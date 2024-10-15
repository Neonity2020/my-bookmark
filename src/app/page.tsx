'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookmarkCard } from "@/components/BookmarkCard"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusIcon } from "@radix-ui/react-icons"
import { AddBookmarkForm } from "@/components/AddBookmarkForm"

interface Bookmark {
  id: string;
  title: string;
  description: string;
  url: string;
  categories: string[]; // 确保这是一个非空数组
}

interface Collection {
  id: string;
  name: string;
  bookmarkIds: string[]; // 添加这个属性
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
      description: '中文互联网质量的问答社区和创作者聚集原创内容平台',
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
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [collections, setCollections] = useLocalStorage<Collection[]>('collections', [
    { id: '1', name: '默认文件夹', bookmarkIds: [] },
  ]);

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

  const handleAddBookmark = (newBookmark: Omit<Bookmark, 'id'>) => {
    const id = Date.now().toString();
    setBookmarks((prevBookmarks: Bookmark[]) => [...prevBookmarks, { id, ...newBookmark }]);
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

  const [deletedBookmark, setDeletedBookmark] = useState<Bookmark | null>(null);

  const handleDelete = (id: string) => {
    const bookmarkToDelete = bookmarks.find(bookmark => bookmark.id === id);
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
    setDeletedBookmark(bookmarkToDelete || null);
  }

  const handleUndoDelete = () => {
    if (deletedBookmark) {
      setBookmarks(prevBookmarks => [...prevBookmarks, deletedBookmark]);
      setDeletedBookmark(null);
    }
  }

  const filteredBookmarks = selectedCategories.length > 0
    ? bookmarks.filter(bookmark => 
        Array.isArray(bookmark.categories) && 
        bookmark.categories.some(cat => selectedCategories.includes(cat))
      )
    : bookmarks;

  // 添加搜索过滤逻辑
  const searchFilteredBookmarks = filteredBookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleAddToCollection = (bookmarkId: string, collectionId: string) => {
    setCollections(prevCollections => 
      prevCollections.map(collection => 
        collection.id === collectionId
          ? { ...collection, bookmarkIds: collection.bookmarkIds.includes(bookmarkId) ? collection.bookmarkIds : [...collection.bookmarkIds, bookmarkId] }
          : collection
      )
    );
  };

  const handleCreateCollection = (name: string) => {
    const newCollection: Collection = {
      id: Date.now().toString(),
      name,
      bookmarkIds: [],
    };
    setCollections(prevCollections => [...prevCollections, newCollection]);
  };

  const handleMoveUp = (id: string) => {
    setBookmarks(prevBookmarks => {
      const index = prevBookmarks.findIndex(bookmark => bookmark.id === id);
      if (index > 0) {
        const newBookmarks = [...prevBookmarks];
        [newBookmarks[index - 1], newBookmarks[index]] = [newBookmarks[index], newBookmarks[index - 1]];
        return newBookmarks;
      }
      return prevBookmarks;
    });
  };

  const handleMoveDown = (id: string) => {
    setBookmarks(prevBookmarks => {
      const index = prevBookmarks.findIndex(bookmark => bookmark.id === id);
      if (index < prevBookmarks.length - 1) {
        const newBookmarks = [...prevBookmarks];
        [newBookmarks[index], newBookmarks[index + 1]] = [newBookmarks[index + 1], newBookmarks[index]];
        return newBookmarks;
      }
      return prevBookmarks;
    });
  };

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(bookmarkId => bookmarkId !== id) : [...prev, id]
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <nav className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold">我的网址导航 - 打造一个简洁的网址导航</h1>
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
              <Button className="bg-blue-500 hover:bg-blue-600 text-white hidden sm:inline-flex">添加网站</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>添加新网站</DialogTitle>
              </DialogHeader>
              <AddBookmarkForm onSubmit={handleAddBookmark} />
            </DialogContent>
          </Dialog>
        </div>
      </nav>
      
      <div className="mb-4">
        <Input
          type="text"
          placeholder="搜索书签..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

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

      {/* 添加收藏夹管理部分 */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">收藏夹</h2>
        <div className="flex flex-wrap gap-2">
          {collections.map(collection => (
            <Button
              key={collection.id}
              variant="outline"
              onClick={() => {/* 实现显示收藏夹内容的功能 */}}
            >
              {collection.name} ({collection.bookmarkIds.length})
            </Button>
          ))}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">新建收藏夹</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新建收藏夹</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const name = (e.target as HTMLFormElement).collectionName.value;
                handleCreateCollection(name);
                (e.target as HTMLFormElement).reset();
              }}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="collectionName">收藏夹名称</Label>
                    <Input id="collectionName" required />
                  </div>
                  <Button type="submit">创建</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoaded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">
          {searchFilteredBookmarks.map((bookmark, index) => (
            <BookmarkCard 
              key={bookmark.id}
              {...bookmark}
              isBookmarked={bookmarkedIds.includes(bookmark.id)}
              onToggleBookmark={() => handleToggleBookmark(bookmark.id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCategoryClick={handleCategoryClick}
              onMoveUp={() => handleMoveUp(bookmark.id)}
              onMoveDown={() => handleMoveDown(bookmark.id)}
              isFirst={index === 0}
              isLast={index === searchFilteredBookmarks.length - 1}
              totalBookmarks={searchFilteredBookmarks.length}
              collections={collections}
              onAddToCollection={handleAddToCollection}
            />
          ))}
        </div>
      )}

      {deletedBookmark && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center">
          <span className="mr-2">已删除 &quot;{deletedBookmark.title}&quot;</span>
          <Button onClick={handleUndoDelete} variant="outline" size="sm">
            撤销
          </Button>
        </div>
      )}

      {/* 添加移动端浮动按钮 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 rounded-full w-16 h-16 sm:hidden flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
            size="icon"
          >
            <PlusIcon className="h-8 w-8" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>添加新网站</DialogTitle>
          </DialogHeader>
          <AddBookmarkForm onSubmit={handleAddBookmark} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
