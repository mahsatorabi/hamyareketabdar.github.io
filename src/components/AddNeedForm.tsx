import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Minus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
const API_URL = "http://localhost:3001/api/needs";

interface CollectionNeed {
  id: string;
  title: string;
  authors: string[];
  publisher?: string;
  publishYear?: number;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  createdAt: Date;
}

interface AddNeedFormProps {
  onSubmit: (needData: Omit<CollectionNeed, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AddNeedForm = ({ onSubmit, onCancel }: AddNeedFormProps) => {
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState<string[]>(['']);
  const [publisher, setPublisher] = useState('');
  const [publishYear, setPublishYear] = useState<number | ''>('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

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

    onSubmit({
      title: title.trim(),
      authors: validAuthors,
      publisher: publisher.trim() || undefined,
      publishYear: publishYear || undefined,
      priority,
      notes: notes.trim() || undefined,
    });

    toast({
      title: "موفق",
      description: "نیاز جدید اضافه شد",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>افزودن نیاز جدید</CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">نام کتاب *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="نام کتاب مورد نیاز"
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
                placeholder="نام ناشر (اختیاری)"
              />
            </div>

            {/* Publish Year */}
            <div className="space-y-2">
              <Label htmlFor="publishYear">سال انتشار</Label>
              <Input
                id="publishYear"
                type="number"
                value={publishYear}
                onChange={(e) => setPublishYear(e.target.value ? parseInt(e.target.value) : '')}
                placeholder="سال انتشار (اختیاری)"
                min="1000"
                max={new Date().getFullYear()}
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label>اولویت</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={priority === 'high' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriority('high')}
                  className="flex-1"
                >
                  بالا
                </Button>
                <Button
                  type="button"
                  variant={priority === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriority('medium')}
                  className="flex-1"
                >
                  متوسط
                </Button>
                <Button
                  type="button"
                  variant={priority === 'low' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriority('low')}
                  className="flex-1"
                >
                  پایین
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">یادداشت</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="توضیحات اضافی (اختیاری)"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                افزودن
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                انصراف
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNeedForm;