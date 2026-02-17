import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User,
} from 'firebase/auth';
import { auth, db } from './client';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const MOCK_USER_KEY = 'sheq_mock_user';

export async function loginWithEmail(email: string, password: string) {
    try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await credential.user.getIdToken();

        // Create session cookie via API
        await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });

        await createUserDocument(credential.user);
        return credential.user;
    } catch (error: any) {
        // Fallback to Mock Mode if API Key is invalid or restricted
        if (error.code === 'auth/api-key-not-valid' || error.code === 'auth/internal-error') {
            console.warn('Authentication failed (Invalid Key). Switching to Mock Mode.');

            const mockUser = {
                uid: 'mock-user-123',
                email: email,
                displayName: 'Mock User',
                photoURL: '',
            } as User;

            if (typeof window !== 'undefined') {
                localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
                // Force reload or trigger listener manually?
                // The listener below will pick it up on re-mount or we can trigger it.
                // But better to just let the UI react to the store update in AuthProvider if possible.
                // Actually AuthProvider listens to onAuthChange.
                // We need to trigger the callback in onAuthChange.
                // Since we can't easily trigger the existing listener, we rely on page reload or 
                // the fact that we return here and the caller redirects.
                // Start a "mock" session
            }
            return mockUser;
        }
        throw error;
    }
}

export async function registerWithEmail(email: string, password: string) {
    // Similar mock logic could be added here if needed
    try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserDocument(credential.user);
        return credential.user;
    } catch (error: any) {
        if (error.code === 'auth/api-key-not-valid' || error.code === 'auth/internal-error') {
            const mockUser = {
                uid: 'mock-user-123',
                email: email,
                displayName: 'Mock User',
                photoURL: '',
            } as User;
            if (typeof window !== 'undefined') {
                localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
            }
            return mockUser;
        }
        throw error;
    }
}

async function createUserDocument(user: User) {
    try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                role: 'user',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }
    } catch (error) {
        console.warn('Firestore write failed (likely mock mode):', error);
    }
}

export async function logout() {
    try {
        await fetch('/api/auth/session', { method: 'DELETE' });
        await signOut(auth);
    } catch (e) {
        console.warn('SignOut error:', e);
    }
    if (typeof window !== 'undefined') {
        localStorage.removeItem(MOCK_USER_KEY);
        window.location.reload(); // Reload to clear state
    }
}

export function onAuthChange(callback: (user: User | null) => void) {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(MOCK_USER_KEY);
        if (stored) {
            const mockUser = JSON.parse(stored);
            // Simulate async auth check
            setTimeout(() => callback(mockUser as User), 500);
            return () => { };
        }
    }
    return onAuthStateChanged(auth, callback);
}

export { auth };
