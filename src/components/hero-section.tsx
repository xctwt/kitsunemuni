"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";

import Container from "./container";
import { Button } from "./ui/button";
import parse from "html-react-parser";

import React from "react";
import { ArrowLeft, ArrowRight, Captions, Mic } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { ButtonLink } from "./common/button-link";
import { SpotlightAnime } from "@/types/anime";
import { Badge } from "./ui/badge";

type IHeroSectionProps = {
  spotlightAnime: SpotlightAnime[];
  isDataLoading: boolean;
};

const HeroSection = (props: IHeroSectionProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [translateX, setTranslateX] = React.useState(0);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const totalItems = props?.spotlightAnime?.length || 0;

  React.useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  const handlePrev = React.useCallback(() => {
    if (api) {
      api.scrollPrev();
      // Manual animation if CSS transitions are disabled
      if (contentRef.current) {
        const width = contentRef.current.clientWidth;
        setTranslateX(prev => prev + width);
      }
    }
  }, [api]);

  const handleNext = React.useCallback(() => {
    if (api) {
      api.scrollNext();
      // Manual animation if CSS transitions are disabled
      if (contentRef.current) {
        const width = contentRef.current.clientWidth;
        setTranslateX(prev => prev - width);
      }
    }
  }, [api]);

  if (props.isDataLoading) return <LoadingSkeleton />;

  return (
    <div className="h-[80vh] w-full relative">
      <div className="allow-animation w-full">
        <Carousel 
          className="w-full carousel" 
          setApi={setApi} 
          opts={{ 
            loop: true,
            dragFree: true,
            skipSnaps: false,
            align: 'start',
            watchDrag: true,
          }}
          data-carousel
        >
          <CarouselContent 
            className="carousel-content" 
            ref={contentRef}
            style={{
              transform: `translateX(${translateX}px)`
            }}
            data-carousel-content
          >
            {props?.spotlightAnime.map((anime, index) => (
              <CarouselItem 
                key={index} 
                className="carousel-item" 
                data-carousel-item
                style={{ minWidth: '100%', flexShrink: 0 }}
              >
                <HeroCarouselItem anime={anime} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="absolute hidden md:flex items-center gap-5 right-10 3xl:bottom-10 bottom-24 z-50 isolate">
        <Button
          onClick={handlePrev}
          className="border border-cs-border bg-cs-window text-cs-text h-10 w-10 hover:bg-cs-hover carousel-button"
          type="button"
          data-carousel-button="prev"
        >
          <ArrowLeft className="shrink-0" />
        </Button>
        <Button
          onClick={handleNext}
          className="border border-cs-border bg-cs-window text-cs-text h-10 w-10 hover:bg-cs-hover carousel-button"
          type="button"
          data-carousel-button="next"
        >
          <ArrowRight className="shrink-0" />
        </Button>
      </div>
    </div>
  );
};

const HeroCarouselItem = ({ anime }: { anime: SpotlightAnime }) => {
  return (
    <div
      className="w-full h-[80vh] relative overflow-hidden"
    >
      {/* Background Image - No overlay */}
      <img 
        src={anime?.poster} 
        alt={anime?.name}
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      
      {/* Content Section with improved visibility */}
      <div className="w-full h-full flex items-end md:items-center relative z-20">
        <Container className="w-full py-10">
          <div className="space-y-2 lg:w-[40vw] bg-cs-window/80 dark:bg-cs-window/80 p-4 border border-cs-border backdrop-blur-sm">
            <h1 className="text-4xl font-black">{anime?.name}</h1>

            <div className="flex flex-row items-center space-x-2 ">
              {anime.episodes.sub && (
                <Badge className="bg-transparent border-cs-border text-cs-text flex flex-row items-center space-x-0.5">
                  <Captions size={"16"} />
                  <span>{anime.episodes.sub}</span>
                </Badge>
              )}
              {anime.episodes.dub && (
                <Badge className="bg-transparent border-cs-border text-cs-text flex flex-row items-center space-x-0.5">
                  <Mic size={"16"} />
                  <span>{anime.episodes.dub}</span>
                </Badge>
              )}
            </div>

            <p className="text-lg line-clamp-4">
              {parse(anime?.description as string)}
            </p>
            <div className="flex items-center gap-5 !mt-5">
              <ButtonLink
                href={`${ROUTES.ANIME_DETAILS}/${anime.id}`}
                className="h-10 text-md bg-cs-window border border-cs-border text-cs-text hover:bg-cs-hover"
              >
                Learn More
              </ButtonLink>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="h-[80vh] w-full relative">
      <div className="w-full h-[calc(100%-5.25rem)] mt-[5.25rem] relative z-20">
        <Container className="w-full h-full flex flex-col justify-end md:justify-center pb-10">
          <div className="space-y-2 lg:w-[40vw]">
            <div className="h-16 bg-secondary w-[75%]"></div>
            <div className="h-40 w-full bg-secondary"></div>
            <div className="flex items-center gap-5">
              <span className="h-10 w-[7.5rem] bg-secondary"></span>
              <span className="h-10 w-[7.5rem] bg-secondary"></span>
            </div>
          </div>
        </Container>
      </div>
      <div className="absolute hidden md:flex items-center gap-5 right-10 bottom-0 z-50 isolate">
        <span className="h-10 w-10 bg-secondary"></span>
        <span className="h-10 w-10 bg-secondary"></span>
      </div>
    </div>
  );
};
export default HeroSection;
