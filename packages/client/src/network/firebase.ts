// Firebase web config is meant to be public in client code — actual access control is enforced
// by Firestore security rules (see /firestore.rules), not by hiding this object. Same pattern as
// every other app in this series (Worldly, Outworldly, Innerworldly).
//
// Real project ("helioworldly") as of 2026-08-26 — Firestore is provisioned and reachable
// (verified via a REST read against leaderboard/, came back 200 with an empty, queryable
// collection). Remaining publish steps (Netlify connection, game-hub link) are in BACKLOG.md.
import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyCDQQw1Qw0HESEadGxOYJN5xFFCazDrr7k',
  authDomain: 'helioworldly.firebaseapp.com',
  projectId: 'helioworldly',
  storageBucket: 'helioworldly.firebasestorage.app',
  messagingSenderId: '267091728394',
  appId: '1:267091728394:web:cb264c20781465fbab27f3',
};

export const isFirebaseConfigured = firebaseConfig.apiKey !== 'REPLACE_ME';

const app = initializeApp(firebaseConfig);

export const db = isFirebaseConfigured
  ? initializeFirestore(app, { ignoreUndefinedProperties: true })
  : getFirestore(app);
