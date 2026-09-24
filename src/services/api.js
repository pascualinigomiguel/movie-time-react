const API_KEY = "e5cb7e28d85f7cd23385bc62b132c6ab"
const BASE_URL = "https://api.themoviedb.org/3"

export const getPopularMovies = async () => {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
        const data = await response.json()
        return data.results
};

export const searchMovies = async (query) => {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`)
        const data = await response.json()
        return data.results
};

export const getMovieDetails = async (id) => {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`
  );
  if (!response.ok) throw new Error("Failed to load movie details");
  return response.json();
};