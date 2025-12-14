// src/app/profile/page.tsx (новая страница профиля)
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiFetch } from "@/lib/api";

interface Article {
  id: number;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: number;
  username: string;
  created_at: string;
  // Если backend вернёт больше данных — добавь
}

export default function Profile() {
  const { isAuthenticated, username } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setProfileError(null);

        // Пока мокаем user (потом можно будет заменить на реальный запрос)
        setUser({
          id: 1,
          username: username || "",
          created_at: new Date().toISOString(),
        });

        const allArticles = await apiFetch<Article[]>("/articles");
        const userArticles = allArticles.filter(
          (art) => art.author_name === username
        );
        setArticles(userArticles);
      } catch (error: unknown) {
        // Используем переменную error
        let errorMessage = "Ошибка загрузки профиля";

        if (error instanceof Error) {
          errorMessage = `${errorMessage}: ${error.message}`;
        } else if (typeof error === "string") {
          errorMessage = `${errorMessage}: ${error}`;
        }

        console.error("Ошибка загрузки профиля:", error);
        setProfileError(errorMessage);

        // Показать пользователю ошибку через UI, а не alert
        // (или использовать toast уведомление)
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, router, username]);

  if (loading) return <p className="text-center mt-10">Загрузка...</p>;

  return (
    <div className="container mx-auto mt-10">
      {profileError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{profileError}</p>
        </div>
      )}

      <div className="flex items-center space-x-4 mb-8">
        <Avatar className="w-20 h-20">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${username}`}
          />
          <AvatarFallback>{username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{username}</h1>
          <p className="text-gray-500">
            Зарегистрирован:{" "}
            {new Date(user?.created_at || "").toLocaleDateString()}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Мои статьи</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.length > 0 ? (
          articles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{article.content.substring(0, 150)}...</p>
                <p className="text-sm text-gray-500">
                  Создано: {new Date(article.created_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <p className="text-center text-gray-500 py-8">
              У вас пока нет статей.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
