// frontend-next/src/app/articles/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface Article {
  id: number;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    apiFetch<Article[]>("/articles")
      .then(setArticles)
      .catch((error) =>
        alert("Ошибка загрузки статей: " + (error as Error).message)
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Загрузка...</p>;

  return (
    <div>
      {isAuthenticated && (
        <Button onClick={() => router.push("/create-article")} className="mb-4">
          Создать статью
        </Button>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{article.content.substring(0, 150)}...</p>
              <p className="text-sm text-gray-500">
                Автор: {article.author_name} |{" "}
                {new Date(article.created_at).toLocaleString()}
              </p>
              <Link href={`/articles/${article.id}`}>
                <Button variant="link">Подробнее</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
