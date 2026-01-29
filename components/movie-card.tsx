"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "./star-rating"
import type { Movie } from "@/lib/movie-data"

interface MovieCardProps {
  movie: Movie
  isSelected: boolean
  userRating: number
  onSelect: () => void
  onRatingChange: (rating: number) => void
}

export function MovieCard({ movie, isSelected, userRating, onSelect, onRatingChange }: MovieCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col"
    >
      <motion.button
        type="button"
        onClick={onSelect}
        className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
          isSelected
            ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg shadow-primary/20"
            : "hover:ring-1 hover:ring-border"
        }`}
        whileTap={{ scale: 0.98 }}
      >
        <div className="aspect-[2/3] relative">
          <Image
            src={movie.poster || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <Badge variant="secondary" className="mb-2 text-xs">
              {movie.genre}
            </Badge>
            <h3 className="font-semibold text-sm text-foreground line-clamp-2 text-left">
              {movie.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">{movie.year}</p>
          </div>
        </div>
      </motion.button>
      
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 flex flex-col items-center gap-1"
        >
          <span className="text-xs text-muted-foreground">Your Rating</span>
          <StarRating rating={userRating} onRatingChange={onRatingChange} size="md" />
        </motion.div>
      )}
    </motion.div>
  )
}
