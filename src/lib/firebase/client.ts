import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize App safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Services directly (No Proxies)
// accessing these on server-side (Node.js) might work for some, but usually we use admin SDK on server.
// These are primarily for client-components.

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics is only supported in browser and with valid config
let analytics: Analytics | null = null;
if (typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('AIzaSy...')) {
    isSupported().then((supported) => {
        if (supported) {
            try {
                analytics = getAnalytics(app);
            } catch (e) {
                console.warn('Firebase Analytics failed to init:', e);
            }
        }
    }).catch(e => console.warn('Firebase Analytics not supported:', e));
}

export { app, auth, db, storage, analytics };
