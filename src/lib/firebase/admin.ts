import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

// Initialize once
let app: App;

function formatPrivateKey(key: string) {
    return key.replace(/\\n/g, '\n');
}



const hasCredentials =
    !!process.env.FIREBASE_PROJECT_ID &&
    !!process.env.FIREBASE_CLIENT_EMAIL &&
    !!process.env.FIREBASE_PRIVATE_KEY;

if (!getApps().length) {
    if (hasCredentials) {
        app = initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY!),
            }),
        });
    } else {
        console.warn('Initializing Firebase Admin with Project ID only (No Auth capabilities)');
        app = initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID || 'startupkub-fallback',
        });
    }
} else {
    app = getApps()[0];
}

export const adminDb = getFirestore(app);
export const adminAuth = hasCredentials ? getAuth(app) : undefined;

export function getFirebaseAdmin() {
    return { adminApp: app, adminDb, adminAuth };
}

export const hasAdminCredentials =
    !!process.env.FIREBASE_PROJECT_ID &&
    !!process.env.FIREBASE_CLIENT_EMAIL &&
    !!process.env.FIREBASE_PRIVATE_KEY &&
    !process.env.FIREBASE_PRIVATE_KEY.startsWith('-----BEGIN PRIVATE KEY');
