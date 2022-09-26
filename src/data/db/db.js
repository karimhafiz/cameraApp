// db.js
import Dexie from 'dexie';

export const db = new Dexie('notes');
db.version(1).stores({
    photoNotes: '++id, currentImage',
});