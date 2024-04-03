import { atom } from 'recoil';

export const SearchTermAtom = atom({
  key: 'SearchTermAtom',
  default: '',
});

export const SearchIsLoadingAtom = atom({
  key: 'SearchIsLoadingAtom',
  default: false,
});

export const SearchIsEndedAtom = atom({
  key: 'SearchIsEndedAtom',
  default: false,
});
