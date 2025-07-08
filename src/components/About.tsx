import { Card } from "@/components/ui/card";
import { Heart, Users, BookOpen, Target } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "انسان‌دوستی",
      description: "ما معتقدیم که دسترسی به کتاب حق همه کودکان و نوجوانان است."
    },
    {
      icon: Users,
      title: "همکاری",
      description: "با کمک هم می‌توانیم تفاوت بزرگی در زندگی کسانی که به کتاب نیاز دارند ایجاد کنیم."
    },
    {
      icon: BookOpen,
      title: "آموزش",
      description: "کتاب پلی است که افراد را به دنیای دانش و خیال متصل می‌کند."
    },
    {
      icon: Target,
      title: "هدفمندی",
      description: "هر کتاب اهدایی به دست درست و نیازمند واقعی می‌رسد."
    }
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            درباره کتاب‌هدیه
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            کتاب‌هدیه پلتفرمی است که افراد خیرخواه را به مدارس، کتابخانه‌ها و موسسات نیازمند متصل می‌کند
            تا کتاب‌های دست‌دوم سالم به دست کسانی برسد که واقعاً به آن‌ها نیاز دارند.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-elegant transition-smooth">
              <div className="bg-gradient-primary rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <value.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {value.title}
              </h3>
              <p className="text-muted-foreground">
                {value.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="bg-card rounded-lg p-8 shadow-elegant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                چرا کتاب‌هدیه؟
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  هر ساله میلیون‌ها کتاب دست‌دوم در خانه‌ها بلااستفاده باقی می‌مانند، 
                  در حالی که بسیاری از مدارس و کتابخانه‌های کوچک به شدت به کتاب نیاز دارند.
                </p>
                <p>
                  کتاب‌هدیه این شکاف را پر می‌کند و راهی آسان و مطمئن برای 
                  اهدای کتاب‌های شما به نیازمندان واقعی فراهم می‌آورد.
                </p>
                <p>
                  با سیستم پیگیری و تأیید ما، مطمئن باشید که هدیه شما به دست درست می‌رسد.
                </p>
              </div>
            </div>
            <div className="bg-gradient-hero rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground mb-4">کتاب اهدا شده</div>
              <div className="text-4xl font-bold text-accent mb-2">50+</div>
              <div className="text-muted-foreground mb-4">موسسه ثبت‌شده</div>
              <div className="text-4xl font-bold text-primary-glow mb-2">200+</div>
              <div className="text-muted-foreground">اهداکننده فعال</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;