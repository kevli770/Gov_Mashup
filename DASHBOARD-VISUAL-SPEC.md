# Gov.il BI Dashboard - מפרט ויזואלי מלא

מסמך זה מכיל את כל הפרטים הויזואליים של הדשבורד שבנינו, להעתקה לפרויקט ClickSense חדש.

---

## 🎨 ערכת צבעים (Color Palette)

### Light Mode
```css
--background: oklch(0.96 0 0)         /* רקע ראשי - אפור בהיר מאוד */
--foreground: oklch(0.15 0 0)         /* טקסט ראשי - שחור כמעט */
--card: oklch(1 0 0)                  /* רקע כרטיסים - לבן טהור */
--card-foreground: oklch(0.15 0 0)    /* טקסט בכרטיסים */
--primary: oklch(0.55 0.22 27)        /* צבע ראשי - כתום חם */
--primary-foreground: oklch(1 0 0)    /* טקסט על צבע ראשי - לבן */
--muted: oklch(0.92 0 0)              /* צבע עמום - אפור בהיר */
--muted-foreground: oklch(0.5 0 0)    /* טקסט עמום - אפור כהה */
--accent: oklch(0.92 0 0)             /* הדגשה - אפור בהיר */
--accent-foreground: oklch(0.15 0 0)  /* טקסט על הדגשה */
--border: oklch(0.92 0 0)             /* גבולות */
```

### Dark Mode
```css
--background: oklch(0.145 0 0)        /* רקע ראשי - שחור כמעט */
--foreground: oklch(0.985 0 0)        /* טקסט ראשי - לבן כמעט */
--card: oklch(0.205 0 0)              /* רקע כרטיסים - אפור כהה */
--card-foreground: oklch(0.985 0 0)   /* טקסט בכרטיסים */
--primary: oklch(0.922 0 0)           /* צבע ראשי - לבן כמעט */
--primary-foreground: oklch(0.205 0 0)/* טקסט על צבע ראשי */
--muted: oklch(0.269 0 0)             /* צבע עמום */
--muted-foreground: oklch(0.708 0 0)  /* טקסט עמום */
--accent: oklch(0.269 0 0)            /* הדגשה */
--border: oklch(1 0 0 / 10%)          /* גבולות - שקוף 10% */
```

### Chart Colors (גרפים)
```css
--chart-1: 0 72% 51%     /* כחול */
--chart-2: 0 70% 35%     /* כתום כהה */
--chart-3: 0 60% 70%     /* ורוד בהיר */
--chart-4: 0 80% 25%     /* אדום כהה */
--chart-5: 0 50% 85%     /* ורוד מאוד בהיר */
```

---

## 📐 מבנה Layout

### Container Principal
```
Container: max-width: container (Tailwind default)
Padding X: px-3 md:px-4  (0.75rem / 1rem)
Padding Y: py-2           (0.5rem)
Direction: RTL
```

### Grid System
```css
KPI Cards Grid:
  - Mobile: 1 column
  - Desktop: 3 columns (grid-cols-1 md:grid-cols-3)
  - Gap: gap-2 (0.5rem)

Charts Grid:
  - Mobile: 1 column
  - Desktop: 2 columns (grid-cols-1 lg:grid-cols-2)
  - Gap: gap-2 (0.5rem)
```

### Spacing Scale
```
mb-2 = 0.5rem   (בין סקשנים)
gap-2 = 0.5rem  (בין כרטיסים)
pb-1 = 0.25rem  (padding bottom של CardHeader)
pt-1 = 0.25rem  (padding top של CardContent)
pb-3 = 0.75rem  (padding bottom של CardContent)
```

---

## 🎯 Header (כותרת עליונה)

### Structure
```
Background: bg-card
Border: border-b border-border
Position: sticky top-0 z-10
Container: px-4 md:px-6 py-2
Layout: flex flex-col sm:flex-row
Justify: justify-between
Items: items-center
Gap: gap-3
```

### Logo
```
Icon: BarChart3 (lucide-react)
Size: w-6 h-6 md:w-8 md:h-8
Color: text-primary
Text: text-lg md:text-2xl font-bold
```

