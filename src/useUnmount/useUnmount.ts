'use client';
import { useEffect } from 'react';
import type { DependencyList } from 'react';

function useUnmount<T>(callback: () => T, deps: DependencyList = []) {
  useEffect(
    () => () => {
      callback();
    },
    deps,
  );
}

export default useUnmount;
