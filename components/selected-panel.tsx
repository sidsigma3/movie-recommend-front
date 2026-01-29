"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Movie } from "@/lib/movie-data"

interface SelectedMovie {
  movie: Movie
  rating: number
}

interface SelectedPanelProps {
  selectedMovies: SelectedMovie[]
  onRemove: (movieId: number) => void
  onGetRecommendations: () => void
  isLoading: boolean
}

export function SelectedPanel({
  selectedMovies,
  onRemove,
  onGetRecommendations,
  isLoading,
}: SelectedPanelProps) {
  const canGetRecommendations = selectedMovies.length >= 3

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card border border-border rounded-xl p-4 sticky top-20"
    >
      <h3 className="font-semibold text-foreground mb-3">
        Selected Movies
      </h3>

      {selectedMovies.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No movies selected yet
        </p>
      ) : (
        <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {selectedMovies.map(({ movie, rating }) => (
              <motion.div
                key={movie.movieId}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center justify-between gap-2 p-2 bg-secondary rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {movie.title}
                  </p>

                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => onRemove(movie.movieId)}
                  aria-label={`Remove ${movie.title}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="space-y-3">
        <p
          className={`text-xs ${
            canGetRecommendations
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          {canGetRecommendations
            ? "Ready to get recommendations!"
            : `Rate at least ${
                3 - selectedMovies.length
              } more movie${
                3 - selectedMovies.length !== 1 ? "s" : ""
              } to get recommendations`}
        </p>

        <Button
          onClick={onGetRecommendations}
          disabled={!canGetRecommendations || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
            />
          ) : (
            "Get My Recommendations"
          )}
        </Button>
      </div>
    </motion.div>
  )
}
