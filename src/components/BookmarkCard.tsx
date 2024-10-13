'use client'

import { useState, useEffect } from 'react'
// 其他导入...
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface BookmarkCardProps {
  id: string
  title: string
  description: string
  url: string
  onEdit: (id: string, newData: { title: string; description: string; url: string }) => void
  onDelete: (id: string) => void
}

const useLocalStorage = (key: string, initialValue: any) => {
  const [state, setState] = useState(() => {
    try {
      const value = window.localStorage.getItem(key)
      return value ? JSON.parse(value) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const setValue = (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value
      setState(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.log(error)
    }
  }

  return [state, setValue]
}

export function BookmarkCard({ id, title, description, url, onEdit, onDelete }: BookmarkCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const [editedDescription, setEditedDescription] = useState(description)
  const [editedUrl, setEditedUrl] = useState(url)

  const handleSave = () => {
    onEdit(id, { title: editedTitle, description: editedDescription, url: editedUrl })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTitle(title)
    setEditedDescription(description)
    setEditedUrl(url)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <Input 
            value={editedTitle} 
            onChange={(e) => setEditedTitle(e.target.value)} 
            placeholder="网站标题"
          />
        </CardHeader>
        <CardContent>
          <Textarea 
            value={editedDescription} 
            onChange={(e) => setEditedDescription(e.target.value)} 
            placeholder="网站描述"
            className="mb-2"
          />
          <Input 
            value={editedUrl} 
            onChange={(e) => setEditedUrl(e.target.value)} 
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
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {url}
        </a>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => setIsEditing(true)}>编辑</Button>
        <Button onClick={() => onDelete(id)}>删除</Button>
      </CardFooter>
    </Card>
  )
}
