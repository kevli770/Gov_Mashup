# Gov_Mashup Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-11-06

## Active Technologies

### Primary Stack
- **JavaScript ES6+**: Transpiled to ES5 for Qlik Sense compatibility
- **HTML5**: Semantic markup for mashup UI
- **CSS3**: Modern CSS with OKLCH color system, RTL support
- **Qlik Sense Capability APIs**: Data access and visualization via RequireJS

### Build Tools
- **Babel**: ES6 → ES5 transpilation
- **ESLint**: JavaScript linting
- **Webpack** (optional): Module bundling

### Data Platform
- **Qlik Sense Desktop/Server**: BI engine and application host
- **Gov.il Open Data Portal**: CSV data source (800MB, 4M+ records)

### Testing Tools
- **NVDA/VoiceOver**: Screen reader accessibility testing
- **axe DevTools**: Automated accessibility validation
- **WAVE**: Visual accessibility feedback
- **Chrome DevTools**: Performance and memory profiling

## Project Structure

```text
Gov_Mashup/
├── mashup/                          # Qlik Sense Mashup Application
│   ├── index.html                   # Main dashboard HTML (RTL layout)
│   ├── mashup.js                    # Core Qlik integration logic
│   ├── config/
│   │   ├── qlik-config.js          # Qlik connection configuration
│   │   ├── qlik-config.dev.js      # Development settings (Desktop)
│   │   └── qlik-config.prod.js     # Production settings (Server)
│   ├── components/                  # Custom UI components
│   │   ├── kpi-cards.js            # Three KPI card components
│   │   ├── brand-chart.js          # Pie chart component
│   │   ├── ownership-chart.js      # Bar chart component
│   │   ├── fuel-chart.js           # Donut chart component
│   │   ├── models-list.js          # Top Union models list
│   │   ├── year-chart.js           # Year distribution bar chart
│   │   └── refresh-button.js       # Data refresh control
│   ├── lib/
│   │   ├── hypercubes.js           # Hypercube definition catalog
│   │   ├── chart-helpers.js        # Chart rendering utilities
│   │   ├── hebrew-locale.js        # Hebrew number formatting
│   │   └── theme-switcher.js       # Dark/light mode toggle
│   ├── styles/
│   │   ├── main.css                # Custom mashup styles (RTL-aware)
│   │   ├── variables.css           # CSS custom properties (OKLCH colors)
│   │   ├── typography.css          # Hebrew-optimized typography
│   │   ├── responsive.css          # Breakpoints (sm/md/lg/xl)
│   │   └── qlik-overrides.css      # Minimal Qlik object style overrides
│   └── assets/
│       └── icons/                   # SVG icons (Lucide React style)
│
├── qlik-app/                        # Qlik Sense Application
│   ├── Gov_Vehicles_Data.qvf       # Qlik Sense application file
│   └── load-scripts/
│       ├── data-load.qvs           # Main data load script
│       ├── mappings.qvs            # Brand/Model/Trim standardization
│       └── calculated-fields.qvs   # Derived fields (Union flag, percentages)
│
├── specs/                           # SpecKit Documentation
│   └── 1-qlik-mashup-dashboard/
│       ├── spec.md                  # Feature specification
│       ├── plan.md                  # Implementation plan
│       ├── research.md              # Technical decisions
│       ├── data-model.md            # Qlik data model
│       ├── quickstart.md            # Development setup guide
│       ├── contracts/
│       │   ├── hypercubes.md       # Hypercube API contracts
│       │   └── qlik-config.md      # Configuration contract
│       └── checklists/
│           └── requirements.md      # Quality validation checklist
│
├── .specify/                        # SpecKit Configuration
│   ├── templates/                   # Feature templates
│   └── memory/
│       ├── constitution.md          # Project principles (v2.0.0)
│       └── agent-claude.md          # This file
│
├── DASHBOARD-VISUAL-SPEC.md         # Visual design specification
├── package.json                     # NPM dependencies
├── .eslintrc.json                  # ESLint configuration
├── .babelrc                        # Babel transpile config
└── README.md                        # Project documentation
```

## Commands

### Qlik Sense Desktop
```bash
# Start Qlik Sense Desktop (Windows)
# Launch from Start Menu → Qlik Sense Desktop
# Hub available at http://localhost:4848/hub

# Load data in Qlik app
# Open app → Data load editor → "Load data" button
```

