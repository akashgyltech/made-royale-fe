import React from "react";
import PAYMENT_METHODS from "@/data/payment-methods-data";
export default function PaymentMethods() {
    return (<section className="mr-pay-strip">
      <div className="container container-1400">
        <span className="mr-pay-strip-label">We Accept</span>
        <div className="mr-pay-strip-grid">
          {PAYMENT_METHODS.map((m) => (<div className="mr-pay-strip-item" key={m.label} title={m.label}>
              <img src={m.icon} alt={m.label} className="mr-pay-strip-icon"/>
            </div>))}
        </div>
      </div>
    </section>);
}