### Navigation Buttons
```
Direction: RTL
Gap: gap-1 md:gap-2

Active State (דשבורד):
  - bg-primary
  - text-primary-foreground
  - font-medium
  - Padding: px-2 md:px-4 py-2
  - Border radius: rounded-lg
  - Font size: text-sm md:text-base

Inactive State:
  - hover:bg-accent
  - transition-colors
  - Same padding & sizing
```

---

## 🏆 Hero Section

### Title
```
Text: text-xl md:text-2xl
Weight: font-extrabold
Margin: mb-0.5
Color: text-foreground
Content: "דשבורד ניתוח רכבים"
```

### Subtitle
```
Text: text-xs
Color: text-muted-foreground
Content: "נתוני רישוי רכב פרטי ומסחרי • משרד התחבורה • 2025"
```

---

## 📊 KPI Cards (כרטיסי מפתח)

### Card Base Structure
```css
Card Classes:
  - cursor-pointer
  - transition-all duration-300
  - transform hover:-translate-y-1
  - hover:bg-accent/50
```

### CardHeader
```
Padding: pb-2
Layout: flex items-center justify-between

Icon:
  - Size: w-7 h-7 md:w-8 md:h-8
  - Color: text-primary
  - Position: right side

Text Side:
  - CardDescription: text-xs
  - CardTitle: text-base md:text-lg mt-0.5
```

### CardContent
```
Padding: pt-0

Main Number:
  - Size: text-2xl md:text-3xl
  - Weight: font-extrabold
  - Color: text-foreground
  - Format: toLocaleString('he-IL')

Secondary Text:
  - Size: text-xs md:text-sm
  - Weight: font-medium
  - Color: text-muted-foreground
```

### HoverCard Content
```
Width: w-80
Direction: RTL
Spacing: space-y-3

Title:
  - font-semibold text-sm

Data Rows:
  - flex justify-between items-center
  - p-2 rounded-md bg-accent
  - Text: text-muted-foreground text-sm
  - Number: font-bold text-foreground

Footer:
  - pt-2 mt-2 border-t
  - text-xs text-muted-foreground
```

---

## 📈 Charts (גרפים)

### Chart Cards
```css
Card:
  - transition-all duration-300
  - hover:bg-accent/50

CardHeader:
  - pb-1
  - CardTitle: text-base md:text-lg
  - CardDescription: text-xs

CardContent:
  - pt-1 pb-3
```

### 1. Brand Distribution (Pie Chart)
```
Type: PieChart
Container: aspect-square max-h-[180px]
Data: Top 5 brands
Colors: chart-1 to chart-5 (rotating)
Label: Shows count formatted in Hebrew
Tooltip: Shows count with Hebrew locale
```

### 2. Ownership Distribution (Bar Chart)
```
Type: BarChart
Height: h-[180px]
Color: chart-1
Features:
  - CartesianGrid vertical={false}
  - No axis lines
  - Bar radius: 8
  - LabelList on top, fontSize: 10

Data Grid Below Chart:
  - grid-cols-2 gap-1.5
  - Items: p-1.5 bg-accent rounded-lg border
  - Left: font-semibold text-xs
  - Right: text-primary font-bold text-xs
```

### 3. Fuel Distribution (Donut Chart)
```
Type: PieChart with innerRadius
Container: aspect-square max-h-[180px]
Inner Radius: 50
Colors: chart-1 to chart-5 (rotating)
Tooltip: Hebrew locale formatting
```

### 4. Top Union Models (List)
```
Layout: space-y-1

List Item:
  - flex items-center justify-between
  - p-1.5 rounded-lg
  - bg-accent border
  - transition-all hover:-translate-y-0.5
  - cursor-pointer

Rank Badge:
  - w-6 h-6 rounded-full
  - bg-primary text-primary-foreground
  - font-bold text-xs
  - centered content

Model Name:
  - font-semibold text-xs text-foreground

Count:
  - font-bold text-sm text-primary
  - Hebrew locale formatting
```

### 5. Year Distribution (Bar Chart)
```
Type: BarChart
Height: h-[180px]
Color: chart-2
Same structure as Ownership chart
Data: Last 5 years
```

