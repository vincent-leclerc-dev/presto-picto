import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  tap,
} from 'rxjs';
import { CurrentPageAtom } from '../pagination/PaginationState';
import SearchForm from './SearchForm';
import { SearchIsLoadingAtom, SearchTermAtom } from './SearchState';

export default function SearchFormContainer() {
  const [onSearch$] = useState(() => new BehaviorSubject<string>(''));

  const [searchIsLoading, setIsLoading] = useRecoilState(SearchIsLoadingAtom);
  const [searchTerm, setSearchTerm] = useRecoilState(SearchTermAtom);
  const [, setCurrentPage] = useRecoilState(CurrentPageAtom);
  const handleSearch = (term: string): void => {
    onSearch$.next(term);
    setIsLoading(true);
    setCurrentPage(1);
  };

  useEffect(() => {
    const subscription = onSearch$
      .pipe(
        tap((term: string) => {
          setSearchTerm(term);
        }),
        debounceTime(1000),
        distinctUntilChanged(),
        catchError((err: unknown) => {
          // eslint-disable-next-line no-console
          console.error('err', err);
          return of(null);
        }),
      )
      .subscribe((term) => {
        if (searchTerm === '' || term === '') {
          setIsLoading(false);
          return;
        }
        setSearchTerm(searchTerm);
        setIsLoading(false);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [onSearch$, searchTerm, setSearchTerm, setIsLoading]);

  return (
    <SearchForm
      handleOnChange={handleSearch}
      searchTerm={searchTerm}
      searchIsLoading={searchIsLoading}
    />
  );
}
