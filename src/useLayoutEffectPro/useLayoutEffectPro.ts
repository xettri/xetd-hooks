'use client';
import { useLayoutEffect, useEffect } from 'react';
import type { EffectCallback, DependencyList } from 'react';
import { useMemoizeDeps } from '../internal';

const useLayoutEffectBase =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const useLayoutEffectPro = (
  effect: EffectCallback,
  deps?: DependencyList,
  cache = true,
) => {
  if (!Array.isArray(deps)) {
    return useLayoutEffectBase(effect);
  }
  if (deps.length === 0) return useLayoutEffectBase(effect, []);
  return useLayoutEffectBase(effect, cache ? useMemoizeDeps(deps) : deps);
};

export default useLayoutEffectPro;
