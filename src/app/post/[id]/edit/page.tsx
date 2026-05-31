export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import EditForm from "@/components/EditForm";
import Link from "next/link";

async function getPost(id: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) notFound();

  return (
    <div className="max-w-xl mx-auto">
      <Link
        href={`/post/${id}`}
        className="text-sm text-amber-700 hover:text-amber-900 mb-6 inline-flex items-center gap-1"
      >
        ← 投稿に戻る
      </Link>
      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">投稿を編集する</h1>
        <p className="text-sm text-gray-500 mt-1">{post.title}</p>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <EditForm post={post} />
      </div>
    </div>
  );
}
