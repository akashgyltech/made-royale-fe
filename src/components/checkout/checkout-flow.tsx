'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatINR, validateCoupon } from '@/data/catalog';
import { useCart } from '@/provider/CartProvider';
import { useAuth } from '@/provider/AuthProvider';
import { useToast } from '@/provider/ToastProvider';
import SmartImage from '@/components/ui/smart-image';
import { generateOrderNumber, saveOrder, Order, OrderItem } from '@/lib/orders';

const INDIAN_STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
const DELIVERY = [
  { id: 'standard', label: 'Standard Delivery', note: 'Complimentary • 5–10 business days', charge: 0 },
  { id: 'express', label: 'Express Delivery', note: 'Priority dispatch • 3–5 business days', charge: 2999 },
  { id: 'whiteglove', label: 'White-Glove Concierge', note: 'Scheduled slot + premium installation & haul-away', charge: 4999 },
];
const PAYMENTS = [
  { id: 'upi', label: 'UPI', glyph: '📲', desc: 'GPay, PhonePe, Paytm & more' },
  { id: 'card', label: 'Credit / Debit Card', glyph: '💳', desc: 'Visa, Mastercard, RuPay, Amex' },
  { id: 'netbanking', label: 'Net Banking', glyph: '🏦', desc: 'All major Indian banks' },
  { id: 'emi', label: 'No-Cost EMI', glyph: '🧾', desc: '3 / 6 / 9 / 12 month plans' },
  { id: 'wallet', label: 'Wallets', glyph: '👛', desc: 'Paytm, Amazon Pay, Mobikwik' },
  { id: 'cod', label: 'Cash on Delivery', glyph: '💵', desc: 'Pay when it arrives (₹500 token)' },
];
const BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'];
const STEPS = ['Address', 'Delivery', 'Payment', 'Review'];

