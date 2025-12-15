// src/components/home/Footer.tsx - улучшенный
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-background border-t py-12 text-muted-foreground">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4 text-foreground">
            Simple Habr
          </h3>
          <p>Платформа для блогов и обмена знаниями.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-foreground">Навигация</h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Главная
              </Link>
            </li>
            <li>
              <Link
                href="/articles"
                className="hover:text-foreground transition-colors"
              >
                Статьи
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-foreground transition-colors"
              >
                О проекте
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-foreground">Сообщество</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-foreground transition-colors">
                GitHub
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground transition-colors">
                Telegram
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-foreground">Поддержка</h4>
          <p>© 2025 Simple Habr. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
