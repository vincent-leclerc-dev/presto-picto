import { useMemo } from 'react';

const range = (start: number, stop: number, step = 12): number[] => {
  const res = [];
  for (let i = start; i <= stop; i += 1) {
    res.push(i * step);
  }
  return res;
};

export type PaginationType = {
  totalPages: number;
  recordsPerPageRange: number[];
};
const usePagination = ({
  totalRecords,
  recordsPerPage,
}: {
  totalRecords: number;
  recordsPerPage: number;
}): PaginationType => {
  const paginationCache = useMemo(() => {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const step = 12;
    const start = 1;
    const stop = Math.ceil(totalRecords / step);
    const recordsPerPageRange = range(start, stop, step);

    return {
      totalPages,
      recordsPerPageRange,
    };
  }, [totalRecords, recordsPerPage]);

  return paginationCache;
};

export default usePagination;
