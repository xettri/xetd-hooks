'use client';
import React from 'react';

const reactUseId: undefined | (() => string) = (React as any)['useId'];

let globalCount = 0;
const useId = (): string => {
  // if current react version has useId it will return
  // react default useId hook
  if (reactUseId) return reactUseId();

  const id = `:r${globalCount}:`;
  globalCount++;
  return id;
};

export default useId;
