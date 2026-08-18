'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/provider/ToastProvider';
const REQUIREMENTS = ['Interior / Home Project', 'Corporate & Office', 'Hospitality (Hotel / Restaurant)', 'Real Estate & Builders', 'Reseller / Trade', 'Other'];
const BENEFITS = [
    { icon: '🤝', title: 'Dedicated account manager', text: 'A single point of contact from quote to installation.' },
    { icon: '🏷️', title: 'Exclusive trade pricing', text: 'Volume-based discounts tailored to your order size.' },
    { icon: '🪑', title: 'Bespoke customisation', text: 'Custom finishes, dimensions and upholstery at scale.' },
    { icon: '🚚', title: 'Priority production & delivery', text: 'Fast-tracked timelines with pan-India logistics.' },
];
const EMPTY = { name: '', company: '', email: '', phone: '', city: '', requirement: REQUIREMENTS[0], quantity: '', message: '' };
export default function BulkEnquiry() {
    const { toast } = useToast();
    const [form, setForm] = useState(EMPTY);
    const [submitting, setSubmitting] = useState(false);
    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const submit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || !/^\d{10}$/.test(form.phone)) {
            toast('Please enter a valid name, email and 10-digit phone', 'error');
            return;
        }
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setForm(EMPTY);
            toast('Thank you! Our trade team will reach out within 24 hours.');
        }, 700);
    };
    return (<section className="mr-bulk">
      <div className="container container-1300">
        <div className="mr-bulk-layout">
          {/* Form */}
          <div className="mr-checkout-panel mr-bulk-form">
            <h2 className="mr-checkout-panel-title">Tell us about your requirement</h2>
            <p className="mr-bulk-form-sub">Share a few details and our trade team will prepare a tailored quote for you.</p>
            <form onSubmit={submit} noValidate>
              <div className="mr-form-grid">
                <div className="mr-field"><label>Full Name *</label><input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your name"/></div>
                <div className="mr-field"><label>Company / Organisation</label><input value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Optional"/></div>
                <div className="mr-field"><label>Email *</label><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@company.com"/></div>
                <div className="mr-field"><label>Phone *</label><input value={form.phone} onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile"/></div>
                <div className="mr-field"><label>City</label><input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Delivery city"/></div>
                <div className="mr-field">
                  <label>Requirement Type</label>
                  <select value={form.requirement} onChange={(e) => set('requirement', e.target.value)}>
                    {REQUIREMENTS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="mr-field mr-field-full"><label>Approx. Quantity / Budget</label><input value={form.quantity} onChange={(e) => set('quantity', e.target.value)} placeholder="e.g. 25 chairs, 6 sofas, or ₹10L budget"/></div>
                <div className="mr-field mr-field-full">
                  <label>Project Details</label>
                  <textarea className="mr-bulk-textarea" rows={4} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Tell us about your project, timeline and any customisation needs…"/>
                </div>
              </div>
              <button type="submit" className="mr-btn-gold mr-bulk-submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Enquiry'}</button>
              <p className="mr-bulk-note">Prefer to talk? Call <a href="tel:+912240001234">+91 22 4000 1234</a> or email <a href="mailto:trade@shizenta.com">trade@shizenta.com</a></p>
            </form>
          </div>

          {/* Aside */}
          <aside className="mr-bulk-aside">
            <div className="mr-bulk-benefits">
              <span className="mr-bulk-benefits-eyebrow">Why buy in bulk with Shizenta</span>
              {BENEFITS.map((b) => (<div key={b.title} className="mr-bulk-benefit">
                  <span className="mr-bulk-benefit-icon">{b.icon}</span>
                  <div><strong>{b.title}</strong><p>{b.text}</p></div>
                </div>))}
            </div>
            <div className="mr-bulk-stats">
              <div><strong>500+</strong><span>Projects delivered</span></div>
              <div><strong>50+</strong><span>Cities served</span></div>
              <div><strong>4.8★</strong><span>Client rating</span></div>
            </div>
            <div className="mr-bulk-help">
              <strong>Looking for something ready to ship?</strong>
              <p>Browse our full collection while our team prepares your quote.</p>
              <Link href="/shop" className="mr-btn-outline mr-btn-sm">Explore the Collection</Link>
            </div>
          </aside>
        </div>
      </div>
    </section>);
}
