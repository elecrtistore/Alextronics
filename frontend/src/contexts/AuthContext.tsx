import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../firebase';
import { UserProfile, UserRole } from '../types/user';
import { fetchProfile, assignRole } from '../services/authService';

interface AuthContextValue {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signupWithRole: (email: string, password: string, role: string, adminCode?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredRole(): UserRole | null {
  try {
    const r = localStorage.getItem('electrishop-role');
    if (r === 'Admin' || r === 'Buyer' || r === 'Seller') return r;
  } catch {}
  return null;
}

function storeRole(role: string) {
  try { localStorage.setItem('electrishop-role', role); } catch {}
}

function clearStoredRole() {
  try { localStorage.removeItem('electrishop-role'); } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const token = await fbUser.getIdToken();
          const profile = await fetchProfile(token);
          storeRole(profile.role);
          setUser(profile);
        } catch {
          const storedRole = getStoredRole();
          setUser({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || fbUser.email || 'User',
            role: storedRole || 'Buyer'
          });
        }
      } else {
        setUser(null);
        clearStoredRole();
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signupWithRole = async (email: string, password: string, role: string, adminCode?: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
    try {
      const fbUser = auth.currentUser;
      if (fbUser) {
        const token = await fbUser.getIdToken();
        const profile = await assignRole(token, role, adminCode);
        storeRole(profile.role);
        setUser(profile);
      }
    } catch {
      storeRole(role === 'Admin' ? 'Admin' : 'Buyer');
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
    clearStoredRole();
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, signup, signupWithRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
