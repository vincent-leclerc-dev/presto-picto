import { atom } from 'recoil';
import { WordType } from '../../../types/Picto';

export const WordListAtom = atom<WordType[]>({
  key: 'WordListAtom',
  default: [],
});

export const CurrentFocusIndexAtom = atom<number>({
  key: 'CurrentFocusIndexAtom',
  default: 0,
});
