import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera as CameraIcon, X, Plus, Minus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Book {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  publishYear: number;
  quantity: number;
  coverImage?: string;
  createdAt: Date;
}

interface AddBookFormProps {
  book?: Book | null;
  onSubmit: (bookData: Omit<Book, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AddBookForm = ({ book, onSubmit, onCancel }: AddBookFormProps) => {
  const [title, setTitle] = useState(book?.title || '');
  const [authors, setAuthors] = useState<string[]>(book?.authors || ['']);
  const [publisher, setPublisher] = useState(book?.publisher || '');
  const [publishYear, setPublishYear] = useState(book?.publishYear || new Date().getFullYear());
  const [quantity, setQuantity] = useState(book?.quantity || 1);
  const [coverImage, setCoverImage] = useState(book?.coverImage || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // گرفتن عکس با دوربین
  const takePicture = async () => {
    try {
      setIsLoading(true);
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      setCoverImage(image.dataUrl || '');
      toast({
        title: "موفق",
        description: "عکس جلد کتاب ثبت شد",
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در گرفتن عکس پیش آمد",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // انتخاب عکس از فایل سیستم
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCoverImage(ev.target?.result as string);
      toast({
        title: "موفق",
        description: "عکس جلد کتاب انتخاب شد",
      });
    };
    reader.readAsDataURL(file);
  };

  const addAuthor = () => {
    setAuthors([...authors, '']);
  };

  const removeAuthor = (index: number) => {
    if (authors.length > 1) {
      setAuthors(authors.filter((_, i) => i !== index));
    }
  };

  const updateAuthor = (index: number, value: string) => {
    const updatedAuthors = [...authors];
    updatedAuthors[index] = value;
    setAuthors(updatedAuthors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "خطا",
        description: "نام کتاب الزامی است",
        variant: "destructive",
      });
      return;
    }

    const validAuthors = authors.filter(author => author.trim());
    if (validAuthors.length === 0) {
      toast({
        title: "خطا",
        description: "حداقل یک نویسنده الزامی است",
        variant: "destructive",
      });
      return;
    }

    const bookData = {
      title: title.trim(),
      authors: validAuthors,
      publisher: publisher.trim(),
      publishYear,
      quantity,
      coverImage,
    };

    onSubmit(bookData);

    toast({
      title: "موفق",
      description: book ? "کتاب بروزرسانی شد" : "کتاب اضافه شد",
    });

    if (!book) {
      setTitle('');
      setAuthors(['']);
      setPublisher('');
      setPublishYear(new Date().getFullYear());
      setQuantity(1);
      setCoverImage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{book ? 'ویرایش کتاب' : 'افزودن کتاب جدید'}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Cover Image */}
            <div className="space-y-2">
              <Label>جلد کتاب</Label>
              {coverImage ? (
                <div className="relative">
                  <img 
                    src={coverImage} 
                    alt="جلد کتاب" 
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setCoverImage('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-32 border-dashed"
                    onClick={takePicture}
                    disabled={isLoading}
                  >
                    <div className="text-center">
                      <CameraIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {isLoading ? 'در حال گرفتن عکس...' : 'عکس جلد کتاب بگیرید'}
                      </p>
                    </div>
                  </Button>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">نام کتاب *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="نام کتاب را وارد کنید"
                required
              />
            </div>

            {/* Authors */}
            <div className="space-y-2">
              <Label>نویسنده‌ها *</Label>
              {authors.map((author, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={author}
                    onChange={(e) => updateAuthor(index, e.target.value)}
                    placeholder="نام نویسنده"
                    required
                  />
                  {authors.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeAuthor(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAuthor}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                افزودن نویسنده
              </Button>
            </div>

            {/* Publisher */}
            <div className="space-y-2">
              <Label htmlFor="publisher">ناشر</Label>
              <Input
                id="publisher"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="نام ناشر"
              />
            </div>

            {/* Publish Year */}
            <div className="space-y-2">
              <Label htmlFor="publishYear">سال انتشار</Label>
              <Input
                id="publishYear"
                type="number"
                value={publishYear}
                onChange={(e) => setPublishYear(Number(e.target.value))}
                placeholder="سال انتشار"
                min="1000"
                max={new Date().getFullYear()}
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">تعداد</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                انصراف
              </Button>
              <Button type="submit">
                {book ? 'ذخیره تغییرات' : 'افزودن کتاب'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBookForm;