---

## 🔄 Refresh Button

```css
Button:
  - px-4 py-2
  - bg-primary text-primary-foreground
  - rounded-lg
  - font-semibold text-xs md:text-sm
  - transition-all hover:bg-primary/90
  - flex items-center gap-2
  - mx-auto

Icon (RefreshCw):
  - w-3 h-3 md:w-4 md:h-4
  - group-hover:rotate-180
  - transition-transform duration-500
```

---

## 📱 Responsive Breakpoints

```css
Mobile First Approach:

sm: 640px   (Small tablets)
md: 768px   (Tablets)
lg: 1024px  (Desktop)
xl: 1280px  (Large desktop)

Key Responsive Changes:
- Header: flex-col → sm:flex-row
- KPI Cards: 1 col → md:3 cols
- Charts: 1 col → lg:2 cols
- Text sizes: xs/sm → md:base/lg
- Icon sizes: 6/7 → md:8
- Padding: 3/4 → md:4/6
```

---

## 🎭 Animations & Transitions

### Hover Effects
```css
Cards:
  - transition-all duration-300
  - transform hover:-translate-y-1
  - hover:bg-accent/50

List Items:
  - transition-all
  - hover:-translate-y-0.5

Buttons:
  - transition-all
  - hover:bg-primary/90

Navigation:
  - transition-colors
```

### Loading State
```css
Spinner:
  - animate-spin
  - rounded-full h-16 w-16
  - border-b-4 border-primary

Text:
  - text-2xl font-bold mb-2
  - text-muted-foreground (subtitle)
```

### Refresh Icon
```css
  - group-hover:rotate-180
  - transition-transform duration-500
```

---

## 🔤 Typography Scale

```css
Headings:
  h1: text-xl md:text-2xl font-extrabold
  Card Titles: text-base md:text-lg
  Descriptions: text-xs

Numbers:
  KPI Large: text-2xl md:text-3xl font-extrabold
  List Numbers: text-sm font-bold
  Percentages: text-xs md:text-sm

Body Text:
  Primary: text-sm
  Secondary: text-xs text-muted-foreground
```

---

## 🌐 RTL Support

### Global
```
- dir="rtl" on main containers
- Navigation: flex direction RTL
- Text alignment: natural (right for RTL)
```

### Hebrew Locale
```javascript
// Number formatting
count.toLocaleString('he-IL')

// Displays: 123,456 → 123,456 (Hebrew format)
```

---

## 🎯 Component Library

### UI Components Used
```
shadcn/ui components:
- Card, CardContent, CardDescription, CardHeader, CardTitle
- HoverCard, HoverCardContent, HoverCardTrigger

Recharts components:
- Pie, PieChart
- Bar, BarChart
- CartesianGrid
- XAxis
- LabelList

Lucide React Icons:
- TrendingUp
- Car
- Building2
- Zap
- RefreshCw
- BarChart3
```

---

## 📦 Chart Configuration Template

```typescript
const chartConfig: ChartConfig = {
  count: { label: "רכבים" },
};

// Dynamic color assignment
data.forEach((item, index) => {
  const key = item.name.toLowerCase().replace(/\s+/g, '-');
  chartConfig[key] = {
    label: item.name,
    color: `hsl(var(--chart-${(index % 5) + 1}))`,
  };
});
```

---

## 🎨 Visual Hierarchy

### Z-Index Layers
```css
Header (sticky): z-10
Cards: default (z-0)
Hover effects: no z-index change
```

### Shadow System
```
No custom shadows used
Relying on:
- Border system
- Background color contrast
- Hover state backgrounds
```

### Border Radius
```css
--radius: 0.25rem (4px)
--radius-sm: calc(var(--radius) - 4px)  /* 0px */
--radius-md: calc(var(--radius) - 2px)  /* 2px */
--radius-lg: var(--radius)              /* 4px */
--radius-xl: calc(var(--radius) + 4px)  /* 8px */

Applied as: rounded-lg (8px most common)
```

---

## 🎯 Accessibility Features

