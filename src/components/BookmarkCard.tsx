'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FaviconImage } from '@/components/Favicon'

interface BookmarkCardProps {
  id: string
  title: string
  description: string
  url: string
  categories: string[] // 将单个 category 改为 categories 数组
  onEdit: (id: string, newData: { title: string; description: string; url: string; categories: string[] }) => void
  onDelete: (id: string) => void
}

export function BookmarkCard({ id, title, description, url, categories = [], onEdit, onDelete }: BookmarkCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({ title, description, url, categories: categories || [] })

  const handleSave = () => {
    onEdit(id, editedData)
    setIsEditing(false)
  }

  const faviconUrl = `${new URL(url).origin}/favicon.ico` 

  const handleCancel = () => {
    setEditedData({ title, description, url, categories })
    setIsEditing(false)
  }

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
    <Card>
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editedData.title}
              onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
              placeholder="标题"
            />
            <Input
              value={editedData.url}
              onChange={(e) => setEditedData({ ...editedData, url: e.target.value })}
              placeholder="URL"
            />
            <Input
              value={editedData.description}
              onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
              placeholder="描述"
            />
            <Input
              value={editedData.categories.join(', ')}
              onChange={(e) => setEditedData({ ...editedData, categories: e.target.value.split(',').map(cat => cat.trim()) })}
              placeholder="分类（用逗号分隔）"
            />
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2 mb-2">
              <FaviconImage url={url} />
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-2">{description}</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{url}</a>
            <div className="flex flex-wrap gap-2 mt-2">
              {(categories || []).map((category, index) => (
                <span key={index} className="px-2 py-1 bg-gray-200 rounded-full text-xs text-gray-700">
                  {category}
                </span>
              ))}
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="p-4">
        {isEditing ? (
          <>
            <Button onClick={handleSave} className="mr-2">保存</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>取消</Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)} className="mr-2">编辑</Button>
            <Button variant="destructive" onClick={() => onDelete(id)}>删除</Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
