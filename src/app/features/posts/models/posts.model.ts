export interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
  created_at: string;
}

export interface PostUser {
  id: number;
  user_id: number;
  title: string;
  body: string;
  created_at: string;
  author_name: string;
}
