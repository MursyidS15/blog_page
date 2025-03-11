"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface BlogForm {
  title: string;
  content: string;
}

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState<BlogForm | null>(null);

  useEffect(() => {
    const savedArticle = sessionStorage.getItem(`article-${id}`);
    if (savedArticle) {
      setArticle(JSON.parse(savedArticle));
    }
  }, [id]);

  if (!article) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-green-700">{article.title}</h1>
      <p className="mt-4">{article.content}</p>
    </div>
  );
};

export default ArticleDetail;
