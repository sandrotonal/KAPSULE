# Sleek Digital Vault UI/UX Architecture Spec

## Goal
Elevate the Kapsüle application into a cohesive, high-end SaaS personal vault by:
1. Eliminating generic AI cliché icons (`Sparkles` ✨) in favor of semantic vault and scanning iconography (`ScanText`, `Plus`, `ShieldCheck`).
2. Enforcing a strict single-accent color harmony across the application, eliminating rainbow gradients and neon palette mismatches.
3. Transforming the cartoonish green leather wallet into a cryptographic frosted titanium vault card deck that adapts seamlessly to dark and light modes.
4. Correcting dark mode cutout defects in ticket components (`ReceiptTicket`, `WarrantyTicket`, `SubscriptionTicket`).
5. Refining analytics and activity rings to follow the unified design token system.

## Design Principles
- **Monochromatic Sophistication:** Single accent color (`hsl(var(--accent))`) with semantic status alerts (danger/warning/success) reserved strictly for critical states (e.g. expiring warranty, failed action).
- **Authentic Semantics:** No AI sparkles where no generative AI is involved. OCR is document scanning (`ScanText`), saving is storing in vault (`Plus` / `Check`).
- **Tactile Cryptographic Vault:** Physical, tactile micro-interactions with matte frosted glass, precise border highlights, and zero harsh artificial skeuomorphism.
- **100% Dark & Light Parity:** No hardcoded color values (`#1e341e`, `bg-gray-200`, `bg-blue-200`) in structural elements.

## Component Specifications

### 1. Iconography Clean-up
- `src/components/common/QuickAddModal.tsx`:
  - Replace `<Sparkles>` button icon with `<Plus className="w-3.5 h-3.5" />`.
- `src/features/documents/DocumentDetailModal.tsx`:
  - Replace `<Sparkles>` next to "Taranan metin" with `<ScanText className="w-3.5 h-3.5 text-accent" />`.
- `src/components/ui/SpendingCard.tsx`:
  - Remove unused `Sparkles` import.
- `src/lib/brandLogos.tsx`:
  - Remove unused `Sparkles` import.

### 2. Single-Accent Color Harmony
- `src/features/home/HomeScreen.tsx`:
  - In `COLLECTIONS`, eliminate multi-colored gradient classes (`from-blue-500/20`, `from-emerald-500/20`, `from-purple-500/20`, `from-orange-500/20`, `from-yellow-500/20`, `from-pink-500/20`).
  - Standardize collection card hover states with `from-accent/[0.08] to-transparent` and border transition `group-hover:border-accent/30`.
- `src/components/ui/SpendingCard.tsx`:
  - Replace multi-color `CATEGORY_COLORS` with tonal monochromatic gradations:
    - Rank 0: `bg-accent`
    - Rank 1: `bg-accent/80`
    - Rank 2: `bg-accent/60`
    - Rank 3: `bg-accent/40`
    - Rank 4: `bg-accent/25`
    - Rank 5: `bg-secondary/25`

### 3. Vault Pocket & Deck Re-Architecture (`src/components/ui/WalletCard.tsx`)
- Eliminate hardcoded green leather SVG (`#1e341e`, `#3d5635`, `#698263`).
- Implement modern frosted titanium vault enclosure:
  - Background: `bg-surface/80 dark:bg-zinc-900/90 backdrop-blur-xl border border-border/80 dark:border-white/10 shadow-2xl rounded-[28px]`.
  - Subtle cryptographic grid watermark or brushed metal texture.
  - Interactive tactile peek of stacked cards:
    - Card 1 (Belgeler): Frosted surface with accent badge and `FileText`.
    - Card 2 (Garantiler): Frosted surface with accent badge and `ShieldCheck`.
    - Card 3 (Abonelikler): Frosted surface with accent badge and `CreditCard` (replacing `Zap`).
  - Balance reveal animation respects dark/light theme typography with zero hardcoded olive green text.

### 4. Ticket Cutout Holes Dark Mode Fix
- `src/components/ui/ReceiptTicket.tsx`:
  - Change notch circles from `bg-gray-200` to `bg-background`.
- `src/components/ui/SubscriptionTicket.tsx`:
  - Change notch circles from `bg-gray-200` to `bg-background`.
- `src/components/ui/WarrantyTicket.tsx`:
  - Change notch circles from `bg-blue-200` to `bg-background`.

### 5. Concentric Ring Refinement (`src/components/ui/WarrantyCard.tsx`)
- Replace rainbow `#8B5CF6`, `#10B981`, `#F59E0B` with:
  - Ring 1 (Aktif): Single accent color (`hsl(var(--accent))`).
  - Ring 2 (Güvende): Accent tonal variant (`hsl(var(--accent) / 0.65)`).
  - Ring 3 (Koruma): Contextual semantic (`#f59e0b` if expiring items exist, otherwise `hsl(var(--accent) / 0.35)`).
