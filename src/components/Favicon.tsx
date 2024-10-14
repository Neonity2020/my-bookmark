import { useState, useEffect } from 'react';
import Image from 'next/image';

interface FaviconProps {
  url: string;
  size?: number;
}

export function Favicon({ url, size = 16 }: FaviconProps) {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  useEffect(() => {
    const getFaviconUrl = async () => {
      try {
        const urlObject = new URL(url);
        const domain = urlObject.hostname;

        // 尝试多种常见的favicon路径
        const possiblePaths = [
          `${urlObject.origin}/favicon.ico`,
          `${urlObject.origin}/favicon.png`,
          `${urlObject.origin}/apple-touch-icon.png`,
          `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${domain}&size=32`,
          `https://api.faviconkit.com/${domain}/32`,
          `https://icon.horse/icon/${domain}`,
        ];

        for (const path of possiblePaths) {
          try {
            const response = await fetch(path, { method: 'HEAD', mode: 'no-cors' });
            if (response.ok || response.type === 'opaque') {
              setFaviconUrl(path);
              return;
            }
          } catch (error) {
            console.error(`Error fetching favicon from ${path}:`, error);
          }
        }

        // 如果所有尝试都失败，使用默认图标
        setFaviconUrl('/default-favicon.png');
      } catch {
        setFaviconUrl('/default-favicon.png');
      }
    };

    getFaviconUrl();
  }, [url]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {faviconUrl ? (
        <Image
          src={faviconUrl}
          alt="Favicon"
          width={size}
          height={size}
          className="rounded-sm object-contain"
          unoptimized
        />
      ) : (
        <div className="w-full h-full bg-gray-200 rounded-sm flex items-center justify-center">
          <span className="text-xs text-gray-500">?</span>
        </div>
      )}
    </div>
  );
}
