import Dexie, { Table } from 'dexie';
import { MimeTypes } from '../../types';

export interface IPicto {
  id?: string;
  filename: string;
  image: Uint8Array;
  mimetype: MimeTypes;
  words: string[];
}

class PictoDatabase extends Dexie {
  pictos!: Table<IPicto>;

  constructor() {
    super('prestopicto');
    this.version(1).stores({
      pictos: '++id, image, *words',
    });
    this.pictos = this.table('pictos');
  }
}

export const pictoDb = new PictoDatabase();
