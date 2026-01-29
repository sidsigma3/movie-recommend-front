"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import type { Movie } from "@/lib/movie-data"

interface RecommendationCardProps {
  movie: Movie
  index: number
}

export function RecommendationCard({ movie, index }: RecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative overflow-hidden rounded-xl bg-card border border-border"
    >
      <div className="aspect-[2/3] relative">
        <Image
          src={movie.poster || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {movie.imdbRating && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span className="text-xs font-medium">
              {movie.imdbRating}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Badge variant="outline" className="mb-2 text-xs">
            {movie.genres.split("|")[0]}
          </Badge>

          <h3 className="font-semibold line-clamp-2">
            {movie.title}
          </h3>
        </div>
      </div>
    </motion.div>
  )
}
