import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddBookmarkFormProps {
  onSubmit: (newBookmark: { title: string; description: string; url: string; categories: string[] }) => void;
}

export function AddBookmarkForm({ onSubmit }: AddBookmarkFormProps) {
  const [newBookmark, setNewBookmark] = useState({ title: '', description: '', url: '', categories: [] as string[] });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(newBookmark);
    setNewBookmark({ title: '', description: '', url: '', categories: [] });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
  );
}