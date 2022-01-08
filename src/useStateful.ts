import React, { SetStateAction, useMemo, useState } from 'react';

export type UseStateful<T> = {
  value: T;
  setValue: React.Dispatch<SetStateAction<T>>;
};

export function useStateful<T = any>(initial: T): UseStateful<T> {
  const [value, setValue] = useState(initial);
  return useMemo(() => ({ value, setValue }), [value, setValue]);
}
