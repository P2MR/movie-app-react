import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { MovieContext } from "../context/MovieContext";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_URL = "https://image.tmdb.org/t/p/";

function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [certification, setCertification] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { watched, handleWatched } = useContext(MovieContext);
    const [status, setStatus] = useState("pending");

    useEffect(() => {
        const controller = new AbortController();

        const fetchMovieDetails = async () => {
            setLoading(true);
            setError(null);
            setMovie(null);
            setCertification("");

            try {
                const detailsUrl =
                    `https://api.themoviedb.org/3/movie/${id}` +
                    `?api_key=${API_KEY}&language=es-ES`;

                const datesUrl =
                    `https://api.themoviedb.org/3/movie/${id}/release_dates` +
                    `?api_key=${API_KEY}`;

                const [detailsResponse, datesResponse] = await Promise.all([
                    fetch(detailsUrl, { signal: controller.signal }),
                    fetch(datesUrl, { signal: controller.signal }),
                ]);

                if (!detailsResponse.ok) {
                    throw new Error("No se ha podido cargar la película.");
                }

                const details = await detailsResponse.json();
                setMovie(details);

                // Buscamos la clasificación por edades de España.
                if (datesResponse.ok) {
                    const datesData = await datesResponse.json();
                    const spain = datesData.results?.find(
                        (country) => country.iso_3166_1 === "ES",
                    );

                    const spanishCertification = spain?.release_dates
                        ?.map((release) => release.certification?.trim())
                        .find(Boolean);

                    setCertification(spanishCertification || "");
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Error al cargar la película:", err);
                    setError(
                        "No se ha podido cargar la información. Inténtalo de nuevo.",
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchMovieDetails();

        return () => controller.abort();
    }, [id]);

    useEffect(() => {
        if (movie) {
            const savedMovie = watched.find((item) => item.id === movie.id);
            setStatus(savedMovie ? savedMovie.status : "pending");
        }
    }, [movie, watched]);

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);

        if (movie) {
            handleWatched({ ...movie, status: newStatus });
        }
    };

    if (loading) {
        return (
            <div className="movie-message">
                Cargando información de la película...
            </div>
        );
    }

    if (error) {
        return <div className="movie-message movie-error">{error}</div>;
    }

    if (!movie) {
        return (
            <div className="movie-message">
                No se ha encontrado la película.
            </div>
        );
    }

    const releaseDate = movie.release_date
        ? new Date(`${movie.release_date}T12:00:00`)
        : null;

    const formattedDate =
        releaseDate && !Number.isNaN(releaseDate.getTime())
            ? releaseDate.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
              })
            : "Fecha no disponible";

    const isReleased = releaseDate && releaseDate <= new Date();

    const backdrop = movie.backdrop_path
        ? `${IMAGE_URL}original${movie.backdrop_path}`
        : null;

    const poster = movie.poster_path
        ? `${IMAGE_URL}w500${movie.poster_path}`
        : null;

    return (
        <section className="movie-page">
            {backdrop && (
                <div
                    className="movie-backdrop"
                    style={{ backgroundImage: `url("${backdrop}")` }}
                    aria-hidden="true"
                />
            )}

            <div className="movie-details-layout">
                <div className="movie-poster">
                    {poster ? (
                        <img src={poster} alt={`Póster de ${movie.title}`} />
                    ) : (
                        <div className="movie-no-poster">
                            Póster no disponible
                        </div>
                    )}
                </div>

                <div className="movie-info">
                    <span className="movie-eyebrow">FICHA DE LA PELÍCULA</span>

                    <h1>{movie.title}</h1>

                    {movie.original_title &&
                        movie.original_title !== movie.title && (
                            <p className="movie-original-title">
                                Título original: {movie.original_title}
                            </p>
                        )}

                    <div className="movie-badges">
                        {movie.vote_average > 0 && (
                            <span className="movie-rating">
                                ★ {movie.vote_average.toFixed(1)} / 10
                            </span>
                        )}

                        <span
                            className={`movie-release ${isReleased ? "released" : "upcoming"}`}
                        >
                            {releaseDate
                                ? isReleased
                                    ? "Ya estrenada"
                                    : "Próximo estreno"
                                : "Estreno sin confirmar"}
                        </span>

                        {certification && (
                            <span className="movie-certification">
                                Edad: {certification}
                            </span>
                        )}
                    </div>

                    <div className="movie-metadata">
                        <div>
                            <span className="metadata-label">Estreno</span>
                            <strong>{formattedDate}</strong>
                        </div>

                        <div>
                            <span className="metadata-label">Duración</span>
                            <strong>
                                {movie.runtime
                                    ? `${movie.runtime} min`
                                    : "No disponible"}
                            </strong>
                        </div>

                        <div>
                            <span className="metadata-label">Votos</span>
                            <strong>
                                {movie.vote_count?.toLocaleString("es-ES") ??
                                    "0"}
                            </strong>
                        </div>
                    </div>

                    <div className="movie-genres">
                        {movie.genres?.length > 0 ? (
                            movie.genres.map((genre) => (
                                <span className="genre-tag" key={genre.id}>
                                    {genre.name}
                                </span>
                            ))
                        ) : (
                            <span className="metadata-muted">
                                Géneros no disponibles
                            </span>
                        )}
                    </div>

                    <div className="movie-synopsis">
                        <h2>Sinopsis</h2>
                        <p>
                            {movie.overview ||
                                "Todavía no hay una sinopsis disponible en español."}
                        </p>
                    </div>

                    {/* Seguimiento personal de la película */}
                    <div className="movie-tracking">
                        <h2>Mi seguimiento</h2>

                        <div className="movie_status">
                            <button
                                type="button"
                                onClick={() => handleStatusChange("view")}
                                className={status === "view" ? "active" : ""}
                            >
                                Vista
                            </button>

                            <button
                                type="button"
                                onClick={() => handleStatusChange("watching")}
                                className={
                                    status === "watching" ? "active" : ""
                                }
                            >
                                Viendo
                            </button>

                            <button
                                type="button"
                                onClick={() => handleStatusChange("pending")}
                                className={status === "pending" ? "active" : ""}
                            >
                                Pendiente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default MovieDetails;
