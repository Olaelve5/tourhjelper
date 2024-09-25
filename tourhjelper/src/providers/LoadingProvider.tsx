import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface LoadingContextProps {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [loadingCount, setLoadingCount] = useState(1);

    const setLoading = (loading: boolean) => {
        setLoadingCount(prevCount => loading ? prevCount + 1 : Math.max(prevCount - 1, 0));
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingCount(prevCount => Math.max(prevCount - 1, 0));
        }, 1500);

        return () => clearTimeout(timer);
    }, [loadingCount]);

    return (
        <LoadingContext.Provider value={{ isLoading: loadingCount > 0, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};