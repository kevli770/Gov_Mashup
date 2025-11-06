# Research & Technical Decisions: Qlik Sense Mashup Dashboard

**Feature**: 1-qlik-mashup-dashboard
**Date**: 2025-11-06
**Purpose**: Resolve all NEEDS CLARIFICATION items from plan.md Technical Context and Constitution Check

## Research Tasks

This document addresses the 6 research tasks identified during constitution check:

1. Qlik theme integration strategy with custom OKLCH colors
2. Framework decision (vanilla JS vs lightweight React/Vue)
3. Dark mode implementation approach
4. Qlik object styling strategy (custom CSS scope and limits)
5. API call debouncing best practices for Qlik hypercubes
6. Screen reader compatibility testing approach for custom mashup UI

---

## Research Task 1: Qlik Theme Integration with Custom OKLCH Colors

### Decision

Use **custom OKLCH color system** from DASHBOARD-VISUAL-SPEC.md for the mashup container and custom components, while respecting Qlik object internal styling. Apply custom colors only to mashup-controlled DOM elements, not to Qlik-generated objects.

### Rationale

**Context**: The DASHBOARD-VISUAL-SPEC.md defines a complete OKLCH color palette (lines 7-45) optimized for Hebrew accessibility and brand consistency. Qlik Sense has its own theming system for native objects.

**Analysis**:
- **Qlik theme applies to**: Qlik-generated visualizations, selection bars, toolbars, native UI controls
- **Custom mashup CSS applies to**: Dashboard container, KPI cards, custom HTML/CSS components, layout structure
- **No conflict**: These are separate DOM trees - Qlik objects render into their own containers

**Best Practice** (from Qlik Mashup API documentation):
- Qlik objects are isolated in their own DOM containers
- Mashup developers control the surrounding layout and custom UI
- Use Qlik's `qlik-styles.css` for Qlik objects, custom CSS for mashup UI
- Only override Qlik object styles when absolutely necessary (via scoped CSS)

**Implementation Strategy**:
1. Apply OKLCH color system via CSS custom properties to `<body>` or main dashboard container
2. Scope custom colors to `.dashboard-*` class names (e.g., `.dashboard-kpi-card`, `.dashboard-header`)
3. Let Qlik objects use default Qlik theme internally
4. For visual consistency, match Qlik object container backgrounds to custom design system

### Alternatives Considered

| Alternative | Pros | Cons | Rejected Because |
|-------------|------|------|------------------|
| Override Qlik theme completely | Full visual control | Breaks Qlik updates, accessibility issues | Violates constitution principle IV (respect Qlik styling) |
| Use only Qlik theme | Easy integration | Cannot match DASHBOARD-VISUAL-SPEC.md | Requirement explicitly specifies custom design system |
| Hybrid: Modify Qlik theme | Some consistency | Complex, fragile, hard to maintain | Qlik theme customization is limited and affects all apps |

### Implementation Notes

```css
/* mashup/styles/variables.css */
:root {
  /* OKLCH colors from visual spec (light mode) */
  --background: oklch(0.96 0 0);
  --foreground: oklch(0.15 0 0);
  --card: oklch(1 0 0);
  --primary: oklch(0.55 0.22 27);
  /* ... rest of color palette */
}

/* Scope to custom dashboard components only */
.dashboard-container {
  background: var(--background);
  color: var(--foreground);
}

.dashboard-kpi-card {
  background: var(--card);
  border: 1px solid var(--border);
}

/* Let Qlik objects use their internal styling */
.qlik-object-container {
  /* No color overrides - Qlik manages internally */
  /* Only layout properties: width, height, margin */
}
```

### Testing Criteria

- ✅ Custom OKLCH colors render correctly on dashboard background and KPI cards
- ✅ Qlik objects render with default Qlik theme without visual breaks
- ✅ No CSS specificity wars between custom styles and Qlik styles
- ✅ Color contrast meets WCAG AA standards for both custom and Qlik elements

---

## Research Task 2: Framework Decision (Vanilla JS vs Lightweight React/Vue)

### Decision

Use **Vanilla JavaScript with ES6 modules** (transpiled to ES5 for Qlik compatibility). Do NOT introduce React or Vue framework.

### Rationale

