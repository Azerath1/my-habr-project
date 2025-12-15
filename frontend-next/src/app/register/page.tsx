// frontend-next/src/app/register/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";

export default function Register() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      alert("Регистрация успешна! Теперь войдите.");
      router.push("/");
    } catch (error: unknown) {
      let message = "Неизвестная ошибка";
      if (error instanceof Error) message = error.message;
      alert("Ошибка регистрации: " + message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Имя пользователя</Label>
          <Input
            id="username"
            name="username"
            type="text"
            required
            minLength={3}
            maxLength={50}
          />
        </div>
        <div>
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            maxLength={100}
          />
        </div>
        <Button type="submit" className="w-full">
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
}
