import { atom } from 'recoil';
import { IWord } from './WordModel';

export const WordsAtom = atom<IWord[]>({
  key: 'WordsAtom',
  default: [],
});

export const InitialWordsAtom = atom<IWord[]>({
  key: 'InitialWordsAtom',
  default: [],
});

export const WordListErrorState = atom<string>({
  key: 'WordListErrorState',
  default: '',
});

export const WordItemErrorState = atom<{ index: number; error: string }>({
  key: 'WordItemErrorState',
  default: { index: -1, error: '' },
});

export const WordInputErrorState = atom<string>({
  key: 'WordInputErrorState',
  default: '',
});