**Context**: The dashboard has 6 visualization components (3 KPI cards + 5 charts) and a refresh button. Each component needs to:
- Create a Qlik hypercube
- Manage its DOM lifecycle
- Handle data updates from Qlik
- Apply custom styling from visual spec

**Analysis**:

**Vanilla JS Advantages**:
- ✅ Zero dependencies beyond Qlik APIs
- ✅ Simpler build process (Babel for ES6→ES5, no JSX compilation)
- ✅ Faster load times (no framework overhead)
- ✅ Direct control over Qlik object lifecycle (no framework lifecycle conflicts)
- ✅ Easier for team without React/Vue experience
- ✅ Qlik Mashup API examples use vanilla JS patterns
- ✅ Smaller bundle size (<50KB vs 100KB+ for React)

**React/Vue Disadvantages**:
- ❌ Additional complexity for managing Qlik object lifecycle within React lifecycle
- ❌ Larger bundle size impacts 3-second load target (SC-001)
- ❌ Framework state management competes with Qlik's reactive model
- ❌ More build tooling (Webpack, JSX/Vue compiler, React DevTools)
- ❌ Team learning curve if not familiar with framework + Qlik integration
- ❌ No significant benefit for 6 components (not 60+ components)

**Best Practice** (from Qlik community and official examples):
- Most Qlik mashups use vanilla JS or jQuery
- Framework integration is possible but adds complexity without proportional benefit for small dashboards
- ES6 modules provide sufficient code organization

### Alternatives Considered

| Alternative | Pros | Cons | Rejected Because |
|-------------|------|------|------------------|
| React | Component reusability, popular | Bundle size, lifecycle complexity | Overkill for 6 components, impacts load time |
| Vue | Lightweight, simple | Still 50KB+ min+gzip, learning curve | Vanilla JS is even lighter (0KB framework) |
| jQuery | Familiar, DOM manipulation | Legacy, large (87KB min), unnecessary | ES6 native features replace jQuery needs |
| Svelte | Compile-time, no runtime | Build complexity, team unfamiliarity | Vanilla JS is simpler for this scope |

### Implementation Pattern

```javascript
// mashup/components/kpi-card.js (ES6 module)
export class KPICard {
  constructor(container, hypercubeDef, title) {
    this.container = container;
    this.hypercubeDef = hypercubeDef;
    this.title = title;
    this.hypercube = null;
  }

  async create(app) {
    // Create Qlik hypercube
    this.hypercube = await app.createCube(this.hypercubeDef, this.render.bind(this));
  }

  render(reply) {
    // Extract data from reply.qHyperCube
    const data = reply.qHyperCube.qDataPages[0].qMatrix;

    // Update DOM (vanilla JS)
    this.container.innerHTML = `
      <div class="dashboard-kpi-card">
        <h3>${this.title}</h3>
        <p class="kpi-value">${data[0][0].qText}</p>
      </div>
    `;
  }

  destroy() {
    // Cleanup hypercube
    if (this.hypercube) {
      this.hypercube.close();
    }
  }
}

// mashup/mashup.js (main)
import { KPICard } from './components/kpi-card.js';

require(['js/qlik'], function(qlik) {
  const app = qlik.openApp('app-id', config);

  const kpi1 = new KPICard(
    document.getElementById('kpi-1'),
    { /* hypercube def */ },
    'Total Vehicles'
  );

  kpi1.create(app);
});
```

**Build Process**:
- Babel transpiles ES6 → ES5 (for Qlik compatibility)
- Webpack bundles modules into single mashup.js (optional, could use native ES6 modules in modern browsers)
- ESLint ensures code quality
- No JSX compilation, no virtual DOM overhead

### Testing Criteria

- ✅ All 6 components load and render without framework dependencies
- ✅ Bundle size < 50KB gzipped (excluding Qlik APIs)
- ✅ Dashboard loads in < 3 seconds (SC-001)
- ✅ No framework lifecycle conflicts with Qlik object updates
- ✅ Memory leaks prevented (hypercubes properly closed on destroy)

---

## Research Task 3: Dark Mode Implementation Approach

### Decision

Implement **CSS-based dark mode toggle** using CSS custom properties and a JavaScript theme switcher. Store preference in `localStorage`. Use the OKLCH dark mode colors from DASHBOARD-VISUAL-SPEC.md (lines 24-36).

