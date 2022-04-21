import { useDeepCompareEffect } from '../useDeepCompareEffect';
import { renderHook } from '@testing-library/react-hooks';

test('useDeepCompareEffect handles changing values as expected', () => {
  const callback = jest.fn();
  let deps = [1, { a: 'b' }, true];

  const { rerender } = renderHook(() => useDeepCompareEffect(callback, deps));

  expect(callback).toHaveBeenCalledTimes(1);
  callback.mockClear();

  //no-changes (new object with same properties) <=> memoized
  deps = [1, { a: 'b' }, true];
  rerender();
  expect(callback).toHaveBeenCalledTimes(0);
  callback.mockClear();

  //change (new primitive value)
  deps = [4, { a: 'b' }, true];
  rerender();
  expect(callback).toHaveBeenCalledTimes(1);
  callback.mockClear();

  //no-changes
  rerender();
  expect(callback).toHaveBeenCalledTimes(0);
  callback.mockClear();

  //change (new primitive values)
  deps = [1, { a: 'b' }, true];
  rerender();
  expect(callback).toHaveBeenCalledTimes(1);
  callback.mockClear();

  //change (new primitives on object)
  deps = [1, { a: 'c' }, true];
  rerender();
  expect(callback).toHaveBeenCalledTimes(1);
  callback.mockClear();
});

test('useDeepCompareEffect does NOT work with manipulation', () => {
  const callback = jest.fn();
  const deps = [{ a: 'b' }];
  const { rerender } = renderHook(() => useDeepCompareEffect(callback, deps));

  expect(callback).toHaveBeenCalledTimes(1);
  callback.mockClear();

  //modification
  deps[0].a = 'c';
  rerender();
  expect(callback).toHaveBeenCalledTimes(0);
});
