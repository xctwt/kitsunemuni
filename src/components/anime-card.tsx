import React from "react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Captions, Mic } from "lucide-react";

type Props = {
  className?: string;
  poster: string;
  title: string;
  episodeCard?: boolean;
  sub?: number | null;
  dub?: number | null;
  subTitle?: string;
  displayDetails?: boolean;
  variant?: "sm" | "lg";
  href?: string;
  showGenre?: boolean;
};

const AnimeCard = ({
  displayDetails = true,
  // showGenre = true,
  variant = "sm",
  ...props
}: Props) => {
  return (
    <Link href={props.href as string}>
      <div
        className={cn([
          "overflow-hidden relative cursor-pointer transition-colors border border-cs-border",
          variant === "sm" &&
          "h-[12rem] min-[320px]:h-[16.625rem] sm:h-[18rem] max-w-[12.625rem] md:min-w-[12rem]",
          ,
          variant === "lg" &&
          "max-w-[12.625rem] md:max-w-[18.75rem] h-auto md:h-[25rem] shrink-0 lg:w-[18.75rem]",
          props.className,
        ])}
      >
        <Image
          src={props.poster}
          alt="image"
          height={100}
          width={100}
          className="w-full h-full object-cover"
          unoptimized
        />
        {displayDetails && (
          <div className="absolute bottom-0 left-0 right-0 bg-cs-window/80 border-t border-cs-border p-2">
            <h5 className="line-clamp-1 font-medium">{props.title}</h5>
            {props.episodeCard ? (
              <div className="flex flex-row items-center space-x-2 mt-1">
                {props.sub && (
                  <Badge className="bg-transparent border-cs-border text-cs-text flex flex-row items-center space-x-0.5">
                    <Captions size={"16"} />
                    <span>{props.sub}</span>
                  </Badge>
                )}
                {props.dub && (
                  <Badge className="bg-transparent border-cs-border text-cs-text flex flex-row items-center space-x-0.5">
                    <Mic size={"16"} />
                    <span>{props.dub}</span>
                  </Badge>
                )}
                <p className="text-sm text-gray-400">{props.subTitle}</p>
              </div>
            ) : (
              <span className="text-sm">{props.subTitle}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default AnimeCard;
