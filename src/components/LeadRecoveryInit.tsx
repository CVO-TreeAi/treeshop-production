'use client';

import { useEffect } from 'react';
import { initLeadRecovery } from '@/utils/leadRecovery';

export default function LeadRecoveryInit() {
  useEffect(() => {
    initLeadRecovery();
  }, []);

  return null;
}