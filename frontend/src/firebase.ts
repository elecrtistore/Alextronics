import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBGZr393XbTW4dpHIwcslfI5d2mjzhVeOQ',
  authDomain: 'electrishop-80dd6.firebaseapp.com',
  projectId: 'electrishop-80dd6',
  storageBucket: 'electrishop-80dd6.firebasestorage.app',
  messagingSenderId: '1060879793327',
  appId: '1:1060879793327:web:4ca58fff674ef19a2c285a',
  measurementId: 'G-8G9W8295B4'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
