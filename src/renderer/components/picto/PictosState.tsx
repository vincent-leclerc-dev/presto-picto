import { atom, selectorFamily } from 'recoil';
import { IPicto, pictoDb } from '../../models/Picto';

export const PictoState = atom({
  key: 'PictoState',
  default: {} as IPicto,
});

export const PictosAtom = atom({
  key: 'PictosAtom',
  default: [] as IPicto[],
});

export const pictosQuery = selectorFamily({
  key: 'pictosQuery',
  get:
    ({ offset = 0, limit = 12 }: { offset?: number; limit?: number }) =>
    async () =>
      pictoDb.pictos.offset(offset).limit(limit).toArray(),
});

export const pictoQuery = selectorFamily({
  key: 'pictoQuery',
  get:
    ({ id = 0 }: { id: number | undefined }) =>
    async () => {
      if (typeof id === 'undefined') {
        return undefined;
      }

      const res = await pictoDb.pictos.get(id);
      if (!res) {
        return undefined;
      }
      return res;
    },
});

export const wordsQuery = selectorFamily({
  key: 'wordsQuery',
  get:
    ({ id = 0 }: { id: number | undefined }) =>
    async () => {
      if (typeof id === 'undefined') {
        return undefined;
      }

      const res = await pictoDb.pictos.get(id);
      return res;
    },
});
