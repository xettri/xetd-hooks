'use client';
import { useMemo } from 'react';
import type { DependencyList } from 'react';
import { useMemoizeDeps } from '../internal';

function useMemoPro<T>(factory: () => T, deps: DependencyList) {
  if (!deps || !Array.isArray(deps)) {
    return useMemo(factory, []);
  }
  if (deps.length === 0) return useMemo(factory, []);
  return useMemo(factory, useMemoizeDeps(deps));
}

export default useMemoPro;
