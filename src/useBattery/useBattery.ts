'use client';
import { useState, useEffect } from 'react';
import deepEqual from 'fast-deep-equal';

export interface BatteryState {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

interface BatteryManager extends Readonly<BatteryState>, EventTarget {
  onchargingchange: () => void;
  onchargingtimechange: () => void;
  ondischargingtimechange: () => void;
  onlevelchange: () => void;
}

interface ExtendedNavigator extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

const customNavigator: ExtendedNavigator | undefined =
  typeof navigator !== 'undefined' ? navigator : undefined;

const useBattery = () => {
  const [batteryState, setBatteryState] = useState<BatteryState>({
    charging: false,
    chargingTime: 0,
    dischargingTime: 0,
    level: 1,
  });

  useEffect(() => {
    let battery: BatteryManager | null = null;

    const handleChange = () => {
      if (!battery) return;
      setBatteryState(oldState => {
        if (!battery) return oldState;
        const newState = {
          level: battery.level,
          charging: battery.charging,
          dischargingTime: battery.dischargingTime,
          chargingTime: battery.chargingTime,
        };
        if (deepEqual(oldState, newState)) return oldState;
        return newState;
      });
    };

    customNavigator?.getBattery?.()?.then((bat: BatteryManager) => {
      battery = bat;
      battery.addEventListener('chargingchange', handleChange);
      battery.addEventListener('chargingtimechange', handleChange);
      battery.addEventListener('dischargingtimechange', handleChange);
      battery.addEventListener('levelchange', handleChange);
      handleChange();
    });

    return () => {
      if (battery) {
        battery.removeEventListener('chargingchange', handleChange);
        battery.removeEventListener('chargingtimechange', handleChange);
        battery.removeEventListener('dischargingtimechange', handleChange);
        battery.removeEventListener('levelchange', handleChange);
      }
    };
  }, []);

  return batteryState;
};

export default useBattery;
