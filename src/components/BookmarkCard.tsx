'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronUp, ChevronDown, Pencil, Trash2 } from 'lucide-react'
import { Collection } from '@/types/Collection'
import { ClickableTitle } from '@/components/ClickableTitle'
import Link from "@/components/Link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { BookmarkIcon } from "@radix-ui/react-icons";

// 添加 Bookmark 类型定义
interface Bookmark {
  id: string;
  title: string;
  description: string;
  url: string;
  categories: string[];
}

interface BookmarkCardProps {
  id: string;
  title: string;
  description: string;
  url: string;
  categories: string[];
  onEdit?: () => void;
  onDelete?: () => void;
  onCategoryClick?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst: boolean;
  isLast: boolean;
  totalBookmarks: number;
  collections: Collection[];
  onAddToCollection: (bookmarkId: string, collectionId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export function BookmarkCard({ 
  id, 
  title, 
  description, 
  url, 
  categories = [], 
  onEdit, 
  onDelete, 
  onCategoryClick, 
  onMoveUp, 
  onMoveDown, 
  isFirst,
  isLast,
  collections,
  onAddToCollection,
  isBookmarked,
  onToggleBookmark
}: BookmarkCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({ title, description, url, categories: categories || [] })
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSave = () => {
    onEdit(id, editedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData({ title, description, url, categories })
    setIsEditing(false)
  }

  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }

  const handleToggleBookmark = () => {
    onToggleBookmark();
    setIsDropdownOpen(false);
  };

  const handleBookmarkClick = () => {
    setIsDropdownOpen(true);
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <Input 
            value={editedData.title}
            onChange={(e) => setEditedData({ ...editedData, title: e.target.value })} 
            placeholder="网站标题"
          />
        </CardHeader>
        <CardContent>
          <Textarea 
            value={editedData.description} 
            onChange={(e) => setEditedData({ ...editedData, description: e.target.value })} 
            placeholder="网站描述"
            className="mb-2"
          />
          <Input 
            value={editedData.url} 
            onChange={(e) => setEditedData({ ...editedData, url: e.target.value })} 
            placeholder="网站URL"
            className="mb-2"
          />
          <Input 
            value={editedData.categories.join(', ')} 
            onChange={(e) => setEditedData({ ...editedData, categories: e.target.value.split(',').map(cat => cat.trim()) })} 
            placeholder="分类（用逗号分隔）"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>保存</Button>
          <Button variant="outline" onClick={handleCancel} className="ml-2">取消</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full flex flex-col">
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-center mb-3">
        <div className="flex-grow mr-2 min-w-0">
            <ClickableTitle url={url} title={title} />
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoveUp}
              disabled={isFirst}
              title="左移"
              className="h-8 w-8"
            >
              <ChevronUp className="h-4 w-4 rotate-[-90deg]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onMoveDown}
              disabled={isLast}
              title="右移"
              className="h-8 w-8"
            >
              <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
            </Button>
          </div>
        </div>
        
        <div className="border-b border-gray-200 dark:border-gray-700 mb-3"></div>
        
        <p className="text-sm mb-2">
          {isExpanded ? description : truncateDescription(description, 100)}
          {description.length > 100 && (
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? '收起' : '展开'}
            </Button>
          )}
        </p>
        <Link href={url} external className="hover:underline truncate block mb-2" title={url}>
          {url}
        </Link>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <span 
              key={index} 
              className="px-2 py-1 bg-blue-200 dark:bg-blue-700 rounded-full text-xs cursor-pointer hover:bg-blue-300 dark:hover:bg-blue-600 transition-colors duration-200"
              onClick={() => onCategoryClick(category)}
            >
              {category}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center px-4 py-2 border-t bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant={isBookmarked ? "default" : "outline"}
                size="sm"
                onClick={handleBookmarkClick}
              >
                <BookmarkIcon className={isBookmarked ? "fill-current" : ""} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {collections.map((collection) => (
                <DropdownMenuItem
                  key={collection.id}
                  onSelect={() => handleToggleBookmark(collection.id)}
                >
                  {collection.bookmarkIds.includes(id) 
                    ? `从 ${collection.name} 移除` 
                    : `添加到 ${collection.name}`}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            title="编辑"
            className="p-1"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(id)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 p-1"
            title="删除"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleBookmark}
            className={isBookmarked ? "text-yellow-500" : "text-gray-500"}
          >
            <StarIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
