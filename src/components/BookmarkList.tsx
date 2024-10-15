import { useState, useEffect } from 'react'
import { BookmarkCard } from './BookmarkCard'
interface Bookmark {
  id: string
  title: string
  description: string
  url: string
  categories: string[]
  isBookmarked: boolean
}

interface Collection {
  id: string;
  name: string;
  bookmarkIds: string[];
}

export function BookmarkList() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [collections, setCollections] = useState<Collection[]>([])

  useEffect(() => {
    // 初始化收藏夹
    setCollections([
      { id: '1', name: '收藏夹1', bookmarkIds: [] },
      { id: '2', name: '收藏夹2', bookmarkIds: [] },
      // ...
    ]);
  }, []);

  const handleMoveUp = (_id: string) => {
    // 实现上移逻辑
    console.log(`尝试上移书签: ${_id}`);
    // 这里可以添加实际的上移逻辑
  };

  const handleMoveDown = (_id: string) => {
    // 实现下移逻辑
    console.log(`尝试下移书签: ${_id}`);
    // 这里可以添加实际的下移逻辑
  };

  const handleEdit = (id: string, newData: Partial<Bookmark>) => {
    setBookmarks(prevBookmarks => 
      prevBookmarks.map(bookmark => 
        bookmark.id === id ? { ...bookmark, ...newData } : bookmark
      )
    );
  };

  const handleCategoryClick = (category: string) => {
    // 在这里添加处理类别点击的逻辑
    console.log(`类别被点击: ${category}`);
  };

  const handleDelete = (id: string) => {
    setBookmarks(prevBookmarks => prevBookmarks.filter(bookmark => bookmark.id !== id));
  };

  const handleAddToCollection = (_id: string, collectionId: string) => {
    // 在这里添加处理添加到收藏夹的逻辑
    console.log(`添加到收藏夹: ${_id} -> ${collectionId}`);
  };

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark, index) => (
        <BookmarkCard
          key={bookmark.id}
          {...bookmark}
          totalBookmarks={bookmarks.length}
          onEdit={handleEdit}
          onDelete={() => handleDelete(bookmark.id)}
          onCategoryClick={handleCategoryClick}
          onMoveUp={() => handleMoveUp(bookmark.id)}
          onMoveDown={() => handleMoveDown(bookmark.id)}
          isFirst={index === 0}
          isLast={index === bookmarks.length - 1}
          collections={collections}
          onAddToCollection={handleAddToCollection}
          isBookmarked={bookmark.isBookmarked}
          onToggleBookmark={(_id) => {
            // 在这里更新书签的收藏状态
            console.log(`切换书签状态: ${_id}`);
            // 例如：updateBookmarkStatus(_id, !bookmark.isBookmarked)
          }}
        />
      ))}
    </div>
  )
}
