import React, { useState } from 'react';
import Link from "@/components/Link";

interface ClickableTitleProps {
  url: string;
  title: string;
}

export function ClickableTitle({ url, title }: ClickableTitleProps) {
  const [imageError, setImageError] = useState(false);

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${url}&sz=32`;

  return (
    <div className="flex items-center">
      {imageError ? (
        <div className="w-4 h-4 mr-2 flex items-center justify-center text-gray-400 bg-gray-200 rounded">
          ?
        </div>
      ) : (
        <img
          src={faviconUrl}
          alt=""
          className="w-4 h-4 mr-2"
          onError={() => setImageError(true)}
        />
      )}
      <Link href={url} external className="text-lg font-semibold hover:underline">
        {title}
      </Link>
    </div>
  );
}
