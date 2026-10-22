# Movie App — React

Aplicación web desarrollada con React para consultar películas y gestionar un seguimiento personal de las que quiero ver, estoy viendo o ya he visto.

## Funcionalidades

- Listado de películas ordenadas por popularidad.
- Búsqueda de películas por título.
- Ficha individual con información detallada.
- Información sobre sinopsis, fecha de estreno, duración, géneros y valoración.
- Clasificación por edades en España, cuando está disponible.
- Seguimiento personal: vistas, viendo y pendientes.
- Carga de películas mediante la API de The Movie Database (TMDB).

## Tecnologías utilizadas

- React
- JavaScript
- Vite
- Redux
- React Router
- CSS
- API REST de TMDB

## Instalación y ejecución

1. Clonar el repositorio.
2. Instalar las dependencias:

    ```bash
    npm install
    ```

3. Crear un archivo `.env` en la raíz del proyecto y añadir la clave de TMDB:

    ```env
    VITE_TMDB_API_KEY=tu_clave_de_tmdb
    ```

4. Iniciar el servidor de desarrollo:

    ```bash
    npm run dev
    ```

5. Para generar la versión de producción:

    ```bash
    npm run build
    ```

## API

Los datos de las películas se obtienen mediante la API de [The Movie Database (TMDB)](https://www.themoviedb.org/).

Este proyecto es de carácter personal y educativo.
