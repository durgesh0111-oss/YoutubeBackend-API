# YoutubeBackend-API

A RESTful backend API designed for interacting with YouTube data, including searching, fetching video details, and more. Built for scalability, easy integration, and secure access.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## About

**YoutubeBackend-API** provides endpoints to interact with YouTube services programmatically. Whether you’re building a dashboard, an analytics tool, or automating video management, this API offers the backend foundation.

## Features

- Search YouTube videos by keyword.
- Fetch video details by ID.
- Get channel information.
- Pagination and filtering support.
- Secure authentication (JWT or API Key).
- Error handling & standard responses.

## Tech Stack

- Node.js / Express (or your stack)
- MongoDB (if used)
- YouTube Data API v3
- dotenv for config
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js >= 14.x
- npm or yarn
- MongoDB instance (if needed)
- YouTube Data API credentials

### Installation

```bash
git clone https://github.com/durgesh0111-oss/YoutubeBackend-API.git
cd YoutubeBackend-API
npm install
```

### Configuration

1. Copy `.env.example` to `.env` and update values:
    - `YOUTUBE_API_KEY`
    - `JWT_SECRET`
    - `MONGODB_URI`

2. Start the server:
```bash
npm start
```

## Usage

Make API requests to the running server:

```bash
GET /api/search?q=learn nodejs
```

Use a tool like [Postman](https://www.postman.com/) or `curl` to interact with endpoints.

## API Endpoints

| Method | Endpoint                | Description                |
|--------|-------------------------|----------------------------|
| GET    | `/api/search`           | Search videos by keyword   |
| GET    | `/api/videos/:id`       | Get video details by ID    |
| GET    | `/api/channels/:id`     | Get channel info by ID     |
| POST   | `/api/auth/login`       | User login (JWT)           |

For full API documentation, see [docs/API.md](docs/API.md).

## Authentication

- Most endpoints require JWT or API Key in the header.
- Login using `/api/auth/login` to get your token.

Example usage:

```http
Authorization: Bearer <your_token>
```

## Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/foo`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/foo`)
5. Open a PR

## License

This project is licensed under the MIT License.

## Author

Created by **Durgesh**  
GitHub: [durgesh0111-oss](https://github.com/durgesh0111-oss)

---

Feel free to reach out via issues or discussions for support or suggestions.