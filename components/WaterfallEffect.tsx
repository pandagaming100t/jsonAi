"use client";

import React from "react";

const VideoBackground = () => {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/waterfall.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Optional overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
    </div>
  );
};

export default VideoBackground;