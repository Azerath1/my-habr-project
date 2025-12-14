"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, PenTool, LogOut, User, Home, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

// === ВЫНЕСЕННЫЕ КОМПОНЕНТЫ ===

// Мобильное меню (Sheet)
function MobileMenu() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Главная", icon: Home },
    { href: "/articles", label: "Статьи", icon: BookOpen },
    ...(isAuthenticated
      ? [
          { href: "/create-article", label: "Написать", icon: PenTool },
          { href: "/profile", label: "Профиль", icon: User },
        ]
      : []),
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Открыть меню</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <div className="flex flex-col space-y-4 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          {!isAuthenticated ? (
            <>
              <Link href="/login">
                <Button className="w-full">Войти</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="w-full">
                  Регистрация
                </Button>
              </Link>
            </>
          ) : (
            <Button variant="destructive" onClick={logout} className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Десктопный профиль с Dropdown
function DesktopProfile() {
  const { username, logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-3 hover:bg-muted px-3 py-2 rounded-full"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${username}&backgroundColor=3b82f6`}
              alt={username || ""}
            />
            <AvatarFallback>{username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="hidden lg:inline-block font-medium">{username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Профиль
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/create-article" className="flex items-center">
            <PenTool className="mr-2 h-4 w-4" />
            Написать статью
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={logout}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// === ОСНОВНОЙ КОМПОНЕНТ HEADER ===
export default function Header() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Главная", icon: Home },
    { href: "/articles", label: "Статьи", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Логотип */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="text-2xl font-bold text-primary">Simple Habr</div>
        </Link>

        {/* Десктопная навигация */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
          {isAuthenticated && (
            <>
              <Link
                href="/create-article"
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/create-article"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <PenTool className="h-4 w-4" />
                <span>Написать</span>
              </Link>
              <Link
                href="/profile"
                className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/profile"
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <User className="h-4 w-4" />
                <span>Профиль</span>
              </Link>
            </>
          )}
        </nav>

        {/* Правая часть */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link href="/login" className="hidden md:inline-block">
                <Button variant="ghost">Войти</Button>
              </Link>
              <Link href="/register" className="hidden md:inline-block">
                <Button>Регистрация</Button>
              </Link>
            </>
          ) : (
            <DesktopProfile />
          )}

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
