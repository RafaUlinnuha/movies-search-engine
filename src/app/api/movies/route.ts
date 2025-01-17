import prisma from "@/lib/prisma";
import redisClient from "@/lib/redis";
import { getDataFromCacheOrDb, Movie } from "@/services/cacheService";
import logger from "@/utils/logger";
import { NextResponse } from "next/server";

const CACHE_TTL = 3600;

async function cacheMovies(movie: Movie[]) {
  const multi = redisClient.multi();

  movie.forEach((movie) => {
    multi.setEx(movie.title.toString(), CACHE_TTL, JSON.stringify(movie));
  });

  await multi.exec();
}

export async function GET() {
  try {
    const movies = await prisma.movies.findMany();

    await cacheMovies(movies);

    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    console.log("[GET MOVIES]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const keys = await req.json();

    const { results, missingKeys } = await getDataFromCacheOrDb(keys);

    let missingMovies = [];
    if (missingKeys.length > 0) {
      missingMovies = await prisma.movies.findMany({
        where: {
          title: {
            in: missingKeys,
          },
        },
      });

      await cacheMovies(missingMovies);
    }

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.log(error);
    logger.error("Error: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
