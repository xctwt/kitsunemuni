if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,n)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let i={};const r=e=>c(e,t),u={module:{uri:t},exports:i,require:r};s[t]=Promise.all(a.map((e=>u[e]||r(e)))).then((e=>(n(...e),i)))}}define(["./workbox-e9849328"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"c8c0f835ea716ab082a1f9cb308f6bea"},{url:"/_next/static/7YsNugOQc8yGMVeNecR7I/_buildManifest.js",revision:"c3e03df2cd33914bf2143a442e6db9e2"},{url:"/_next/static/7YsNugOQc8yGMVeNecR7I/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/08ffd5a1-26b114db0cbc517d.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/203-cc5ffa7ee903f6a5.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/228-46f553f059c9e6ed.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/349954a4-0781098cae7fb239.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/381-e4f45881e2348dfa.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/405-d957c7e75ffb2ed2.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/415-986faddd95871cbf.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/441-4b240814afc37a98.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/754-5a833ca086e113ed.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/787-4b79ccd821e0f014.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/79-6a8eab2befc28cf2.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/790-afa62e1174930269.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/845-5070c328278b6a36.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/973.03d579b049330d35.js",revision:"03d579b049330d35"},{url:"/_next/static/chunks/app/_not-found/page-5d651fc8e16ffe38.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/app/anime/%5Bslug%5D/page-0a0b356623c6f7d4.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/app/anime/watch/layout-cc1585f4047b3dab.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/app/anime/watch/page-2b3a4c6d93c67f95.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/app/error-3dab124f5f161ca2.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/app/global-error-4f1ad46b5350d483.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/app/layout-3d3d761e154ae140.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/app/loading-b2fe3ef772b03886.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/app/page-bc8f00e05acd3303.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/app/search/page-47b1b5a94b9c6fad.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/framework-6e06c675866dc992.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/main-5b0d1a004cdaf7a7.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/main-app-f9bbfca5bba3241a.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/pages/_app-ef5d66bd0260f8ed.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/pages/_error-a88b75f0d28f9ab3.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/reactPlayerDailyMotion.72ef35dd9d767bf1.js",revision:"72ef35dd9d767bf1"},{url:"/_next/static/chunks/reactPlayerFacebook.e5b2883df60a1aa1.js",revision:"e5b2883df60a1aa1"},{url:"/_next/static/chunks/reactPlayerFilePlayer.830d7e79782d4d87.js",revision:"830d7e79782d4d87"},{url:"/_next/static/chunks/reactPlayerKaltura.b4426e97ce76118b.js",revision:"b4426e97ce76118b"},{url:"/_next/static/chunks/reactPlayerMixcloud.b780389385296ef1.js",revision:"b780389385296ef1"},{url:"/_next/static/chunks/reactPlayerMux.634bee57da2f6211.js",revision:"634bee57da2f6211"},{url:"/_next/static/chunks/reactPlayerPreview.09817167e9646bda.js",revision:"09817167e9646bda"},{url:"/_next/static/chunks/reactPlayerSoundCloud.79a88044a365feac.js",revision:"79a88044a365feac"},{url:"/_next/static/chunks/reactPlayerStreamable.bb4f10b6f4b5f9bd.js",revision:"bb4f10b6f4b5f9bd"},{url:"/_next/static/chunks/reactPlayerTwitch.417d8c5e76d358c9.js",revision:"417d8c5e76d358c9"},{url:"/_next/static/chunks/reactPlayerVidyard.b0246461bf5fab01.js",revision:"b0246461bf5fab01"},{url:"/_next/static/chunks/reactPlayerVimeo.4e49741e5babc103.js",revision:"4e49741e5babc103"},{url:"/_next/static/chunks/reactPlayerWistia.1ec62dc7d7e0e1e6.js",revision:"1ec62dc7d7e0e1e6"},{url:"/_next/static/chunks/reactPlayerYouTube.7ca60c4cf68ffd2f.js",revision:"7ca60c4cf68ffd2f"},{url:"/_next/static/chunks/webpack-85e776f892fce5db.js",revision:"7YsNugOQc8yGMVeNecR7I"},{url:"/_next/static/css/317285df0e0bbe7b.css",revision:"317285df0e0bbe7b"},{url:"/_next/static/css/6108c112870e8a5e.css",revision:"6108c112870e8a5e"},{url:"/_next/static/media/4473ecc91f70f139-s.p.woff",revision:"78e6fc13ea317b55ab0bd6dc4849c110"},{url:"/_next/static/media/463dafcda517f24f-s.p.woff",revision:"cbeb6d2d96eaa268b4b5beb0b46d9632"},{url:"/_next/static/media/error.a893477b.gif",revision:"c6ee19d8a999e730174659f53b8a6362"},{url:"/icon-192x192.png",revision:"c499877ad8aaf2113b6092420d3cda6a"},{url:"/icon-256x256.png",revision:"4f7ee5634768717473258c9223248a09"},{url:"/icon-384x384.png",revision:"aca61b63dbf5139ca1eb5819142cee5a"},{url:"/icon-512x512.png",revision:"60e7c7e3033ebc42852db77930f98089"},{url:"/icon.png",revision:"ae55038c109136f74927c8ec0056cc7b"},{url:"/loader.gif",revision:"072709b3a6aff27a3b328b0d1a43dcb0"},{url:"/manifest.json",revision:"2d7e8a681776a6754d66c3b79e3d0d58"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:c,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
