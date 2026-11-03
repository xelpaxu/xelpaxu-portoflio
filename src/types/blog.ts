export interface BlogNode {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  content?: BlogNode[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  coverAlt?: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  content: BlogNode;
}
