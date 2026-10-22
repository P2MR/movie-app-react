
import React from 'react';
import { Link } from 'react-router-dom';

function Header({ searchTerm, setSearchTerm }) {
    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <header>
            <h1>My Movie List</h1>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar películas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {searchTerm && (
                    <button
                        type="button"
                        className="clear-search"
                        onClick={clearSearch}
                        aria-label="Limpiar búsqueda"
                        title="Limpiar búsqueda"
                    >
                        ✕
                    </button>
                )}
            </div>

            <nav>
                <Link to="/">Inicio</Link>
            </nav>
        </header>
    );
}

export default Header;
