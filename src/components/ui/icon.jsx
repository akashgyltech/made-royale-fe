import React from 'react';
const PATHS = {
    // Material — a plank with grain lines
    wood: <><rect x="3" y="7" width="18" height="10" rx="1.6"/><path d="M6.5 10.2c3.4 1 7.6 1 11 0M6.5 13.8c3.4 1 7.6 1 11 0"/></>,
    // Warranty — shield with a check
    shield: <><path d="M12 3l7 2.6v5c0 4.4-3 7.4-7 8.9-4-1.5-7-4.5-7-8.9v-5L12 3z"/><path d="M9 11.8l2.1 2.1L15.2 10"/></>,
    // Delivery — box truck
    truck: <><path d="M3 6.5h10.5v8.5H3z"/><path d="M13.5 9h3.6l2.9 2.9V15h-6.5"/><circle cx="7" cy="17.5" r="1.7"/><circle cx="17" cy="17.5" r="1.7"/></>,
    // Returns — reverse arrow loop
    returns: <><path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4.5V9h4.5"/></>,
    // Secure — padlock
    lock: <><rect x="4.5" y="10.5" width="15" height="9.5" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><path d="M12 14.5v2.5"/></>,
    // Genuine — starburst seal with a check
    verified: <><path d="M12 2.8l2 1.7 2.6-.4 1 2.5 2.4 1-.4 2.6 1.7 2-1.7 2 .4 2.6-2.4 1-1 2.5-2.6-.4-2 1.7-2-1.7-2.6.4-1-2.5-2.4-1 .4-2.6-1.7-2 1.7-2-.4-2.6 2.4-1 1-2.5 2.6.4 2-1.7z"/><path d="M9 12l2.1 2.1L15.2 10"/></>,
    // Quality — award medal
    medal: <><circle cx="12" cy="9" r="5"/><path d="M8.5 13.2L7.5 21l4.5-2.4L16.5 21l-1-7.8"/></>,
    // Handcrafted — faceted gem
    gem: <><path d="M6.5 3.5h11l3 5-8.5 12L3.5 8.5z"/><path d="M3.5 8.5h17M9 3.5L6.5 8.5 12 20l5.5-11.5L15 3.5"/></>,
    // SKU / offers — luggage tag
    tag: <><path d="M3.5 3.5h6.6l10.4 10.4-6.6 6.6L3.5 10.1z"/><circle cx="7.3" cy="7.3" r="1.4"/></>,
    // EMI / receipt
    receipt: <><path d="M6 3.5h12v17l-2.5-1.7-2.5 1.7-2.5-1.7-2.5 1.7z"/><path d="M9 8h6M9 11.5h6M9 15h3.5"/></>,
    // Ruler — dimensions
    ruler: <><rect x="3" y="8.5" width="18" height="7" rx="1.3"/><path d="M7 8.5v2.6M11 8.5v3.4M15 8.5v2.6M19 8.5v3.4"/></>,
    // Bank
    bank: <><path d="M3.5 9.5L12 4l8.5 5.5"/><path d="M5 9.5v9M19 9.5v9M9 12v4M15 12v4"/><path d="M3.5 19h17"/></>,
    // Gift
    gift: <><rect x="3.5" y="9" width="17" height="4" rx="1"/><path d="M4.5 13v7h15v-7"/><path d="M12 9v11"/><path d="M12 9C10.2 9 8.3 8.2 8.3 6.6c0-1.4 1-1.9 2-1.4 1.3.7 1.7 3.8 1.7 3.8zM12 9c1.8 0 3.7-.8 3.7-2.4 0-1.4-1-1.9-2-1.4-1.3.7-1.7 3.8-1.7 3.8z"/></>,
    // Delivery pincode — map pin
    pin: <><path d="M12 21s6-5.3 6-10.2A6 6 0 0 0 6 10.8C6 15.7 12 21 12 21z"/><circle cx="12" cy="10.8" r="2.3"/></>,
    // Craft flourish — crown (mirrors the placeholder monogram crown)
    crown: <><path d="M3.5 8l3.8 3.6L12 5l4.7 6.6L20.5 8l-1.6 11H5.1L3.5 8z"/></>,
    // Share
    share: <><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.4 13.3l7.2 4.4M15.6 6.3l-7.2 4.4"/></>,
};
export default function Icon({ name, size = 18, strokeWidth = 1.5, className }) {
    return (<svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>);
}
