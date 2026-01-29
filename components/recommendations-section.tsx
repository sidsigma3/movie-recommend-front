"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { RecommendationCard } from "./recommendation-card"
import type { Movie } from "@/lib/movie-data"

interface RecommendationsSectionProps {
  movies: Movie[]
}

export function RecommendationsSection({ movies }: RecommendationsSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 border-t border-border"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Recommended For You</h2>
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <p className="text-muted-foreground">Based on your selected and rated movies</p>
      </motion.div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.map((movie, index) => (
          <RecommendationCard key={movie.movieId} movie={movie}  index={index} />
        ))}
      </div>
    </motion.section>
  )
}
