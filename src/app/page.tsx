import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookmarkCard } from "@/components/ui/BookmarkCard"

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <nav className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">我的网址导航</h1>
        <div className="flex items-center space-x-4">
          <Input className="w-64" placeholder="搜索网站..." />
          <Button>添加网站</Button>
        </div>
      </nav>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <BookmarkCard 
          title="Google"
          description="世界最大的搜索引擎"
          url="https://www.google.com"
        />
        <BookmarkCard 
          title="GitHub"
          description="代码托管和协作平台"
          url="https://github.com"
        />
        {/* 添加更多BookmarkCard组件 */}
      </div>
    </div>
  )
}
