# E-learning Platform Backend

A TypeScript-based Express.js backend for an e-learning platform using MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote instance)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/e-learning
   NODE_ENV=development
   ```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── models/         # Mongoose models
├── routes/         # Express routes
├── middleware/     # Custom middleware
├── utils/          # Utility functions
└── index.ts        # Application entry point
```

## API Documentation

The API documentation will be available at `/api-docs` when running the server.

## License

MIT
