import * as React from 'react';

type PaginationState = {
  totalItems: number;
  // How many items on the page
  pageSize: number;
  //Start page (could be any number to start current page )
  currentPage: number;
};

type UsePaginationConfig = {
  totalItems?: number;
  initialPage?: number;
  initialPageSize?: number;
};

type CurrentPageActions =
  | { type: 'NEXT_PAGE' }
  | { type: 'PREVIOUS_PAGE' }
  | { type: 'SET_PAGE'; page: number };

type TotalItemActions = {
  type: 'SET_TOTAL_ITEMS';
  totalItems: number;
  nextPage?: number;
};

type PageSizeActions = {
  type: 'SET_PAGE_SIZE';
  pageSize: number;
  nextPage?: number;
};

type FinalPaginationState = {
  // The current page
  currentPage: number;

  // The first index of the page window
  startIndex: number;

  // The last index of the page window
  endIndex: number;

  // Whether the next button should be enabled
  nextEnabled: boolean;

  // Whether the previous button should be enabled
  previousEnabled: boolean;

  // The total page size
  pageSize: number;

  //Total number of items
  totalItems: number;

  // Jump directly to a page
  setPage: (page: number) => void;

  // Jump to the next page
  setNextPage: () => void;

  // Jump to the previous page
  setPreviousPage: () => void;

  // Set the page size
  setPageSize: (pageSize: number, nextPage?: number) => void;
};

type PaginationStateReducerActions = CurrentPageActions | TotalItemActions | PageSizeActions;

const getTotalPages = (totalItems: number, pageSize: number): number => Math.ceil(totalItems / pageSize);

//When you have 10 pages and you are at page 10 you can't go to page 11 because of this condition
// page > 0 && page < getTotalPages()
const limitPageBounds = (totalItems: number, pageSize: number) => (page: number): number =>
  Math.min(Math.max(page, 0), getTotalPages(totalItems, pageSize) - 1);

const getStartIndex = (pageSize: number, currentPage: number): number => pageSize * currentPage;

const getEndIndex = (pageSize: number, currentPage: number, totalItems: number): number => {
  const lastPageIndex = pageSize * (currentPage + 1);
  if (lastPageIndex > totalItems) {
    return totalItems - 1;
  }
  return lastPageIndex - 1;
};

const getPreviousEnabled = (currentPage: number): boolean => currentPage > 0;

const getNextEnabled = (currentPage: number, totalPages: number): boolean => currentPage + 1 < totalPages;

const getPaginationMeta = ({ totalItems, pageSize, currentPage }: PaginationState) => {
  const totalPages = getTotalPages(totalItems, pageSize);
  return {
    totalPages,
    startIndex: getStartIndex(pageSize, currentPage),
    endIndex: getEndIndex(pageSize, currentPage, totalItems),
    previousEnabled: getPreviousEnabled(currentPage),
    nextEnabled: getNextEnabled(currentPage, totalPages),
  };
};

const getCurrentPageReducer = (rootState: PaginationState) => (
  state: PaginationState['currentPage'],
  action: PaginationStateReducerActions,
) => {
  switch (action.type) {
    case 'SET_PAGE':
      return limitPageBounds(rootState.totalItems, rootState.pageSize)(action.page);
    case 'NEXT_PAGE':
      return limitPageBounds(rootState.totalItems, rootState.pageSize)(state + 1);
    case 'PREVIOUS_PAGE':
      return limitPageBounds(rootState.totalItems, rootState.pageSize)(state - 1);
    case 'SET_TOTAL_ITEMS':
      return limitPageBounds(action.totalItems, rootState.pageSize)(action.nextPage ?? state);
    default:
      return state;
  }
};

const totalItemReducer = (state: PaginationState['totalItems'], action: TotalItemActions) => {
  switch (action.type) {
    case 'SET_TOTAL_ITEMS':
      return action.totalItems;
    default:
      return state;
  }
};

const pageSizeReducer = (state: PaginationState['pageSize'], action: PageSizeActions) => {
  switch (action.type) {
    case 'SET_PAGE_SIZE':
      return action.pageSize;
    default:
      return state;
  }
};

/**Middle ware */
const paginationStateReducer = (state: PaginationState, action: PaginationStateReducerActions) => {
  return {
    currentPage: getCurrentPageReducer(state)(state.currentPage, action as CurrentPageActions),
    totalItems: totalItemReducer(state.totalItems, action as TotalItemActions),
    pageSize: pageSizeReducer(state.pageSize, action as PageSizeActions),
  };
};

const usePagination = ({
  totalItems = 0,
  initialPage = 0,
  initialPageSize = 0,
}: UsePaginationConfig = {}): FinalPaginationState => {
  const initialState = {
    totalItems,
    pageSize: initialPageSize,
    currentPage: initialPage,
  };
  const [paginationState, dispatch] = React.useReducer(paginationStateReducer, initialState);

  const totalItemsRef = React.useRef(totalItems);
  totalItemsRef.current = totalItems;

  React.useEffect(() => {
    return () => {
      if (typeof totalItemsRef.current !== 'number' || totalItems === totalItemsRef.current) {
        return;
      }

      dispatch({ type: 'SET_TOTAL_ITEMS', totalItems: totalItemsRef.current });
    };
  }, [totalItems]);

  return {
    ...paginationState,
    ...React.useMemo(() => getPaginationMeta(paginationState), [paginationState]),
    setPage: React.useCallback((page: number) => {
      dispatch({
        type: 'SET_PAGE',
        page,
      });
    }, []),
    setNextPage: React.useCallback(() => {
      dispatch({ type: 'NEXT_PAGE' });
    }, []),
    setPreviousPage: React.useCallback(() => {
      dispatch({ type: 'PREVIOUS_PAGE' });
    }, []),
    setPageSize: React.useCallback((pageSize: number, nextPage = 0) => {
      dispatch({ type: 'SET_PAGE_SIZE', pageSize, nextPage });
    }, []),
  };
};

export { usePagination };
