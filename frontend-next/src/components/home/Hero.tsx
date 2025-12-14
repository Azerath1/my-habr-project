import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-32">
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative container mx-auto text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
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
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Начать сейчас
            </Button>
          </Link>
          <Link href="/articles">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-black hover:bg-white/20"
            >
              Посмотреть статьи
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-background to-transparent"></div>
    </section>
  );
}
