import * as React from 'react';

enum ActionType {
  Undo = 'UNDO',
  Redo = 'REDO',
  Reset = 'RESET',
  Set = 'SET',
}

interface Actions<T> {
  reset: (newPresent: T) => void;
  set: (newPresent: T) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

interface Action<T> {
  type: ActionType;
  newPresent?: T;
}

interface State<T> {
  past: T[];
  present: T;
  future: T[];
}

const initialState = {
  past: [],
  present: null,
  future: [],
};

const useUndo = <T>(initialPresent: T): [State<T>, Actions<T>] => {
  const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
    const { past, present, future } = state;

    switch (action.type) {
      case ActionType.Undo: {
        if (past.length === 0) {
          return state;
        }
        const previousPast = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        return {
          past: newPast,
          present: previousPast,
          future: [present, ...future],
        };
      }
      case ActionType.Redo: {
        if (future.length === 0) {
          return state;
        }
        const nextFuture = future[0];
        const newFuture = future.slice(1);
        return {
          past: [...past, present],
          present: nextFuture,
          future: newFuture,
        };
      }
      case ActionType.Reset: {
        const { newPresent } = action;
        return {
          past: [],
          present: newPresent!,
          future: [],
        };
      }
      case ActionType.Set: {
        const { newPresent } = action;
        return {
          past: [...past, present],
          present: newPresent!,
          future: [],
        };
      }
      default:
        return state;
    }
  };
  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    present: initialPresent,
  }) as [State<T>, React.Dispatch<Action<T>>];

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;
  const undo = React.useCallback(() => {
    if (canUndo) {
      dispatch({
        type: ActionType.Undo,
      });
    }
  }, [canUndo]);
  const redo = React.useCallback(() => {
    if (canRedo) {
      dispatch({
        type: ActionType.Redo,
      });
    }
  }, [canRedo]);
  const reset = React.useCallback((newPresent: T) => {
    dispatch({ type: ActionType.Reset, newPresent });
  }, []);
  const set = React.useCallback((newPresent: T) => {
    dispatch({ type: ActionType.Set, newPresent });
  }, []);
  return [state, { reset, set, undo, redo, canUndo, canRedo }];
};

export { useUndo };
