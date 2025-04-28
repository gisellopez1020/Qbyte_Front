import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPxgBc0Qi2W5ljbEYBOc5UnnqIYiCG7Sw",
  authDomain: "registro-qbyte.firebaseapp.com",
  projectId: "registro-qbyte",
  storageBucket: "registro-qbyte.firebasestorage.app",
  messagingSenderId: "159646744111",
  appId: "1:159646744111:web:1737c35b995a0c7267d0da"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;