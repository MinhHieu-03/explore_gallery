export type Photo = {
  id: string;
  title: string;
  src: string;
  category: string;
  likes: number;
  createdAt: string;
  tags?: string[];
  author?: string;
  description?: string;
};

export const CATEGORIES = ["Nature", "City", "People", "Food", "Animals"];

export const mockData: Photo[] = Array.from({ length: 60 }).map((_, i) => {
  const cat = CATEGORIES[i % CATEGORIES.length];
  return {
    id: String(i + 1),
    title: `${cat} photo ${i + 1}`,
    src: `https://picsum.photos/seed/${i}/600/400`,
    category: cat,
    likes: Math.floor(Math.random() * 500),
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    tags: [`#${cat.toLowerCase()}`, "#photo", "#mock"],
    author: `Author ${(i % 10) + 1}`,
    description: `This is a beautiful ${cat.toLowerCase()} photo taken recently.`,
  };
});
