import React from 'react';

export default function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="mr-stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - (i - 1)));
        return (
          <span key={i} className="mr-star" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox="0 0 24 24" className="mr-star-bg">
              <path d="M12 2l2.9 6.2 6.8.8-5 4.6 1.3 6.7L12 17.8 5.9 20.9 7.2 14.2l-5-4.6 6.8-.8L12 2z" />
            </svg>
            <span className="mr-star-fill" style={{ width: `${fill * 100}%` }}>
              <svg width={size} height={size} viewBox="0 0 24 24">
                <path d="M12 2l2.9 6.2 6.8.8-5 4.6 1.3 6.7L12 17.8 5.9 20.9 7.2 14.2l-5-4.6 6.8-.8L12 2z" />
              </svg>
            </span>
          </span>
        );
      })}
    </span>
  );
}
