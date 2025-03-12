"use client";

import React from "react";
import SearchBar from "@/components/search-bar";
import { useGetHomePageData } from "@/query/get-home-page-data";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function Home() {
  const { isLoading } = useGetHomePageData();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <div className="flex flex-col items-center justify-center w-full max-w-3xl px-4 py-20">
        <Link href={ROUTES.HOME} className="mb-16">
        </Link>
        <div className="w-full">
          <SearchBar className="w-full" />
        </div>
      </div>
    </div>
  );
}
