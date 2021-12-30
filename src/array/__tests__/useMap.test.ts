import { act, renderHook } from '@testing-library/react-hooks';
import { useMap } from '../useMap';
describe('useMap array', () => {
  describe('set', () => {
    it('should update old value', () => {
      //given
      const { result } = renderHook(() => useMap([[1, 'default']]));
      const [, actions] = result.current;
      expect(result.current[0].get(1)).toBe('default');
      //when
      act(() => {
        actions.set(1, 'changed');
      });
      //then
      expect(result.current[0].get(1)).toBe('changed');
    });
    it('should add new value', () => {
      //given
      const { result } = renderHook(() => useMap());
      const [, actions] = result.current;
      expect(result.current[0].get(1)).toBeUndefined();
      //when
      act(() => {
        actions.set(1, 'added');
      });
      //then
      expect(result.current[0].get(1)).toBe('added');
    });
  });

  describe('delete', () => {
    it('should delete existing value', () => {
      //given
      const { result } = renderHook(() => useMap([[1, 'exisiting']]));
      const [, actions] = result.current;
      expect(result.current[0].get(1)).toBe('exisiting');
      //when
      act(() => {
        actions.delete(1);
      });
      expect(result.current[0].get(1)).toBeUndefined();
    });
  });

  describe('initialize', () => {
    it.each`
      message    | input
      ${'map'}   | ${new Map([[1, 'initialized']])}
      ${'tuple'} | ${[[1, 'initialized']]}
    `('initializes with $message', ({ input }) => {
      //given
      const { result } = renderHook(() => useMap());
      const [, actions] = result.current;
      expect(result.current[0].get(1)).toBeUndefined();
      //when
      act(() => {
        actions.initialize(input);
      });
      expect(result.current[0].get(1)).toBe('initialized');
    });
  });

  describe('clear', () => {
    it('clears the map state and gets values', () => {
      //given
      const { result } = renderHook(() => useMap([[1, 'initialized']]));
      const [, actions] = result.current;
      expect(result.current[0].get(1)).toBe('initialized');
      //when
      act(() => {
        actions.clear();
      });
      // then
      expect(result.current[0].get(1)).toBeUndefined();
    });
  });

  describe('hooks optimizations', () => {
    it('should change value reference equality after change', () => {
      //given
      const { result } = renderHook(() => useMap());
      const [originalValueReference, actions] = result.current;
      expect(result.current[0]).toBe(originalValueReference);
      //when
      act(() => {
        actions.set(1, 'changed');
      });
      //then
      expect(result.current[0]).not.toBe(originalValueReference);
      expect(originalValueReference.get(1)).toBeUndefined();
      expect(result.current[0].get(1)).toBe('changed');
    });
    it('should keep actions reference equality after value change', () => {
      //given
      const { result } = renderHook(() => useMap());
      const [, originalActionReference] = result.current;
      //when
      act(() => {
        originalActionReference.set(1, 'changed');
      });
      expect(originalActionReference).toBe(result.current[1]);
    });
    //then
  });
});
