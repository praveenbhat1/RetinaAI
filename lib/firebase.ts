import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only once
let app;
const isBrowser = typeof window !== "undefined";
const hasKey = !!firebaseConfig.apiKey;

if (isBrowser) {
    console.log("Firebase Init: Checking configuration...", {
        hasApiKey: !!firebaseConfig.apiKey,
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain
    });
}

if (getApps().length === 0) {
    if (hasKey) {
        try {
            app = initializeApp(firebaseConfig);
            if (isBrowser) console.log("Firebase Init: Success");
        } catch (err) {
            if (isBrowser) console.error("Firebase Init: Failed to initializeApp", err);
        }
    } else if (isBrowser) {
        console.error("Firebase Init: API Key is missing. Check your .env.local or platform environment variables.");
    }
} else {
    app = getApps()[0];
    if (isBrowser) console.log("Firebase Init: Using existing app instance");
}

export const auth = app ? getAuth(app) : (null as any);

// Use initializeFirestore with Long Polling to prevent "Backend didn't respond within 10 seconds" errors
export const db = (isBrowser && app) ? initializeFirestore(app, {
    experimentalForceLongPolling: true,
}) : (app ? getFirestore(app) : (null as any));

// Enable Offline Persistence for a smoother experience
if (isBrowser && db) {
    enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn("Firebase Persistence: Multiple tabs open, persistence enabled in first tab only.");
        } else if (err.code === 'unimplemented') {
            console.warn("Firebase Persistence: Browser does not support offline persistence.");
        }
    });
}

export default app;
