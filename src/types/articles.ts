export type DBArticlesRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail_url: string | null;
  category_id: string;
  author_id: string;
  is_published: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type articles = DBArticlesRow;
