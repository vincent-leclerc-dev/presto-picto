import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import PaginationContainer from '../components/core/pagination/PaginationContainer';
import { TotalRecordsAtom } from '../components/core/pagination/PaginationState';
import SearchFormContainer from '../components/core/search/SearchContainer';
import {
  SearchIsEndedAtom,
  SearchIsLoadingAtom,
  SearchTermAtom,
} from '../components/core/search/SearchState';
import PictoListContainer from '../components/picto/PictoListContainer';
import PictoListEmptyState from '../components/picto/PictoListEmptyState';
import { PictosAtom } from '../components/picto/PictosState';
import { pictoDb } from '../models/Picto';

function PictosPage() {
  const [searchTerm] = useRecoilState(SearchTermAtom);
  const [isLoading] = useRecoilState(SearchIsLoadingAtom);
  const [, setSearchIsEnded] = useRecoilState(SearchIsEndedAtom);
  const [, setTotalRecords] = useRecoilState(TotalRecordsAtom);
  const [, setPictos] = useRecoilState(PictosAtom);

  const handleSearchTermChange = useCallback(
    async (term: string) => {
      setSearchIsEnded(false);
      const pictosFromDb =
        term !== ''
          ? await pictoDb.pictos
              .filter((picto) => {
                const words =
                  picto.words.find((word) => word.startsWith(term)) || [];

                return words?.length > 0;
              })
              .toArray()
          : await pictoDb.pictos.toArray();
      setPictos(pictosFromDb);
      setTotalRecords(pictosFromDb.length);
      setSearchIsEnded(true);
    },
    [setPictos, setTotalRecords, setSearchIsEnded],
  );

  useEffect(() => {
    handleSearchTermChange(searchTerm);
  }, [searchTerm, handleSearchTermChange]);

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <SearchFormContainer />
      {isLoading && <PictoListEmptyState />}
      {!isLoading && (
        <>
          <PictoListContainer />
          <PaginationContainer />
        </>
      )}
    </div>
  );
}

export default PictosPage;
