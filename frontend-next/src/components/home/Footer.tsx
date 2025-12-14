import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-card border-t py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4">Simple Habr</h3>
          <p className="text-muted-foreground">
            Платформа для блогов и обмена знаниями.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Навигация</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                Главная
              </Link>
            </li>
            <li>
              <Link href="/articles" className="hover:text-foreground">
                Статьи
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-foreground">
                О проекте
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Сообщество</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a href="#" className="hover:text-foreground">
                GitHub
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-foreground">
                Telegram
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Поддержка</h4>
          <p className="text-muted-foreground">
            © 2025 Simple Habr. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
