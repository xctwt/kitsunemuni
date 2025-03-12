"use client";

import Artplayer from "artplayer";
import React, { useRef, useEffect } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
function ArtPlayer({
  intro,
  outro,
  tracks,
  option,
  getInstance,
  ...rest
}: any) {
  const artRef = useRef();

  const trackOptions: Array<{ default: boolean; html: string; url: string }> =
    [];

  tracks.map((track: { label: string; file: string; kind: string }) => {
    if (track.kind === "captions") {
      trackOptions.push({
        default: track.label === "English",
        html: track.label,
        url: track.file,
      });
    }
  });

  useEffect(() => {
    const art = new Artplayer({
      ...option,
      container: artRef.current,
      highlight: [
        {
          time: intro?.start,
          text: "Intro Start",
        },
        {
          time: intro?.end,
          text: "Intro End",
        },
        {
          time: outro?.start,
          text: "Outro Start",
        },
        {
          time: outro?.end,
          text: "Outro End",
        },
      ],
      settings: [
        {
          width: 250,
          html: "Subtitle",
          tooltip: "Subtitle",

          selector: [
            {
              html: "Display",
              tooltip: "Show",
              switch: true,
              onSwitch: function (item) {
                item.tooltip = item.switch ? "Hide" : "Show";
                art.subtitle.show = !item.switch;
                return !item.switch;
              },
            },
            ...trackOptions,
          ],
          onSelect: function (item) {
            art.subtitle.switch(item.url, {
              name: item.html,
            });
            return item.html;
          },
        },
      ],
      layers: [
        {
          name: 'custom-control-style',
          html: `
            <style>
              .art-control { 
                --art-theme: var(--cs-text) !important;
                background: var(--cs-window) !important;
                border-top: 1px solid var(--cs-border) !important;
              }
              .art-control-progress { 
                background-color: var(--cs-hover) !important;
                height: 5px !important;
              }
              .art-control-progress-inner { 
                background-color: var(--cs-border) !important;
              }
              .art-video-player .art-subtitle p {
                color: var(--cs-text) !important;
                background-color: transparent !important;
              }
              .art-settings-item {
                background-color: var(--cs-window) !important;
                color: var(--cs-text) !important;
                border: 1px solid var(--cs-border) !important;
              }
              .art-contextmenus, .art-settings {
                background-color: var(--cs-window) !important;
                color: var(--cs-text) !important;
                border: 1px solid var(--cs-border) !important;
              }
              .art-contextmenu, .art-settings-item {
                border-bottom: 1px solid var(--cs-border) !important;
              }
              .art-contextmenu:hover, .art-settings-item:hover {
                background-color: var(--cs-hover) !important;
              }
              .art-notice {
                border: 1px solid var(--cs-border) !important;
                background-color: var(--cs-window) !important;
                color: var(--cs-text) !important;
              }
              .art-video-player .art-title {
                display: none !important;
              }
              .art-video-player .art-bottom .art-controls .art-control-logo {
                display: none !important;
              }
              /* Edgy control button styles */
              .art-icon {
                border: 1px solid var(--cs-border) !important;
                padding: 5px !important;
                transition: all 0.2s !important;
              }
              .art-icon:hover {
                background-color: var(--cs-hover) !important;
                transform: scale(1.1) !important;
              }
              .art-control-volume-panel {
                border: 1px solid var(--cs-border) !important;
                padding: 5px !important;
              }
              /* Progress thumb edgy style */
              .art-control-progress-thumb {
                width: 12px !important;
                height: 12px !important;
                border: 2px solid var(--cs-border) !important;
                background: var(--cs-window) !important;
                border-radius: 0 !important;
                transform: rotate(45deg) !important;
              }
            </style>
          `,
        },
      ],
    });

    art.on("resize", () => {
      art.subtitle.style({
        fontSize: art.height * 0.05 + "px",
      });
    });

    // Fix for audio continuing after pause
    art.on('pause', () => {
      const video = art.template.$video;
      if (video && !video.paused) {
        video.pause();
      }
    });

    if (getInstance && typeof getInstance === "function") {
      getInstance(art);
    }

    return () => {
      if (art && art.destroy) {
        art.destroy(true);
      }
    };
    //eslint-disable-next-line
  }, [option, trackOptions]);

  return <div ref={artRef} {...rest} style={{ background: "none" }}></div>;
}
/* eslint-disable @typescript-eslint/no-explicit-any */

export default ArtPlayer;
