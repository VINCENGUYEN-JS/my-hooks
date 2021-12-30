import React, { useState, useCallback, useMemo, SetStateAction } from 'react';

type UseBooleanAction = (initial: boolean) => [boolean, UseBooleanActions];

export type UseBooleanActions = {
  setValue: React.Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
};

export type UseBoolean = [boolean, UseBooleanActions];

export const useBoolean: UseBooleanAction = (initial) => {
  const [value, setValue] = useState<boolean>(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  const actions = useMemo(
    () => ({
      setValue,
      toggle,
      setTrue,
      setFalse,
    }),
    [],
  );

  return useMemo(() => [value, actions], [value, actions]);
};

export default useBoolean;
