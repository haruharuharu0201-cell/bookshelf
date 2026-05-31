import { Post } from "@/lib/types";
import BookCard from "./BookCard";

type Props = {
  posts: Post[];
  emptyMessage?: string;
};

export default function BookGrid({ posts, emptyMessage = "まだ投稿がありません" }: Props) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <span className="text-7xl mb-4">📚</span>
        <p className="text-lg font-medium text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {posts.map((post) => (
        <BookCard key={post.id} post={post} />
      ))}
    </div>
  );
}
