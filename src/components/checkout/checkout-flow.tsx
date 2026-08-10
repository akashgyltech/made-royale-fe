'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatINR } from '@/data/catalog';
import { useCart } from '@/provider/CartProvider';
import { useAuth } from '@/provider/AuthProvider';
import { useToast } from '@/provider/ToastProvider';
import SmartImage from '@/components/ui/smart-image';
import { orderApi, paymentApi, profileApi } from '@/lib/store-api';
import { openRazorpayCheckout, type RazorpayHandlerResponse } from '@/lib/razorpay';
import { INDIAN_STATES } from '@/lib/indian-states';
import type { BackendAddress, BackendAddressSnapshot, BackendOrder, BackendQuote } from '@/types/backend';

const PAYMENT_OPTIONS: { id: 'razorpay' | 'cod'; label: string; glyph: string; desc: string }[] = [
  { id: 'razorpay', label: 'Pay Online', glyph: '💳', desc: 'UPI, Cards, NetBanking & Wallets — secured by Razorpay' },
  { id: 'cod', label: 'Cash on Delivery', glyph: '💵', desc: 'Pay in cash when your order arrives' },
];
const STEPS = ['Address', 'Delivery', 'Payment', 'Review'];

interface AddressForm { name: string; phone: string; pincode: string; line1: string; line2: string; city: string; state: string; }
const emptyAddress: AddressForm = { name: '', phone: '', pincode: '', line1: '', line2: '', city: '', state: '' };

function fromBackendAddress(a: BackendAddress): AddressForm {
  return { name: a.name, phone: a.phone, pincode: a.pincode, line1: a.line1, line2: a.line2 || '', city: a.city, state: a.state };
}
function toSnapshot(a: AddressForm): BackendAddressSnapshot {
  return { name: a.name.trim(), phone: a.phone.trim(), line1: a.line1.trim(), line2: a.line2.trim() || undefined, city: a.city.trim(), state: a.state, pincode: a.pincode.trim(), country: 'India' };
}

