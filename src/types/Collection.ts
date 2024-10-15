export interface Bookmark {
  id: string;
  title: string;
  description: string;
  url: string;
  categories: string[];
  isBookmarked: boolean;
}

export interface Collection {
  id: string;
  name: string;
  bookmarkIds: string[];
}
