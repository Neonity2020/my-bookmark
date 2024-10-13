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
  category: string
  onEdit: (id: string, newData: { title: string; description: string; url: string }) => void
  onDelete: (id: string) => void
}

export function BookmarkCard({ id, title, description, url, category, onEdit, onDelete }: BookmarkCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({ title, description, url, category })

  const handleSave = () => {
    onEdit(id, editedData)
    setIsEditing(false)
  }

  const faviconUrl = `${new URL(url).origin}/favicon.ico` 

  const handleCancel = () => {
    setEditedData({ title, description, url, category })
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
              value={editedData.category}
              onChange={(e) => setEditedData({ ...editedData, category: e.target.value })}
              placeholder="分类"
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
            <p className="text-sm text-gray-400 mt-2">分类: {category}</p>
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
