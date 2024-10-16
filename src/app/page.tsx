'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookmarkCard } from "@/components/BookmarkCard"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusIcon } from "@radix-ui/react-icons"
import { AddBookmarkForm } from "@/components/AddBookmarkForm"
import { useToast } from "@/hooks/use-toast"

interface Bookmark {
  id: string;
  title: string;
  description: string;
  url: string;
  categories: string[];
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
      categories: ['搜索引擎', '网络服务'],
    },
    {
      id: '2',
      title: '淘宝',
      description: '中国领先的电子务平台',
      url: 'https://www.taobao.com',
      categories: ['购物', '网络服务'],
    },
    {
      id: '3',
      title: '知乎',
      description: '中文互联网质量的问答社区和创作者聚集原创内容平台',
      url: 'https://www.zhihu.com',
      categories: ['社交', '网络服务'],
    },
    {
      id: '4',
      title: 'GitHub',
      description: '全球最大的代码托管平台',
      url: 'https://github.com',
      categories: ['开发', '网络服务'],
    },
    {
      id: '5',
      title: 'bilibili',
      description: '国内知名的视频弹幕网站',
      url: 'https://www.bilibili.com',
      categories: ['娱乐', '网络服务'],
    }
  ];

  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('bookmarks', initialBookmarks);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isCollectionsLoaded, setIsCollectionsLoaded] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isNewCollectionDialogOpen, setIsNewCollectionDialogOpen] = useState(false);
  const [defaultCollectionId, setDefaultCollectionId] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast()

  const handleImportBookmarks = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedBookmarks = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedBookmarks)) {
            // 清除当前书签并设置导入的书签
            setBookmarks(importedBookmarks);
            // 更新收藏夹中的书签ID
            setCollections(prevCollections => 
              prevCollections.map(collection => ({
                ...collection,
                bookmarkIds: collection.id === defaultCollectionId ? importedBookmarks.map(b => b.id) : []
              }))
            );
            toast({
              title: "导入成功",
              description: `已成功导入 ${importedBookmarks.length} 个书签。`,
            });
          } else {
            toast({
              title: "导入失败",
              description: "导入的文件格式不正确。",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('解析导入的文件时错:', error);
          toast({
            title: "导入失败",
            description: "解析文件时出错，请确保文件格式正确。",
            variant: "destructive",
          });
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
    const bookmarkWithId = { id, ...newBookmark };
    setBookmarks((prevBookmarks: Bookmark[]) => [...prevBookmarks, bookmarkWithId]);
    
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

  const handleCreateCollection = () => {
    const trimmedName = newCollectionName.trim();
    if (trimmedName) {
      const isNameExist = collections.some(collection => collection.name.toLowerCase() === trimmedName.toLowerCase());
      
      if (isNameExist) {
        toast({
          title: "创建失败",
          description: "已存在同名收藏夹，请使用其他名称。",
          variant: "destructive",
        });
        return;
      }

      const newCollection: Collection = {
        id: Date.now().toString(),
        name: trimmedName,
        bookmarkIds: [],
      };
      setCollections(prevCollections => [...prevCollections, newCollection]);
      setNewCollectionName('');
      setIsNewCollectionDialogOpen(false);
      toast({
        title: "创建成功",
        description: `已成功创建收藏夹 "${trimmedName}"。`,
      });
    }
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

  const handleToggleBookmark = (id: string, collectionId: string | null) => {
    if (collectionId) {
      // 添加到指定收藏夹或从指定收藏夹中移除
      setCollections(prevCollections => 
        prevCollections.map(collection => 
          collection.id === collectionId
            ? {
                ...collection,
                bookmarkIds: collection.bookmarkIds.includes(id)
                  ? collection.bookmarkIds.filter(bookmarkId => bookmarkId !== id)
                  : [...collection.bookmarkIds, id]
              }
            : collection
        )
      );
    } else {
      // 从所有收藏夹中移除
      setCollections(prevCollections => 
        prevCollections.map(collection => ({
          ...collection,
          bookmarkIds: collection.bookmarkIds.filter(bookmarkId => bookmarkId !== id)
        }))
      );
    }

    // 更新 bookmarkedIds 状态
    setBookmarkedIds(prev => {
      const isCurrentlyBookmarked = prev.includes(id);
      if (isCurrentlyBookmarked && !collectionId) {
        return prev.filter(bookmarkId => bookmarkId !== id);
      } else if (!isCurrentlyBookmarked && collectionId) {
        return [...prev, id];
      }
      return prev;
    });
  };

  useEffect(() => {
    // 在客户端加载收藏夹数据
    const storedCollections = localStorage.getItem('collections');
    if (storedCollections) {
      const parsedCollections = JSON.parse(storedCollections);
      setCollections(parsedCollections);
      
      // 检查是否存在默认收藏夹，如果不存在则创建
      const defaultCollection = parsedCollections.find((c: Collection) => c.name === '默认收藏夹');
      if (!defaultCollection) {
        const newDefaultCollection: Collection = {
          id: 'default',
          name: '默认收藏夹',
          bookmarkIds: [], // 初始化为空数组
        };
        setCollections(prev => [...prev, newDefaultCollection]);
        setDefaultCollectionId('default');
      } else {
        setDefaultCollectionId(defaultCollection.id);
        // 设置已收藏的书签ID
        setBookmarkedIds(defaultCollection.bookmarkIds);
      }
    } else {
      const defaultCollection: Collection = {
        id: 'default',
        name: '默认收藏夹',
        bookmarkIds: [], // 初始化为空数组
      };
      setCollections([defaultCollection]);
      setDefaultCollectionId('default');
    }
    setIsCollectionsLoaded(true);
  }, []);

  useEffect(() => {

    if (isCollectionsLoaded) {
      localStorage.setItem('collections', JSON.stringify(collections));
    }
  }, [collections, isCollectionsLoaded]);

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        <nav className="flex flex-col sm:flex-row items-center justify-between py-4 space-y-4 sm:space-y-0">

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
                variant={collection.id === defaultCollectionId ? "default" : "outline"}
                onClick={() => {/* 实现显示收藏夹内容的功能 */}}
              >
                {collection.name} ({collection.bookmarkIds.length})
                {collection.id === defaultCollectionId && " (默认)"}
              </Button>
            ))}
            <Dialog open={isNewCollectionDialogOpen} onOpenChange={setIsNewCollectionDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">新建收藏夹</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建收藏夹</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="collectionName">收藏夹名称</Label>
                    <Input 
                      id="collectionName" 
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      required 
                    />
                  </div>
                  <Button onClick={handleCreateCollection}>创建</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoaded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">
            {filteredBookmarks.map((bookmark, index) => (
              <BookmarkCard 
                key={bookmark.id}
                {...bookmark}
                isBookmarked={bookmarkedIds.includes(bookmark.id)}
                onToggleBookmark={() => handleToggleBookmark(bookmark.id, null)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCategoryClick={handleCategoryClick}
                onMoveUp={() => handleMoveUp(bookmark.id)}
                onMoveDown={() => handleMoveDown(bookmark.id)}
                isFirst={index === 0}
                isLast={index === filteredBookmarks.length - 1}
                totalBookmarks={filteredBookmarks.length}
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
      
  </>
  )
}
