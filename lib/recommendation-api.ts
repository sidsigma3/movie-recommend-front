export async function fetchRecommendationsFromRatings(
  selectedMovies: { movie: { id: number }; rating: number }[]
) {
  const response = await fetch("http://127.0.0.1:8000/recommend/from-ratings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ratings: selectedMovies.map((sm) => ({
        movieId: sm.movie.id,
        rating: sm.rating,
      })),
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch recommendations")
  }

  return response.json()
}
