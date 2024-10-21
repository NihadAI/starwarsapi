"use client";

import React, { useState, useEffect } from "react";
import ReactFlow, { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { fetchHeroDetails, fetchFilms, fetchStarships } from "@/app/api/fetch";
import { Hero } from "@/types/types";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

interface HeroDetailsProps {
  params: { id: string };
}

const HeroDetailGraph = ({ params }: HeroDetailsProps) => {
  const heroId = params.id;

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [hero, setHero] = useState<Hero | null>(null); // State to store hero details

  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const heroData = await fetchHeroDetails(heroId);
        setHero(heroData); // Set the hero details in state
        const films = await fetchFilms(heroData.films);

        // Create Hero Node in the center
        const heroNode: Node = {
          id: "hero",
          data: { label: heroData.name },
          position: { x: 300, y: 250 },
        };

        // Create Film Nodes on the left
        const filmNodes: Node[] = films.map((film, index) => ({
          id: `film-${film.episode_id}`,
          data: { label: film.title },
          position: { x: 100, y: 150 + index * 80 }, // Stack vertically on the left
        }));

        // Fetch Starships for each film and position them closer to the hero
        const starshipNodes: Node[] = [];
        for (const film of films) {
          const starships = await fetchStarships(film.starships);
          starships.forEach((ship, shipIndex) => {
            starshipNodes.push({
              id: `starship-${ship.url.split("/").pop()}`, // Extract starship ID from URL
              data: { label: ship.name },
              position: { x: 500, y: 150 + shipIndex * 80 }, // Stack vertically on the right, close to the hero
            });
          });
        }

        // Create edges (links between nodes)
        const newEdges: Edge[] = [
          ...filmNodes.map((film) => ({
            id: `hero-film-${film.id}`,
            source: "hero",
            target: film.id,
            type: "default",
          })),
          ...starshipNodes.map((ship) => ({
            id: `film-starship-${ship.id}`,
            source: `film-${ship.id.split("-")[1]}`, // Connect starships to the corresponding films
            target: ship.id,
            type: "default",
          })),
        ];

        // Set graph nodes and edges
        setNodes([heroNode, ...filmNodes, ...starshipNodes]);
        setEdges(newEdges);
      } catch (error) {
        console.error("Error loading hero data:", error);
      }
    };

    loadHeroData();
  }, [heroId]);

  return (
    <div className="bg-slate-100">
      <MaxWidthWrapper>
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center justify-center w-full max-w-4xl space-y-8">
            {/* Name Card */}
            {hero && ( // Only render the hero details if hero is not null
              <div className="text-center">
                <h1 className="text-4xl font-bold">{hero.name}</h1>
                <p>Height: {hero.height} cm</p>
                <p>Mass: {hero.mass} kg</p>
              </div>
            )}

            {/* Graph */}
            <div className="react-flow-container">
              <ReactFlow nodes={nodes} edges={edges} fitView />
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default HeroDetailGraph;
