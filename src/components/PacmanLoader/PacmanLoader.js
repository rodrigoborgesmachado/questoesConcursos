import React from 'react';
import './PacmanLoader.css';

export default function PacmanLoader({
  size = 64,
  mouthAngle = 40,
  dots = 7
}) {
  const pellets = Array.from({ length: dots }, (_, i) => i);
  return (
    <div className='loader-container'>
      <div
        className="pacman-loader"
        role="status"
        aria-label="Carregando…"
        style={{
          '--size': `${size}px`,
          '--mouth': `${mouthAngle}deg`,
          '--dots': dots
        }}
      >
        <div className="pacman" />
        <div className="pellets" aria-hidden="true">
          {pellets.map(i => <span key={i} className="pellet" style={{ '--i': i }} />)}
        </div>
      </div>
    </div>
  );
}
