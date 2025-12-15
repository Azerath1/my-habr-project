// src/app/page.tsx - улучшенный, с анимациями и лучшим UX
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import CallToAction from "@/components/home/CallToAction";

export default function Home() {
  return (
    <div className="space-y-12">
      {" "}
      {/* Добавили spacing для секций */}
      <Hero />
      <Features />
      <CallToAction />
    </div>
  );
}
