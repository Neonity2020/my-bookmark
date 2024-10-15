import React from 'react';
import { BookmarkCard } from './BookmarkCard';
import { Collection, Bookmark } from '@/types/Collection';

interface CollectionViewProps {
  collection: Collection;
  bookmarks: Bookmark[];
  onEditBookmark: (id: string, newData: Partial<Bookmark>) => void;
  onDeleteBookmark: (id: string) => void;
  onCategoryClick: (category: string) => void;
  onMoveBookmarkUp: (id: string) => void;
  onMoveBookmarkDown: (id: string) => void;
  collections: Collection[];
  onAddBookmarkToCollection: (bookmarkId: string, collectionId: string) => void;
}

export function CollectionView({
  collection,
  bookmarks,
  onEditBookmark,
  onDeleteBookmark,
  onCategoryClick,
  onMoveBookmarkUp,
  onMoveBookmarkDown,
  collections,
  onAddBookmarkToCollection
}: CollectionViewProps) {
  const collectionBookmarks = bookmarks.filter(bookmark => 
    collection.bookmarkIds.includes(bookmark.id)
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{collection.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {collectionBookmarks.map((bookmark, index) => (
          <BookmarkCard
            key={bookmark.id}
            {...bookmark}
            totalBookmarks={collectionBookmarks.length}
            onEdit={onEditBookmark}
            onDelete={onDeleteBookmark}
            onCategoryClick={onCategoryClick}
            onMoveUp={() => onMoveBookmarkUp(bookmark.id)}
            onMoveDown={() => onMoveBookmarkDown(bookmark.id)}
            isFirst={index === 0}
            isLast={index === collectionBookmarks.length - 1}
            collections={collections}
            onAddToCollection={onAddBookmarkToCollection}
            isBookmarked={bookmark.isBookmarked}
            onToggleBookmark={(id) => {
              onEditBookmark(id, { isBookmarked: !bookmark.isBookmarked });
            }}
          />
        ))}
      </div>
    </div>
  );
}
