import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LeaveType } from '@/enums/leaveType';
import { Plus } from 'lucide-react';

interface HeaderProps {
  t: any;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  rangeStart: string | null;
  rangeEnd: string | null;
  setRangeStart: (val: string | null) => void;
  setRangeEnd: (val: string | null) => void;
  leaveType: string;
  setLeaveType: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  documents: File[];
  setDocuments: (files: File[]) => void;
  onSubmitLeave: () => Promise<void>;
  isSubmitting: boolean;
}

export function TimeOffHeader({
  t,
  isDialogOpen,
  setIsDialogOpen,
  rangeStart,
  rangeEnd,
  setRangeStart,
  setRangeEnd,
  leaveType,
  setLeaveType,
  description,
  setDescription,
  documents,
  setDocuments,
  onSubmitLeave,
  isSubmitting,
}: HeaderProps) {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await onSubmitLeave();
    } catch {
      // Hook already reports the error with a toast.
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{t('dashboard.sidebar.sections.timeOff')}</h2>
        <p className="text-sm text-muted-foreground">Tüm izin süreçlerinizi, ekip çakışmalarını ve takvimi tek bir ekrandan yönetin.</p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 shadow-sm cursor-pointer" onClick={() => setIsDialogOpen(true)}>
            <Plus className="size-4" /> Yeni İzin Talebi
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>İzin Talebi Oluştur</DialogTitle>
            <DialogDescription>
              Tarih aralığı seçerken takvimdeki çakışmaları göz önünde bulundurabilirsiniz.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Başlangıç Tarihi <span className="text-destructive">*</span></Label>
                <Input
                  id="startDate"
                  type="date"
                  value={rangeStart || ""}
                  onChange={(e) => setRangeStart(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Bitiş Tarihi <span className="text-destructive">*</span></Label>
                <Input
                  id="endDate"
                  type="date"
                  value={rangeEnd || ""}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leaveType">İzin Tipi <span className="text-destructive">*</span></Label>
              <Select value={leaveType} onValueChange={setLeaveType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Bir izin tipi seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={LeaveType.Annual.toString()}>Yıllık İzin</SelectItem>
                  <SelectItem value={LeaveType.Sick.toString()}>Hastalık İzni</SelectItem>
                  <SelectItem value={LeaveType.Excuse.toString()}>Mazeret İzni</SelectItem>
                  <SelectItem value={LeaveType.Unpaid.toString()}>Ücretsiz İzin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama (İsteğe Bağlı)</Label>
              <Textarea
                id="description"
                placeholder="İzin talebinizle ilgili eklemek istedikleriniz..."
                className="resize-none"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documents">Ekler (İsteğe Bağlı)</Label>
              <Input
                id="documents"
                type="file"
                multiple
                onChange={(e) => setDocuments(Array.from(e.target.files ?? []))}
              />
              {documents.length > 0 && (
                <div className="rounded-sm border border-border bg-muted/20 p-3 text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">Seçilen dosyalar</p>
                  <ul className="space-y-1">
                    {documents.map((file) => (
                      <li key={`${file.name}-${file.size}`}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>İptal</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Gönderiliyor...' : 'Talep Oluştur'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}