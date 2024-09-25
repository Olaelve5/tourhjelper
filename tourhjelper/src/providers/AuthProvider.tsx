// contexts/AuthContext.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebaseConfig'; // Adjust the import path as necessary
import { onAuthStateChanged, User, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';


type AuthContextType = {
    user: User | null;
  };

  const AuthContext = createContext<AuthContextType>({
    user: null});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user: currentUser }}>
            {children}
        </AuthContext.Provider>
    );
};