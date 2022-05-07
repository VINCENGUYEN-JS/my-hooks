import * as React from 'react';

type ContextProviderProps = {
  children: React.ReactNode;
};

type ContextValues = {
  cache: Record<string, any>;
};

const AppContext = React.createContext({} as ContextValues);

export const ContextProvider = (props: ContextProviderProps) => {
  const { children } = props;
  const cache = React.useRef({});
  return <AppContext.Provider value={{ cache }}>{children}</AppContext.Provider>;
};

export const useAppContext = React.useContext(AppContext);

type InitialState = {
  loading: boolean;
  data: any;
  error: any;
};

type ActionType =
  | { type: 'SUCCESS'; payload: any }
  | {
      type: 'LOADING';
    }
  | {
      type: 'ERROR';
      error: any;
    };

const initialState: InitialState = {
  loading: false,
  data: undefined,
  error: undefined,
};

const reducer = (state: InitialState, actionType: ActionType) => {
  switch (actionType.type) {
    case 'SUCCESS': {
      return {
        data: actionType.payload,
        loading: false,
        error: undefined,
      };
    }
    case 'LOADING': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'ERROR': {
      return {
        data: undefined,
        loading: false,
        error: actionType.error,
      };
    }
    default:
      return state;
  }
};

const DEFAULT_OPTION = {
  sizeCache: 100,
  saveCache: false,
  refetchInterval: 1000,
};

type UseQueryProps = {
  url: string;
  options: {
    sizeCache: number;
    saveCache: boolean;
    refetchInterval: number;
  };
};

export const useQuery = (props: UseQueryProps) => {
  const { url, options: userOptions } = props;
  const { cache } = useAppContext;
  const options = {
    ...DEFAULT_OPTION,
    userOptions,
  };
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    let here = true;
    if (cache.current[url]) {
      dispatch({ type: 'SUCCESS', payload: cache.current[url] });
    }

    const delayDebounce = setTimeout(
      () => {
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            if (here) {
              if (options.saveCache) {
                cache.current[url] = data;
              }
              dispatch({ type: 'SUCCESS', payload: data });
            }
          })
          .catch((err) => {
            if (here) {
              dispatch({ type: 'ERROR', error: err });
            }
          });
      },
      cache.current[url] ? options.refetchInterval : 0,
    );

    return () => {
      here = false;
      clearTimeout(delayDebounce);
    };
  }, []);

  return { ...state };
};
