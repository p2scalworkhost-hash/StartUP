import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminApp: App | undefined;
let adminDb: Firestore | undefined;
let adminAuth: Auth | undefined;

function formatPrivateKey(key: string) {
    return key.replace(/\\n/g, '\n');
}

export function getFirebaseAdmin() {
    if (adminApp) {
        return { adminApp, adminDb: adminDb!, adminAuth };
    }

    const hasCredentials =
        !!process.env.FIREBASE_PROJECT_ID &&
        !!process.env.FIREBASE_CLIENT_EMAIL &&
        !!process.env.FIREBASE_PRIVATE_KEY &&
        !process.env.FIREBASE_PRIVATE_KEY.startsWith('-----BEGIN PRIVATE KEY');

    try {
        if (!getApps().length) {
            if (hasCredentials) {
                adminApp = initializeApp({
                    credential: cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY!),
                    }),
                });
                // Only init Auth if we have full credentials
                adminAuth = getAuth(adminApp);
            } else {
                // Initialize with project ID only for safety
                console.warn('Initializing Firebase Admin with Project ID only (No Auth capabilities)');
                adminApp = initializeApp({
                    projectId: process.env.FIREBASE_PROJECT_ID || 'startupkub-fallback',
                });
                // adminAuth remains undefined
            }
        } else {
            adminApp = getApps()[0];
            // Try to get auth, might fail if existing app was init without creds, but that's ok
            try {
                adminAuth = getAuth(adminApp);
            } catch (e) {
                console.warn('Could not retrieve Auth instance from existing app');
            }
        }

        try {
            adminDb = getFirestore(adminApp);
        } catch (e) {
            console.error('Error initializing Firestore Admin:', e);
        }

        return { adminApp, adminDb, adminAuth };
    } catch (error) {
        console.error('Firebase Admin Init Error:', error);
        throw error;
    }
}

export const hasAdminCredentials =
    !!process.env.FIREBASE_PROJECT_ID &&
    !!process.env.FIREBASE_CLIENT_EMAIL &&
    !!process.env.FIREBASE_PRIVATE_KEY &&
    !process.env.FIREBASE_PRIVATE_KEY.startsWith('-----BEGIN PRIVATE KEY');
