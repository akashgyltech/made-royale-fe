'use client';
import React from 'react';
import { Order, ORDER_STAGES, computeStageIndex } from '@/lib/orders';

export default function OrderTimeline({ order }: { order: Order }) {
  const current = computeStageIndex(order);
  return (
    <div className="mr-timeline">
      {ORDER_STAGES.map((stage, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'todo';
        return (
          <div key={stage.key} className={`mr-timeline-step is-${state}`}>
            <div className="mr-timeline-marker"><span>{i < current ? '✓' : i + 1}</span></div>
            <div className="mr-timeline-content"><h5>{stage.label}</h5><p>{stage.note}</p></div>
            {i < ORDER_STAGES.length - 1 && <div className={`mr-timeline-bar ${i < current ? 'is-done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}
