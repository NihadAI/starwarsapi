"use client";
import React, { useEffect, useState } from "react";
import { fetchHeroes } from "../app/api/fetch";
import { Hero } from "../types/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Pagination from "./Pagination";
import SkeletonCards from "./SkeletonCards";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 3; // Number of heroes to display per page default

const HeroList: React.FC = () => {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [buttonLoading, setButtonLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadHeroes = async () => {
      setLoading(true);
      try {
        const data = await fetchHeroes();
        setHeroes(data);
      } catch (error) {
        console.error("Error loading heroes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHeroes();
  }, []); // Fetch once on component mount

  const totalPages = Math.ceil(heroes.length / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const currentHeroes = heroes.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const handleMoreInfo = (url: string) => {
    setButtonLoading(url); // Disable button by setting loading state
    const heroId = url.split("/").filter(Boolean).pop(); // Extract ID from the URL
    router.push(`/hero/${heroId}`); // Redirect to the hero's page
  };

  if (loading) return <SkeletonCards/>;

  return (
    <div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentHeroes.map((hero) => (
          <li key={hero.url}>
            <Card className="shadow-lg flex justify-center w-[250px] h-[250px]">
              <div className="flex flex-col items-center justify-center text-lg">
                <CardHeader>
                  <CardTitle>{hero.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Height: {hero.height} cm</p>
                  <p>Mass: {hero.mass} kq</p>
                </CardContent>
                <CardFooter>
                <Button 
                    onClick={() => handleMoreInfo(hero.url)} 
                    disabled={buttonLoading === hero.url} // Disable when loading
                  >
                    {buttonLoading === hero.url ? 'Loading...' : 'More Info'}
                  </Button>
                </CardFooter>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex mt-8 justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default HeroList;
