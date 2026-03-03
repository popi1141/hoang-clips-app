# Hoang Fan Clips App

A full-stack web application for managing and showcasing Hoang fan clips with admin panel, submissions, and gallery features.

## Technology Stack

- **Runtime**: Bun (modern JavaScript/TypeScript runtime)
- **Backend**: Hono.js (lightweight web framework)
- **Frontend**: Server-side rendered HTML/TypeScript
- **Database**: SQLite with `bun:sqlite`
- **Language**: TypeScript

## Project Structure

```
hoang-clips/
├── src/
│   ├── app.ts                 # Main application server setup
│   ├── index.ts               # Entry point
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts            # Authentication helpers
│   │   ├── db.ts              # Database initialization
│   │   ├── dropbox.ts         # Dropbox API integration
│   │   ├── paths.ts           # Path configuration
│   │   └── thumbnails.ts      # Thumbnail generation
│   ├── pages/                 # Server-side rendered pages
│   │   ├── gallery.ts         # Main gallery page
│   │   ├── admin.ts           # Admin dashboard
│   │   ├── admin-settings.ts  # Admin settings page
│   │   ├── terms.ts           # Terms of service
│   │   ├── shared.ts          # Shared components
│   │   └── ...
│   └── routes/                # API endpoints
│       ├── gallery.ts         # Gallery API
│       ├── submissions.ts     # Clip submission API
│       ├── admin.ts           # Admin API
│       ├── files.ts           # File handling
│       ├── gigs.ts            # Gigs information
│       ├── meta.ts            # Metadata API
│       └── webhook.ts         # Webhook handlers
├── public/                    # Static assets
│   └── hoang-hero-background.mp4
├── scripts/                   # Utility scripts
│   └── generate-missing-thumbnails.ts
├── package.json              # Project dependencies
├── bun.lock                  # Dependency lock file
├── tsconfig.json             # TypeScript configuration
├── CLAUDE.md                 # Development guidelines
└── start.sh                  # Startup script
```

## Getting Started

### Prerequisites
- Bun (https://bun.sh)
- Node.js 18+ (if not using Bun)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/popi1141/hoang-clips-app.git
cd hoang-clips-app
```

2. Install dependencies:
```bash
bun install
```

3. Configure environment variables:
Create a `.env` file in the root directory with required configuration:
```
DATABASE_URL=./hoang.db
ADMIN_PASSWORD=your_secure_password
DROPBOX_TOKEN=your_dropbox_token
# Add other required environment variables
```

### Running the Application

Development mode:
```bash
bun run src/index.ts
```

Or using the startup script:
```bash
./start.sh
```

The application will be available at `http://localhost:3000`

## Features

- **Gallery**: Browse and view Hoang fan clips
- **Submissions**: Users can submit their own clips
- **Admin Panel**: Manage clips, moderation, and settings
- **Gigs**: Information about Hoang's performances
- **Dropbox Integration**: Sync clips with Dropbox
- **Thumbnail Generation**: Automatic thumbnail creation for videos
- **Authentication**: Secure admin access

## Database

The application uses SQLite for data persistence. Database files are created automatically on first run.

Database schema includes tables for:
- Clips and metadata
- Submissions
- User data
- Admin settings

## API Endpoints

### Gallery Routes
- `GET /api/gallery` - List clips
- `GET /api/gallery/:id` - Get clip details

### Submissions Routes
- `POST /api/submissions` - Submit a new clip
- `GET /api/submissions` - List submissions (admin)

### Admin Routes
- `GET /admin` - Admin dashboard
- `POST /api/admin/` - Admin operations

### Other Routes
- `GET /api/gigs` - Gigs information
- `GET /api/meta` - Application metadata
- `GET /files/:filename` - Serve files

## Development Guidelines

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines, including:
- Bun usage patterns
- API recommendations
- Testing conventions

## Scripts

### Generate Missing Thumbnails
```bash
bun scripts/generate-missing-thumbnails.ts
```

### Sync Dropbox
```bash
bun sync-dropbox.ts
```

## Security Notes

- Keep `.env` files out of version control
- Use strong admin passwords
- Validate all user inputs
- Regularly update dependencies

## Troubleshooting

### Port Already in Use
Change the port in `src/index.ts` or set `PORT` environment variable

### Database Lock
Remove old WAL files if experiencing lock errors:
```bash
rm *.db-wal *.db-shm
```

### Missing Dependencies
Ensure all dependencies are installed:
```bash
bun install
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Commit with clear messages
4. Push to your fork
5. Open a pull request

## License

[Add appropriate license information]

## Support

For issues and questions, please open an issue on GitHub.

---

**Last Updated**: March 3, 2026
**Backed Up From**: /home/workspace/Projects/hoang-clips
