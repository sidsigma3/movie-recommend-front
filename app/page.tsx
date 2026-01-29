"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { Header } from "@/components/header"
import { MovieCard } from "@/components/movie-card"
import { SelectedPanel } from "@/components/selected-panel"
import { RecommendationsSection } from "@/components/recommendations-section"

import type { Movie } from "@/lib/movie-data"
import {
  fetchMovies,
  fetchRecommendationsFromRatings,
} from "@/lib/api"

interface SelectedMovie {
  movie: Movie
  rating: number
}

const PAGE_LIMIT = 50

export default function Home() {
  // ---------------- MOVIES ----------------
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMovies, setLoadingMovies] = useState(false)

  // ---------------- SELECTION ----------------
  const [selectedMovies, setSelectedMovies] = useState<SelectedMovie[]>([])

  // ---------------- RECOMMENDATIONS ----------------
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([])
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false)

  // ---------------- SEARCH ----------------
  const [search, setSearch] = useState("")

  // ---------------- LOAD MOVIES ----------------
  const loadMovies = useCallback(async () => {
    if (loadingMovies || !hasMore) return

    setLoadingMovies(true)

    try {
      const data = await fetchMovies(page, PAGE_LIMIT)

      // ✅ SAFETY CHECK
      if (!Array.isArray(data.movies)) {
        throw new Error("Movies API did not return movies array")
      }

      setMovies((prev) => [...prev, ...data.movies])

      const loaded = (page - 1) * PAGE_LIMIT + data.movies.length
      if (loaded >= data.total) {
        setHasMore(false)
      } else {
        setPage((p) => p + 1)
      }
    } catch (err) {
      console.error("Failed to load movies:", err)
    } finally {
      setLoadingMovies(false)
    }
  }, [page, hasMore, loadingMovies])

  // Initial load
  useEffect(() => {
    loadMovies()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------- SELECT MOVIE ----------------
  const handleSelectMovie = useCallback((movie: Movie) => {
    setSelectedMovies((prev) => {
      const exists = prev.find(
        (sm) => sm.movie.movieId === movie.movieId
      )

      if (exists) {
        return prev.filter(
          (sm) => sm.movie.movieId !== movie.movieId
        )
      }

      return [...prev, { movie, rating: 3 }]
    })

    setShowRecommendations(false)
  }, [])

  // ---------------- CHANGE RATING ----------------
  const handleRatingChange = useCallback(
    (movieId: number, rating: number) => {
      setSelectedMovies((prev) =>
        prev.map((sm) =>
          sm.movie.movieId === movieId
            ? { ...sm, rating }
            : sm
        )
      )
    },
    []
  )

  // ---------------- REMOVE MOVIE ----------------
  const handleRemoveMovie = useCallback((movieId: number) => {
    setSelectedMovies((prev) =>
      prev.filter((sm) => sm.movie.movieId !== movieId)
    )
    setShowRecommendations(false)
  }, [])

  // ---------------- GET RECOMMENDATIONS ----------------
  const handleGetRecommendations = useCallback(async () => {
    if (selectedMovies.length < 3) return

    setIsLoadingRecommendations(true)

    try {
      const payload = selectedMovies.map((sm) => ({
        movieId: sm.movie.movieId,
        rating: sm.rating,
      }))

      const data = await fetchRecommendationsFromRatings(payload)

      if (!Array.isArray(data.recommendations)) {
        throw new Error("Invalid recommendation response")
      }

      setRecommendedMovies(data.recommendations)
      setShowRecommendations(true)
    } catch (err) {
      console.error("Recommendation error:", err)
      alert("Failed to get recommendations")
    } finally {
      setIsLoadingRecommendations(false)
    }
  }, [selectedMovies])

  // ---------------- HELPERS ----------------
  const isMovieSelected = useCallback(
    (movieId: number) =>
      selectedMovies.some((sm) => sm.movie.movieId === movieId),
    [selectedMovies]
  )

  const getMovieRating = useCallback(
    (movieId: number) => {
      const selected = selectedMovies.find(
        (sm) => sm.movie.movieId === movieId
      )
      return selected?.rating ?? 3
    },
    [selectedMovies]
  )

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  )

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-background">
      <Header search={search} onSearchChange={setSearch} />

      <main className="container mx-auto px-4 py-8">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Discover Your Next Favorite Movie
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select movies you like, rate them, and get personalized recommendations.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* MOVIE GRID */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredMovies.map((movie, index) => (
                <motion.div
                  key={movie.movieId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.01 }}
                >
                  <MovieCard
                    movie={movie}
                    isSelected={isMovieSelected(movie.movieId)}
                    userRating={getMovieRating(movie.movieId)}
                    onSelect={() => handleSelectMovie(movie)}
                    onRatingChange={(rating) =>
                      handleRatingChange(movie.movieId, rating)
                    }
                  />
                </motion.div>
              ))}
            </div>

            {/* LOAD MORE */}
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMovies}
                  disabled={loadingMovies}
                  className="px-6 py-3 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
                >
                  {loadingMovies ? "Loading..." : "Load More Movies"}
                </button>
              </div>
            )}
          </div>

          {/* SELECTED PANEL */}
          <aside className="lg:w-72 xl:w-80">
            <SelectedPanel
              selectedMovies={selectedMovies}
              onRemove={handleRemoveMovie}
              onGetRecommendations={handleGetRecommendations}
              isLoading={isLoadingRecommendations}
            />
          </aside>
        </div>

        {/* RECOMMENDATIONS */}
        <AnimatePresence>
          {showRecommendations && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="mt-12"
            >
              <RecommendationsSection movies={recommendedMovies} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          CineMatch — Hybrid Collaborative Filtering Movie Recommendation System
        </div>
      </footer>
    </div>
  )
}
