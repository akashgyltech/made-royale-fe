'use client';
import React from 'react';
import { ORDER_STAGES, STATUS_LABELS, isTerminalException, stageIndex, exceptionNote } from '@/lib/order-status';
export default function OrderTimeline({ status }) {
    if (isTerminalException(status)) {
        return (<div className="mr-timeline">
        <div className="mr-timeline-step is-active">
          <div className="mr-timeline-marker"><span>!</span></div>
          <div className="mr-timeline-content">
            <h5>{STATUS_LABELS[status]}</h5>
            <p>{exceptionNote(status)}</p>
          </div>
        </div>
      </div>);
    }
    const current = stageIndex(status);
    return (<div className="mr-timeline">
      {ORDER_STAGES.map((stage, i) => {
            const state = i < current ? 'done' : i === current ? 'active' : 'todo';
            return (<div key={stage.key} className={`mr-timeline-step is-${state}`}>
            <div className="mr-timeline-marker"><span>{i < current ? '✓' : i + 1}</span></div>
            <div className="mr-timeline-content"><h5>{stage.label}</h5><p>{stage.note}</p></div>
            {i < ORDER_STAGES.length - 1 && <div className={`mr-timeline-bar ${i < current ? 'is-done' : ''}`}/>}
          </div>);
        })}
    </div>);
}
