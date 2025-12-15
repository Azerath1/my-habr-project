// frontend-next/src/app/articles/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

interface Article {
  id: number;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Article>(`/articles/${id}`)
      .then(setArticle)
      .catch((error) =>
        alert("Ошибка загрузки статьи: " + (error as Error).message)
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Загрузка...</p>;
  if (!article) return <p>Статья не найдена.</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{article.content}</p>
        <p className="text-sm text-gray-500 mt-4">
          Автор: {article.author_name} | Создано:{" "}
          {new Date(article.created_at).toLocaleString()} | Обновлено:{" "}
          {new Date(article.updated_at).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
