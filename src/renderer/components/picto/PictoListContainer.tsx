import { useMemo } from 'react';
import { useRecoilState } from 'recoil';

import { IPicto } from '../../models/Picto';
import {
  CurrentPageAtom,
  RecordsPerPageAtom,
} from '../core/pagination/PaginationState';
import PictoList from './PictoList';
import { PictosAtom } from './PictosState';

export default function PictoListContainer() {
  const [records] = useRecoilState(PictosAtom);
  const [currentPage] = useRecoilState(CurrentPageAtom);
  const [recordsPerPage] = useRecoilState(RecordsPerPageAtom);

  const recordsSlice = useMemo((): IPicto[] => {
    const firstPageIndex = (currentPage - 1) * recordsPerPage;
    const lastPageIndex = firstPageIndex + recordsPerPage;
    return records.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, records, recordsPerPage]);

  return <PictoList pictoSlice={recordsSlice} />;
}
