import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import usePagination, { PaginationType } from '../../../hooks/usePagination';
import Pagination from './Pagination';
import {
  CurrentPageAtom,
  RecordsPerPageAtom,
  TotalPageAtom,
  TotalRecordsAtom,
} from './PaginationState';

export default function PaginationContainer() {
  const [currentPage, setCurrentPage] = useRecoilState(CurrentPageAtom);
  const [recordsPerPage, setRecordsPerPage] =
    useRecoilState(RecordsPerPageAtom);
  const [, setTotalPages] = useRecoilState(TotalPageAtom);
  const [totalRecords] = useRecoilState(TotalRecordsAtom);

  const handleCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPage = (perPage: number) => {
    setCurrentPage(1);
    setRecordsPerPage(perPage);
  };

  const pagination: PaginationType = usePagination({
    totalRecords,
    recordsPerPage,
  });

  useEffect(() => {
    if (pagination.totalPages) {
      setTotalPages(pagination.totalPages);
    }
    return () => {};
  }, [pagination.totalPages, setTotalPages]);

  return (
    <Pagination
      totalPages={pagination.totalPages}
      currentPage={currentPage}
      handleCurrentPage={handleCurrentPage}
      recordsPerPageRange={pagination.recordsPerPageRange}
      handleRecordsPerPage={handleRecordsPerPage}
      recordsPerPage={recordsPerPage}
    />
  );
}
