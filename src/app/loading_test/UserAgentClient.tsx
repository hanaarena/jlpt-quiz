"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  onMobileRedirect?: string;
  sendToApi?: string;
};

export default function UserAgentClient({ onMobileRedirect, sendToApi }: Props = {}) {
  const [ua, setUa] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const u = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
    setUa(u);

    const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(u);
    setIsMobile(mobile);

    // Example conditional action: redirect mobile users to a mobile page
    if (mobile && onMobileRedirect) {
      router.push(onMobileRedirect);
      return;
    }

    // Example conditional action: send UA to your API for analytics
    if (sendToApi) {
      void fetch(sendToApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAgent: u, isMobile: mobile }),
      }).catch(() => {
        /* ignore */
      });
    }
  }, [onMobileRedirect, sendToApi, router]);

  return (
    <div>
      <div>User agent: {ua}</div>
      <div>Mobile: {isMobile ? 'yes' : 'no'}</div>
    </div>
  );
}
