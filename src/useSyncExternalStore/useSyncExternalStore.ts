'use client';
import React from 'react';
import { useSyncExternalStore as useSyncExternalStoreShim } from 'use-sync-external-store/shim';

const reactUseSyncExternalStore: undefined | (() => string) = (React as any)['useSyncExternalStore'];
export default reactUseSyncExternalStore || useSyncExternalStoreShim;
