import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
interface Collection {
  id: string;
  name: string;
}

interface CollectionManagerProps {
  collections: Collection[];
  onAddCollection: (name: string) => void;
  onDeleteCollection: (id: string) => void;
  onEditCollection: (id: string, newName: string) => void;
}

export function CollectionManager({ collections, onAddCollection, onDeleteCollection, onEditCollection }: CollectionManagerProps) {
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleAddCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      onAddCollection(newCollectionName.trim());
      setNewCollectionName('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">管理集合</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>管理集合</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddCollection} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newCollection">新集合名称</Label>
            <Input
              id="newCollection"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="输入新集合名称"
            />
          </div>
          <Button type="submit">添加集合</Button>
        </form>
        <div className="mt-4 space-y-2">
          {collections.map((collection) => (
            <div key={collection.id} className="flex items-center justify-between">
              <span>{collection.name}</span>
              <div>
                <Button variant="outline" size="sm" onClick={() => onEditCollection(collection.id, collection.name)}>编辑</Button>
                <Button variant="destructive" size="sm" onClick={() => onDeleteCollection(collection.id)}>删除</Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}