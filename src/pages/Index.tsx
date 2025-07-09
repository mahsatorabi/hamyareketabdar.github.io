import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, LogOut, User, Check, X } from 'lucide-react';
import AddBookForm from '@/components/AddBookForm';
import BookCard from '@/components/BookCard';
import SearchBar from '@/components/SearchBar';
import LoginForm from '@/components/LoginForm';
import NeedsManagement from '@/components/NeedsManagement';
import AddNeedForm from '@/components/AddNeedForm';
import DonationRequestForm from '@/components/DonationRequestForm';
import { toast } from "sonner";
import { usePageState } from "../hooks/usePageState";

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

interface DonationRequest {
  id: string;
  title: string;
  author: string;
  description: string;
  contact: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const Index = () => {
  const [user, setUser] = useState<{ username: string; role: 'librarian' | 'guest' } | null>(null);
  // Firestore-backed states
  const { state: books, setState: setBooks, loading: booksLoading } = usePageState<Book[]>("books", { name: user?.username ?? "unknown", email: "unknown@example.com" });
  const { state: needs, setState: setNeeds, loading: needsLoading } = usePageState<CollectionNeed[]>("needs", { name: user?.username ?? "unknown", email: "unknown@example.com" });
  const { state: donationRequests, setState: setDonationRequests, loading: donationLoading } = usePageState<DonationRequest[]>("donationRequests", { name: user?.username ?? "unknown", email: "unknown@example.com" });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showNeedsForm, setShowNeedsForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeTab, setActiveTab] = useState<'books' | 'needs' | 'donations'>('books');

  // Remove fetchAllData and localStorage usage

