'use client';
import { useEffect } from 'react';
import type { EffectCallback, DependencyList } from 'react';
import { useMemoizeDeps } from '../internal';

function useEffectPro(effect: EffectCallback, deps?: DependencyList) {
  if (!Array.isArray(deps)) {
    return useEffect(effect);
  }
  if (deps.length === 0) return useEffect(effect, []);
  return useEffect(effect, useMemoizeDeps(deps));
}

export default useEffectPro;
