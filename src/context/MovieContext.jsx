import React, { createContext, useState, useEffect } from 'react';

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
    const [watched, setWatched] = useState(() => {
        const storedWatched = localStorage.getItem('watched');
        return storedWatched ? JSON.parse(storedWatched) : [];
    });

    useEffect(() => {
        localStorage.setItem('watched', JSON.stringify(watched));
    }, [watched]);

    const handleWatched = (movie) => {
        setWatched(prevWatched => {
            const movieIndex = prevWatched.findIndex(m => m.id === movie.id);
            if (movieIndex !== -1) {
                const updatedWatched = [...prevWatched];
                updatedWatched[movieIndex] = movie;
                return updatedWatched;
            } else {
                return [...prevWatched, movie];
            }
        });
    };

    return (
        <MovieContext.Provider value={{ watched, handleWatched }}>
            {children}
        </MovieContext.Provider>
    );
};