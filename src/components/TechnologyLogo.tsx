'use client';

import { useState } from 'react';
import { Library, QrCode } from 'lucide-react';

export default function TechnologyLogo({ src, monochrome = false, qr = false, className }: {
  src?: string;
  monochrome?: boolean;
  qr?: boolean;
  className: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    const Icon = qr ? QrCode : Library;
    return <Icon aria-hidden="true" className={className} />;
  }

  // Serve SVGs directly, without the Next.js image optimizer.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" aria-hidden="true" width={18} height={18}
    loading="lazy" decoding="async" onError={() => setFailed(true)}
    className={`${className} object-contain${monochrome ? ' dark:invert' : ''}`} />;
}
