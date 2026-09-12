import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCy8MuJtZLiJSf8AE2Dail5p_HavOPTUJY",
  authDomain: "octaves-vnit.firebaseapp.com",
  projectId: "octaves-vnit",
  storageBucket: "octaves-vnit.firebasestorage.app",
  messagingSenderId: "879947887267",
  appId: "1:879947887267:web:805b50e6374835ab3e0516",
  measurementId: "G-N79GH6V3PX"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
