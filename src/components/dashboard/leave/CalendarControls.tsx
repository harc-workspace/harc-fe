import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

export interface CalendarControlsProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
}

export function CalendarControls({ currentDate, onPrev, onNext }: CalendarControlsProps) {
  return (
    <div className="flex items-center justify-between border-b border-border p-4 bg-muted/20">
      <div className="flex items-center gap-2">
        <CalendarDays className="size-4 text-primary" />
        <h3 className="font-semibold text-sm">
          {currentDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
        </h3>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon-sm" className="cursor-pointer" onClick={onPrev}>
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="outline" size="icon-sm" className="cursor-pointer" onClick={onNext}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}