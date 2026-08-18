// ─────────────────────────────────────────────────────────────────────────────
// SHIZENTA — Legal / policy content. Plain data so pages stay easy to edit.
// ─────────────────────────────────────────────────────────────────────────────
const CONTACT = 'care@shizenta.com';
export const legalDocs = {
    'privacy-policy': {
        slug: 'privacy-policy',
        title: 'Privacy Policy',
        subtitle: 'Your Trust, Protected',
        updated: '1 July 2026',
        intro: 'At Shizenta, we respect your privacy and are committed to protecting the personal information you share with us. This policy explains what we collect, how we use it, and the choices you have.',
        sections: [
            { heading: 'Information We Collect', body: [
                    'We collect information you provide directly — your name, email, phone number, shipping and billing addresses, and order details when you shop, create an account, or contact us.',
                    'We also collect limited technical data automatically, such as your device type, browser, and pages viewed, to improve your browsing experience.',
                ] },
            { heading: 'How We Use Your Information', body: [
                    'To process and deliver your orders, provide white-glove installation, and keep you updated on order status.',
                    'To respond to enquiries, offer design consultations, and — only with your consent — send you curated offers and new collection announcements.',
                    'To detect fraud, secure our platform, and comply with legal obligations.',
                ] },
            { heading: 'Sharing & Disclosure', body: [
                    'We never sell your personal data. We share it only with trusted partners who help us operate — logistics providers, payment gateways, and IT services — under strict confidentiality.',
                    'We may disclose information where required by law or to protect our rights and the safety of our customers.',
                ] },
            { heading: 'Data Security', body: [
                    'Payments are processed over encrypted, PCI-DSS compliant gateways. We apply industry-standard safeguards to protect your data, though no method of transmission is ever completely secure.',
                ] },
            { heading: 'Your Rights', body: [
                    'You may access, correct, or request deletion of your personal data, and opt out of marketing communications at any time from your account or by writing to us.',
                ] },
            { heading: 'Contact Us', body: [
                    `For any privacy question or request, email us at ${CONTACT} and our team will respond within 2 business days.`,
                ] },
        ],
    },
    'terms-conditions': {
        slug: 'terms-conditions',
        title: 'Terms & Conditions',
        subtitle: 'The Fine Print',
        updated: '1 July 2026',
        intro: 'These terms govern your use of the Shizenta website and the purchase of our products. By browsing or ordering, you agree to the terms below.',
        sections: [
            { heading: 'Use of the Website', body: [
                    'You agree to use this website for lawful purposes only and not to misuse, copy, or disrupt any part of it. All content, imagery, and designs are the intellectual property of Shizenta.',
                ] },
            { heading: 'Products & Pricing', body: [
                    'As every piece is handcrafted, natural variations in grain, colour, and finish are a hallmark of authenticity — not defects.',
                    'We strive for accuracy in pricing and descriptions, but errors may occur. Where a genuine error is found, we reserve the right to cancel and fully refund the affected order.',
                ] },
            { heading: 'Orders & Acceptance', body: [
                    'Your order is an offer to buy. A contract is formed only once we confirm acceptance and payment. We may decline or cancel an order at our discretion, with a full refund.',
                ] },
            { heading: 'Made-to-Order Items', body: [
                    'Bespoke and made-to-order pieces enter production once confirmed. Timelines are estimates and may vary with material availability and craftsmanship demands.',
                ] },
            { heading: 'Limitation of Liability', body: [
                    'To the extent permitted by law, Shizenta is not liable for indirect or consequential loss arising from the use of our products or website. Our total liability is limited to the value of the affected order.',
                ] },
            { heading: 'Governing Law', body: [
                    'These terms are governed by the laws of India, and any disputes are subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.',
                ] },
        ],
    },
    'refund-policy': {
        slug: 'refund-policy',
        title: 'Refund & Returns Policy',
        subtitle: 'Shop With Confidence',
        updated: '1 July 2026',
        intro: 'We want you to love every Shizenta piece. If something isn’t right, our returns process is simple, fair, and designed around you.',
        sections: [
            { heading: '7-Day Easy Returns', body: [
                    'You may request a return within 7 days of delivery for ready-to-ship products, provided the item is unused, undamaged, and in its original packaging.',
                ] },
            { heading: 'How to Initiate a Return', body: [
                    'Go to My Account → My Orders, open the order, and select “Request Return”, or write to us with your order number. Our team will schedule a pickup at no cost to you.',
                ] },
            { heading: 'Refund Timeline', body: [
                    'Once your return is received and quality-checked, refunds are processed to your original payment method within 5–7 business days.',
                    'Cash-on-delivery orders are refunded via bank transfer or store credit, as you prefer.',
                ] },
            { heading: 'Damaged or Defective Items', body: [
                    'If your piece arrives damaged, notify us within 48 hours with photographs. We will arrange a free replacement or full refund — whichever you choose.',
                ] },
            { heading: 'Non-Returnable Items', body: [
                    'Bespoke, customised, and made-to-order pieces cannot be returned unless they arrive damaged or defective, as they are crafted uniquely for you.',
                ] },
            { heading: 'Need Help?', body: [
                    `Our care team is happy to help at ${CONTACT} or on +91 22 4000 1234, Monday to Saturday, 10am–7pm IST.`,
                ] },
        ],
    },
    'shipping-policy': {
        slug: 'shipping-policy',
        title: 'Shipping & Delivery',
        subtitle: 'White-Glove Service',
        updated: '1 July 2026',
        intro: 'Every Shizenta order is delivered with care, unpacked, assembled, and placed exactly where you want it — by our trained delivery specialists.',
        sections: [
            { heading: 'Free White-Glove Delivery', body: [
                    'We offer complimentary delivery and expert installation across all serviceable pincodes in India on orders above ₹15,000.',
                ] },
            { heading: 'Delivery Timelines', body: [
                    'Ready-to-ship pieces are delivered within 7–14 business days. Made-to-order and bespoke items typically take 4–8 weeks, confirmed at the time of order.',
                ] },
            { heading: 'Order Tracking', body: [
                    'Track your order anytime from the Track Order page or from My Account → My Orders. You’ll also receive updates by email and SMS at every stage.',
                ] },
            { heading: 'Installation & Assembly', body: [
                    'Our specialists assemble your furniture, position it, and remove all packaging — leaving your space ready to enjoy.',
                ] },
            { heading: 'Serviceable Areas', body: [
                    'We currently deliver across major metros and most tier-2 cities. Enter your pincode on any product page to confirm availability and estimated delivery.',
                ] },
        ],
    },
};
export function getLegalDoc(slug) { return legalDocs[slug]; }
export const legalDocList = Object.values(legalDocs);
