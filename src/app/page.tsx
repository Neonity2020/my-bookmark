'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookmarkCard } from "@/components/BookmarkCard"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Bookmark {
  id: string;
  title: string;
  description: string;
  url: string;
}

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : initialValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return initialValue
    }
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(state))
      } catch (error) {
        console.error('Error writing to localStorage:', error)
      }
    }
  }, [key, state])

  return [state, setState]
}

export default function Home() {
  const initialBookmarks: Bookmark[] = [
    {
      id: '1',
      title: '百度',
      description: '中国最大的搜索引擎',
      url: 'https://www.baidu.com'
    },
    {
      id: '2',
      title: '淘宝',
      description: '中国领先的电子商务平台',
      url: 'https://www.taobao.com'
    },
    {
      id: '3',
      title: '知乎',
      description: '中文互联网高质量的问答社区和创作者聚集原创内容平台',
      url: 'https://www.zhihu.com'
    },
    {
      id: '4',
      title: 'GitHub',
      description: '全球最大的代码托管平台',
      url: 'https://github.com'
    },
    {
      id: '5',
      title: 'bilibili',
      description: '国内知名的视频弹幕网站',
      url: 'https://www.bilibili.com'
    }
  ];

  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('bookmarks', initialBookmarks);
  const [newBookmark, setNewBookmark] = useState({ title: '', description: '', url: '' })
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleAddBookmark = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const id = Date.now().toString()
    setBookmarks((prevBookmarks: Bookmark[]) => [...prevBookmarks, { id, ...newBookmark }])
    setNewBookmark({ title: '', description: '', url: '' })
  }

  const handleEdit = (id: string, newData: Partial<Bookmark>) => {
    setBookmarks(bookmarks.map(bookmark => 
      bookmark.id === id ? { ...bookmark, ...newData } : bookmark
    ))
  }

  const handleDelete = (id: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id))
  }

  return (
    <div className="container mx-auto px-4">
      <nav className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">我的网址导航</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>添加网站</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加新网站</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddBookmark} className="space-y-4">
              <div>
                <Label htmlFor="title">标题</Label>
                <Input
                  id="title"
                  value={newBookmark.title}
                  onChange={(e) => setNewBookmark({...newBookmark, title: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={newBookmark.url}
                  onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">描述</Label>
                <Input
                  id="description"
                  value={newBookmark.description}
                  onChange={(e) => setNewBookmark({...newBookmark, description: e.target.value})}
                />
              </div>
              <Button type="submit">添加</Button>
            </form>
          </DialogContent>
        </Dialog>
      </nav>
      
      {isLoaded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {bookmarks.map(bookmark => (
            <BookmarkCard 
              key={bookmark.id}
              {...bookmark}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
