# Movie Streaming Platform

A modern movie and TV show streaming platform built with Next.js, featuring TMDB integration and multi-source video scraping.

## Features

- 🎬 Browse movies and TV shows from TMDB
- 🔍 Search functionality with real-time suggestions
- 🎥 Integrated video player (Video.js with HLS.js support)
- 🔄 Multi-source video scraping with automatic fallback
- 📱 Responsive design for all devices
- 🎨 Modern dark theme UI

## Prerequisites

- Node.js 18+ and npm
- TMDB API key (free at [themoviedb.org](https://www.themoviedb.org/settings/api))

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
   NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── (main)/          # Main pages (home, browse, search, etc.)
│   ├── api/             # API routes (TMDB proxy, sources)
│   ├── components/      # React components
│   └── lib/             # Utilities and scrapers
├── public/              # Static assets
└── ...config files
```

## Usage

1. **Browse Content:** Navigate to the Browse page to filter movies/TV shows by genre and year
2. **Search:** Use the search bar to find specific titles
3. **Watch:** Click on any movie/TV show and select "Watch Now" to stream

## Video Sources

The platform uses multiple scraping sources with automatic fallback:
- VidSrc
- SuperEmbed (2Embed)
- Additional fallback sources

## Important Notes

- This is for personal use only
- Video sources are scraped from public streaming sites
- Some content may not be available depending on source availability
- Ensure you comply with local laws regarding streaming content

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Video.js** - Video player
- **HLS.js** - HLS stream support
- **TMDB API** - Movie/TV database
- **Axios** - HTTP client
- **Cheerio** - HTML parsing

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is for personal use only and will be deleted after the hackathon ends.

