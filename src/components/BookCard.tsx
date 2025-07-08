import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, User, Building } from 'lucide-react';

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

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: string) => void;
}

const BookCard = ({ book, onEdit, onDelete }: BookCardProps) => {
  return (
    <Card className="hover:shadow-elegant transition-smooth">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Cover Image */}
          <div className="flex-shrink-0">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-16 h-20 object-cover rounded-md border"
              />
            ) : (
              <div className="w-16 h-20 bg-muted rounded-md border flex items-center justify-center">
                <span className="text-xs text-muted-foreground text-center">بدون جلد</span>
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground truncate ml-2">
                {book.title}
              </h3>
              <Badge variant="secondary" className="flex-shrink-0">
                {book.quantity} نسخه
              </Badge>
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span className="truncate">{book.authors.join('، ')}</span>
              </div>
              
              {book.publisher && (
                <div className="flex items-center gap-2">
                  <Building className="h-3 w-3" />
                  <span className="truncate">{book.publisher}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>{book.publishYear}</span>
              </div>
            </div>

            {/* Action Buttons - Only show for librarians */}
            {(onEdit || onDelete) && (
              <div className="flex gap-2 mt-3">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(book)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    ویرایش
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(book.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;