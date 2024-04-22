'use client';
import { useRef, useEffect } from 'react';
import deepEqual from 'fast-deep-equal';

export type UsePreviousOption = {
  deepCompare?: boolean;
};

const usePrevious = <T>(
  value: T,
  options?: UsePreviousOption,
): T | undefined => {
  const { deepCompare = true } = options || {};
  const ref = useRef<T>();

  useEffect(() => {
    // it will keep refrence same if no change in props
    if (deepCompare === true) {
      if (!deepEqual(ref.current, value)) {
        ref.current = value;
      }
    } else {
      ref.current = value;
    }
  }, [value, deepCompare]);

  return ref.current;
};

export default usePrevious;
