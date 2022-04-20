import * as React from 'react';
import isEqual from 'lodash/isEqual';

type UseEffectParams = Parameters<typeof React.useEffect>;
type EffectCallback = UseEffectParams[0];
type DependencyList = UseEffectParams[1];
type UseEffectReturn = ReturnType<typeof React.useEffect>;

function useDeepCompareMemoize<T>(value: T) {
  const ref = React.useRef<T>();

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

const useDeepCompareEffect = (callback: EffectCallback, dependencies: DependencyList): UseEffectReturn => {
  return React.useEffect(callback, useDeepCompareMemoize(dependencies));
};

export { useDeepCompareEffect };
