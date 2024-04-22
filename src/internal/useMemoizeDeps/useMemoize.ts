'use client';
import { useRef } from 'react';
import type { DependencyList } from 'react';
import deepEqual from 'fast-deep-equal';

export function useMemoizeDeps(value: DependencyList) {
  const ref = useRef<DependencyList>([]);

  if (!deepEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export default useMemoizeDeps;
