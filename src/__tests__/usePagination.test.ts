import { renderHook, act } from '@testing-library/react-hooks';
import { usePagination, paginationStateReducer, getPaginationMeta } from '../usePagination/usePagination';

const DEFAULT_STATE = {
  totalItems: 100,
  initialPageSize: 10,
  initialPage: 1,
};

describe('usePagination', () => {
  it('correctly initializes the page state and contain expected meta data', () => {
    const { result } = renderHook(() => usePagination(DEFAULT_STATE));

    expect(result.current.currentPage).toBe(DEFAULT_STATE.initialPage);
    expect(result.current.totalItems).toBe(DEFAULT_STATE.totalItems);
    expect(result.current.pageSize).toBe(DEFAULT_STATE.initialPageSize);
    expect(result.current.startIndex).toBe(DEFAULT_STATE.initialPage * DEFAULT_STATE.initialPageSize);
    expect(result.current.endIndex).toBe((DEFAULT_STATE.initialPage + 1) * DEFAULT_STATE.initialPageSize - 1);
    expect(result.current.nextEnabled).toBe(true);
    expect(result.current.previousEnabled).toBe(true);
  });

  it('sets the next page when setNextPage is called', () => {
    const { result } = renderHook(() => usePagination(DEFAULT_STATE));
    expect(result.current.currentPage).toBe(DEFAULT_STATE.initialPage);
    act(() => {
      result.current.setNextPage();
    });
    expect(result.current.currentPage).toBe(DEFAULT_STATE.initialPage + 1);
  });

  it('set the previous page when setPreviousPage is called', () => {
    const { result } = renderHook(() => usePagination(DEFAULT_STATE));
    expect(result.current.currentPage).toBe(DEFAULT_STATE.initialPage);
    act(() => {
      result.current.setPreviousPage();
    });
    expect(result.current.currentPage).toBe(DEFAULT_STATE.initialPage - 1);
  });

  it('sets the page when setPage is called', () => {
    const { result } = renderHook(() => usePagination(DEFAULT_STATE));
    expect(result.current.currentPage).toBe(DEFAULT_STATE.initialPage);
    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.currentPage).toBe(2);
  });

  it('sets the pageSize when setPageSized is called', () => {
    const { result } = renderHook(() => usePagination(DEFAULT_STATE));
    expect(result.current.pageSize).toBe(DEFAULT_STATE.initialPageSize);
    act(() => {
      result.current.setPageSize(5);
    });
    expect(result.current.pageSize).toBe(5);
  });

  it('initializes configurations to 0 when not provided', () => {
    const { result } = renderHook(() => usePagination({}));

    expect(result.current.totalItems).toBe(0);
    expect(result.current.pageSize).toBe(0);
    expect(result.current.currentPage).toBe(0);
  });

  //   it('updates the totalItems in the reducer when re-rendered', async () => {
  //     const { result, rerender } = renderHook(() => usePagination({}));
  //     expect(result.current.totalItems).toBe(0);
  //     act(() => {
  //       rerender({ totalItems: 100 });
  //     });
  //     expect(result.current.totalItems).toBe(100);
  //   });
});

const MULTI_PAGE_FIRST_PAGE = {
  totalItems: 100,
  pageSize: 10,
  currentPage: 0,
};

/**
 * The advantage of this test is you don't have to wrap your fn in act
 */
describe('paginationStateReducer', () => {
  it('sets the next page when not on the last page', () => {
    const nextState = paginationStateReducer(MULTI_PAGE_FIRST_PAGE, { type: 'NEXT_PAGE' });
    expect(nextState.currentPage).toBe(1);
  });

  it('does not set the next page when on the last page', () => {
    const nextState = paginationStateReducer(
      {
        totalItems: 1,
        currentPage: 0,
        pageSize: 1,
      },
      {
        type: 'NEXT_PAGE',
      },
    );
    expect(nextState.currentPage).toBe(0);
  });

  it('sets the previous page when not on the first page', () => {
    const nextState = paginationStateReducer(
      { totalItems: 2, pageSize: 1, currentPage: 1 },
      { type: 'PREVIOUS_PAGE' },
    );
    expect(nextState.currentPage).toBe(0);
  });

  it('set the previous page when on the first page', () => {
    const nextState = paginationStateReducer(
      {
        totalItems: 2,
        pageSize: 1,
        currentPage: 0,
      },
      { type: 'PREVIOUS_PAGE' },
    );
    expect(nextState.currentPage).toBe(0);
  });
});

describe('getPaginationMeta', () => {
  it('correct calculates startIndex and lastIndex on the first page', () => {
    const meta = getPaginationMeta(MULTI_PAGE_FIRST_PAGE);
    expect(meta.startIndex).toBe(0);
    expect(meta.endIndex).toBe(9);
  });

  it('correct calculates startIndex and lastIndex on the second page', () => {
    const meta = getPaginationMeta({ ...MULTI_PAGE_FIRST_PAGE, currentPage: 1 });
    expect(meta.startIndex).toBe(10);
    expect(meta.endIndex).toBe(19);
  });

  it('correct calculates startIndex and lastIndex on the last page', () => {
    const meta = getPaginationMeta({ ...MULTI_PAGE_FIRST_PAGE, currentPage: 9 });
    expect(meta.startIndex).toBe(90);
    expect(meta.endIndex).toBe(99);
  });

  it('correct calculates endIndex on a half-full last page', () => {
    const meta = getPaginationMeta({ totalItems: 92, pageSize: 10, currentPage: 9 });
    expect(meta.endIndex).toBe(91);
  });
});
