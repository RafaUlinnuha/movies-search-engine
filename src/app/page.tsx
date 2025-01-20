"use client";

import Image from "next/image";
import BounceLoader from "react-spinners/BounceLoader";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    result: Array<{
      id: number;
      title: string;
      genres: string[];
      cast: string[];
      released: string;
      rated: string;
      poster: string;
    }>;
  }>({ result: [] });

  const fetchData = async () => {
    if (!input) {
      setSearchResults({ result: [] });
      return;
    }

    setLoading(true);

    await fetch(`http://localhost:3000/api/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    })
      .then(async (response) => {
        if (!response.ok) {
          console.error(
            "failed to fetch search results :( ",
            response.statusText
          );
          setLoading(false);
          return;
        }

        const data = await response.json();

        setSearchResults(data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main className="h-screen w-screen grainy">
      <div className="flex flex-col gap-6 items-center pt-24 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
        <h1 className="text-5xl tracking-tight font-bold text-[#F2EFE5]">
          Movies Search Engine
        </h1>
        <p className="text-[#F2EFE5] text-lg max-w-prose text-center">
          A search engine built with Next.js, MongoDB, Redis, and Prisma
          <br />
          Type a query and get your results!
        </p>
        <div className="flex mt-8 w-1/2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="rounded-none rounded-s-md bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5"
          />
          <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-[#F2EFE5] border border-e-0 border-gray-300 rounded-none rounded-e-lg">
            <button onClick={fetchData}>Submit</button>
          </span>
        </div>
        {loading ? (
          <div className="flex items-center pt-8">
            <BounceLoader color="#F2EFE5" />
          </div>
        ) : (
          <>
            {searchResults?.result.map((data, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:w-1/2"
              >
                <Image
                  className="object-cover w-1/3 h-auto rounded-t-lg md:rounded-none md:rounded-s-lg"
                  src={data.poster}
                  width={200}
                  height={100}
                  alt="Movie Poster"
                />
                <div className="flex flex-col justify-between p-4 leading-normal">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                    {data.title}
                  </h5>
                  {data.cast.map((casts, index) => (
                    <p key={index} className="mb-3 font-normal text-gray-700">
                      {casts}
                    </p>
                  ))}
                  <p className="mb-3 font-normal text-gray-700">
                    {data.released}
                  </p>
                  <p className="mb-3 font-normal text-gray-700">{data.rated}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
}