### Rationale

**Context**: DASHBOARD-VISUAL-SPEC.md defines both light and dark mode color palettes. The feature spec assumes dark mode support (spec assumption #4: "Dark mode support will be implemented in a future iteration"). However, the constitution requires supporting both modes if the design system provides them.

**Analysis**:
- Visual spec provides complete dark mode palette (lines 24-36)
- Constitution principle II requires accessibility - dark mode aids users with light sensitivity
- Modern browsers support CSS custom properties
- No Qlik Sense theme dependency (Qlik objects manage their own dark mode internally)

**Implementation Strategy**:
1. Define both light and dark mode color palettes as CSS custom properties
2. Apply `data-theme="light"` or `data-theme="dark"` to `<body>` element
3. Use CSS selectors to swap color palettes: `[data-theme="dark"] { --background: oklch(0.145 0 0); }`
4. Add theme toggle button (sun/moon icon)
5. Persist preference in `localStorage`
6. Respect system preference on first load (`prefers-color-scheme` media query)

**Qlik Object Handling**:
- Qlik Sense objects have their own internal dark mode handling
- Some Qlik visualizations auto-adapt to container background color
- No need to override Qlik object dark mode - they handle it internally

### Alternatives Considered

| Alternative | Pros | Cons | Rejected Because |
|-------------|------|------|------------------|
| No dark mode | Simpler | Violates constitution principle II (accessibility) | Design spec provides dark mode, users may need it |
| Qlik theme-based | Automatic for Qlik objects | Doesn't affect custom mashup UI | Custom UI uses OKLCH colors, not Qlik theme |
| JavaScript-only | Full control | Performance hit (DOM manipulation), flash on load | CSS is declarative and more performant |
| System preference only | Respects OS settings | No user override option | Users may want different theme than OS setting |

### Implementation Notes

```css
/* mashup/styles/variables.css */

/* Light mode (default) */
:root, [data-theme="light"] {
  --background: oklch(0.96 0 0);
  --foreground: oklch(0.15 0 0);
  --card: oklch(1 0 0);
  --primary: oklch(0.55 0.22 27);
  /* ... rest of light palette */
}

/* Dark mode */
[data-theme="dark"] {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --primary: oklch(0.922 0 0);
  /* ... rest of dark palette */
}

/* Respect system preference on first load */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --background: oklch(0.145 0 0);
    /* ... dark mode colors */
  }
}
```

```javascript
// mashup/lib/theme-switcher.js

class ThemeSwitcher {
  constructor() {
    this.theme = this.getInitialTheme();
    this.applyTheme(this.theme);
  }

  getInitialTheme() {
    // 1. Check localStorage preference
    const stored = localStorage.getItem('theme');
    if (stored) return stored;

    // 2. Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // 3. Default to light
    return 'light';
  }

  applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.theme = theme;
  }

  toggle() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }
}

// Initialize theme immediately (before Qlik loads) to prevent flash
const themeSwitcher = new ThemeSwitcher();
```

**HTML Button**:
```html
<!-- In header -->
<button id="theme-toggle" class="dashboard-icon-button" aria-label="Toggle dark mode">
  <svg class="sun-icon"><!-- Sun SVG --></svg>
  <svg class="moon-icon hidden"><!-- Moon SVG --></svg>
</button>
```

### Testing Criteria

- ✅ Light mode displays OKLCH light palette correctly
- ✅ Dark mode displays OKLCH dark palette correctly
- ✅ Theme toggle switches between modes instantly
- ✅ Preference persists across browser sessions (localStorage)
- ✅ System preference respected on first visit
- ✅ No flash of unstyled content on page load
- ✅ WCAG AA contrast maintained in both modes
- ✅ Qlik objects render appropriately in both themes

---

## Research Task 4: Qlik Object Styling Strategy

### Decision

Apply **minimal scoped CSS overrides** to Qlik object containers for layout and spacing only. Do NOT override internal Qlik visualization styles. Use container classes to scope overrides and prevent global side effects.

### Rationale

**Context**: Qlik Sense generates complex SVG and HTML for visualizations. Constitution principle IV requires respecting Qlik's styling system. However, the visual spec defines specific spacing, borders, and container styles (lines 212-225: Chart Cards).

**Analysis**:

**Qlik Object Styling Layers**:
1. **Qlik internal styles**: SVG paths, chart elements, tooltips, legends (managed by Qlik)
2. **Qlik container styles**: The `<div>` that hosts the Qlik object
3. **Mashup layout styles**: Grid, flexbox, spacing around Qlik containers

**Safe to Override**:
- ✅ Container dimensions (`width`, `height`)
- ✅ Container background, borders, shadows
- ✅ Container padding and margin
- ✅ Container transitions (hover effects)
- ✅ Container z-index and positioning

**Unsafe to Override** (breaks Qlik functionality):
- ❌ SVG internal elements (chart bars, pie slices)
- ❌ Qlik tooltip styling
- ❌ Qlik selection bar styling
- ❌ Qlik legend and axis styling
- ❌ Qlik object toolbar (unless hiding entirely with `qlik.resize()`)

**Best Practice**:
- Use specific class names for Qlik containers (e.g., `.qlik-chart-container`)
- Never use `!important` overrides on Qlik-generated elements
- Test overrides thoroughly - Qlik updates may change internal structure

### Alternatives Considered

| Alternative | Pros | Cons | Rejected Because |
|-------------|------|------|------------------|
| No styling | Safest | Inconsistent with visual spec | Requirements demand custom card styling |
| Deep overrides | Full control | Breaks Qlik updates, accessibility issues | Violates constitution principle IV |
| Qlik extensions | Native integration | Complex, requires Qlik Dev Hub, harder to deploy | Mashup is simpler for this use case |

### Implementation Pattern

```css
/* mashup/styles/main.css */

/* Container styling (safe) */
.dashboard-chart-card {
  background: var(--card);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.dashboard-chart-card:hover {
  background: var(--accent);
  transform: translateY(-1px);
}

/* Qlik object container (layout only) */
.qlik-object-container {
  width: 100%;
  height: 180px; /* From visual spec */
  margin-top: 0.5rem;
  /* NO color, font, or SVG overrides */
}

/* Card header (custom, not Qlik) */
.dashboard-chart-header {
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--border);
}

.dashboard-chart-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--foreground);
}
```

```html
<!-- HTML structure -->
<div class="dashboard-chart-card">
  <div class="dashboard-chart-header">
    <h3 class="dashboard-chart-title">Brand Distribution</h3>
    <p class="dashboard-chart-description">Top 5 Manufacturers</p>
  </div>

  <!-- Qlik object renders here -->
  <div id="qlik-brand-chart" class="qlik-object-container"></div>
</div>
```

**Scoping Rules**:
1. All custom styles use `.dashboard-*` prefix
2. Qlik container uses `.qlik-object-container` (minimal styling)
3. Never target Qlik-generated classes (e.g., `.qv-object`, `.lui-*)
4. Use DevTools to inspect Qlik DOM before attempting any overrides

### Testing Criteria

- ✅ Custom card backgrounds, borders, and shadows render correctly
- ✅ Qlik charts render without visual breaks or distortions
- ✅ Hover states on containers work smoothly
- ✅ Qlik tooltips and legends remain functional
- ✅ Qlik selection bar remains clickable and visible
- ✅ Responsive breakpoints adjust container sizes appropriately
- ✅ No CSS specificity warnings in browser console

---

## Research Task 5: API Call Debouncing Best Practices for Qlik Hypercubes

### Decision

Implement **automatic debouncing via Qlik's hypercube subscription model** - do NOT manually debounce. Qlik engine already batches updates. For custom filters or search inputs, use 300ms debounce timer before calling Qlik selection APIs.

### Rationale

**Context**: Performance goal SC-004 requires dashboard refresh in < 5 seconds. Constitution principle V requires debouncing to prevent excessive API calls. However, Qlik hypercubes have built-in update batching.

**Analysis**:

**Qlik Hypercube Update Model**:
- Hypercubes are reactive - they automatically update when data or selections change
- Qlik engine batches updates internally (doesn't fire callback for every keystroke)
- Hypercube callbacks fire when Qlik determines data has stabilized
- Manual debouncing is redundant for hypercube subscriptions

**When Debouncing IS Needed**:
- Custom search inputs (before calling `app.field().selectMatch(searchTerm)`)
- Custom filter dropdowns (before calling `app.field().selectValues()`)
- Manual refresh buttons (prevent double-clicks)

**When Debouncing is NOT Needed**:
- Hypercube data callbacks (Qlik handles batching)
- Qlik object interactions (selections, zooming, panning)
- Dashboard initial load

**Best Practice**:
- Let Qlik handle hypercube update batching
- Debounce user input that triggers Qlik API calls (search, filters)
- Use 300ms timeout for search inputs (balance responsiveness vs API calls)
- Use click prevention (disabled state) for refresh buttons

### Alternatives Considered

| Alternative | Pros | Cons | Rejected Because |
|-------------|------|------|------------------|
| Debounce all hypercube callbacks | Explicit control | Interferes with Qlik's batching, delays updates | Qlik already optimizes this |
| No debouncing | Simplest | Excessive API calls on user input | Violates constitution performance principle |
| Throttling instead of debouncing | More responsive | More API calls than debouncing | Debouncing is more efficient for search |
| Server-side debouncing | Offload to Qlik | Not possible - Qlik engine handles its own batching | Qlik already does this |

### Implementation Pattern

```javascript
// mashup/lib/debounce.js

/**
 * Debounce utility for user input before Qlik API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait (default 300ms)
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Usage example: Search input
const searchInput = document.getElementById('brand-search');
const debouncedSearch = debounce((searchTerm) => {
  app.field('Brand_Canonical').selectMatch(searchTerm, false);
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Usage example: Refresh button (prevent double-click)
const refreshButton = document.getElementById('refresh-btn');
refreshButton.addEventListener('click', async () => {
  refreshButton.disabled = true; // Prevent double-click
  refreshButton.textContent = 'Refreshing...';

  try {
    await app.doReload();
  } finally {
    refreshButton.disabled = false;
    refreshButton.textContent = 'Refresh Dashboard';
  }
});

// NO debouncing needed for hypercube callbacks
app.createCube(hypercubeDef, (reply) => {
  // This callback already benefits from Qlik's internal batching
  renderChart(reply.qHyperCube);
});
```

**Debouncing Strategy Summary**:

| User Action | Debounce? | Timeout | Reason |
|-------------|-----------|---------|--------|
| Typing in search input | ✅ Yes | 300ms | Prevent API call per keystroke |
| Clicking refresh button | ✅ Yes (via disabled state) | N/A | Prevent double-click |
| Qlik object selection (native) | ❌ No | N/A | Qlik handles internally |
| Hypercube data callback | ❌ No | N/A | Qlik batches updates |
| Dropdown filter change | ✅ Yes (optional) | 200ms | Only if rapid changes expected |

### Testing Criteria

- ✅ Search input waits 300ms after last keystroke before API call
- ✅ Typing "Toyota" fires only 1 API call, not 6
- ✅ Refresh button disabled during reload operation
- ✅ Hypercube callbacks fire promptly without artificial delay
- ✅ Dashboard feels responsive (no lag perceived by user)
- ✅ Network tab shows reasonable number of API requests (not hundreds)

---

## Research Task 6: Screen Reader Compatibility Testing Approach

### Decision

Use **NVDA (Windows) and VoiceOver (macOS/iOS)** for screen reader testing. Implement ARIA labels on all custom mashup UI elements. For Qlik objects, verify Qlik's built-in accessibility features are enabled. Create a screen reader testing checklist as part of the quickstart.md acceptance criteria.

### Rationale

**Context**: Constitution principle II requires WCAG 2.1 Level AA compliance and screen reader compatibility. The feature spec mentions ARIA labels (visual spec lines 499-514) but doesn't explicitly require screen reader testing. Constitution fills this gap.

**Analysis**:

**Qlik Sense Accessibility**:
- Qlik Sense objects have built-in accessibility features
- Qlik charts include ARIA labels for data points (when configured)
- Qlik supports keyboard navigation natively
- Mashup must not break Qlik's accessibility

**Custom Mashup UI Requirements**:
- KPI cards need ARIA labels and roles
- Navigation buttons need clear labels
- Refresh button needs status announcements
- Charts need data table alternatives (Qlik provides this)
- Hebrew content must be properly announced (lang="he" attribute)

**Testing Tools**:

| Tool | Platform | Free? | Recommended? | Reason |
|------|----------|-------|--------------|--------|
| NVDA | Windows | ✅ Yes | ✅ Yes | Most popular Windows screen reader, free |
| JAWS | Windows | ❌ No ($95+) | ⚠️ Optional | Industry standard but expensive |
| VoiceOver | macOS/iOS | ✅ Yes | ✅ Yes | Built into Apple devices, widely used |
| Narrator | Windows | ✅ Yes | ⚠️ Secondary | Basic, good for quick checks |
| axe DevTools | Browser | ✅ Yes | ✅ Yes | Automated accessibility scanner |
| WAVE | Browser | ✅ Yes | ✅ Yes | Visual accessibility feedback |

**Recommended Testing Stack**:
1. **NVDA (Windows)** - Primary screen reader testing
2. **VoiceOver (macOS)** - Secondary screen reader testing (if available)
3. **axe DevTools** - Automated ARIA and contrast checks
4. **WAVE** - Visual accessibility issues

### Alternatives Considered

| Alternative | Pros | Cons | Rejected Because |
|-------------|------|------|------------------|
| No screen reader testing | Faster development | Fails WCAG compliance, violates constitution | Non-negotiable requirement |
| Automated testing only | Fast, repeatable | Misses real user experience issues | Automated tests catch ~30% of accessibility issues |
| JAWS only | Industry standard | Expensive ($95+), limits testing to paid team members | NVDA is free and equally capable |
| Narrator only | Built into Windows | Less capable than NVDA/JAWS | NVDA is free and more feature-complete |

### Implementation Approach

**ARIA Labeling Strategy**:

```html
<!-- KPI Card Example -->
<div class="dashboard-kpi-card" role="region" aria-labelledby="kpi-total-title">
  <h3 id="kpi-total-title">Total Vehicles</h3>
  <p class="kpi-value" aria-label="Total vehicles: 123,456">123,456</p>
  <p class="kpi-subtitle">רכבים רשומים 2025</p>
</div>

<!-- Navigation Example -->
<nav role="navigation" aria-label="ניווט ראשי">
  <a href="/dashboard" aria-current="page" aria-label="דשבורד - עמוד נוכחי">
    דשבורד
  </a>
</nav>

<!-- Refresh Button Example -->
<button id="refresh-btn"
        aria-label="רענן נתוני דשבורד"
        aria-live="polite"
        aria-busy="false">
  <svg aria-hidden="true"><!-- Icon --></svg>
  <span>רענן נתונים</span>
</button>

<!-- When loading -->
<script>
  async function refreshDashboard() {
    const btn = document.getElementById('refresh-btn');
    btn.setAttribute('aria-busy', 'true');
    btn.textContent = 'טוען...';

    await app.doReload();

    btn.setAttribute('aria-busy', 'false');
    btn.textContent = 'רענן נתונים';

    // Announce completion
    announceToScreenReader('הדשבורד עודכן בהצלחה');
  }

  function announceToScreenReader(message) {
    const liveRegion = document.getElementById('aria-live-region');
    liveRegion.textContent = message;
  }
</script>

<!-- Hidden live region for announcements -->
<div id="aria-live-region" aria-live="polite" aria-atomic="true" class="sr-only">
  <!-- Screen reader announcements injected here -->
</div>

<!-- Visually hidden class -->
<style>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
```

**Hebrew Language Support**:
```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
  <head>
    <meta charset="UTF-8">
    <title>דשבורד ניתוח רכבים - Union Motors</title>
  </head>
  <body>
    <!-- All content announced in Hebrew by screen readers -->
  </body>
</html>
```

**Screen Reader Testing Checklist** (to include in quickstart.md):

```markdown
## Screen Reader Accessibility Testing

### Setup
- [ ] Install NVDA (Windows): https://www.nvaccess.org/download/
- [ ] Or use VoiceOver (macOS): Cmd+F5 to enable
- [ ] Install axe DevTools browser extension
- [ ] Install WAVE browser extension

### Manual Testing with NVDA/VoiceOver

**Navigation Testing**:
- [ ] Tab through all interactive elements (buttons, links, Qlik objects)
- [ ] Verify tab order is logical (top-to-bottom, right-to-left for Hebrew)
- [ ] All interactive elements have focus indicators
- [ ] No keyboard traps (can tab in and out of Qlik objects)

**Content Announcement**:
- [ ] Page title announced: "דשבורד ניתוח רכבים"
- [ ] KPI card values announced with labels: "Total vehicles: 123,456"
- [ ] Chart titles and descriptions announced
- [ ] Qlik object data points announced (test with arrow keys)
- [ ] Refresh button state changes announced ("טוען..." → "רענן נתונים")
- [ ] Hebrew content pronounced correctly (verify lang="he")

**ARIA Implementation**:
- [ ] All icons have `aria-hidden="true"`
- [ ] All buttons have `aria-label` in Hebrew
- [ ] Navigation has `aria-current="page"` for active link
- [ ] Live regions announce updates (`aria-live="polite"`)
- [ ] Loading states use `aria-busy="true"`
- [ ] Regions have `role="region"` and `aria-labelledby`

### Automated Testing with axe DevTools

- [ ] Run axe scan on dashboard page
- [ ] Fix all Critical and Serious issues
- [ ] Document any Moderate/Minor issues (may be false positives)
- [ ] Verify color contrast passes WCAG AA (4.5:1 for normal text)

### Automated Testing with WAVE

- [ ] Run WAVE scan on dashboard page
- [ ] Verify no Errors (red icons)
- [ ] Review Alerts (yellow icons) - may be warnings, not failures
- [ ] Confirm Features (green icons) - ARIA labels present

### Qlik Object Accessibility

- [ ] Qlik charts are keyboard-navigable (arrow keys work)
- [ ] Qlik tooltips appear on focus (not just hover)
- [ ] Qlik data tables are available as alternative to charts
- [ ] Qlik selection bar is keyboard-accessible (Enter to select)

### Pass Criteria

- ✅ All manual testing items checked
- ✅ axe DevTools shows 0 Critical/Serious issues
- ✅ WAVE shows 0 Errors
- ✅ Screen reader successfully navigates entire dashboard
- ✅ All KPI values and chart data announced correctly in Hebrew
```

### Testing Criteria

- ✅ NVDA announces all dashboard content in Hebrew
- ✅ Tab navigation reaches all interactive elements in logical order
- ✅ KPI values announced with proper context (labels and units)
- ✅ Refresh button state changes announced ("loading" → "complete")
- ✅ axe DevTools reports 0 Critical/Serious issues
- ✅ WAVE reports 0 Errors
- ✅ Qlik objects remain keyboard-navigable and screen reader accessible
- ✅ No keyboard traps (can enter and exit all sections)

---

## Summary of Decisions

| Research Task | Decision | Key Rationale |
|---------------|----------|---------------|
| 1. Qlik Theme Integration | Use custom OKLCH colors for mashup UI, respect Qlik object internal styling | No conflict - separate DOM trees |
| 2. Framework Choice | Vanilla JavaScript ES6 modules (transpiled to ES5) | Zero dependencies, simpler, faster load, Qlik examples use vanilla JS |
| 3. Dark Mode | CSS-based theme switcher with localStorage persistence | Visual spec provides dark palette, accessibility requirement |
| 4. Qlik Object Styling | Minimal scoped CSS overrides (layout only, no internal styles) | Safe approach, respects Qlik updates, meets visual spec |
| 5. API Debouncing | Let Qlik handle hypercube batching, debounce user input (300ms) | Qlik already optimizes, only debounce search/filter inputs |
| 6. Screen Reader Testing | NVDA + VoiceOver + axe DevTools + WAVE, comprehensive checklist | Free tools, covers Windows/macOS, automated + manual testing |

## Implementation Readiness

All NEEDS CLARIFICATION items from plan.md have been resolved. The project is ready to proceed to **Phase 1: Data Model and Contracts**.

**Next Steps**:
1. Generate `data-model.md` (Qlik Sense data model and field definitions)
2. Generate `contracts/hypercubes.md` (Hypercube definitions for all visualizations)
3. Generate `contracts/qlik-config.md` (Qlik connection configuration)
4. Generate `quickstart.md` (Development setup and testing procedures)
5. Update agent context with technology decisions

**No Blockers**: All technical decisions made, no outstanding unknowns.
