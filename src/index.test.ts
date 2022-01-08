import { renderHook, act } from '@testing-library/react-hooks';
import { useStateful } from './useStateful';

describe('useStateful', () => {
  it('should change value', () => {
    const { result } = renderHook(() => useStateful('initial'));
    expect(result.current.value).toBe('initial');
    act(() => {
      result.current.setValue('changed');
    });
    expect(result.current.value).toBe('changed');
  });
});

describe('hook optimization', () => {
  it('should keep setValue reference equality after value changed', () => {
    const { result } = renderHook(() => useStateful('initial'));
    const setValue = result.current.setValue;
    act(() => {
      result.current.setValue('changed');
    });
    expect(result.current.setValue).toBe(setValue);
  });
});