### Mashup Development
```bash
# Serve mashup locally (option 1: VS Code Live Server)
# Right-click index.html → "Open with Live Server"

# Serve mashup locally (option 2: Python HTTP server)
cd mashup
python -m http.server 8080
# Then open http://localhost:8080/index.html

# Serve mashup locally (option 3: Node.js http-server)
npx http-server -p 8080
```

### Build Tools
```bash
# Transpile ES6 → ES5 with Babel
npx babel mashup/mashup.js --out-file mashup/dist/mashup.es5.js

# Lint JavaScript
npx eslint mashup/**/*.js

# Bundle with Webpack (if configured)
npx webpack --config webpack.config.js
```

### Testing
```bash
# Run accessibility scan with axe DevTools
# 1. Open mashup in browser with DevTools
# 2. Navigate to "axe DevTools" tab
# 3. Click "Scan ALL of my page"

# Test screen reader (NVDA on Windows)
# 1. Download and install NVDA: https://www.nvaccess.org/download/
# 2. Launch NVDA (CTRL+ALT+N)
# 3. Tab through mashup with screen reader active
# 4. Verify announcements match expectations

# Performance profiling
# 1. Open Chrome DevTools → Performance tab
# 2. Click Record
# 3. Interact with dashboard (load, refresh, hover)
# 4. Stop recording
# 5. Analyze: Load time < 3s, Refresh < 5s, Hover < 200ms
```

### Git Workflow
```bash
# Work on feature branch
git checkout 1-qlik-mashup-dashboard

# Commit and push frequently
git add .
git commit -m "feat: add KPI card hypercube integration"
git push origin 1-qlik-mashup-dashboard

# Conventional commit prefixes:
# feat: new feature
# fix: bug fix
# qlik: Qlik-specific update (API, object config)
# style: visual/CSS changes
# refactor: code improvements
# perf: performance optimization
# docs: documentation
```

## Code Style

### JavaScript (ES6+ → ES5 transpile)

```javascript
// ✅ Good: ES6 modules with named exports
export class KPICard {
  constructor(container, hypercubeDef, title) {
    this.container = container;
    this.hypercubeDef = hypercubeDef;
    this.title = title;
  }

  async create(app) {
    this.hypercube = await app.createCube(this.hypercubeDef, this.render.bind(this));
  }

  render(reply) {
    const data = reply.qHyperCube.qDataPages[0].qMatrix;
    // ... render logic
  }

  destroy() {
    if (this.hypercube) {
      app.destroySessionObject(this.hypercube.qInfo.qId);
    }
  }
}

// ✅ Good: Hebrew number formatting
const count = 123456;
const formatted = count.toLocaleString('he-IL');  // "123,456"

// ❌ Bad: Hardcoded formatting
const formatted = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// ✅ Good: Qlik Set Analysis
const expression = "Count({<Current_Year_Flag={1}, Union_Flag={1}>} DISTINCT mispar_rechev)";

// ✅ Good: Error handling for Qlik API
qlik.setOnError(function(error) {
  console.error('Qlik Error:', error.code, error.message);
  showUserFriendlyError(error);
});

// ✅ Good: Hypercube lifecycle management
let hypercubeHandle = null;

app.createCube(hypercubeDef, (reply) => {
  hypercubeHandle = reply.qHyperCube;
  renderVisualization(reply);
});

// On component unmount:
if (hypercubeHandle) {
  app.destroySessionObject(hypercubeHandle.qInfo.qId);
  hypercubeHandle = null;
}
```

### CSS (OKLCH color system, RTL-aware)

```css
/* ✅ Good: Use CSS custom properties from variables.css */
.kpi-card {
  background: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
}

/* ❌ Bad: Hardcoded colors */
.kpi-card {
  background: #ffffff;
  color: #000000;
}

/* ✅ Good: RTL-aware logical properties */
.kpi-card {
  margin-inline-start: 1rem;  /* Right in RTL, Left in LTR */
  padding-inline: 1rem;       /* Both sides */
}

/* ❌ Bad: LTR-specific properties */
.kpi-card {
  margin-left: 1rem;  /* Wrong for RTL */
}

/* ✅ Good: Responsive with mobile-first approach */
.kpi-section {
  display: grid;
  grid-template-columns: 1fr;  /* Mobile: 1 column */
}

@media (min-width: 768px) {
  .kpi-section {
    grid-template-columns: repeat(3, 1fr);  /* Desktop: 3 columns */
  }
}

/* ✅ Good: Dark mode support */
[data-theme="dark"] .kpi-card {
  background: var(--card);  /* Automatically uses dark mode value */
}
```

