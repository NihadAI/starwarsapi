"use client";

import { SyncLoader } from 'react-spinners';
import React, { useState, useEffect } from 'react';
import ReactFlow, { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { fetchHeroDetails, fetchFilms, fetchStarships } from '@/app/api/fetch';
import { Hero } from '@/types/types';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Link from 'next/link';

interface HeroDetailsProps {
  params: { id: string };
}

const HeroDetailGraph = ({ params }: HeroDetailsProps) => {
  const heroId = params.id;

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [hero, setHero] = useState<Hero | null>(null); // State to store hero details
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const heroData = await fetchHeroDetails(heroId);
        setHero(heroData); // Set the hero details in state
        const films = await fetchFilms(heroData.films);

        // Create Hero Node in the center
        const heroNode: Node = {
          id: 'hero',
          data: { label: heroData.name },
          position: { x: 300, y: 250 }, // Center position
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
              id: `starship-${ship.url.split('/').pop()}`, // Extract starship ID from URL
              data: { label: ship.name },
              position: { x: 500, y: 150 + shipIndex * 80 }, // Stack vertically on the right, close to the hero
            });
          });
        }

        // Create edges (links between nodes)
        const newEdges: Edge[] = [
          ...filmNodes.map((film) => ({
            id: `hero-film-${film.id}`,
            source: 'hero',
            target: film.id,
            type: 'default',
          })),
          ...starshipNodes.map((ship) => ({
            id: `film-starship-${ship.id}`,
            source: `film-${ship.id.split('-')[1]}`, // Connect starships to the corresponding films
            target: ship.id,
            type: 'default',
          })),
        ];

        // Set graph nodes and edges
        setNodes([heroNode, ...filmNodes, ...starshipNodes]);
        setEdges(newEdges);
      } catch (error) {
        console.error('Error loading hero data:', error);
      } finally {
        setLoading(false); // Set loading to false once data is loaded or an error occurs
      }
    };

    loadHeroData();
  }, [heroId]);

  return (
    <div className='bg-slate-50'>
      <section>
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52">
          <div className='col-span-2 px-6 lg:px-0 lg:pt-4'>
            <div className='relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start'>
              <div className='absolute w-1/3 left-0 -top-20 hidden lg:block'>
                <Link href='/'>
                  <img src='/StarWars.png' className='w-full' alt='Star Wars Logo' />
                </Link>
              </div>
              <h1 className='relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl'>
                Your Favorite Series Now in{' '}
                <span className='bg-yellow-500 px-2 text-white'>This</span>{' '}
                Site
              </h1>
              <p className='mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap'>
                Here are the results for {hero?.name}&apos;s appearances in the series,{' '}
                <span className='font-semibold'>& </span> the ship the character rode
              </p>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      <section className='bg-slate-100'>
        <MaxWidthWrapper>
          <div className="flex flex-col justify-center items-center h-screen">
            <div className='col-span-2 items-center gap-4 sm:gap-6'>
              <h1 className='text-4xl text-center font-bold mb-6'>Character Graph</h1>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center mt-5 justify-center w-full max-w-4xl space-y-8">
              {/* Name Card */}
              {hero && ( // Only render the hero details if hero is not null
                <div className="text-center">
                  <h1 className="text-4xl font-bold">{hero.name}</h1>
                  <p>Height: {hero.height} cm</p>
                  <p>Mass: {hero.mass} kg</p>
                </div>
              )}
  
              {/* Loading Indicator */}
              {loading ? ( 
                <div className="flex flex-col items-center justify-center h-48">
                  <SyncLoader size={10} color="#000" className='mb-5' />
                  <p className="text-lg">Loading...</p>
                </div>
              ) : (
                // Graph
                <div className="react-flow-container">
                  <ReactFlow nodes={nodes} edges={edges} fitView />
                </div>
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
};

export default HeroDetailGraph;
