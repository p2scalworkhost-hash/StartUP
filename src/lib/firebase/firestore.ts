import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    DocumentData,
    QueryConstraint,
} from 'firebase/firestore';
import { db } from './client';

// Generic helpers for Firestore operations

export async function getDocument<T = DocumentData>(
    collectionName: string,
    docId: string
): Promise<T | null> {
    const docRef = doc(db, collectionName, docId);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as T) : null;
}

export async function queryDocuments<T = DocumentData>(
    collectionName: string,
    ...constraints: QueryConstraint[]
): Promise<T[]> {
    const q = query(collection(db, collectionName), ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as T);
}

export async function setDocument(
    collectionName: string,
    docId: string,
    data: Record<string, unknown>
): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
}

export async function updateDocument(
    collectionName: string,
    docId: string,
    data: Record<string, unknown>
): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
}

export async function deleteDocument(
    collectionName: string,
    docId: string
): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
}

export function chunkArray<T>(arr: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    );
}

export { db, collection, doc, query, where, orderBy, limit };
