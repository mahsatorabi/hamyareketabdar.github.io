import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, User, Lock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLogin: (username: string, password: string) => boolean;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = onLogin(username, password);
    
    if (!success) {
      toast({
        title: "خطا",
        description: "نام کاربری یا رمز عبور اشتباه است",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleGuestLogin = () => {
    onLogin('guest', 'guest');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">همیار کتابدار</CardTitle>
          <p className="text-muted-foreground">کاری از تیم کتاب‌بیس</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">نام کاربری</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="نام کاربری خود را وارد کنید"
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="رمز عبور خود را وارد کنید"
                  className="pr-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'در حال ورود...' : 'ورود به عنوان کتابدار'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">یا</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGuestLogin}
          >
            ورود به عنوان مهمان
          </Button>

            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>مهمان: فقط مشاهده و جستجو</p>
              <p>ایمیل پشتیبانی: <a href="mailto:ketabbase@gmail.com" className="underline">ketabbase@gmail.com</a></p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;