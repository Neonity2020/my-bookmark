import Image from 'next/image'
import { useState, useEffect } from 'react'

interface FaviconImageProps {
  url: string
  size?: number
}

export function FaviconImage({ url, size = 16 }: FaviconImageProps) {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null)

  useEffect(() => {
    const getFavicon = () => {
      try {
        const domain = new URL(url).origin
        // 直接使用网站的favicon
        setFaviconUrl(`${domain}/favicon.ico`)
      } catch (error) {
        console.error('Error getting favicon:', error)
        setFaviconUrl(null)
      }
    }

    getFavicon()
  }, [url, size])

  if (!faviconUrl) {
    return null
  }

  return (
    <Image
      src={faviconUrl}
      alt={`Favicon for ${url}`}
      width={size}
      height={size}
      className="rounded-sm"
    />
  )
}
