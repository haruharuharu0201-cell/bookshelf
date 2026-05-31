import PostForm from "@/components/PostForm";

export default function NewPostPage() {
  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">本を投稿する</h1>
        <p className="text-sm text-gray-500 mt-1">
          読んだ本のAmazonリンクを貼って感想をシェアしましょう
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <PostForm />
      </div>
    </div>
  );
}
