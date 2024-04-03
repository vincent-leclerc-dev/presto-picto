import Dexie, { Table } from 'dexie';
import { IPicto } from './Picto';

export interface IPage {
  id: string;
  title: string;
  pictos: IPicto[];
}

export class PageDatabase extends Dexie {
  pages!: Table<IPage>;

  constructor() {
    super('prestopicto');
    this.version(1).stores({
      pages: '++id, title',
    });
  }
}

export const pageDb = new PageDatabase();
