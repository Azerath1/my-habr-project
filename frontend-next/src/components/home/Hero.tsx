// src/components/home/Hero.tsx - улучшенный дизайн
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-primary to-primary-foreground text-foreground py-32 rounded-xl shadow-2xl">
      <div className="absolute inset-0 bg-background/10 backdrop-blur-sm"></div>
      <div className="relative container mx-auto text-center px-4 animate-fadeIn">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Simple Habr — Твой блог для знаний
        </h1>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
          Пиши статьи, делись опытом и вдохновляй сообщество. Простой, быстрый и
          безопасный.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="hover:scale-105 transition-transform"
            >
              Начать сейчас
            </Button>
          </Link>
          <Link href="/articles">
            <Button
              size="lg"
              variant="outline"
              className="hover:scale-105 transition-transform"
            >
              Посмотреть статьи
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
