import { Favicon } from '@/components/Favicon'

interface ClickableTitleProps {
  url: string;
  title: string;
}

export function ClickableTitle({ url, title }: ClickableTitleProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2 max-w-full group"
      title={title}
    >
      <Favicon url={url} />
      <h3 className="text-lg font-semibold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
    </a>
  )
}
