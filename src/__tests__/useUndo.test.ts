import { renderHook, act } from '@testing-library/react-hooks';
import { useUndo } from '../useUndo/useUndo';

describe('useUndo', () => {
  test('initiliazes the state correctly', () => {
    const { result } = renderHook(() => useUndo(0));
    const [countState, { canUndo, canRedo }] = result.current;
    expect(countState).toEqual({
      past: [],
      present: 0,
      future: [],
    });
    expect(canUndo).toBe(false);
    expect(canRedo).toBe(false);
  });

  test('multiple set without undo and redo', () => {
    const { result } = renderHook(() => useUndo(0));
    const [_, { set }] = result.current;
    act(() => {
      set(1);
      set(2);
      set(3);
    });
    expect(result.current[0]).toEqual({
      past: [0, 1, 2],
      present: 3,
      future: [],
    });

    test('multiple set with undo', async () => {
      const { result } = renderHook(() => useUndo(0));
      const [_, { set }] = result.current;
      act(() => {
        set(1);
        set(2);
        set(3);
      });
      act(() => {
        result.current[1].undo();
        result.current[1].undo();
        result.current[1].undo();
      });
      expect(result.current[0]).toEqual({
        past: [],
        present: 0,
        future: [1, 2, 3],
      });
    });
  });

  test('multiple set with undo and redo', async () => {
    const { result } = renderHook(() => useUndo(0));
    const [_, { set }] = result.current;
    act(() => {
      set(1);
      set(2);
      set(3);
    });
    act(() => {
      result.current[1].undo();
      result.current[1].undo();
      result.current[1].undo();
    });
    act(() => {
      result.current[1].redo();
      result.current[1].redo();
      result.current[1].redo();
    });
    expect(result.current[0]).toEqual({
      past: [0, 1, 2],
      present: 3,
      future: [],
    });
  });
});
