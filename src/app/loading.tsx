import React from "react";

const Loading = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <div className="animate-pulse">
        <div className="h-24 w-24 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loading;