### ARIA Labels
```html
Navigation:
role="navigation"
aria-label="ניווט ראשי"

Links:
aria-label="דשבורד - עמוד נוכחי"
aria-current="page"

Buttons:
aria-label="רענן נתוני דשבורד"

Icons:
aria-hidden="true" (decorative)
```

### Focus States
```css
outline-ring/50 (from global base layer)
```

---

## 📱 Mobile Optimizations

### Touch Targets
```
Minimum: 44px × 44px (iOS/Android standard)
Navigation buttons: py-2 (sufficient height)
Cards: Full clickable area
```

### Text Scaling
```
Mobile: text-xs, text-sm, text-base
Desktop: md:text-sm, md:text-base, md:text-lg
```

### Spacing
```
Mobile: px-3, gap-2, mb-2
Desktop: md:px-4, md:px-6
```

---

## 🎨 Data Visualization Best Practices

### Color Assignment
- Consistent color per category
- High contrast
- Color blind friendly (OKLCH color space)

### Chart Heights
- Consistent: 180px for all bar/line charts
- Responsive: aspect-square for pie/donut charts

### Labels
- Always Hebrew formatted numbers
- Font size: 10-12px
- Position: top for bars, on slice for pies

### Tooltips
- Dark background (ChartTooltip default)
- Hebrew locale formatting
- Hide label when redundant

---

## 🔍 Footer

```css
Styling:
  - mt-2 mb-1
  - text-center
  - text-muted-foreground
  - text-xs

Content:
"נתונים מתעדכנים מ-Gov.il Data Portal • Union Motors Dashboard"
```

---

## 💡 Implementation Notes for ClickSense

### 1. Color System
- Use OKLCH colors for better perceptual uniformity
- Implement both light and dark modes
- Use CSS variables for easy theming

### 2. Component Structure
- Modular components
- Reusable chart components
- Hover states for all interactive elements

### 3. Data Flow
```typescript
interface DashboardStats {
  total_vehicles: number;
  union_vehicles: number;
  union_percentage: string;
  brand_distribution: Array<{ brand: string; count: number; percentage: string }>;
  ownership_distribution: Array<{ type: string; count: number; percentage: string }>;
  fuel_distribution: Array<{ type: string; count: number; percentage: string }>;
  top_union_models: Array<{ model: string; count: number }>;
  year_distribution: Array<{ year: number; count: number }>;
}
```

### 4. Performance
- Static rendering where possible
- Lazy loading for charts
- Optimized re-renders
- Memoized chart configurations

### 5. Hebrew/RTL Support
- dir="rtl" on containers
- toLocaleString('he-IL') for numbers
- Right-aligned text naturally
- Icons on right side of text

---

## 🎯 Key Design Decisions

1. **Compact Design**: Small spacing (gap-2, pb-1) for data density
2. **Hover Interactions**: All cards and list items have hover states
3. **Consistent Typography**: Small text sizes for more info on screen
4. **Chart Focus**: Large, readable charts with clear labels
5. **Mobile First**: Responsive from smallest screens up
6. **Subtle Animations**: Smooth transitions without distraction
7. **High Contrast**: Clear visual hierarchy with color system
8. **Data First**: Numbers prominent, chrome minimal

---

## 📋 Component Checklist for ClickSense

- [ ] Color system (OKLCH variables)
- [ ] Typography scale
- [ ] Spacing system
- [ ] Border radius tokens
- [ ] Responsive breakpoints
- [ ] RTL support
- [ ] Hebrew locale formatting
- [ ] Chart configurations
- [ ] Hover states
- [ ] Loading states
- [ ] Error states
- [ ] Accessibility features
- [ ] Dark mode
- [ ] Icon system
- [ ] Navigation structure

---

## 🎨 Design Files Reference

This spec is based on the implemented dashboard at:
- Dashboard Page: `src/app/dashboard/page.tsx`
- Chart Components: `src/components/dashboard-charts-patterns.tsx`
- Global Styles: `src/app/globals.css`

**Last Updated**: 2025-11-06
**Dashboard Version**: v1.0
**Framework**: Next.js 15 + Tailwind CSS + shadcn/ui + Recharts
