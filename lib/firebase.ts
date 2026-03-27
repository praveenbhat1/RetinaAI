import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

if (getApps().length === 0) {
    // Only initialize if we have a key OR if we are in the browser (where we expect a key)
    if (hasKey) {
        app = initializeApp(firebaseConfig);
    } else if (isBrowser) {
        console.error("Firebase API Key is missing. Check your .env.local or platform environment variables.");
    }
} else {
    app = getApps()[0];
}

export const auth = app ? getAuth(app) : (null as any);
export const db = app ? getFirestore(app) : (null as any);
export default app;
