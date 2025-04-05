# Learning Management System (LMS)

A modern, feature-rich Learning Management System built with Next.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Course management system
- Content delivery platform
- Progress tracking
- Assessment system
- Real-time analytics
- Mobile responsive design

## Tech Stack

### Frontend
- Next.js 14+
- TypeScript
- Tailwind CSS
- Shadcn UI

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Prerequisites

- Node.js 18.x or higher
- MongoDB 6.x or higher
- Yarn package manager
- Git

## Getting Started

1. Clone the repository
```bash
git clone [repository-url]
cd lms-platform
```

2. Install dependencies
```bash
# Root directory
yarn install

# Frontend
cd frontend
yarn install

# Backend
cd ../backend
yarn install
```

3. Set up environment variables
```env
# Backend (.env)
MONGODB_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_jwt_secret
PORT=5000

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start development servers
```bash
# Backend (from backend directory)
yarn dev

# Frontend (from frontend directory)
yarn dev
```

## Project Structure

```
lms-platform/
├── backend/               # Express backend
├── frontend/             # Next.js frontend
├── docs/                 # Documentation
└── memory-bank/         # Project memory bank
```

## Documentation

- [System Architecture](docs/systemArchitecture.md)
- [Feature Specifications](docs/featureSpecs.md)
- [Security Policies](docs/securityPolicies.md)
- [Task Overview](docs/taskOverview.md)
- [Deployment Guide](docs/deploymentGuide.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 