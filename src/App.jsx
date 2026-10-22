import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MovieProvider } from "./context/MovieContext";
import MovieList from "./components/MovieList";
import MovieDetails from "./components/MovieDetails";
import Header from "./components/Header";
import "./styles.css";

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    const dispatch = useDispatch();
    const movies = useSelector((state) => state.movies.movies) || [];

    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

    useEffect(() => {
        const fetchApiMovies = async () => {
            try {
                const firstResponse = await fetch(
                    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}`,
                );

                if (!firstResponse.ok) {
                    throw new Error(`Error HTTP: ${firstResponse.status}`);
                }

                const firstData = await firstResponse.json();
                let results = firstData.results || [];

                // En la primera carga, añadimos 4 películas de la página siguiente.
                if (page === 1) {
                    const secondResponse = await fetch(
                        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=2`,
                    );

                    if (!secondResponse.ok) {
                        throw new Error(`Error HTTP: ${secondResponse.status}`);
                    }

                    const secondData = await secondResponse.json();
                    const extraMovies = (secondData.results || []).slice(0, 4);

                    results = [...results, ...extraMovies];
                }

                if (page === 1) {
                    dispatch({ type: "SET_MOVIES", payload: results });
                } else {
                    dispatch({ type: "ADD_MOVIES", payload: results });
                }
            } catch (error) {
                console.error("Error al cargar las películas:", error);
            }
        };

        fetchApiMovies();
    }, [page, dispatch]);

    const filteredMovies = movies.filter((movie) =>
        movie.title?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const loadMoreMovies = () => {
        setPage((prevPage) => prevPage + 1);
    };

    return (
        <MovieProvider>
            <div className="App">
                <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                <Routes>
                    <Route
                        path="/"
                        element={
                            <MovieList
                                filteredMovies={filteredMovies}
                                loadMoreMovies={loadMoreMovies}
                            />
                        }
                    />
                    <Route path="/movie/:id" element={<MovieDetails />} />
                </Routes>
            </div>
        </MovieProvider>
    );
}

export default App;
