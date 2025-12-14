import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import CallToAction from "@/components/home/CallToAction";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <CallToAction />
      {/* Footer теперь в layout.tsx, если хочешь глобальный */}
    </>
  );
}
