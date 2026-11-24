---
name: TaskFlow Executive System
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#45464f'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#767680'
  outline-variant: '#c6c5d0'
  surface-tint: '#4f5c8e'
  primary: '#000f3f'
  on-primary: '#ffffff'
  primary-container: '#172554'
  on-primary-container: '#808dc2'
  inverse-primary: '#b7c4fd'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#001714'
  on-tertiary: '#ffffff'
  tertiary-container: '#002e29'
  on-tertiary-container: '#00a191'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4fd'
  on-primary-fixed: '#071747'
  on-primary-fixed-variant: '#374475'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#71f8e4'
  tertiary-fixed-dim: '#4fdbc8'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005048'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: '1.15'
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: '1.25'
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.015em
  title-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: '1.5'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: '1.25'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
This design system defines an authoritative, high-efficiency SaaS productivity environment. It balances executive precision with tactile, focused utility. Targeted at modern knowledge workers, engineering leaders, and project managers, the interface avoids decorative excess in favor of crisp visual hierarchy, decisive typographic cadence, and clear operational states.

The design movement combines **Corporate Modern** with **Soft Architectural Precision**:
- High-density information views anchored by pure white work surfaces over an airy, pale-slate backdrop.
- Subtle geometric boundaries that isolate critical focal points without visual clutter.
- Interaction cues that evoke responsiveness, confidence, and deliberate momentum.

## Colors
The palette leverages a deep naval anchor paired with functional, high-clarity accents. 

- **Primary (`#172554`):** Anchors primary actions, active navigational chrome, and high-emphasis display surfaces.
- **Secondary (`#3B82F6`):** Emphasizes focused tasks, primary progress bars, interactive links, and batch actions.
- **Tertiary / Accent (`#14B8A6`):** Communicates dynamic progress, active tracking states, and positive workflow milestones.
- **Neutral Surface & Text (`#F8FAFC` base, `#FFFFFF` cards, `#1E293B` text, `#64748B` muted text):** Delivers clean contrast while reducing long-session eye fatigue.
- **Functional Semantics:** 
  - Success: `#22C55E`
  - High Priority: `#EF4444`
  - Medium Priority: `#F59E0B`
  - Subtle borders rely strictly on `#E2E8F0` (slate-200) for structural division and `#F1F5F9` (slate-100) for internal card dividers.

## Typography
Typographic rhythm relies exclusively on **Inter** to ensure maximum legibility across high-density task grids, kanban boards, and executive dashboards.

- Headings use tight negative tracking (`-0.02em` to `-0.03em`) and structured weights (600/700) to command authority.
- Body content defaults to regular weight (400) at 14px (`0.875rem`) for task lists, supporting dense yet readable views.
- Labels, meta tags, and priority markers utilize medium to semi-bold weights with slight positive letter spacing to maintain distinct scan-readiness at reduced sizes.

## Layout & Spacing
The layout model employs a fluid 12-column grid system paired with strict 4px/8px incremental spatial rhythm:

- **Desktop (1024px+):** 12 columns with `1.5rem` (24px) gutters, `2rem` outer margins, and persistent collapsible side navigation (280px wide).
- **Tablet (768px - 1023px):** 8 columns with `1rem` gutters, `1.5rem` outer margins. Side navigation compresses into an icon rail or sheet overlay.
- **Mobile (<768px):** Single-column stacked flow with `1rem` canvas margin and bottom-anchored task execution bars.
- **Component Metrics:** Internal component padding scales predictably: dense table rows take `space-sm` vertical padding; standard actionable cards use `space-lg` padding.

## Elevation & Depth
Depth is established through crisp, low-contrast structural borders paired with diffused, color-neutral ambient shadowing:

- **Flat/Resting:** Surfaces (`#FFFFFF`) sit on the background (`#F8FAFC`) framed by a 1px border (`#E2E8F0`). Shadow is suppressed to avoid visual fatigue during long sessions.
- **Card Hover:** Subtle upward transition with an ambient drop: `0 4px 12px -2px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.03)`, accompanied by a border shift to `#CBD5E1`.
- **Dropdown & Flyout Menus:** Elevated popovers rely on `0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)` with a crisp 1px `#E2E8F0` bounding border.
- **Modals & Drawers:** High elevation (`0 25px 50px -12px rgba(15, 23, 42, 0.18)`) over a backdrop scrim tinted with `#0F172A` at 40% opacity with backdrop-blur of 4px.

## Shapes
The visual identity embraces a balanced, contemporary curvature that softens rigorous data displays without appearing playful:

- Standard controls, inputs, chips, and small cards use **12px (`rounded-xl` equivalent in default geometry)**.
- Primary container panels, modals, and dashboard cards scale to **16px (`rounded-2xl` equivalent)**.
- Pills and dynamic badges feature fully rounded geometry (`9999px`) to create clear shape differentiation against rectangular structural views.

## Components

### Buttons
- **Primary:** Background `#172554`, text `#FFFFFF`, border none, radius `0.75rem` (12px). Hover: `#1E3A8A`. Active: scales to 0.98. Focus: ring 2px `#3B82F6` with 2px offset.
- **Secondary:** Background `#FFFFFF`, text `#1E293B`, border 1px solid `#E2E8F0`. Hover: `#F8FAFC` and border `#CBD5E1`.
- **Accent:** Background `#14B8A6`, text `#FFFFFF`. Used strictly for "New Task", "Complete Sprint", or quick-capture calls to action.
- **Ghost / Icon:** Transparent background, text `#64748B`, hover background `#F1F5F9`, hover text `#1E293B`.

### Input Fields & Search
- Background `#FFFFFF`, border 1px solid `#E2E8F0`, corner radius `0.75rem` (12px). Height 40px for standard tasks, 48px for global search.
- Text `#1E293B`, placeholder `#94A3B8`.
- Focus state: border `#3B82F6`, shadow ring `0 0 0 3px rgba(59, 130, 246, 0.15)`.

### Checkboxes & Selection
- Dimensions 20px × 20px, radius 6px.
- Unchecked: 1.5px border `#CBD5E1`, background `#FFFFFF`.
- Checked: Background `#3B82F6`, border `#3B82F6`, with a white sharp checkmark icon. Smooth 150ms spring animation.

### Cards & Task Rows
- **Card Containers:** Background `#FFFFFF`, border 1px solid `#E2E8F0`, radius `1rem` (16px), padding `1.25rem` to `1.5rem`.
- **Task List Rows:** Background `#FFFFFF`, 1px bottom border `#F1F5F9`. Hover state introduces `#F8FAFC` fill and surfaces hidden quick-actions (assignee, due date, subtask counter).

### Priority Badges & Status Chips
- Height 24px, radius 9999px (full pill), text size `label-sm`.
- **High Priority:** Background `rgba(239, 68, 68, 0.1)`, text `#DC2626`, dot indicator `#EF4444`.
- **Medium Priority:** Background `rgba(245, 158, 11, 0.1)`, text `#D97706`, dot indicator `#F59E0B`.
- **Low / Completed:** Background `rgba(34, 197, 94, 0.1)`, text `#16A34A`, dot indicator `#22C55E`.

### Productivity Extras (Progress & Metrics)
- **Progress Trackers:** Track `#F1F5F9`, indicator bar `#14B8A6` with 9999px capsule ends, height 6px.
- **Iconography:** Lucide-style single-color stroke (1.75px stroke width, 20px bounding box), color `#64748B`, transitioning to `#1E293B` on interactive hover.