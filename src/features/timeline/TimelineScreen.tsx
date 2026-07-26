import React from 'react';
import { FileText, Receipt, ShieldCheck, CreditCard, Clock } from 'lucide-react';
import { VaultStorageService } from '../../services/vaultStorage';
import { formatDate } from '../../lib/utils';
import { motion } from 'framer-motion';
import { ActiveTab } from '../../types';

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

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-[-0.02em]">Timeline</h1>
        <p className="text-sm text-secondary mt-0.5">A record of your important life events.</p>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

        <div className="space-y-5">
          {events.map((event, i) => {
            const isClickable = !!event.linkedItemId && !!event.itemType;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15, delay: i * 0.04 }}
                onClick={() => handleEventClick(event)}
                className={`flex gap-4 relative group ${isClickable ? 'cursor-pointer hover:opacity-80 transition-all duration-150' : ''}`}
              >
                {/* Dot */}
                <div className="relative z-10 mt-1 shrink-0">
                  <div className="w-[22px] h-[22px] rounded-full bg-background border-2 border-border flex items-center justify-center group-hover:border-primary transition-colors">
                    <div className="w-[7px] h-[7px] rounded-full bg-vault-300 group-hover:bg-primary transition-colors" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-secondary/60 shrink-0">
                        {ICONS[event.category] || <Clock className="w-3.5 h-3.5" />}
                      </span>
                      <p className="text-sm font-medium text-primary leading-snug group-hover:text-accent transition-colors truncate">
                        {event.title}
                      </p>
                    </div>
                    <span className="text-[11px] text-secondary/60 shrink-0 tabular-nums pt-0.5">{formatDate(event.date)}</span>
                  </div>
                  {event.description && (
                    <p className="text-xs text-secondary mt-1 ml-6 leading-relaxed">{event.description}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
