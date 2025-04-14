"use client";

import React from "react";

interface BackgroundImageProps {
  src: string;
  className?: string;
}

const BackgroundImage: React.FC<BackgroundImageProps> = ({
  src,
  className,
}) => {
  if (!src) return null;

  return (
    <div
      className={`bg-cover bg-fixed min-h-screen w-full fixed bg-blend-lighten bg-white bg-opacity-70 ${className}`}
      style={{ backgroundImage: `url(${src})` }}
    ></div>
  );
};

export default BackgroundImage;
