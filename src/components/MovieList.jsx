
import React from 'react';
import { Link } from 'react-router-dom';

function MovieList({ filteredMovies, loadMoreMovies }) {
    return (
        <main className="movies_body">
            <h2>Películas</h2>

            {filteredMovies.length === 0 ? (
                <p className="no-movies">
                    No se han encontrado películas.
                </p>
            ) : (
                <ul>
                    {filteredMovies.map((movie) => {
                        const year = movie.release_date
                            ? movie.release_date.substring(0, 4)
                            : null;

                        return (
                            <li key={movie.id} className="movie_li">
                                <Link to={`/movie/${movie.id}`}>
                                    {movie.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                            alt={`Póster de ${movie.title}`}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="movie-no-poster">
                                            Póster no disponible
                                        </div>
                                    )}

                                    <div className="movie-card-info">
                                        <h3>{movie.title}</h3>

                                        <div className="movie-card-meta">
                                            <span className="movie-card-rating">
                                                ★ {movie.vote_average > 0
                                                    ? movie.vote_average.toFixed(1)
                                                    : 'Sin valorar'}
                                            </span>

                                            <span className="movie-card-year">
                                                {year || 'Año desconocido'}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}

            <button
                type="button"
                onClick={loadMoreMovies}
                className="load-more-button"
            >
                Cargar más películas
            </button>
        </main>
    );
}

export default MovieList;
