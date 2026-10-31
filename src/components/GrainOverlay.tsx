// components/common/GrainOverlay.tsx
'use client';

import { useEffect, useRef } from 'react';

export const GrainOverlay = () => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const img = ctx.createImageData(128, 128);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = 10;
    }
    ctx.putImageData(img, 0, 0);
    if (overlayRef.current) overlayRef.current.style.backgroundImage = `url("${canvas.toDataURL()}")`;
  }, []);

  return (
    <>
      {/* Grain texture generated locally */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
        className="fixed inset-0 pointer-events-none -z-10 hidden mix-blend-multiply dark:block dark:opacity-[0.05]"
      />
    </>
  );
};