### Qlik Load Script (Set Analysis)

```qlik
// ✅ Good: Mapping tables for standardization
BrandMaster:
LOAD * INLINE [
Raw_Brand, Canonical_Brand
"טויוטה יפן", "Toyota"
"טויוטה טורקיה", "Toyota"
];

BrandMap:
Mapping LOAD
  Raw_Brand,
  Canonical_Brand
RESIDENT BrandMaster;

// ✅ Good: Apply mapping during load
LOAD
  ApplyMap('BrandMap', tozeret_nm, 'Unknown') as Brand_Canonical,
  *
FROM [lib://DataFiles/gov_il_vehicles.csv];

// ✅ Good: Set analysis for current year
Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)

// ✅ Good: Multiple filters (AND logic)
Count({<Current_Year_Flag={1}, Union_Flag={1}>} DISTINCT mispar_rechev)

// ❌ Bad: Manual filtering (less efficient)
Count(if(Current_Year_Flag=1 AND Union_Flag=1, mispar_rechev))
```

### HTML (Semantic, RTL, Accessible)

```html
<!-- ✅ Good: RTL layout with lang attribute -->
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>דשבורד ניתוח רכבים</title>
</head>

<!-- ✅ Good: Semantic HTML with ARIA labels -->
<nav role="navigation" aria-label="ניווט ראשי">
  <a href="/dashboard" aria-current="page">דשבורד</a>
</nav>

<div class="kpi-card" role="region" aria-labelledby="kpi-total-title">
  <h3 id="kpi-total-title">סה"כ רכבים</h3>
  <p class="kpi-value" aria-label="Total vehicles: 150,234">150,234</p>
</div>

<!-- ✅ Good: Accessible button with icon -->
<button id="refresh-btn" aria-label="רענן נתוני דשבורד">
  <svg aria-hidden="true"><!-- Icon --></svg>
  <span>רענן נתונים</span>
</button>

<!-- ❌ Bad: Missing ARIA labels -->
<button>🔄</button>
```

## Recent Changes

### Feature 1: Qlik Sense Mashup Dashboard (1-qlik-mashup-dashboard)
**Date**: 2025-11-06
**Status**: Phase 1 Complete (Planning & Design)

**What was added**:
- Complete technical planning for vehicle registration analytics dashboard
- Qlik Sense data model with 4M+ records from Gov.il portal
- 8 hypercube contracts (3 KPIs, 5 charts) using Set Analysis
- Vanilla JavaScript ES6 decision (no React/Vue framework)
- OKLCH color system with light/dark mode support
- Comprehensive testing checklist (functional, accessibility, performance)
- Hebrew/RTL layout throughout

**Key Technologies**:
- Qlik Sense Capability APIs (RequireJS-based)
- JavaScript ES6 → ES5 transpile (Babel)
- CSS custom properties (OKLCH colors)
- NVDA/VoiceOver screen reader testing
- axe DevTools accessibility validation

**Architecture Decisions** (from research.md):
1. Custom OKLCH colors for mashup UI, respect Qlik object internal styling
2. Vanilla JavaScript (no framework) for simplicity and performance
3. CSS-based dark mode with localStorage persistence
4. Minimal scoped CSS overrides (layout only, no Qlik internal styles)
5. Let Qlik handle hypercube batching, debounce user inputs (300ms)
6. NVDA + VoiceOver + axe DevTools for accessibility testing

**Data Model**:
- Fact table: VehicleRegistrations (20+ fields, 4M+ rows)
- Mapping tables: BrandMaster, ModelMaster, UnionTrimMapping
- Derived fields: Brand_Canonical, Union_Flag, Registration_Date_Actual
- Daily load with new record detection via snapshot comparison

**Performance Targets** (Success Criteria):
- Dashboard load: < 3 seconds (desktop), < 5 seconds (mobile 3G)
- Data refresh: < 5 seconds
- Hover interactions: < 200ms
- Memory: < 500MB browser footprint
- 4M+ records handled via server-side Qlik aggregation

**Next Phase**: Run `/speckit.tasks` to generate actionable implementation tasks

<!-- MANUAL ADDITIONS START -->
<!-- Add any custom guidelines, team-specific practices, or notes here -->
<!-- They will be preserved across agent context updates -->
<!-- MANUAL ADDITIONS END -->
