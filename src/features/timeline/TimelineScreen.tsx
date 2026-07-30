import React from 'react';
import { FileText, Receipt, ShieldCheck, CreditCard, Clock, ArrowUpRight } from 'lucide-react';
import { VaultStorageService } from '../../services/vaultStorage';
import { formatDate, cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { ActiveTab } from '../../types';
import { Card } from '../../components/ui/Card';

const ICONS: Record<string, React.ReactNode> = {
  document: <FileText className="w-3.5 h-3.5" />,
  receipt: <Receipt className="w-3.5 h-3.5" />,
  warranty: <ShieldCheck className="w-3.5 h-3.5" />,
  subscription: <CreditCard className="w-3.5 h-3.5" />,
};

const CATEGORY_TO_TAB: Record<string, ActiveTab> = {
  document: 'documents',
  receipt: 'receipts',
  warranty: 'warranties',
  subscription: 'subscriptions',
};

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

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-primary tracking-tight">Zaman Akışı</h1>
          <p className="text-lg text-secondary font-medium">Önemli olayların ve kayıtların kronolojik serüveni.</p>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-surface border border-border flex items-center justify-center text-accent shadow-soft">
          <Clock className="w-7 h-7" />
        </div>
      </div>

      <div className="relative pt-6">
        <div className="absolute left-[13px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-border/80 via-border/20 to-transparent" />

        <div className="space-y-16">
          {Object.entries(groupedEvents).map(([month, monthEvents], groupIndex) => (
            <div key={month} className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4 ml-10"
              >
                <div className="h-px w-8 bg-accent/20" />
                <p className="text-[12px] font-bold text-accent uppercase tracking-[0.2em]">
                  {month}
                </p>
              </motion.div>
              
              <div className="space-y-8">
                {monthEvents.map((event, i) => {
                  const isClickable = !!event.linkedItemId && !!event.itemType;
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: (groupIndex * 0.1) + (i * 0.05),
                        ease: [0.16, 1, 0.3, 1]
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
                      className={`flex gap-6 relative group rounded-3xl focus:outline-none focus:ring-2 focus:ring-accent/30 ${isClickable ? 'cursor-pointer' : ''}`}
                    >
                      {/* Dot */}
                      <div className="relative z-10 mt-2 shrink-0">
                        <div className="w-7 h-7 rounded-full bg-background border-2 border-border flex items-center justify-center group-hover:border-accent transition-all duration-500 shadow-soft">
                          <div className="w-2 h-2 rounded-full bg-border group-hover:bg-accent transition-colors" />
                        </div>
                      </div>

                      {/* Content Card */}
                      <Card 
                        padding="lg" 
                        className={cn(
                          "flex-1 border-border/60 transition-all duration-500 rounded-[2rem]",
                          isClickable && "group-hover:border-accent group-hover:bg-accent/[0.02]"
                        )}
                      >
                        <div className="flex items-start justify-between gap-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center text-secondary group-hover:text-accent transition-colors duration-500">
                                {ICONS[event.itemType || ''] || <Clock className="w-4 h-4" />}
                              </div>
                              <h3 className="text-lg font-bold text-primary tracking-tight leading-none group-hover:text-accent transition-colors duration-500">
                                {event.title}
                              </h3>
                            </div>
                            <p className="text-sm text-secondary/80 leading-relaxed font-medium">
                              {event.description}
                            </p>
                          </div>
                          <span className="text-[11px] font-bold text-secondary/40 tabular-nums uppercase tracking-widest bg-surface px-2.5 py-1 rounded-full border border-border/40">
                            {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        
                        {isClickable && (
                          <div className="flex items-center gap-2 mt-5 pt-5 border-t border-border/40 text-[11px] font-bold text-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 duration-500">
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
    </div>
  );
};