export default function CheckoutFlow() {
  const router = useRouter();
  const { resolved, subtotal, savings, count, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ name: '', phone: '', pincode: '', line1: '', line2: '', city: '', state: '' });
  const [gstEnabled, setGstEnabled] = useState(false);
  const [gst, setGst] = useState({ gstin: '', businessName: '' });
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment] = useState('upi');
  const [pay, setPay] = useState({ upi: '', cardNumber: '', cardName: '', expiry: '', cvv: '', bank: '', wallet: 'Paytm', emiTenure: '6' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);

  useEffect(() => { if (user) setAddress((a) => ({ ...a, name: a.name || user.name, phone: a.phone || user.phone || '' })); }, [user]);
  useEffect(() => {
    try { const c = localStorage.getItem('mr_coupon'); if (c) { const r = validateCoupon(c, subtotal); if (r.valid && r.coupon) setCoupon({ code: r.coupon.code, discount: r.discount }); else setCoupon(null); } } catch {}
  }, [subtotal]);

  const shipping = DELIVERY.find((d) => d.id === delivery)?.charge ?? 0;
  const discount = coupon?.discount ?? 0;
  const total = Math.max(0, subtotal - discount + shipping);
  const selPay = PAYMENTS.find((p) => p.id === payment)!;

  const validateAddress = () => {
    const e: Record<string, string> = {};
    if (!address.name.trim()) e.name = 'Required';
    if (!/^\d{10}$/.test(address.phone)) e.phone = 'Enter a 10-digit mobile number';
    if (!/^\d{6}$/.test(address.pincode)) e.pincode = 'Enter a 6-digit pincode';
    if (!address.line1.trim()) e.line1 = 'Required';
    if (!address.city.trim()) e.city = 'Required';
    if (!address.state) e.state = 'Select a state';
    if (gstEnabled) { if (!/^[0-9A-Z]{15}$/.test(gst.gstin.toUpperCase())) e.gstin = 'Enter a valid 15-char GSTIN'; if (!gst.businessName.trim()) e.businessName = 'Required'; }
    setErrors(e); return Object.keys(e).length === 0;
  };
  const validatePayment = () => {
    const e: Record<string, string> = {};
    if (payment === 'upi' && !/@/.test(pay.upi)) e.upi = 'Enter a valid UPI ID (e.g. name@bank)';
    if (payment === 'card') { if (pay.cardNumber.replace(/\s/g, '').length < 12) e.cardNumber = 'Enter a valid card number'; if (!pay.cardName.trim()) e.cardName = 'Required'; if (!/^\d{2}\/\d{2}$/.test(pay.expiry)) e.expiry = 'MM/YY'; if (!/^\d{3,4}$/.test(pay.cvv)) e.cvv = 'CVV'; }
    if ((payment === 'netbanking' || payment === 'emi') && !pay.bank) e.bank = 'Select a bank';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const next = () => { if (step === 0 && !validateAddress()) return; if (step === 2 && !validatePayment()) return; setStep((s) => Math.min(3, s + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const placeOrder = () => {
    if (!validateAddress() || !validatePayment()) { toast('Please complete all required details', 'error'); return; }
    setPlacing(true);
    const items: OrderItem[] = resolved.map((l) => ({ productId: l.product.id, name: l.product.name, slug: l.product.slug, sku: l.product.sku, color: l.color, price: l.product.price, qty: l.qty }));
    const eta = new Date(); eta.setDate(eta.getDate() + (delivery === 'express' ? 5 : delivery === 'whiteglove' ? 8 : 10));
    const order: Order = {
      orderNumber: generateOrderNumber(), createdAt: new Date().toISOString(), status: 'placed', items,
      address: { name: address.name, phone: address.phone, line1: address.line1, line2: address.line2, city: address.city, state: address.state, pincode: address.pincode },
      paymentMethod: payment, paymentLabel: payment === 'cod' ? 'Cash on Delivery' : selPay.label,
      subtotal, discount, couponCode: coupon?.code, shipping, gstInvoice: gstEnabled ? { gstin: gst.gstin.toUpperCase(), businessName: gst.businessName } : undefined,
      total, estimatedDelivery: eta.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    };
    setTimeout(() => { saveOrder(order); clearCart(); try { localStorage.removeItem('mr_coupon'); } catch {} router.push(`/order-confirmation/${order.orderNumber}`); }, 1100);
  };

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
                <div className="mr-choice-list">
                  {DELIVERY.map((d) => (
                    <label key={d.id} className={`mr-choice ${delivery === d.id ? 'is-active' : ''}`}>
                      <input type="radio" name="delivery" checked={delivery === d.id} onChange={() => setDelivery(d.id)} />
                      <span className="mr-choice-radio" />
                      <span className="mr-choice-body"><span className="mr-choice-label">{d.label}</span><span className="mr-choice-note">{d.note}</span></span>
                      <span className="mr-choice-price">{d.charge === 0 ? 'Free' : formatINR(d.charge)}</span>
                    </label>
                  ))}
                </div>
                <div className="mr-checkout-info"><span>🛠️</span> Every delivery includes assembly by our trained craftsmen. Packaging is fully recyclable and hauled away at no cost.</div>
              </div>
            )}

            {step === 2 && (
              <div className="mr-checkout-panel">
                <h3 className="mr-checkout-panel-title">Payment Method</h3>
                <div className="mr-pay-grid">
                  {PAYMENTS.map((p) => (
                    <button key={p.id} type="button" className={`mr-pay-method ${payment === p.id ? 'is-active' : ''}`} onClick={() => { setPayment(p.id); setErrors({}); }}>
                      <span className="mr-pay-glyph">{p.glyph}</span><span className="mr-pay-label">{p.label}</span><span className="mr-pay-desc">{p.desc}</span>
                    </button>
                  ))}
                </div>
                <div className="mr-pay-fields">
                  {payment === 'upi' && <Field label="UPI ID" error={errors.upi}><input value={pay.upi} onChange={(e) => setPay({ ...pay, upi: e.target.value })} placeholder="yourname@bank" /></Field>}
                  {payment === 'card' && (
                    <div className="mr-form-grid">
                      <Field label="Card Number" error={errors.cardNumber} full><input value={pay.cardNumber} onChange={(e) => setPay({ ...pay, cardNumber: e.target.value.replace(/[^\d ]/g, '').slice(0, 19) })} placeholder="1234 5678 9012 3456" inputMode="numeric" /></Field>
                      <Field label="Name on Card" error={errors.cardName} full><input value={pay.cardName} onChange={(e) => setPay({ ...pay, cardName: e.target.value })} placeholder="Cardholder name" /></Field>
                      <Field label="Expiry (MM/YY)" error={errors.expiry}><input value={pay.expiry} onChange={(e) => setPay({ ...pay, expiry: e.target.value.slice(0, 5) })} placeholder="MM/YY" /></Field>
                      <Field label="CVV" error={errors.cvv}><input value={pay.cvv} onChange={(e) => setPay({ ...pay, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="•••" type="password" /></Field>
                    </div>
                  )}
                  {(payment === 'netbanking' || payment === 'emi') && (
                    <Field label={payment === 'emi' ? 'EMI Bank' : 'Select Bank'} error={errors.bank}>
                      <select value={pay.bank} onChange={(e) => setPay({ ...pay, bank: e.target.value })}><option value="">Choose a bank</option>{BANKS.map((b) => <option key={b} value={b}>{b}</option>)}</select>
                    </Field>
                  )}
                  {payment === 'emi' && <Field label="EMI Tenure"><select value={pay.emiTenure} onChange={(e) => setPay({ ...pay, emiTenure: e.target.value })}>{['3', '6', '9', '12'].map((t) => <option key={t} value={t}>{t} months — {formatINR(Math.round(total / Number(t)))}/mo</option>)}</select></Field>}
                  {payment === 'wallet' && <Field label="Wallet"><select value={pay.wallet} onChange={(e) => setPay({ ...pay, wallet: e.target.value })}>{['Paytm', 'Amazon Pay', 'Mobikwik', 'Freecharge'].map((w) => <option key={w} value={w}>{w}</option>)}</select></Field>}
                  {payment === 'cod' && <div className="mr-checkout-info"><span>💵</span> A refundable token of ₹500 is collected online to confirm COD orders. The balance is payable on delivery.</div>}
                </div>
                <div className="mr-pay-secure">🔒 256-bit encrypted • PCI-DSS compliant • Your details are never stored on our servers</div>
              </div>
            )}

            {step === 3 && (
              <div className="mr-checkout-panel">
                <h3 className="mr-checkout-panel-title">Review & Confirm</h3>
                <div className="mr-review-block">
                  <div className="mr-review-block-head"><h4>Deliver to</h4><button onClick={() => setStep(0)}>Edit</button></div>
                  <p><strong>{address.name}</strong> • {address.phone}<br />{address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />{address.city}, {address.state} — {address.pincode}</p>
                  {gstEnabled && <p className="mr-review-gst">GST Invoice: {gst.businessName} ({gst.gstin.toUpperCase()})</p>}
                </div>
                <div className="mr-review-block">
                  <div className="mr-review-block-head"><h4>Delivery & Payment</h4><button onClick={() => setStep(1)}>Edit</button></div>
                  <p>{DELIVERY.find((d) => d.id === delivery)?.label} — {shipping === 0 ? 'Free' : formatINR(shipping)}<br />Paying via <strong>{selPay.label}</strong></p>
                </div>
                <div className="mr-review-block">
                  <div className="mr-review-block-head"><h4>Items ({count})</h4><Link href="/cart">Edit</Link></div>
                  <div className="mr-review-items">
                    {resolved.map((l) => (
                      <div className="mr-review-item" key={l.key}>
                        <div className="mr-review-item-thumb"><SmartImage src={l.product.image} alt={l.product.name} ratio="1 / 1" /></div>
                        <div className="mr-review-item-info"><span>{l.product.name}</span><small>{l.color ? `${l.color} • ` : ''}Qty {l.qty}</small></div>
                        <div className="mr-review-item-price">{formatINR(l.lineTotal)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mr-checkout-nav">
              {step > 0 ? <button className="mr-btn-outline" onClick={back} disabled={placing}>← Back</button> : <Link className="mr-btn-outline" href="/cart">← Back to Cart</Link>}
              {step < 3 ? <button className="mr-btn-gold" onClick={next}>Continue</button> : <button className="mr-btn-gold mr-place-btn" onClick={placeOrder} disabled={placing}>{placing ? 'Processing…' : `Place Order • ${formatINR(total)}`}</button>}
            </div>
          </div>

          <aside className="mr-checkout-summary">
            <h3 className="mr-cart-summary-title">Order Summary</h3>
            <div className="mr-checkout-summary-items">
              {resolved.map((l) => (
                <div className="mr-checkout-summary-item" key={l.key}>
                  <div className="mr-checkout-summary-thumb"><SmartImage src={l.product.image} alt={l.product.name} ratio="1 / 1" /><span className="mr-checkout-summary-qty">{l.qty}</span></div>
                  <span className="mr-checkout-summary-name">{l.product.name}</span><span className="mr-checkout-summary-price">{formatINR(l.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="mr-cart-summary-rows">
              <div className="mr-cart-summary-row"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
              {savings > 0 && <div className="mr-cart-summary-row mr-save"><span>Instant savings</span><span>− {formatINR(savings)}</span></div>}
              {discount > 0 && <div className="mr-cart-summary-row mr-save"><span>Coupon ({coupon?.code})</span><span>− {formatINR(discount)}</span></div>}
              <div className="mr-cart-summary-row"><span>Delivery</span><span className={shipping === 0 ? 'mr-free' : ''}>{shipping === 0 ? 'Free' : formatINR(shipping)}</span></div>
            </div>
            <div className="mr-cart-summary-total"><span>Total</span><span>{formatINR(total)}</span></div>
            <p className="mr-cart-summary-tax">Inclusive of all taxes</p>
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
