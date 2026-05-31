export type Post = {
  id: string
  nickname: string
  amazon_url: string
  title: string
  author: string | null
  cover_image_url: string | null
  review: string
  learnings: string | null
  created_at: string
  likes_count?: number
  comments_count?: number
}

export type Like = {
  id: string
  post_id: string
  nickname: string
  created_at: string
}

export type Comment = {
  id: string
  post_id: string
  nickname: string
  content: string
  created_at: string
}

export type BookInfo = {
  title: string
  author: string
  coverImageUrl: string
}
