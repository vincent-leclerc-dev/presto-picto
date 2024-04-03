import { atom } from 'recoil';

export const RecordsPerPageAtom = atom<number>({
  key: 'RecordsPerPageAtom',
  default: 12,
});

export const TotalRecordsAtom = atom<number>({
  key: 'TotalRecordsAtom',
  default: 0,
});

export const CurrentPageAtom = atom<number>({
  key: 'CurrentPageAtom',
  default: 1,
});

export const TotalPageAtom = atom<number>({
  key: 'TotalPageAtom',
  default: 0,
});
