import HeroList from "@/components/HeroList";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Link from "next/link";


export default function Home() {
  return (
    <div className="bg-slate-50">
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
                Get your favorite Star Wars entity,{' '}
                <span className='font-semibold'>and </span> see its appearance in the series
              </p>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      <section className="bg-slate-100 grainy-dark py-24">
        <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-32">
          <div className="col-span-2 items-center gap-4 sm:gap-6">
            <h1 className='text-4xl text-center font-bold mb-6'>Star Wars Heroes</h1>
            <HeroList/>
          </div>
        </MaxWidthWrapper>
      </section>
    </div>
  );
}
