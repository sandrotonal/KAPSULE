import React from 'react';
import { FileText, Receipt, ShieldCheck, CreditCard, Clock } from 'lucide-react';
import { VaultStorageService } from '../../services/vaultStorage';
import { formatDate } from '../../lib/utils';
import { motion } from 'framer-motion';

const ICONS: Record<string, React.ReactNode> = {
  document: <FileText className="w-3.5 h-3.5" />,
  receipt: <Receipt className="w-3.5 h-3.5" />,
  warranty: <ShieldCheck className="w-3.5 h-3.5" />,
  subscription: <CreditCard className="w-3.5 h-3.5" />,
};

export const TimelineScreen: React.FC = () => {
  const events = VaultStorageService.getTimeline();

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
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: i * 0.04 }}
              className="flex gap-4 relative"
            >
              {/* Dot */}
              <div className="relative z-10 mt-1 shrink-0">
                <div className="w-[22px] h-[22px] rounded-full bg-background border-2 border-border flex items-center justify-center">
                  <div className="w-[7px] h-[7px] rounded-full bg-vault-300" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-secondary/60 shrink-0">
                      {ICONS[event.category] || <Clock className="w-3.5 h-3.5" />}
                    </span>
                    <p className="text-sm font-medium text-primary leading-snug">{event.title}</p>
                  </div>
                  <span className="text-[11px] text-secondary/60 shrink-0 tabular-nums pt-0.5">{formatDate(event.date)}</span>
                </div>
                {event.description && (
                  <p className="text-xs text-secondary mt-1 ml-6 leading-relaxed">{event.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
