'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  logoSrc?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Loading...',
  logoSrc = '/pattern.png',
  className = '',
}) => {
  const ring = {
    sm:  { outer: 48,  logo: 24, stroke: 3  },
    md:  { outer: 72,  logo: 36, stroke: 4  },
    lg:  { outer: 120, logo: 58, stroke: 5  },
  }[size];

  const textSize = { sm: 'text-xs', md: 'text-sm', lg: 'text-[14px]' }[size];
  const r   = (ring.outer - ring.stroke) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen gap-5 bg-white ${className}`}
    >
      {/* SVG ring + logo */}
      <div className="relative" style={{ width: ring.outer, height: ring.outer }}>

        {/* Outer spinning arc */}
        <svg
          width={ring.outer}
          height={ring.outer}
          className="absolute inset-0"
          style={{ animation: 'spin-cw 1.4s linear infinite' }}
        >
          <circle
            cx={ring.outer / 2}
            cy={ring.outer / 2}
            r={r}
            fill="none"
            stroke="#e5e5e5"
            strokeWidth={ring.stroke}
          />
          <circle
            cx={ring.outer / 2}
            cy={ring.outer / 2}
            r={r}
            fill="none"
            stroke="#111"
            strokeWidth={ring.stroke}
            strokeLinecap="round"
            strokeDasharray={`${circ * 0.25} ${circ * 0.75}`}
          />
        </svg>

        {/* Inner counter-spinning arc */}
        <svg
          width={ring.outer}
          height={ring.outer}
          className="absolute inset-0"
          style={{ animation: 'spin-ccw 2.1s linear infinite' }}
        >
          <circle
            cx={ring.outer / 2}
            cy={ring.outer / 2}
            r={r * 0.72}
            fill="none"
            stroke="#d4d4d4"
            strokeWidth={ring.stroke * 0.6}
            strokeLinecap="round"
            strokeDasharray={`${circ * 0.72 * 0.15} ${circ * 0.72 * 0.85}`}
          />
        </svg>

        {/* Logo / image in center — pulse + breathe */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ animation: 'breathe 2.8s ease-in-out infinite' }}
        >
          <img
            src={logoSrc}
            alt="logo"
            style={{
              width:  ring.logo,
              height: ring.logo,
              objectFit: 'contain',
              filter: 'grayscale(1)',
              borderRadius: 4,
            }}
          />
        </div>
      </div>

      {/* Text + dots */}
      <div className="flex flex-col items-center gap-2">
        <span
          className={`${textSize} font-medium tracking-widest uppercase text-gray-400 select-none`}
          style={{ letterSpacing: '0.18em' }}
        >
          {text}
        </span>

        {/* Three dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="block w-1 h-1 rounded-full bg-gray-300"
              style={{ animation: `dot-fade 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-cw  { to { transform: rotate(360deg);  } }
        @keyframes spin-ccw { to { transform: rotate(-360deg); } }

        @keyframes breathe {
          0%, 100% { opacity: 1;    transform: scale(1);    }
          50%       { opacity: 0.55; transform: scale(0.88); }
        }

        @keyframes dot-fade {
          0%, 80%, 100% { opacity: 0.2; transform: translateY(0); }
          40%            { opacity: 1;   transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
};

/* ─── Full-page overlay ─────────────────────────────────── */
export const FullPageLoading: React.FC<LoadingSpinnerProps> = (props) => (
  <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
    <LoadingSpinner {...props} size={props.size ?? 'lg'} />
  </div>
);

/* ─── Skeleton ──────────────────────────────────────────── */
export const SkeletonLoader: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div
          className="h-4 bg-gray-200 rounded"
          style={{ width: `${100 - i * 15}%` }}
        />
      </div>
    ))}
  </div>
);

export default LoadingSpinner;