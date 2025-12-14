// src/app/login/page.tsx (переход на главную + setUser)
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface LoginResponse {
  access_token: string;
  username: string;
}

export default function Login() {
  const router = useRouter();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const data = await apiFetch<LoginResponse>("/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`,
      });
      setUser(data.access_token, data.username); // ← Сохраняем username
      alert("Вход успешен!");
      router.push("/"); // ← Переход на главную
    } catch (error: unknown) {
      let message = "Неизвестная ошибка";
      if (error instanceof Error) message = error.message;
      alert("Ошибка входа: " + message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Вход</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Имя пользователя</Label>
          <Input id="username" name="username" type="text" required />
        </div>
        <div>
          <Label htmlFor="password">Пароль</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Войти
        </Button>
      </form>
    </div>
  );
}
