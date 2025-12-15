// frontend-next/src/app/profile/page.tsx
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
}

export default function Profile() {
  const { isAuthenticated, username } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userData = await apiFetch<UserProfile>("/users/me");
        setUser(userData);

        const allArticles = await apiFetch<Article[]>("/articles");
        const userArticles = allArticles.filter(
          (art) => art.author_name === username
        );
        setArticles(userArticles);
      } catch (error: unknown) {
        alert("Ошибка загрузки профиля");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, router, username]);

  if (loading) return <p className="text-center mt-10">Загрузка...</p>;

  return (
    <div className="container mx-auto mt-10">
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
          <p>У вас пока нет статей.</p>
        )}
      </div>
    </div>
  );
}
