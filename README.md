# Boom Video Platform

A modern video-sharing platform built with React, TypeScript, and TailwindCSS that supports both short-form and long-form video content with monetization features.

## Features

- 🎥 Support for both short-form and long-form videos
- 💰 Built-in wallet system for content monetization
- 🎁 Gifting system for supporting creators
- 💬 Interactive comment system
- 👤 User authentication and profiles
- 📱 Responsive design for mobile and desktop
- 🌓 Dark theme UI
- 🔄 Infinite scroll feed

## Tech Stack

- React 18
- TypeScript
- TailwindCSS
- Vite
- React Router
- Lucide Icons

## Getting Started

1. Clone the repository:
```sh
git clone <https://github.com/KSurendra1/boom-video-platform/>
cd boom-video-platform
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

4. Build for production:
```sh
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── comments/     # Comment-related components
│   ├── dialogs/      # Modal dialogs
│   ├── layout/       # Layout components (Navbar, Footer)
│   ├── skeletons/    # Loading skeleton components
│   ├── ui/           # UI components
│   ├── videos/       # Video-related components
│   └── wallet/       # Wallet components
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── pages/           # Page components
├── services/        # API services
└── types/           # TypeScript type definitions
```

## Features in Detail

### Video Upload
- Support for short-form video file uploads
- YouTube URL integration for long-form content
- Customizable pricing for premium content
- Thumbnail generation

### Monetization
- Integrated wallet system
- Video purchase functionality
- Creator gifting system
- Transaction history

### User Experience
- Infinite scroll video feed
- Responsive video player
- Interactive comments
- Toast notifications
- Loading skeletons
- Mobile-friendly navigation

## License

MIT License
