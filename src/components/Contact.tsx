import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "پیام ارسال شد",
        description: "پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در ارسال پیام پیش آمد. لطفا دوباره تلاش کنید.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            تماس با ما
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            سوال، پیشنهاد یا نیاز به راهنمایی دارید؟ با ما در ارتباط باشید
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                اطلاعات تماس
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">ایمیل</div>
                    <div className="text-muted-foreground">info@ketabhedie.ir</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">تلفن پشتیبانی</div>
                    <div className="text-muted-foreground">021-12345678</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">آدرس</div>
                    <div className="text-muted-foreground">تهران، خیابان ولیعصر، پلاک 123</div>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-6 bg-gradient-hero">
              <h4 className="text-lg font-semibold mb-3">ساعات کاری</h4>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>شنبه تا چهارشنبه</span>
                  <span>9:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>پنج‌شنبه</span>
                  <span>9:00 - 13:00</span>
                </div>
                <div className="flex justify-between">
                  <span>جمعه</span>
                  <span>تعطیل</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              پیام خود را ارسال کنید
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-right">
                  نام و نام خانوادگی *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="نام شما"
                  required
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-right">
                  ایمیل *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="text-left"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-right">
                  موضوع *
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="موضوع پیام شما"
                  required
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-right">
                  پیام *
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="متن پیام خود را بنویسید..."
                  required
                  className="text-right min-h-[120px]"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "در حال ارسال..."
                ) : (
                  <>
                    <Send className="ml-2 h-4 w-4" />
                    ارسال پیام
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;