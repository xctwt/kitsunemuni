"use client";

import Artplayer from "artplayer";
import React, { useRef, useEffect } from "react";

//eslint-disable-next-line
function ArtPlayer({ option, getInstance, ...rest }: any) {
  const artRef = useRef();

  useEffect(() => {
    const art = new Artplayer({
      ...option,
      container: artRef.current,
    });

    art.on("resize", () => {
      art.subtitle.style({
        fontSize: art.height * 0.05 + "px",
      });
    });

    if (getInstance && typeof getInstance === "function") {
      getInstance(art);
    }

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
    //eslint-disable-next-line
  }, []);

  return <div ref={artRef} {...rest} style={{ background: "none" }}></div>;
}

export default ArtPlayer;
