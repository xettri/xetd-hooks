'use client';
import { useCallback } from 'react';
import type { DependencyList } from 'react';
import { useMemoizeDeps } from '../internal';

function useCallbackPro<T extends Function>(callback: T, deps: DependencyList) {
  if (!deps || (Array.isArray(deps) && deps.length === 0)) {
    return useCallback(callback, []);
  }
  return useCallback(callback, useMemoizeDeps(deps));
}

export default useCallbackPro;
