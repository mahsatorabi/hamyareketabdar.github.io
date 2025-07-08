import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DonationRequestFormProps {
  onSubmit: (data: { title: string; author: string; description: string; contact: string }) => void;
}

const DonationRequestForm = ({ onSubmit }: DonationRequestFormProps) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !contact) {
      setError("لطفاً همه فیلدهای ضروری را پر کنید.");
      return;
    }
    setError("");
    onSubmit({ title, author, description, contact });
    setTitle("");
    setAuthor("");
    setDescription("");
    setContact("");
  };

  return (
    <Card className="max-w-md mx-auto my-6">
      <CardHeader>
        <CardTitle>درخواست اهدا کتاب</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="نام کتاب *"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <Input
            placeholder="نویسنده *"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            required
          />
          <Input
            placeholder="توضیحات"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <Input
            placeholder="اطلاعات تماس *"
            value={contact}
            onChange={e => setContact(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full">ثبت درخواست</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DonationRequestForm; 