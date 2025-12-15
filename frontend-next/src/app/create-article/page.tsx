// frontend-next/src/app/create-article/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";

export default function CreateArticle() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      alert("Вы не авторизованы. Перенаправляем на вход.");
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    try {
      await apiFetch("/articles", {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });
      alert("Статья создана!");
      router.push("/articles");
    } catch (error: unknown) {
      let message = "Неизвестная ошибка";
      if (error instanceof Error) message = error.message;
      alert("Ошибка создания статьи: " + message);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <Label htmlFor="title">Заголовок</Label>
        <Input
          id="title"
          name="title"
          type="text"
          required
          minLength={1}
          maxLength={200}
        />
      </div>
      <div>
        <Label htmlFor="content">Содержание</Label>
        <Textarea
          id="content"
          name="content"
          required
          minLength={10}
          className="h-40"
        />
      </div>
      <Button type="submit">Создать</Button>
    </form>
  );
}
