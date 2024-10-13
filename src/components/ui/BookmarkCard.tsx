import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface BookmarkCardProps {
  title: string
  description: string
  url: string
}

export function BookmarkCard({ title, description, url }: BookmarkCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {url}
        </a>
      </CardContent>
      <CardFooter>
        <Button variant="outline">编辑</Button>
        <Button variant="destructive" className="ml-2">删除</Button>
      </CardFooter>
    </Card>
  )
}