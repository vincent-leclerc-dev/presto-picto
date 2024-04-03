import { atom } from 'recoil';
import { MimeTypes } from '../../../types';
import { IWord } from './words/WordModel';

export const WordsWithIdsState = atom<IWord[]>({
  key: 'WordsWithIdsState',
  default: [],
});

export const titleAtom = atom<string>({
  key: 'title',
  default: 'Ajouter un pictogramme',
});

export const fileNameAtom = atom<string>({
  key: 'fileName',
  default: '',
});

export const mimeTypeAtom = atom<MimeTypes>({
  key: 'mimeType',
  default: 'image/png',
});

export const base64StrAtom = atom<string>({
  key: 'base64Str',
  default: '',
});

export const uint8arrayAtom = atom<Uint8Array>({
  key: 'uint8array',
  default: new Uint8Array(),
});

export const fileIsLoadedAtom = atom<boolean>({
  key: 'fileIsLoaded',
  default: false,
});

export const fileIsNewAtom = atom<boolean>({
  key: 'fileIsNew',
  default: false,
});

export const pictoWasCreatedAtom = atom<boolean>({
  key: 'pictoWasCreated',
  default: false,
});

export const pictoWasUpdatedAtom = atom<boolean>({
  key: 'pictoWasUpdated',
  default: false,
});

export const pictoIdAtom = atom<string>({
  key: 'pictoId',
  default: '',
});

export const errorAtom = atom<string>({
  key: 'error',
  default: '',
});
