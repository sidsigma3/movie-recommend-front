const API_BASE = "http://127.0.0.1:8000"

export async function fetchMovies(page = 1, limit = 50) {
  const res = await fetch(
    `${API_BASE}/movies?page=${page}&limit=${limit}`
  )

  if (!res.ok) {
    throw new Error("Failed to fetch movies")
  }

  const data = await res.json()

  // ✅ HANDLE BOTH BACKEND SHAPES
  if (Array.isArray(data)) {
    return {
      movies: data,
      total: data.length,
    }
  }

  return {
    movies: data.movies ?? [],
    total: data.total ?? 0,
  }
}

export async function fetchRecommendationsFromRatings(ratings: {
  movieId: number
  rating: number
}[]) {
  const res = await fetch(`${API_BASE}/recommend/from-ratings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ratings }),
  })

  if (!res.ok) {
    throw new Error("Failed to fetch recommendations")
  }

  return res.json()
}
