declare module 'random-useragent' {
  export function getRandom(): string;
  export function getRandomData(): { 
    browser: string;
    browserVersion: string;
    os: string;
    osVersion: string;
    deviceType: string;
    deviceVendor: string;
    deviceModel: string;
  };
} 