import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FaviconProps {
  url: string;
  size?: number;
}

export function Favicon({ url, size = 16 }: FaviconProps) {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  useEffect(() => {
    const getFaviconUrl = () => {
      try {
        const urlObject = new URL(url);
        return `${urlObject.protocol}//${urlObject.hostname}/favicon.ico`;
      } catch {
        return null;
      }
    };

    setFaviconUrl(getFaviconUrl());
  }, [url]);

  const handleError = () => {
    setFaviconUrl('/default-favicon.png'); // 确保在public文件夹中有一个默认的favicon图标
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {faviconUrl ? (
        <Image
          src={faviconUrl}
          alt="Favicon"
          width={size}
          height={size}
          onError={handleError}
          className="rounded-sm object-contain"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 rounded-sm flex items-center justify-center">
          <span className="text-xs text-gray-500">?</span>
        </div>
      )}
    </div>
  );
}
