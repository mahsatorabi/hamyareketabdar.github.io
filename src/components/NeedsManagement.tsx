import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, User, Building, AlertCircle } from 'lucide-react';

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

interface NeedsManagementProps {
  needs: CollectionNeed[];
  onDelete?: (needId: string) => void;
}

const priorityColors = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200'
};

const priorityLabels = {
  high: 'بالا',
  medium: 'متوسط',
  low: 'پایین'
};

const NeedsManagement = ({ needs, onDelete }: NeedsManagementProps) => {
  if (needs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">هنوز نیازی ثبت نشده است</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {needs.map(need => (
        <Card key={need.id} className="hover:shadow-elegant transition-smooth">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-foreground">{need.title}</h3>
              <Badge 
                variant="outline" 
                className={priorityColors[need.priority]}
              >
                اولویت {priorityLabels[need.priority]}
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-2">
                <User className="h-3 w-3" />
                <span>{need.authors.join('، ')}</span>
              </div>
              
              {need.publisher && (
                <div className="flex items-center gap-2">
                  <Building className="h-3 w-3" />
                  <span>{need.publisher}</span>
                </div>
              )}
              
              {need.publishYear && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>{need.publishYear}</span>
                </div>
              )}
            </div>

            {need.notes && (
              <div className="bg-muted p-3 rounded-md mb-3">
                <p className="text-sm text-muted-foreground">{need.notes}</p>
              </div>
            )}

            {onDelete && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(need.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NeedsManagement;
