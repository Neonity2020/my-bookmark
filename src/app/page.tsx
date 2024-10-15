'use client'

import { useState, useEffect, useRef } from 'react'
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
  categories: string[]; // 确保这是一个非空数组
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

const generateJsonFile = (data: Bookmark[]): string => {
  return JSON.stringify(data, null, 2);
};

const downloadJsonFile = (bookmarks: Bookmark[]) => {
  const jsonContent = generateJsonFile(bookmarks);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'bookmarks.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function Home() {
  const initialBookmarks: Bookmark[] = [
    {
      id: '1',
      title: '百度',
      description: '中国最大的搜索引擎',
      url: 'https://www.baidu.com',
      categories: ['搜索引擎', '网络服务']
    },
    {
      id: '2',
      title: '淘宝',
      description: '中国领先的电子商务平台',
      url: 'https://www.taobao.com',
      categories: ['购物', '网络服务']
    },
    {
      id: '3',
      title: '知乎',
      description: '中文互联网高质量的问答社区和创作者聚集原创内容平台',
      url: 'https://www.zhihu.com',
      categories: ['社交', '网络服务']
    },
    {
      id: '4',
      title: 'GitHub',
      description: '全球最大的代码托管平台',
      url: 'https://github.com',
      categories: ['开发', '网络服务']
    },
    {
      id: '5',
      title: 'bilibili',
      description: '国内知名的视频弹幕网站',
      url: 'https://www.bilibili.com',
      categories: ['娱乐', '网络服务']
    }
  ];

  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('bookmarks', initialBookmarks);
  const [newBookmark, setNewBookmark] = useState({ title: '', description: '', url: '', categories: [] as string[] });
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportBookmarks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedBookmarks = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedBookmarks)) {
            setBookmarks((prevBookmarks) => [...prevBookmarks, ...importedBookmarks]);
          } else {
            console.error('导入的文件格式不正确');
          }
        } catch (error) {
          console.error('解析导入的文件时出错:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(bookmarks.flatMap(bookmark => bookmark.categories)));
    setCategories(uniqueCategories);
  }, [bookmarks]);

  useEffect(() => {
    // 模拟数据加载
    setIsLoaded(true);
  }, []);

  const handleAddBookmark = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = Date.now().toString();
    setBookmarks((prevBookmarks: Bookmark[]) => [...prevBookmarks, { id, ...newBookmark }]);
    setNewBookmark({ title: '', description: '', url: '', categories: [] as string[] });
  };

  const handleEdit = (id: string, newData: Partial<Bookmark>) => {
    setBookmarks(prevBookmarks => {
      const updatedBookmarks = prevBookmarks.map(bookmark => 
        bookmark.id === id ? { ...bookmark, ...newData } : bookmark
      );
      const uniqueCategories = Array.from(new Set(updatedBookmarks.flatMap(bookmark => bookmark.categories)));
      setCategories(uniqueCategories);
      return updatedBookmarks;
    });
  }

  const handleDelete = (id: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id))
  }

  const filteredBookmarks = selectedCategories.length > 0
    ? bookmarks.filter(bookmark => 
        Array.isArray(bookmark.categories) && 
        bookmark.categories.some(cat => selectedCategories.includes(cat))
      )
    : bookmarks;

  const handleCategoryClick = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <nav className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">我的网址导航</h1>
        <div className="flex flex-wrap justify-center sm:justify-end gap-2">
          <Button onClick={() => downloadJsonFile(bookmarks)}>下载书签</Button>
          <Button onClick={() => fileInputRef.current?.click()}>导入书签</Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImportBookmarks}
            accept=".json"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">添加网站</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>添加新网站</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddBookmark} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">标题</Label>
                    <Input
                      id="title"
                      value={newBookmark.title}
                      onChange={(e) => setNewBookmark({...newBookmark, title: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={newBookmark.url}
                      onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">描述</Label>
                  <Input
                    id="description"
                    value={newBookmark.description}
                    onChange={(e) => setNewBookmark({...newBookmark, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categories">分类（用逗号分隔多个分类）</Label>
                  <Input
                    id="categories"
                    value={newBookmark.categories.join(', ')}
                    onChange={(e) => setNewBookmark({...newBookmark, categories: e.target.value.split(',').map(cat => cat.trim())})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={!newBookmark.title || !newBookmark.url || !newBookmark.categories.length}>添加</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
      
      <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
        <Button
          variant={selectedCategories.length === 0 ? "default" : "outline"}
          onClick={() => setSelectedCategories([])}
          className="mb-2 sm:mb-0"
        >
          全部
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategories.includes(category) ? "default" : "outline"}
            onClick={() => handleCategoryClick(category)}
            className="mb-2 sm:mb-0"
          >
            {category}
          </Button>
        ))}
      </div>

      {isLoaded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">
          {filteredBookmarks.map(bookmark => (
            <BookmarkCard 
              key={bookmark.id}
              {...bookmark}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCategoryClick={handleCategoryClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}
