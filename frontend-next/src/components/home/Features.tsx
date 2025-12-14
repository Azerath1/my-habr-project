import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Users, Shield } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Sparkles,
      title: "Интуитивно и просто",
      description:
        "Создавай статьи за минуты без сложных настроек. Фокус на контенте.",
      color: "text-blue-600",
    },
    {
      icon: Users,
      title: "Живое сообщество",
      description: "Читай, комментируй и обсуждай статьи с единомышленниками.",
      color: "text-purple-600",
    },
    {
      icon: Shield,
      title: "Безопасность на первом месте",
      description:
        "Современная аутентификация и защита данных. Твои статьи в надёжных руках.",
      color: "text-indigo-600",
    },
  ];

  return (
    <section className="py-20 container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-12">
        Почему выбирают Simple Habr?
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="text-center">
              <feature.icon
                className={`w-12 h-12 mx-auto mb-4 ${feature.color}`}
              />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
