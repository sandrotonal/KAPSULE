# Sleek Digital Vault Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cleanse all AI/sparkle clichés, enforce the single-accent design language across cards and collections, modernize the cartoon wallet card into a frosted titanium vault sleeve, and fix ticket cutout notches in dark mode.

**Architecture:** Systematic UI refactoring of icon imports, Tailwind utility classes, SVG fill attributes, and design tokens across existing React components while preserving full responsiveness and TypeScript 0-error integrity.

**Tech Stack:** React 18, TypeScript, TailwindCSS v3, Framer Motion, Lucide React.

**Spec:** `docs/superpowers/specs/2026-09-22-sleek-digital-vault-design.md`

## Global Constraints
- Turkish UI only (100% Türkçe).
- Single accent color palette (`hsl(var(--accent))`) — no multi-colored rainbow gradients or neon effects.
- Strict TypeScript: no `any` types.
- Try-catch blocks on async handlers.
- Both dark and light mode compatibility verified.

---

### Task 1: Eliminate AI Cliché Sparkles & Unused Imports
**Files:**
- Modify: `src/components/common/QuickAddModal.tsx:6,510`
- Modify: `src/features/documents/DocumentDetailModal.tsx:2,94`
- Modify: `src/components/ui/SpendingCard.tsx:2`
- Modify: `src/lib/brandLogos.tsx:11`

**Interfaces:**
- Consumes: `lucide-react` icons (`Plus`, `ScanText`, `ShieldCheck`)
- Produces: Clean semantic UI free of generative AI clichés

- [ ] **Step 1: Replace Sparkles in QuickAddModal with Plus icon**
- [ ] **Step 2: Replace Sparkles in DocumentDetailModal with ScanText icon**
- [ ] **Step 3: Remove unused Sparkles imports from SpendingCard and brandLogos**
- [ ] **Step 4: Run `npx tsc --noEmit` to verify type safety**
- [ ] **Step 5: Commit changes: `git commit -m "fix(ui): replace AI sparkles with semantic vault and scan icons"`**

---

### Task 2: Ticket Cutout Holes Dark Mode Fix
**Files:**
- Modify: `src/components/ui/ReceiptTicket.tsx:110-111`
- Modify: `src/components/ui/SubscriptionTicket.tsx:108-109`
- Modify: `src/components/ui/WarrantyTicket.tsx:107-108`

**Interfaces:**
- Consumes: Tailwind `bg-background` class
- Produces: Proper transparent punch-hole cutout illusion in both light and dark modes

- [ ] **Step 1: Change `bg-gray-200` to `bg-background` in `ReceiptTicket.tsx`**
- [ ] **Step 2: Change `bg-gray-200` to `bg-background` in `SubscriptionTicket.tsx`**
- [ ] **Step 3: Change `bg-blue-200` to `bg-background` in `WarrantyTicket.tsx`**
- [ ] **Step 4: Verify visually that punch holes match the background**
- [ ] **Step 5: Commit changes: `git commit -m "fix(tickets): use bg-background for punch-hole notch cutouts in dark mode"`**

---

### Task 3: Single-Accent Harmony in Collections & SpendingCard
**Files:**
- Modify: `src/features/home/HomeScreen.tsx:73-120,206`
- Modify: `src/components/ui/SpendingCard.tsx:13-20`

**Interfaces:**
- Consumes: CSS variable `--accent` and `--secondary`
- Produces: Monochromatic, high-end SaaS aesthetic for category cards and progress bars

- [ ] **Step 1: Replace rainbow hover gradients in `HomeScreen.tsx` with unified `from-accent/[0.08] to-transparent`**
- [ ] **Step 2: Update `SpendingCard.tsx` category colors to monochromatic step shades of `bg-accent`**
- [ ] **Step 3: Verify TypeScript compilation**
- [ ] **Step 4: Commit changes: `git commit -m "style(home): unify collection hover and spending cards to single-accent palette"`**

---

### Task 4: Re-architect WalletCard into a Frosted Titanium Digital Vault
**Files:**
- Modify: `src/components/ui/WalletCard.tsx`

**Interfaces:**
- Consumes: `VaultStorageService.getStats()`, `framer-motion`
- Produces: Sleek, theme-adaptive cryptographic card case replacing the green leather wallet

- [ ] **Step 1: Redesign the outer pocket container from green leather SVG to frosted glass/titanium sleeve**
- [ ] **Step 2: Update internal peek cards to use dark/light surface tokens and accent badges**
- [ ] **Step 3: Replace `Zap` icon with `CreditCard` for subscriptions**
- [ ] **Step 4: Update reveal typography to use theme text colors instead of olive green**
- [ ] **Step 5: Verify animation and interaction in both light and dark modes**
- [ ] **Step 6: Commit changes: `git commit -m "feat(ui): redesign WalletCard to frosted titanium vault sleeve"`**

---

### Task 5: Concentric Rings Refinement in WarrantyCard
**Files:**
- Modify: `src/components/ui/WarrantyCard.tsx:113-144`

**Interfaces:**
- Consumes: `hsl(var(--accent))` and subtle secondary/status tones
- Produces: Cohesive activity ring widget matching the single-accent design system

- [ ] **Step 1: Update ring colors from Apple Watch neon purple/green/amber to single accent hierarchy**
- [ ] **Step 2: Verify SVG linearGradient definitions and dark mode legibility**
- [ ] **Step 3: Commit changes: `git commit -m "style(warranties): align warranty activity rings with single-accent tokens"`**
