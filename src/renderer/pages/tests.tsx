/* eslint-disable no-console */

import { useEffect, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import PaginationContainer from '../components/core/pagination/PaginationContainer';
import {
  CurrentPageAtom,
  RecordsPerPageAtom,
} from '../components/core/pagination/PaginationState';

function TestsPage() {
  const [records, setRecords] = useState<number[]>([]);
  const [currentPage] = useRecoilState(CurrentPageAtom);
  const [recordsPerPage] = useRecoilState(RecordsPerPageAtom);

  const recordsSlice = useMemo((): number[] => {
    const firstPageIndex = (currentPage - 1) * recordsPerPage;
    const lastPageIndex = firstPageIndex + recordsPerPage;
    return records.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, records, recordsPerPage]);

  useEffect(() => {
    if (records.length === 0) {
      const items = Array.from(Array(91).keys());
      setRecords(items);
    }

    return () => {};
  }, [records]);
  return (
    <div className="flex flex-col dark:bg-amber-400 p-8">
      <h1 className="text-3xl">Test</h1>
      <PaginationContainer />
      <ul>
        {recordsSlice?.map((record) => {
          return <li key={record}>{record}</li>;
        })}
      </ul>
      <PaginationContainer />
    </div>
  );
}

export default TestsPage;
