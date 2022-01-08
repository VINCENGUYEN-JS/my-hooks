import { useMemo } from 'react';
import type { UseStateful } from './useStateful';
import { useMap as useMapArray, UseMapActions, MapOrEntries } from './array/useMap';

type UseMap<K, V> = UseStateful<Map<K, V>> & UseMapActions<K, V>;

export function useMap<K, V>(initialState: MapOrEntries<K, V> = new Map()): UseMap<K, V> {
  const [map, actions] = useMapArray(initialState);
  return useMemo(() => ({ value: map, ...actions }), [map, actions]);
}
