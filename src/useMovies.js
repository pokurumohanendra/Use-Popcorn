import { useState, useEffect } from "react";

const KEY = process.env.REACT_APP_API_KEY;

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      callback?.();
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal },
          );

          if (!res.ok) throw new Error("You Are Offline");
          const data = await res.json();

          if (data.Response === "False") throw new Error("Movienot Found");
          setMovies(data.Search);
        } catch (err) {
          setError("");
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }
      // handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query, callback],
  );
  return { movies, isLoading, error };
}
