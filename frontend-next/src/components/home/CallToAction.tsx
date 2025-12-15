// src/components/home/CallToAction.tsx - улучшенный
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-20 bg-accent/20 rounded-lg">
      <div className="container mx-auto text-center px-4 animate-fadeIn">
        <h2 className="text-4xl font-bold mb-6">Готов делиться знаниями?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Присоединяйся к тысячам авторов и читателей уже сегодня.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="hover:scale-105 transition-transform">
              Регистрация бесплатно
            </Button>
          </Link>
          <Link href="/articles">
            <Button
              size="lg"
              variant="secondary"
              className="hover:scale-105 transition-transform"
            >
              Читать статьи
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
