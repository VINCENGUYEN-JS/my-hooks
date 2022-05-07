import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import * as useQuery from '../useQuery/useQuery';

let useContextMock: any;
let fetch;
const mockFetchPromise = Promise.resolve({
  json: () => Promise.resolve([]),
});
describe('useQuery', () => {
  beforeEach(() => {
    useContextMock = jest.spyOn(useQuery, 'useAppContext');
    fetch = jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise as any);
  });

  test('should return query data', () => {
    useContextMock.mockReturnValue({
      cache: {},
    });
    const { result } = renderHook(() => useQuery.useQuery({ url: 'something' }));
    expect(result.current.data).toEqual([]);
  });
//   afterEach(() => {
//     (global.fetch as any).mockClear();
//     delete (global as any).fetch;
//   });
});
