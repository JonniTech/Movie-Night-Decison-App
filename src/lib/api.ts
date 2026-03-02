import axios from 'axios'

export interface Movie {
    id: number
    title: string
    year: string
    rating: number
    posterUrl: string
    reason: string
}

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

// Genre Mapping
const moodGenres: Record<string, number[]> = {
    'happy': [35, 12, 16], // Comedy, Adventure, Animation
    'sad': [18, 10749],     // Drama, Romance
    'excited': [28, 12, 53], // Action, Adventure, Thriller
    'romantic': [10749, 35], // Romance, Comedy
    'thoughtful': [9648, 8741, 99] // Mystery, Sci-Fi, Documentary
}

const fallbackMovies: Record<string, Movie[]> = {
    'happy-friends': [
        { id: 1, title: 'Game Night', year: '2018', rating: 7.0, posterUrl: 'https://image.tmdb.org/t/p/w500/85kiuvvA128B2Rymd6XNn3P69zH.jpg', reason: 'High-energy comedy with twists that will keep the whole group laughing.' },
        { id: 2, title: 'The Nice Guys', year: '2016', rating: 7.1, posterUrl: 'https://image.tmdb.org/t/p/w500/sh9Y98pxLAEzY6879899G9UhT69.jpg', reason: 'A colorful, hilarious action-comedy perfect for casual group vibes.' }
    ],
    'default': [
        { id: 10, title: 'Everything Everywhere All at Once', year: '2022', rating: 8.0, posterUrl: 'https://image.tmdb.org/t/p/w500/rKtQO8tF98mYqJcT2NmbU30YdG5.jpg', reason: 'A wild, imaginative ride that has something for everyone.' }
    ]
}

export async function fetchRecommendations(mood: string, context: string, page: number = 1): Promise<{ movies: Movie[], reason: string }> {
    const overallReason = generateOverallReason(mood, context)

    if (!TMDB_API_KEY || TMDB_API_KEY === 'API_KEY') {
        console.warn('TMDB API Key missing. Falling back to mocked data.')
        if (page > 1) return { movies: [], reason: overallReason } // Mock data doesn't paginate
        const key = `${mood}-${context}`
        const docs = fallbackMovies[key] || fallbackMovies.default || []
        return { movies: docs, reason: overallReason }
    }

    try {
        const genres = moodGenres[mood] || [35]
        const params: any = {
            api_key: TMDB_API_KEY,
            with_genres: genres.join('|'),
            'vote_average.gte': 6.0,
            'vote_count.gte': 100,
            include_adult: false,
            sort_by: 'popularity.desc',
            page: page
        }

        // Context adjustments
        if (context === 'friends') {
            params['with_runtime.lte'] = 120
            params['sort_by'] = 'popularity.desc'
        } else if (context === 'partner') {
            params['vote_average.gte'] = 6.5
        } else if (context === 'alone') {
            params['vote_average.gte'] = 6.8
            // Allow longer movies for solo viewing
        }

        const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, { params })
        const results = response.data.results

        const movies: Movie[] = results.map((m: any) => ({
            id: m.id,
            title: m.title,
            year: m.release_date ? m.release_date.split('-')[0] : 'N/A',
            rating: m.vote_average,
            posterUrl: m.poster_path ? `${TMDB_IMAGE_BASE}${m.poster_path}` : '',
            reason: generateMovieReason(m, mood, context)
        }))

        return { movies, reason: overallReason }
    } catch (error) {
        console.error('TMDB API Error:', error)
        if (page > 1) return { movies: [], reason: overallReason }
        const key = `${mood}-${context}`
        const docs = fallbackMovies[key] || fallbackMovies.default || []
        return { movies: docs, reason: overallReason }
    }
}

function generateOverallReason(mood: string, context: string): string {
    if (mood === 'happy') {
        return context === 'friends'
            ? "We went for high-energy crowd-pleasers to keep the room buzzing with good energy."
            : "These picks are pure sunshine, designed to keep that positive vibe going solo."
    } else if (mood === 'romantic') {
        return "Selected for their chemistry and emotional depth, these films go beyond classic tropes."
    } else if (mood === 'thoughtful') {
        return "These are 'thinker' films—deliberately paced and rich with subtext for a focused viewing session."
    } else if (mood === 'sad') {
        return "Sometimes you just need a good cry. These are emotionally resonant films that offer a poetic catharsis."
    } else if (mood === 'excited') {
        return "Pure spectacle and momentum. These picks are designed to match your high energy levels."
    }
    return `We've hand-picked these based on your ${mood} mood and ${context} setting.`
}

function generateMovieReason(movie: any, mood: string, context: string): string {
    const rating = movie.vote_average

    if (mood === 'thoughtful') return `A deep, complex narrative that rewards focus.`
    if (mood === 'happy') return `Unabashedly fun and vibrant cinema.`
    if (mood === 'sad' && rating > 7.5) return `A powerful, acclaimed piece of emotional storytelling.`
    if (context === 'friends') return `Dynamic and engaging—perfect for a group setup.`
    if (context === 'partner') return `Intimate and beautifully crafted.`

    return `A standout choice with a strong ${rating} rating.`
}
