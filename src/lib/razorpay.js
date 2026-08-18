// Thin loader + typed wrapper around Razorpay's hosted Checkout.js widget.
// made-royale-be creates the Razorpay order server-side (paymentApi.createRazorpayOrder)
// and verifies the signature server-side (paymentApi.verifyPayment) — this module only
// deals with getting the client-side widget script onto the page and opening it.
const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
let scriptPromise = null;
export function loadRazorpayScript() {
    if (typeof window === 'undefined')
        return Promise.reject(new Error('Razorpay checkout is only available in the browser'));
    if (window.Razorpay)
        return Promise.resolve();
    if (scriptPromise)
        return scriptPromise;
    scriptPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
        if (existing) {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay checkout script')));
            if (window.Razorpay)
                resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = SCRIPT_SRC;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => { scriptPromise = null; reject(new Error('Failed to load Razorpay checkout script')); };
        document.body.appendChild(script);
    });
    return scriptPromise;
}
export async function openRazorpayCheckout(options) {
    await loadRazorpayScript();
    if (!window.Razorpay)
        throw new Error('Razorpay checkout script did not load correctly');
    const instance = new window.Razorpay(options);
    instance.open();
    return instance;
}
