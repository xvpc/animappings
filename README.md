# AniMappings

#### A project to scrape anime meta from lots of websites using anilist id's

The origin project was made by [illusionTBA](https://github.com/illusionTBA) 
This is just a clone that uses Mongoose/mongodb instead of Prisma.

## Technologies Used

- Node.js
- TypeScript
- Mongoose

## Getting Started

First You'll need to make a MongoDB atlas as a Requirement you can get it for free by signing in 
[mongodb.com](https://www.mongodb.com/)

If you don't want to use MongoDB check: [AniMappings](https://github.com/illusionTBA/AniMappings)

### Installation

1. Clone the repository: `git clone https://github.com/xvpc/animappings.git`
2. Install dependencies: `npm install`
3. Make a .env file with a variable called `DATABASE_URL` and set it to your MongoDB atlas URL.

```
DATABSE_URL="mongodb+srv://<username>:<password>@db.mongodb.net/..."
```

## Usage

- `npm run dev` or `npm start` To start the server.
- `npm run crawl` Map and Crawl to database.
- `npm run export` Export all of the database into a json file
