import React, { useMemo } from 'react';
import { FileText, Receipt, ShieldCheck, CreditCard, Clock, ArrowUpRight, StickyNote, Bookmark } from 'lucide-react';
import { VaultStorageService } from '../../services/vaultStorage';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { ActiveTab } from '../../types';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { ReturnsCalendar } from '../../components/ui/ReturnsCalendar';
import { SectorsDonut } from '../../components/ui/SectorsDonut';

const ICONS: Record<string, React.ReactNode> = {
  document: <FileText className="w-4 h-4" />,
  receipt: <Receipt className="w-4 h-4" />,
  warranty: <ShieldCheck className="w-4 h-4" />,
  subscription: <CreditCard className="w-4 h-4" />,
  note: <StickyNote className="w-4 h-4" />,
  bookmark: <Bookmark className="w-4 h-4" />,
};

const CATEGORY_TO_TAB: Record<string, ActiveTab> = {
  document: 'documents',
  receipt: 'receipts',
  warranty: 'warranties',
  subscription: 'subscriptions',
  note: 'notes',
  bookmark: 'bookmarks',
};

const CALENDAR_YEARS = [2024, 2025, 2026];

export interface TimelineScreenProps {
  onNavigateToTab: (tab: ActiveTab, linkedItemId?: string) => void;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({ onNavigateToTab }) => {
  const events = VaultStorageService.getTimeline();

  const handleEventClick = (event: typeof events[0]) => {
    if (event.linkedItemId && event.itemType) {
      const tab = CATEGORY_TO_TAB[event.itemType];
      if (tab) {
        onNavigateToTab(tab, event.linkedItemId);
      }
    }
  };

  const groupedEvents = events.reduce((acc, event) => {
    const date = new Date(event.date);
    const month = date.toLocaleString('tr-TR', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {} as Record<string, typeof events>);

  // Compute real event activity matrix per year and month
  const calendarReturns = useMemo(() => {
    const matrix = CALENDAR_YEARS.map(() => Array(12).fill(0));
    events.forEach((ev) => {
      const d = new Date(ev.date);
      const yIdx = CALENDAR_YEARS.indexOf(d.getFullYear());
      const mIdx = d.getMonth();
      if (yIdx !== -1 && mIdx >= 0 && mIdx < 12) {
        matrix[yIdx][mIdx] += 1;
      }
    });
    return matrix;
  }, [events]);

  // Compute category distribution percentages for SectorsDonut (from zmanaakısı.md)
  const donutSectors = useMemo(() => {
    const docs = VaultStorageService.getDocuments().length;
    const recs = VaultStorageService.getReceipts().length;
    const wars = VaultStorageService.getWarranties().length;
    const subs = VaultStorageService.getSubscriptions().length;
    const notes = VaultStorageService.getNotes().length;
    const bms = VaultStorageService.getBookmarks().length;
    const total = docs + recs + wars + subs + notes + bms;

    if (total === 0) {
      return [
        { label: 'Belgeler', pct: 30 },
        { label: 'Fişler', pct: 25 },
        { label: 'Garantiler', pct: 20 },
        { label: 'Abonelikler', pct: 15 },
        { label: 'Notlar', pct: 10 },
      ];
    }

    const items = [
      { label: 'Belgeler', count: docs },
      { label: 'Fişler', count: recs },
      { label: 'Garantiler', count: wars },
      { label: 'Abonelikler', count: subs },
      { label: 'Notlar', count: notes },
      { label: 'Yer İmleri', count: bms },
    ].filter((i) => i.count > 0);

    return items.map((i) => ({
      label: i.label,
      pct: Math.round((i.count / total) * 100) || 1,
      count: i.count,
    }));
  }, [events]);

  return (
    <div className="space-y-8">
      {/* Clean header without icon box */}
      <div className="space-y-1">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Zaman Akışı</h1>
        <p className="text-base text-secondary font-medium">Önemli olayların ve kayıtların kronolojik serüveni.</p>
      </div>

      {/* Analytics Widgets: Activity Calendar (fis.md) + Sectors Donut (zmanaakısı.md) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <ReturnsCalendar
          title="Aktivite & Kayıt Takvimi"
          hint="Ay üzerine gel · yıllık toplam"
          years={CALENDAR_YEARS}
          returns={calendarReturns}
        />
        <SectorsDonut
          symbol="KAPSULE"
          caption="kayıt dağılımı"
          sectors={donutSectors}
        />
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={<Clock className="w-8 h-8 text-secondary opacity-60" />}
          title="Henüz olay yok"
          description="Kaydettiğiniz belgeler, fişler ve diğer öğeler zaman akışınızda kronolojik olarak görünecektir."
        />
      ) : (
        <div className="relative pt-4">
          <div className="absolute left-[13px] top-4 bottom-6 w-0.5 bg-gradient-to-b from-border/80 via-border/20 to-transparent" />

          <div className="space-y-12">
            {Object.entries(groupedEvents).map(([month, monthEvents], groupIndex) => (
              <div key={month} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 ml-8"
                >
                  <div className="h-px w-6 bg-accent/30" />
                  <p className="text-[11px] font-bold text-accent uppercase tracking-[0.2em]">
                    {month}
                  </p>
                </motion.div>

                <div className="space-y-5">
                  {monthEvents.map((event, i) => {
                    const isClickable = !!event.linkedItemId && !!event.itemType;
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: groupIndex * 0.08 + i * 0.04,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        onClick={() => handleEventClick(event)}
                        onKeyDown={(e) => {
                          if (!isClickable) return;
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleEventClick(event);
                          }
                        }}
                        role={isClickable ? 'button' : undefined}
                        tabIndex={isClickable ? 0 : undefined}
                        aria-label={isClickable ? `${event.title} detaylarını aç` : undefined}
                        className={`flex gap-5 relative group rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/30 ${isClickable ? 'cursor-pointer' : ''}`}
                      >
                        {/* Dot */}
                        <div className="relative z-10 mt-3.5 shrink-0">
                          <div className="w-6 h-6 rounded-full bg-background border-2 border-border flex items-center justify-center group-hover:border-accent transition-all duration-300 shadow-soft">
                            <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-accent transition-colors" />
                          </div>
                        </div>

                        {/* Content Card — clean, no icon background box */}
                        <Card
                          padding="lg"
                          className={cn(
                            'flex-1 border-border/60 transition-all duration-300 rounded-2xl',
                            isClickable && 'group-hover:border-accent/50 group-hover:bg-accent/[0.02]'
                          )}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1.5 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-secondary/70 group-hover:text-accent transition-colors shrink-0">
                                  {ICONS[event.itemType || ''] || <Clock className="w-4 h-4" />}
                                </span>
                                <h3 className="text-base font-bold text-primary tracking-tight leading-snug group-hover:text-accent transition-colors duration-300 truncate">
                                  {event.title}
                                </h3>
                              </div>
                              {event.description && (
                                <p className="text-xs text-secondary/80 leading-relaxed font-medium line-clamp-2">
                                  {event.description}
                                </p>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-secondary/60 tabular-nums uppercase tracking-wider bg-surface px-2.5 py-1 rounded-lg border border-border/40 shrink-0">
                              {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>

                          {isClickable && (
                            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-border/40 text-[11px] font-bold text-accent uppercase tracking-wider opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                              Detayları incele
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
