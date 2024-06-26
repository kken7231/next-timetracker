import {
  collection,
  onSnapshot,
  query,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  Timestamp,
  runTransaction,
  where,
  addDoc,
  getFirestore,
  Firestore,
} from 'firebase/firestore';

import { db as _db } from '@/lib/firebase/clientApp';

export async function getSpaces(db: Firestore = _db, filters = {}) {
  console.log('clicked');
  try {
    let q = query(collection(db, 'db-spaces'));
    const results = await getDocs(q);
    console.log(`results: ${results}`);
  } catch (error) {
    console.log('Error');
  }
}