export default function CheckoutFlow() {
  const router = useRouter();
  const { resolved, count, isLoading: cartLoading, clearCart } = useCart();
  const { user, isLoggedIn, isInitializing, openAuthModal } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);

  // Address
  const [savedAddresses, setSavedAddresses] = useState<BackendAddress[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [selectedSavedId, setSelectedSavedId] = useState<string | 'new' | null>(null);
  const [address, setAddress] = useState<AddressForm>(emptyAddress);
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [addressSavedToProfile, setAddressSavedToProfile] = useState(false);

  // Billing
  const [billingSame, setBillingSame] = useState(true);
  const [billing, setBilling] = useState<AddressForm>(emptyAddress);

  // GST
  const [gstEnabled, setGstEnabled] = useState(false);
  const [gst, setGst] = useState({ gstin: '', businessName: '' });

  // Shipping & coupon
  const [shippingMethod, setShippingMethod] = useState<string | undefined>(undefined);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>(undefined);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Live quote
  const [quote, setQuote] = useState<BackendQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prompt sign-in — every order/quote/payment route requires an authenticated customer.
  useEffect(() => {
    if (!isInitializing && !isLoggedIn) openAuthModal('login');
  }, [isInitializing, isLoggedIn, openAuthModal]);

  // Prefill from the logged-in customer's profile.
  useEffect(() => {
    if (!user) return;
    setAddress((a) => (a.name || a.phone ? a : { ...a, name: user.name, phone: user.phone || '' }));
    if (user.gstInfo?.gstin) {
      setGstEnabled(true);
      setGst({ gstin: user.gstInfo.gstin, businessName: user.gstInfo.businessName || '' });
    }
  }, [user]);

  // Load saved addresses; default to the customer's default address if present.
  useEffect(() => {
    if (!isLoggedIn) { setSavedAddresses([]); return; }
    setAddressesLoading(true);
    profileApi.getAddresses()
      .then((list) => {
        setSavedAddresses(list);
        if (list.length > 0) {
          const def = list.find((a) => a.isDefault) || list[0];
          setSelectedSavedId(def.id);
          setAddress(fromBackendAddress(def));
          setSaveNewAddress(false);
        } else {
          setSelectedSavedId('new');
        }
      })
      .catch(() => { /* non-fatal — user can still enter a fresh address */ })
      .finally(() => setAddressesLoading(false));
  }, [isLoggedIn]);

  const itemsForApi = useMemo(() => resolved.map((l) => ({ productId: l.productId, quantity: l.qty })), [resolved]);
  const fallbackItems = useMemo(() => resolved.map((l) => ({ id: l.key, name: l.product.name, image: l.product.image, quantity: l.qty, total: l.lineTotal })), [resolved]);
  const addressComplete = useMemo(
    () => !!(address.name.trim() && /^\d{10}$/.test(address.phone) && address.line1.trim() && address.city.trim() && address.state && /^\d{6}$/.test(address.pincode)),
    [address]
  );

  // Live, backend-authoritative quote — recomputed whenever address/shipping method/coupon
  // change. Never trust a client-computed total; this is the only source of truth.
  useEffect(() => {
    if (!isLoggedIn || !addressComplete || itemsForApi.length === 0) { setQuote(null); setQuoteError(null); return; }
    let cancelled = false;
    setQuoteLoading(true);
    const shippingAddress = toSnapshot(address);
    const timer = setTimeout(async () => {
      try {
        const q = await orderApi.getQuote({ items: itemsForApi, shippingAddress, couponCode: appliedCoupon, shippingMethod });
        if (cancelled) return;
        setQuote(q);
        setQuoteError(null);
        setCouponError(null);
        setShippingMethod((sm) => sm ?? q.shippingMethod);
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : 'Could not calculate your order total';
        if (appliedCoupon) {
          // Likely an invalid/expired/below-minimum coupon — retry without it so the rest
          // of the totals still render, and surface the coupon-specific error separately.
          setCouponError(msg);
          try {
            const q2 = await orderApi.getQuote({ items: itemsForApi, shippingAddress, shippingMethod });
            if (cancelled) return;
            setQuote(q2);
            setQuoteError(null);
            setShippingMethod((sm) => sm ?? q2.shippingMethod);
          } catch (err2) {
            if (cancelled) return;
            setQuote(null);
            setQuoteError(err2 instanceof Error ? err2.message : 'Could not calculate your order total');
          }
        } else {
          setQuote(null);
          setQuoteError(msg);
        }
      } finally {
        if (!cancelled) setQuoteLoading(false);
      }
    }, 500);
    return () => { cancelled = true; clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, addressComplete, address.name, address.phone, address.line1, address.line2, address.city, address.state, address.pincode, shippingMethod, appliedCoupon, itemsForApi]);

  const selectedShippingOption = quote?.shippingMethods.find((m) => m.key === shippingMethod);

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    setAppliedCoupon(code || undefined);
    setCouponError(null);
  }

  const validateAddress = () => {
    const e: Record<string, string> = {};
    if (!address.name.trim()) e.name = 'Required';
    if (!/^\d{10}$/.test(address.phone)) e.phone = 'Enter a 10-digit mobile number';
    if (!/^\d{6}$/.test(address.pincode)) e.pincode = 'Enter a 6-digit pincode';
    if (!address.line1.trim()) e.line1 = 'Required';
    if (!address.city.trim()) e.city = 'Required';
    if (!address.state) e.state = 'Select a state';
    if (!billingSame) {
      if (!billing.name.trim()) e.bName = 'Required';
      if (!/^\d{10}$/.test(billing.phone)) e.bPhone = 'Enter a 10-digit mobile number';
      if (!/^\d{6}$/.test(billing.pincode)) e.bPincode = 'Enter a 6-digit pincode';
      if (!billing.line1.trim()) e.bLine1 = 'Required';
      if (!billing.city.trim()) e.bCity = 'Required';
      if (!billing.state) e.bState = 'Select a state';
    }
    if (gstEnabled) {
      if (!/^[0-9A-Z]{15}$/.test(gst.gstin.toUpperCase())) e.gstin = 'Enter a valid 15-character GSTIN';
      if (!gst.businessName.trim()) e.businessName = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = async () => {
    if (step === 0) {
      if (!validateAddress()) return;
      if (isLoggedIn && selectedSavedId === 'new' && saveNewAddress && !addressSavedToProfile) {
        try {
          await profileApi.addAddress({ ...toSnapshot(address), label: 'home', isDefault: savedAddresses.length === 0 });
          setAddressSavedToProfile(true);
        } catch { /* saving to the address book is a convenience, not a checkout blocker */ }
      }
    }
    setStep((s) => Math.min(3, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const back = () => { setStep((s) => Math.max(0, s - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  async function payWithRazorpay(order: BackendOrder) {
    try {
      const rp = await paymentApi.createRazorpayOrder(order.id);
      const rzp = await openRazorpayCheckout({
        key: rp.keyId,
        amount: rp.amount,
        currency: rp.currency,
        order_id: rp.razorpayOrderId,
        name: 'Made Royale',
        description: `Order ${rp.orderNumber}`,
        prefill: { name: address.name, contact: address.phone, email: user?.email || '' },
        theme: { color: '#b8965a' },
        handler: async (response: RazorpayHandlerResponse) => {
          try {
            await paymentApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: order.id,
            });
            toast('Payment successful! Your order is confirmed.', 'success');
          } catch {
            toast('Payment was received but verification failed. Our team will confirm shortly.', 'error');
          } finally {
            router.push(`/order-confirmation/${order.orderNumber}`);
          }
        },
        modal: {
          ondismiss: () => {
            setPlacing(false);
            toast('Payment was not completed. Your order is saved — you can pay again from your order details.', 'info');
            router.push(`/order-confirmation/${order.orderNumber}`);
          },
        },
      });
      rzp.on('payment.failed', () => {
        setPlacing(false);
        toast('Payment failed. Your order is saved — you can retry payment from your order details.', 'error');
        router.push(`/order-confirmation/${order.orderNumber}`);
      });
    } catch (err) {
      setPlacing(false);
      toast(err instanceof Error ? err.message : 'Could not start payment. Your order is saved — you can retry from your order details.', 'error');
      router.push(`/order-confirmation/${order.orderNumber}`);
    }
  }

  const placeOrder = async () => {
    if (!validateAddress()) { setStep(0); toast('Please complete your delivery address', 'error'); return; }
    if (!quote) { toast('Please wait for your order total to finish calculating', 'error'); return; }
    setPlacing(true);
    try {
      const shippingAddress = toSnapshot(address);
      const billingAddress = billingSame ? shippingAddress : toSnapshot(billing);
      const order = await orderApi.placeOrder({
        items: itemsForApi,
        billingAddress,
        shippingAddress,
        couponCode: appliedCoupon,
        shippingMethod,
        gstin: gstEnabled ? gst.gstin.toUpperCase() : undefined,
        businessName: gstEnabled ? gst.businessName : undefined,
        paymentMethod,
      });

      // The order now owns these items regardless of payment outcome — clear the cart
      // immediately so a dismissed/failed Razorpay attempt can't lead to re-ordering the
      // same items into a second order. Retrying payment happens against this order, not
      // by re-checking-out.
      clearCart();

      if (paymentMethod === 'cod') {
        toast('Order placed successfully!', 'success');
        router.push(`/order-confirmation/${order.orderNumber}`);
        return;
      }
      await payWithRazorpay(order);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not place your order. Please try again.', 'error');
      setPlacing(false);
    }
  };

  if (isInitializing) {
    return <div className="container container-1300"><div className="mr-oc-loading">Loading…</div></div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="container container-1300">
        <div className="mr-shop-empty" style={{ padding: '60px 20px' }}>
          <div className="mr-shop-empty-glyph">🔐</div>
          <h3>Sign in to check out</h3>
          <p>We need you signed in to place and track your order.</p>
          <button className="mr-btn-solid" onClick={() => openAuthModal('login')}>Sign In</button>
        </div>
      </div>
    );
  }

  if (count === 0 && !placing) {
    return (
      <div className="container container-1300">
        <div className="mr-shop-empty" style={{ padding: '60px 20px' }}>
          <div className="mr-shop-empty-glyph">🛍️</div><h3>Your cart is empty</h3>
          <p>Add a piece to your cart before checking out.</p><Link href="/shop" className="mr-btn-solid">Explore the Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mr-checkout">
      <div className="container container-1300">
        <div className="mr-steps">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`mr-step ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`}>
                <span className="mr-step-num">{i < step ? '✓' : i + 1}</span><span className="mr-step-label">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`mr-step-line ${i < step ? 'is-done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="mr-checkout-layout">
          <div className="mr-checkout-main">
            {step === 0 && (
              <div className="mr-checkout-panel">
                <h3 className="mr-checkout-panel-title">Delivery Address</h3>

                {addressesLoading && <p className="mr-cart-summary-tax">Loading your saved addresses…</p>}

                {savedAddresses.length > 0 && (
                  <div className="mr-choice-list" style={{ marginBottom: 24 }}>
                    {savedAddresses.map((a) => (
                      <label key={a.id} className={`mr-choice ${selectedSavedId === a.id ? 'is-active' : ''}`}>
                        <input type="radio" name="saved-address" checked={selectedSavedId === a.id} onChange={() => { setSelectedSavedId(a.id); setAddress(fromBackendAddress(a)); }} />
                        <span className="mr-choice-radio" />
                        <span className="mr-choice-body">
                          <span className="mr-choice-label">{a.name}{a.isDefault ? ' • Default' : ''}</span>
                          <span className="mr-choice-note">{a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} — {a.pincode} · {a.phone}</span>
                        </span>
                      </label>
                    ))}
                    <label className={`mr-choice ${selectedSavedId === 'new' ? 'is-active' : ''}`}>
                      <input type="radio" name="saved-address" checked={selectedSavedId === 'new'} onChange={() => { setSelectedSavedId('new'); setAddress(emptyAddress); }} />
                      <span className="mr-choice-radio" />
                      <span className="mr-choice-body"><span className="mr-choice-label">+ Use a new address</span></span>
                    </label>
                  </div>
                )}

                {(selectedSavedId === 'new' || savedAddresses.length === 0) && (
                  <>
                    <div className="mr-form-grid">
                      <Field label="Full Name" error={errors.name} full><input value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} placeholder="e.g. Aditya Rathore" /></Field>
                      <Field label="Mobile Number" error={errors.phone}><input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="10-digit mobile" inputMode="numeric" /></Field>
                      <Field label="Pincode" error={errors.pincode}><input value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} placeholder="6-digit pincode" inputMode="numeric" /></Field>
                      <Field label="Flat / House No., Building, Street" error={errors.line1} full><input value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} placeholder="Address line 1" /></Field>
                      <Field label="Area, Landmark (optional)" full><input value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} placeholder="Address line 2" /></Field>
                      <Field label="City" error={errors.city}><input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" /></Field>
                      <Field label="State" error={errors.state}>
                        <select value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })}><option value="">Select state</option>{INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                      </Field>
                    </div>
                    <label className="mr-checkbox"><input type="checkbox" checked={saveNewAddress} onChange={(e) => setSaveNewAddress(e.target.checked)} /><span>Save this address to my account</span></label>
                  </>
                )}

                <label className="mr-checkbox"><input type="checkbox" checked={!billingSame} onChange={(e) => setBillingSame(!e.target.checked)} /><span>Use a different billing address</span></label>
                {!billingSame && (
                  <div className="mr-form-grid mr-gst-grid">
                    <Field label="Full Name" error={errors.bName} full><input value={billing.name} onChange={(e) => setBilling({ ...billing, name: e.target.value })} placeholder="Billing contact name" /></Field>
                    <Field label="Mobile Number" error={errors.bPhone}><input value={billing.phone} onChange={(e) => setBilling({ ...billing, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} placeholder="10-digit mobile" inputMode="numeric" /></Field>
                    <Field label="Pincode" error={errors.bPincode}><input value={billing.pincode} onChange={(e) => setBilling({ ...billing, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} placeholder="6-digit pincode" inputMode="numeric" /></Field>
                    <Field label="Address Line 1" error={errors.bLine1} full><input value={billing.line1} onChange={(e) => setBilling({ ...billing, line1: e.target.value })} placeholder="Address line 1" /></Field>
                    <Field label="Address Line 2 (optional)" full><input value={billing.line2} onChange={(e) => setBilling({ ...billing, line2: e.target.value })} placeholder="Address line 2" /></Field>
                    <Field label="City" error={errors.bCity}><input value={billing.city} onChange={(e) => setBilling({ ...billing, city: e.target.value })} placeholder="City" /></Field>
                    <Field label="State" error={errors.bState}><select value={billing.state} onChange={(e) => setBilling({ ...billing, state: e.target.value })}><option value="">Select state</option>{INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}</select></Field>
                  </div>
                )}

                <label className="mr-checkbox"><input type="checkbox" checked={gstEnabled} onChange={(e) => setGstEnabled(e.target.checked)} /><span>I need a GST invoice (for business purchases)</span></label>
                {gstEnabled && (
                  <div className="mr-form-grid mr-gst-grid">
                    <Field label="GSTIN" error={errors.gstin}><input value={gst.gstin} onChange={(e) => setGst({ ...gst, gstin: e.target.value.toUpperCase().slice(0, 15) })} placeholder="15-character GSTIN" /></Field>
                    <Field label="Business Name" error={errors.businessName}><input value={gst.businessName} onChange={(e) => setGst({ ...gst, businessName: e.target.value })} placeholder="Registered business name" /></Field>
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="mr-checkout-panel">
                <h3 className="mr-checkout-panel-title">Delivery Options</h3>
                {quoteLoading && <p className="mr-cart-summary-tax">Calculating delivery options…</p>}
                {!quoteLoading && quote && quote.shippingMethods.length > 0 && (
                  <div className="mr-choice-list">
                    {quote.shippingMethods.map((m) => (
                      <label key={m.key} className={`mr-choice ${shippingMethod === m.key ? 'is-active' : ''}`}>
                        <input type="radio" name="delivery" checked={shippingMethod === m.key} onChange={() => setShippingMethod(m.key)} />
                        <span className="mr-choice-radio" />
                        <span className="mr-choice-body"><span className="mr-choice-label">{m.label}</span><span className="mr-choice-note">{m.etaDays}</span></span>
                        <span className="mr-choice-price">{m.charge === 0 ? 'Free' : formatINR(m.charge)}</span>
                      </label>
                    ))}
                  </div>
                )}
                {!quoteLoading && !quote && (
                  <div className="mr-checkout-info">
                    <span>ℹ️</span>
                    <span>{quoteError || 'Please complete your delivery address to see shipping options.'} <button type="button" className="mr-btn-text" onClick={() => setStep(0)}>Edit Address</button></span>
                  </div>
                )}
                <div className="mr-checkout-info"><span>🛠️</span> Every delivery includes assembly by our trained craftsmen. Packaging is fully recyclable and hauled away at no cost.</div>
              </div>
            )}

            {step === 2 && (
              <div className="mr-checkout-panel">
                <h3 className="mr-checkout-panel-title">Payment Method</h3>
                <div className="mr-pay-grid">
                  {PAYMENT_OPTIONS.map((p) => (
                    <button key={p.id} type="button" className={`mr-pay-method ${paymentMethod === p.id ? 'is-active' : ''}`} onClick={() => setPaymentMethod(p.id)}>
                      <span className="mr-pay-glyph">{p.glyph}</span><span className="mr-pay-label">{p.label}</span><span className="mr-pay-desc">{p.desc}</span>
                    </button>
                  ))}
                </div>
                {paymentMethod === 'razorpay' && <div className="mr-pay-secure">🔒 256-bit encrypted checkout, secured by Razorpay. Your card/UPI details are never stored on our servers.</div>}
                {paymentMethod === 'cod' && <div className="mr-checkout-info"><span>💵</span> Pay in cash to our delivery partner when your order arrives.</div>}
              </div>
            )}

            {step === 3 && (
              <div className="mr-checkout-panel">
                <h3 className="mr-checkout-panel-title">Review & Confirm</h3>
                <div className="mr-review-block">
                  <div className="mr-review-block-head"><h4>Deliver to</h4><button onClick={() => setStep(0)}>Edit</button></div>
                  <p><strong>{address.name}</strong> • {address.phone}<br />{address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />{address.city}, {address.state} — {address.pincode}</p>
                  {!billingSame && <p style={{ marginTop: 10 }}><strong>Billing:</strong> {billing.name}, {billing.line1}{billing.line2 ? `, ${billing.line2}` : ''}, {billing.city}, {billing.state} — {billing.pincode}</p>}
                  {gstEnabled && <p className="mr-review-gst">GST Invoice: {gst.businessName} ({gst.gstin.toUpperCase()})</p>}
                </div>
                <div className="mr-review-block">
                  <div className="mr-review-block-head"><h4>Delivery & Payment</h4><button onClick={() => setStep(1)}>Edit</button></div>
                  <p>
                    {selectedShippingOption ? `${selectedShippingOption.label} — ${selectedShippingOption.charge === 0 ? 'Free' : formatINR(selectedShippingOption.charge)}` : 'Delivery method'}
                    <br />Paying via <strong>{PAYMENT_OPTIONS.find((p) => p.id === paymentMethod)?.label}</strong>
                  </p>
                </div>
                <div className="mr-review-block">
                  <div className="mr-review-block-head"><h4>Items ({count})</h4><Link href="/cart">Edit</Link></div>
                  <div className="mr-review-items">
                    {(quote?.items ?? fallbackItems).map((it) => (
                      <div className="mr-review-item" key={it.id}>
                        <div className="mr-review-item-thumb"><SmartImage src={it.image} alt={it.name} ratio="1 / 1" /></div>
                        <div className="mr-review-item-info"><span>{it.name}</span><small>Qty {it.quantity}</small></div>
                        <div className="mr-review-item-price">{formatINR(it.total)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mr-checkout-nav">
              {step > 0 ? <button className="mr-btn-outline" onClick={back} disabled={placing}>← Back</button> : <Link className="mr-btn-outline" href="/cart">← Back to Cart</Link>}
              {step < 3 ? (
                <button className="mr-btn-gold" onClick={() => void next()} disabled={placing}>Continue</button>
              ) : (
                <button className="mr-btn-gold mr-place-btn" onClick={() => void placeOrder()} disabled={placing || !quote}>
                  {placing ? 'Processing…' : quote ? `Place Order • ${formatINR(quote.grandTotal)}` : 'Calculating…'}
                </button>
              )}
            </div>
          </div>

          <aside className="mr-checkout-summary">
            <h3 className="mr-cart-summary-title">Order Summary</h3>
            <div className="mr-checkout-summary-items">
              {(quote?.items ?? fallbackItems).map((it) => (
                <div className="mr-checkout-summary-item" key={it.id}>
                  <div className="mr-checkout-summary-thumb"><SmartImage src={it.image} alt={it.name} ratio="1 / 1" /><span className="mr-checkout-summary-qty">{it.quantity}</span></div>
                  <span className="mr-checkout-summary-name">{it.name}</span><span className="mr-checkout-summary-price">{formatINR(it.total)}</span>
                </div>
              ))}
              {cartLoading && fallbackItems.length === 0 && !quote && <p className="mr-cart-summary-tax">Loading items…</p>}
            </div>

            <div className="mr-cart-coupon">
              <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Coupon code" onKeyDown={(e) => { if (e.key === 'Enter') applyCoupon(); }} />
              <button type="button" onClick={applyCoupon}>Apply</button>
            </div>
            {couponError && <p className="mr-cart-coupon-msg err">{couponError}</p>}
            {!couponError && quote?.couponCode && <p className="mr-cart-coupon-msg ok">Coupon {quote.couponCode} applied</p>}

            {quote ? (
              <>
                <div className="mr-cart-summary-rows">
                  <div className="mr-cart-summary-row"><span>Subtotal</span><span>{formatINR(quote.subtotal)}</span></div>
                  {quote.couponDiscount > 0 && <div className="mr-cart-summary-row mr-save"><span>Coupon{quote.couponCode ? ` (${quote.couponCode})` : ''}</span><span>− {formatINR(quote.couponDiscount)}</span></div>}
                  <div className="mr-cart-summary-row"><span>Shipping</span><span className={quote.shippingCharge === 0 ? 'mr-free' : ''}>{quote.shippingCharge === 0 ? 'Free' : formatINR(quote.shippingCharge)}</span></div>
                  {quote.isInterState ? (
                    <div className="mr-cart-summary-row"><span>IGST</span><span>{formatINR(quote.igst)}</span></div>
                  ) : (
                    <>
                      <div className="mr-cart-summary-row"><span>CGST</span><span>{formatINR(quote.cgst)}</span></div>
                      <div className="mr-cart-summary-row"><span>SGST</span><span>{formatINR(quote.sgst)}</span></div>
                    </>
                  )}
                </div>
                <div className="mr-cart-summary-total"><span>Total</span><span>{formatINR(quote.grandTotal)}</span></div>
                <p className="mr-cart-summary-tax">Inclusive of all taxes</p>
              </>
            ) : (
              <div className="mr-cart-summary-rows">
                <p className="mr-cart-summary-tax">{quoteLoading ? 'Calculating your total…' : addressComplete ? (quoteError || 'Could not calculate your total') : 'Enter your delivery address to see the full total'}</p>
              </div>
            )}
            <div className="mr-cart-trust"><span>🔒 Secure checkout</span><span>🛡️ Assured warranty</span></div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children, full }: { label: string; error?: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`mr-field ${full ? 'mr-field-full' : ''} ${error ? 'has-error' : ''}`}>
      <label>{label}</label>{children}{error && <span className="mr-field-err">{error}</span>}
    </div>
  );
}
