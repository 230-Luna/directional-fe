export type Category = 'NOTICE' | 'QNA' | 'FREE'

export interface PostContent {
  title: string
  body: string
  category: Category
  tags: string[]
}

export interface Post extends PostContent {
  id: string
  userId: string
  createdAt: string
}
