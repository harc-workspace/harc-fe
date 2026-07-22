import { cn } from "@/lib/utils";

export function CalendarLegend() {
  const legendItems = [
    { label: 'İzinlerim (Onaylı)', classes: 'bg-primary' },
    { label: 'İzin Taleplerim (Onay Bekleyen)', classes: 'border border-dashed border-primary/80 bg-primary/10', textClass: 'text-muted-foreground' },
    { label: 'Ekibimin İzinleri (Sadece Gelecek)', classes: 'bg-blue-100 dark:bg-blue-950 border border-blue-200' },
    { label: 'Resmi Tatiller / Şirket Kapalı', classes: 'bg-emerald-100/70 dark:bg-emerald-950/40 border border-emerald-200' },
  ];

  return (
    <div className="rounded-sm border border-border bg-card p-4 space-y-3 shadow-sm">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Takvim Haritası</h4>
      <div className="space-y-2.5 text-xs">
        {legendItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={cn("size-3 rounded", item.classes)} />
            <span className={cn("font-medium", item.textClass)}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}