  const handleLogin = (username: string, password: string) => {
    if (username === 'ketab' && password === '1234') {
      setUser({ username, role: 'librarian' });
      return true;
    } else if (username === 'guest' && password === 'guest') {
      setUser({ username, role: 'guest' });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setUser(null);
  };

  const filteredBooks = (books || []).filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
    book.publisher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNeeds = (needs || []).filter(need => 
    need.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    need.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (need.publisher && need.publisher.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // CRUD for Books
  const addBook = (bookData: Omit<Book, 'id' | 'createdAt'>) => {
    const newBook = { ...bookData, id: Date.now().toString(), createdAt: new Date() };
    const updatedBooks = [...(books || []), newBook];
    setBooks(updatedBooks);
    setShowAddForm(false);
  };

  const updateBook = (bookData: Omit<Book, 'id' | 'createdAt'>) => {
    if (selectedBook) {
      const updatedBooks = (books || []).map(b => b.id === selectedBook.id ? { ...b, ...bookData } : b);
      setBooks(updatedBooks);
      setSelectedBook(null);
      setShowAddForm(false);
    }
  };

  const deleteBook = (bookId: string) => {
    const updatedBooks = (books || []).filter(b => b.id !== bookId);
    setBooks(updatedBooks);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setShowAddForm(true);
  };

  // CRUD for Needs
  const addNeed = (needData: Omit<CollectionNeed, 'id' | 'createdAt'>) => {
    const newNeed = { ...needData, id: Date.now().toString(), createdAt: new Date() };
    const updatedNeeds = [...(needs || []), newNeed];
    setNeeds(updatedNeeds);
    setShowNeedsForm(false);
  };

  const deleteNeed = (needId: string) => {
    const updatedNeeds = (needs || []).filter(n => n.id !== needId);
    setNeeds(updatedNeeds);
  };

  // CRUD for Donation Requests
  const addDonationRequest = ({ title, author, description, contact }: Omit<DonationRequest, 'id' | 'status' | 'createdAt'>) => {
    const newRequest = {
      id: Date.now().toString(),
      title,
      author,
      description,
      contact,
      status: 'pending',
      createdAt: new Date()
    };
    const updatedRequests = [...(donationRequests || []), newRequest];
    setDonationRequests(updatedRequests);
    toast.success('درخواست شما ثبت شد و پس از تایید کتابدار نمایش داده خواهد شد.');
  };

  const approveDonationRequest = (id: string) => {
    const updatedRequests = (donationRequests || []).map(req => req.id === id ? { ...req, status: 'approved' } : req);
    setDonationRequests(updatedRequests);
    toast.success('درخواست تایید شد.');
  };

  const rejectDonationRequest = (id: string) => {
    const updatedRequests = (donationRequests || []).map(req => req.id === id ? { ...req, status: 'rejected' } : req);
    setDonationRequests(updatedRequests);
    toast.error('درخواست رد شد.');
  };

  const totalBooks = (books || []).reduce((sum, book) => sum + book.quantity, 0);

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (booksLoading || needsLoading || donationLoading) {
    return <div>در حال بارگذاری اطلاعات...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">همیار کتابدار</h1>
                <p className="text-sm text-muted-foreground">کاری از تیم کتاب‌بیس</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user.username} ({user.role === 'librarian' ? 'کتابدار' : 'مهمان'})</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => {}} className="ml-2">
                به‌روزرسانی
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'books' ? 'default' : 'outline'}
            onClick={() => setActiveTab('books')}
          >
            مجموعه کتاب‌ها
          </Button>
          <Button
            variant={activeTab === 'needs' ? 'default' : 'outline'}
            onClick={() => setActiveTab('needs')}
          >
            نیازهای مجموعه
          </Button>
          <Button
            variant={activeTab === 'donations' ? 'default' : 'outline'}
            onClick={() => setActiveTab('donations')}
          >
            درخواست اهدا
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {activeTab === 'books' ? (books || []).length : (needs || []).length}
              </div>
              <div className="text-sm text-muted-foreground">
                {activeTab === 'books' ? 'عنوان کتاب' : 'نیاز ثبت شده'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent">
                {activeTab === 'books' ? totalBooks : (needs || []).filter(n => n.priority === 'high').length}
              </div>
              <div className="text-sm text-muted-foreground">
                {activeTab === 'books' ? 'مجموع نسخه‌ها' : 'اولویت بالا'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        {user.role === 'librarian' && (
          <div className="flex gap-2">
            {activeTab === 'books' ? (
              <Button 
                onClick={() => {
                  setSelectedBook(null);
                  setShowAddForm(true);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                افزودن کتاب
              </Button>
            ) : (
              <Button 
                onClick={() => setShowNeedsForm(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                افزودن نیاز
              </Button>
            )}
          </div>
        )}

        {/* Search */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'books' ? (
            filteredBooks.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'کتابی با این مشخصات یافت نشد' : 'هنوز کتابی اضافه نکرده‌اید'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredBooks.map(book => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onEdit={user.role === 'librarian' ? handleEditBook : undefined}
                  onDelete={user.role === 'librarian' ? deleteBook : undefined}
                />
              ))
            )
          ) : activeTab === 'needs' ? (
            <NeedsManagement 
              needs={filteredNeeds}
              onDelete={user.role === 'librarian' ? deleteNeed : undefined}
            />
          ) : (
            <div>
              {user.role === 'guest' && (
                <DonationRequestForm
                  onSubmit={addDonationRequest}
                />
              )}
              <div className="space-y-4 mt-6">
                {(user.role === 'librarian'
                  ? (donationRequests || [])
                  : (donationRequests || []).filter(req => req.status === 'approved')
                ).length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {searchTerm ? 'درخواستی با این مشخصات یافت نشد' : 'هنوز درخواستی اضافه نشده است'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  ((user.role === 'librarian'
                    ? (donationRequests || [])
                    : (donationRequests || []).filter(req => req.status === 'approved')
                  )).map(req => (
                    <Card key={req.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{req.title}</CardTitle>
                        <div className="flex items-center text-xs text-muted-foreground">
                          {req.status === 'pending' ? (
                            <Badge className="bg-yellow-500 text-xs">در انتظار تصدیق</Badge>
                          ) : req.status === 'approved' ? (
                            <Badge className="bg-green-500 text-xs">تصدیق شده</Badge>
                          ) : (
                            <Badge className="bg-red-500 text-xs">رد شده</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-2 text-sm">نویسنده: {req.author}</div>
                        {req.description && <div className="mb-2 text-sm">توضیحات: {req.description}</div>}
                        <div className="mb-2 text-xs text-muted-foreground">اطلاعات تماس: {req.contact}</div>
                        <div className="mb-2 text-xs text-muted-foreground">تاریخ ثبت: {new Date(req.createdAt).toLocaleDateString('fa-IR')}</div>
                        {user.role === 'librarian' && req.status === 'pending' && (
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="default" onClick={() => approveDonationRequest(req.id)}>
                              <Check className="h-4 w-4" /> تایید
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => rejectDonationRequest(req.id)}>
                              <X className="h-4 w-4" /> رد
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Book Form Modal */}
      {showAddForm && user.role === 'librarian' && (
        <AddBookForm
          book={selectedBook}
          onSubmit={selectedBook ? updateBook : addBook}
          onCancel={() => {
            setShowAddForm(false);
            setSelectedBook(null);
          }}
        />
      )}

      {/* Add Need Form Modal */}
      {showNeedsForm && user.role === 'librarian' && (
        <AddNeedForm
          onSubmit={addNeed}
          onCancel={() => setShowNeedsForm(false)}
        />
      )}
    </div>
  );
};

export default Index;