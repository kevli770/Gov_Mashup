# Quickstart Guide: Qlik Sense Mashup Dashboard Development

**Feature**: 1-qlik-mashup-dashboard
**Date**: 2025-11-06
**Purpose**: Step-by-step guide to set up the development environment and build the vehicle registration analytics dashboard

## Overview

This quickstart guide will walk you through:

1. **Prerequisites**: Installing required software
2. **Qlik Sense Setup**: Creating the data model and app
3. **Mashup Development**: Building the dashboard interface
4. **Testing**: Validating functionality and accessibility
5. **Deployment**: Publishing to Qlik Sense Server (optional)

**Estimated Time**: 4-6 hours for complete setup (2 hours Qlik app, 2-4 hours mashup)

---

## 📋 Prerequisites

### Required Software

| Software | Version | Purpose | Download Link |
|----------|---------|---------|---------------|
| **Qlik Sense Desktop** | Latest | Development environment for Qlik app | [qlik.com/download](https://www.qlik.com/us/trial/download-qlik-sense-desktop) |
| **Node.js** | 18+ LTS | JavaScript runtime for build tools | [nodejs.org](https://nodejs.org/) |
| **Git** | Latest | Version control | [git-scm.com](https://git-scm.com/) |
| **VS Code** | Latest | Code editor (recommended) | [code.visualstudio.com](https://code.visualstudio.com/) |
| **Modern Browser** | Latest | Chrome/Firefox/Edge for testing | Pre-installed |

### Optional Tools

| Tool | Purpose |
|------|---------|
| **Babel** | ES6→ES5 transpilation for Qlik compatibility |
| **ESLint** | JavaScript linting and code quality |
| **Prettier** | Code formatting |
| **NVDA** (Windows) | Screen reader accessibility testing |

### VS Code Extensions (Recommended)

```bash
# Install via VS Code Extensions marketplace
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- EditorConfig (editorconfig.editorconfig)
- Live Server (ritwickdey.liveserver) - for mashup preview
```

---

## 🗂️ Step 1: Clone Repository and Project Setup

### 1.1 Clone the Repository

```bash
git clone https://github.com/kevli770/Gov_Mashup.git
cd Gov_Mashup
git checkout 1-qlik-mashup-dashboard
```

### 1.2 Create Project Structure

```bash
# Create mashup directory structure
mkdir -p mashup/{config,components,lib,styles,assets/icons}

# Create Qlik app directory
mkdir -p qlik-app/load-scripts

# Verify structure
tree mashup qlik-app
```

Expected output:
```
mashup/
├── config/
├── components/
├── lib/
├── styles/
└── assets/
    └── icons/

qlik-app/
└── load-scripts/
```

### 1.3 Initialize NPM Project (Optional)

```bash
# If using build tools (Babel, Webpack, ESLint)
npm init -y

# Install dependencies
npm install --save-dev @babel/core @babel/preset-env eslint prettier
```

---

## 📊 Step 2: Qlik Sense Application Setup

### 2.1 Download Gov.il Data

**Important**: The Gov.il CSV file is large (~800MB). For development, use a sample dataset first.

#### Option A: Full Dataset (Production)

```bash
# Download from Gov.il portal
curl -o data/gov_il_vehicles.csv \
  "https://data.gov.il/dataset/private-and-commercial-vehicles/resource/053cea08-09bc-40ec-8f7a-156f0677aff3/download/..."

# Note: This may take 5-10 minutes depending on connection
```

#### Option B: Sample Dataset (Development - Recommended)

```bash
# Create a sample with first 10,000 rows for testing
head -n 10000 gov_il_vehicles.csv > data/gov_il_sample.csv
```

### 2.2 Create Qlik Sense Application

1. **Open Qlik Sense Desktop**
   - Launch Qlik Sense Desktop from Start Menu
   - Hub opens at `http://localhost:4848/hub`

2. **Create New App**
   - Click "Create new app"
   - Name: `Gov_Vehicles_Data`
   - Click "Create"

3. **Add Data Connection**
   - Click app to open
   - Click "Add data from files and other sources"
   - Navigate to `data/gov_il_sample.csv` (or full dataset)
   - Click "Add data"
   - Select all fields → "Add data"

4. **Open Data Load Editor**
   - Click hamburger menu (☰) → "Data load editor"
   - You'll see the auto-generated load script

### 2.3 Create Mapping Tables

Replace the auto-generated script with this enhanced version:

**File**: Copy this to Qlik Data Load Editor

```qlik
//============================================
// Gov.il Vehicle Registration Data Model
// Date: 2025-11-06
// Purpose: Load and transform vehicle data
//============================================

//--- SECTION 1: MAPPING TABLES ---

// Brand standardization mapping
BrandMaster:
LOAD * INLINE [
Raw_Brand, Canonical_Brand, Is_Union_Brand
"טויוטה יפן", "Toyota", 1
"טויוטה טורקיה", "Toyota", 1
"לקסוס יפן", "Lexus", 1
"לקסוס אירופה", "Lexus", 1
"הונדה יפן", "Honda", 0
"מאזדה יפן", "Mazda", 0
"קיה דרום קוריאה", "Kia", 0
"יונדאי דרום קוריאה", "Hyundai", 0
"ניסאן יפן", "Nissan", 0
"פורד ארה\"ב", "Ford", 0
];

BrandMap:
Mapping LOAD
  Raw_Brand,
  Canonical_Brand
RESIDENT BrandMaster;

// Model standardization mapping (sample - expand as needed)
ModelMaster:
LOAD * INLINE [
Raw_Model, Canonical_Model
"קורולה קרוס 1.8 היברידי", "Corolla Cross"
"קורולה קרוס 1.8 HYBRID", "Corolla Cross"
"ראב 4 2.5 HYBRID AWD", "RAV4"
"קמרי 2.5 היברידית", "Camry"
"יאריס קרוס 1.5 HYBRID", "Yaris Cross"
];

ModelMap:
Mapping LOAD
  Raw_Model,
  Canonical_Model
RESIDENT ModelMaster;

// Union trim level classification (sample - get from business)
UnionTrimMapping:
LOAD * INLINE [
Brand, Model, Trim_Level, Is_Union
"Toyota", "Corolla Cross", "C SPORT", 1
"Toyota", "Corolla Cross", "STYLE", 1
"Toyota", "RAV4", "ACTIVE", 1
"Toyota", "Camry", "XLE Premium", 1
"Lexus", "ES", "ES 300h", 1
"Lexus", "RX", "RX 450h+", 1
];

UnionTrimMap:
Mapping LOAD
  Brand & '|' & Model & '|' & Trim_Level as Trim_Key,
  Is_Union
RESIDENT UnionTrimMapping;

//--- SECTION 2: FACT TABLE LOAD ---

VehicleRegistrations_Raw:
LOAD
  mispar_rechev,
  tozeret_cd,
  sug_degem,
  tozeret_nm,
  degem_cd,
  degem_nm,
  ramat_gimur,
  ramat_eivzur_betihuty,
  kvutzat_zihum,
  shnat_yitzur,
  degem_manoa,
  Date#(mivchan_acharon_dt, 'YYYY-MM-DD') as mivchan_acharon_dt,
  Date#(tokef_dt, 'YYYY-MM-DD') as tokef_dt,
  baalut,
  misgeret,
  tzeva_cd,
  tzeva_rechev,
  zmig_kidmi,
  zmig_ahori,
  sug_delek_nm,
  horaat_rishum,
  Date#(moed_aliya_lakvish, 'YYYY-MM') as moed_aliya_lakvish_raw,
  kinuy_mishari
FROM [lib://DataFiles/gov_il_sample.csv]
(txt, utf8, embedded labels, delimiter is ',', msq);

//--- SECTION 3: DATA TRANSFORMATIONS ---

VehicleRegistrations:
LOAD
  *,
  // Apply brand standardization
  ApplyMap('BrandMap', tozeret_nm, 'Unknown') as Brand_Canonical,

  // Apply model standardization
  ApplyMap('ModelMap', kinuy_mishari, kinuy_mishari) as Model_Canonical,

  // Registration date (use load date for new records in production)
  moed_aliya_lakvish_raw as Registration_Date_Actual,

  // Derived date fields
  Year(moed_aliya_lakvish_raw) as Registration_Year,
  Month(moed_aliya_lakvish_raw) as Registration_Month_Num,

  // Current year flag (hardcoded for development)
  if(Year(moed_aliya_lakvish_raw) >= 2024, 1, 0) as Current_Year_Flag,

  // Vehicle age
  Year(Today()) - shnat_yitzur as Age_Years

RESIDENT VehicleRegistrations_Raw;

DROP TABLE VehicleRegistrations_Raw;

//--- SECTION 4: UNION CLASSIFICATION ---

Left Join (VehicleRegistrations)
LOAD
  mispar_rechev,
  // Classify as Union (1) or Parallel (0)
  ApplyMap('UnionTrimMap',
    Brand_Canonical & '|' & Model_Canonical & '|' & ramat_gimur,
    0) as Union_Flag
RESIDENT VehicleRegistrations;

// Calculate Parallel flag (inverse of Union)
Left Join (VehicleRegistrations)
LOAD
  mispar_rechev,
  1 - Union_Flag as Parallel_Flag
RESIDENT VehicleRegistrations;

//--- SECTION 5: DATA QUALITY CHECKS ---

// Count records
LET vTotalRecords = NoOfRows('VehicleRegistrations');
TRACE Total records loaded: $(vTotalRecords);

// Count current year records
LET vCurrentYearRecords = Count({<Current_Year_Flag={1}>} mispar_rechev);
TRACE Current year records: $(vCurrentYearRecords);

// Count Union vehicles
LET vUnionRecords = Count({<Union_Flag={1}>} mispar_rechev);
LET vUnionPct = $(vUnionRecords) / $(vTotalRecords) * 100;
TRACE Union Motors vehicles: $(vUnionRecords) ($(vUnionPct)%);

// Check for unmapped brands
UnmappedBrands:
LOAD
  tozeret_nm as Unmapped_Brand,
  Count(*) as Count
RESIDENT VehicleRegistrations
WHERE Brand_Canonical = 'Unknown'
GROUP BY tozeret_nm;

IF NoOfRows('UnmappedBrands') > 0 THEN
  TRACE WARNING: $(NoOfRows('UnmappedBrands')) unmapped brands found;
  FOR vRow = 0 to NoOfRows('UnmappedBrands')-1
    LET vBrand = Peek('Unmapped_Brand', $(vRow), 'UnmappedBrands');
    LET vCount = Peek('Count', $(vRow), 'UnmappedBrands');
    TRACE - $(vBrand): $(vCount) records;
  NEXT vRow
END IF

DROP TABLE UnmappedBrands;

//--- SECTION 6: SAVE QVD (optional for production) ---

// STORE VehicleRegistrations INTO [lib://DataFiles/VehicleRegistrations.qvd] (qvd);

EXIT SCRIPT;
```

### 2.4 Load Data

1. Click "Load data" button (top right)
2. Wait for load to complete (1-5 minutes depending on dataset size)
3. Check progress window for:
   - ✅ "Total records loaded: X"
   - ✅ "Current year records: Y"
   - ✅ "Union Motors vehicles: Z"
   - ⚠️ Any unmapped brand warnings

4. If errors occur:
   - Check file path is correct
   - Verify CSV encoding is UTF-8
   - Check for missing mapping table entries

### 2.5 Create Master Items (Optional but Recommended)

**Purpose**: Define reusable dimensions and measures

1. Navigate to "Master items" section
2. Create Dimensions:
   - `Brand_Canonical` → Label: "Brand"
   - `Model_Canonical` → Label: "Model"
   - `baalut` → Label: "Ownership Type"
   - `sug_delek_nm` → Label: "Fuel Type"
   - `Registration_Year` → Label: "Year"

3. Create Measures:
   - Expression: `Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)`
     Label: "Total Vehicles 2025"
   - Expression: `Count({<Current_Year_Flag={1}, Union_Flag={1}>} DISTINCT mispar_rechev)`
     Label: "Union Vehicles 2025"

### 2.6 Get Application ID

1. Right-click on the app in Qlik Sense Desktop Hub
2. Click "Properties"
3. Copy the file path (e.g., `C:\Users\kevin\Documents\Qlik\Sense\Apps\Gov_Vehicles_Data.qvf`)
4. Save this path - you'll need it for the mashup configuration

---

## 🖥️ Step 3: Mashup Development

### 3.1 Create Qlik Configuration

**File**: `mashup/config/qlik-config.js`

```javascript
// Qlik Sense Desktop development configuration
const config = {
  host: 'localhost',
  prefix: '/',
  port: 4848,
  isSecure: false,
  appId: 'C:\\Users\\YOUR_USERNAME\\Documents\\Qlik\\Sense\\Apps\\Gov_Vehicles_Data.qvf'
  // ⚠️ REPLACE with your actual file path from Step 2.6
};

export default config;
```

### 3.2 Create Main HTML File

**File**: `mashup/index.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>דשבורד ניתוח רכבים - Union Motors</title>

  <!-- Qlik Sense Styles -->
  <link rel="stylesheet" href="http://localhost:4848/resources/autogenerated/qlik-styles.css">

  <!-- Custom Styles -->
  <link rel="stylesheet" href="styles/variables.css">
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>
  <!-- Loading Indicator -->
  <div id="loading" class="loading-container">
    <div class="spinner"></div>
    <p>טוען נתונים...</p>
  </div>

  <!-- Dashboard Container -->
  <div id="dashboard-container" class="dashboard-container" style="display: none;">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="logo">
          <svg><!-- BarChart3 icon --></svg>
          <h1>דשבורד ניתוח רכבים</h1>
        </div>
        <button id="theme-toggle" aria-label="החלף ערכת נושא">
          🌙
        </button>
      </div>
    </header>

    <!-- KPI Cards -->
    <section class="kpi-section">
      <div id="kpi-total" class="kpi-card"></div>
      <div id="kpi-union" class="kpi-card"></div>
      <div id="kpi-brand" class="kpi-card"></div>
    </section>

    <!-- Charts Grid -->
    <section class="charts-section">
      <div id="chart-brand" class="chart-card"></div>
      <div id="chart-ownership" class="chart-card"></div>
      <div id="chart-fuel" class="chart-card"></div>
      <div id="chart-models" class="chart-card"></div>
      <div id="chart-years" class="chart-card"></div>
    </section>

    <!-- Refresh Button -->
    <button id="refresh-btn" class="refresh-btn">
      <svg><!-- RefreshCw icon --></svg>
      <span>רענן נתונים</span>
    </button>
  </div>

  <!-- Error Container -->
  <div id="error-container" style="display: none;"></div>

  <!-- RequireJS Configuration -->
  <script>
    var require = {
      baseUrl: 'http://localhost:4848/resources'
    };
  </script>

  <!-- Load RequireJS -->
  <script src="http://localhost:4848/resources/assets/external/requirejs/require.js"></script>

  <!-- Load Mashup Script -->
  <script src="mashup.js" type="module"></script>
</body>
</html>
```

### 3.3 Create Main Mashup Script

**File**: `mashup/mashup.js`

```javascript
import config from './config/qlik-config.js';

// Main mashup initialization
require(['js/qlik'], function(qlik) {
  // Error handling
  qlik.setOnError(function(error) {
    console.error('Qlik Error:', error);
    showError('שגיאה בחיבור ל-Qlik Sense: ' + error.message);
  });

  // Open Qlik app
  const app = qlik.openApp(config.appId, config);

  // Verify app connection
  app.getAppLayout(function(layout) {
    console.log('✓ App connected:', layout.qTitle);
    console.log('✓ Last reload:', layout.qLastReloadTime);

    // Hide loading, show dashboard
    document.getElementById('loading').style.display = 'none';
    document.getElementById('dashboard-container').style.display = 'block';

    // Initialize dashboard components
    initializeKPIs(app);
    initializeCharts(app);
    initializeRefreshButton(app);
    initializeThemeToggle();
  });
});

// Initialize KPI Cards
function initializeKPIs(app) {
  // KPI 1: Total Vehicles
  app.createCube({
    qInitialDataFetch: [{ qTop: 0, qLeft: 0, qHeight: 1, qWidth: 1 }],
    qDimensions: [],
    qMeasures: [{
      qDef: { qDef: "Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)" },
      qLabel: "Total Vehicles"
    }],
    qSuppressZero: false,
    qSuppressMissing: false,
    qMode: "S",
    qStateName: "$"
  }, function(reply) {
    const value = reply.qHyperCube.qDataPages[0].qMatrix[0][0];
    renderKPI('kpi-total', 'סה"כ רכבים רשומים', value.qNum, 'רכבים פרטיים ומסחריים 2025');
  });

  // KPI 2: Union Motors (implementation similar)
  // KPI 3: Top Brand (implementation similar)
}

// Initialize Charts
function initializeCharts(app) {
  // Chart 1: Brand Distribution (implementation)
  // Chart 2: Ownership (implementation)
  // ... etc
}

// Helper: Render KPI Card
function renderKPI(containerId, title, value, subtitle) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="kpi-content">
      <h3 class="kpi-title">${title}</h3>
      <p class="kpi-value">${value.toLocaleString('he-IL')}</p>
      <p class="kpi-subtitle">${subtitle}</p>
    </div>
  `;
}

// Helper: Show Error
function showError(message) {
  document.getElementById('loading').style.display = 'none';
  const errorContainer = document.getElementById('error-container');
  errorContainer.innerHTML = `<div class="error-message"><p>${message}</p></div>`;
  errorContainer.style.display = 'block';
}

// Initialize Refresh Button
function initializeRefreshButton(app) {
  const btn = document.getElementById('refresh-btn');
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = 'מרענן...';

    try {
      await app.doReload();
      btn.textContent = 'נתונים עודכנו ✓';
      setTimeout(() => {
        btn.innerHTML = '<svg><!-- icon --></svg><span>רענן נתונים</span>';
        btn.disabled = false;
      }, 2000);
    } catch (error) {
      console.error('Reload failed:', error);
      btn.textContent = 'שגיאה בעדכון';
      btn.disabled = false;
    }
  });
}

// Initialize Theme Toggle
function initializeThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', currentTheme);

  btn.addEventListener('click', () => {
    const theme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    btn.textContent = theme === 'light' ? '🌙' : '☀️';
  });
}
```

### 3.4 Create CSS Variables

**File**: `mashup/styles/variables.css`

```css
/* OKLCH Color System from DASHBOARD-VISUAL-SPEC.md */

:root, [data-theme="light"] {
  --background: oklch(0.96 0 0);
  --foreground: oklch(0.15 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0 0);
  --primary: oklch(0.55 0.22 27);
  --primary-foreground: oklch(1 0 0);
  --muted: oklch(0.92 0 0);
  --muted-foreground: oklch(0.5 0 0);
  --accent: oklch(0.92 0 0);
  --accent-foreground: oklch(0.15 0 0);
  --border: oklch(0.92 0 0);

  /* Chart colors */
  --chart-1: hsl(0, 72%, 51%);
  --chart-2: hsl(0, 70%, 35%);
  --chart-3: hsl(0, 60%, 70%);
  --chart-4: hsl(0, 80%, 25%);
  --chart-5: hsl(0, 50%, 85%);
}

[data-theme="dark"] {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --border: oklch(1 0 0 / 10%);
}
```

### 3.5 Create Main Styles

**File**: `mashup/styles/main.css`

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: var(--background);
  color: var(--foreground);
  direction: rtl;
  transition: background 0.3s, color 0.3s;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

/* KPI Cards */
.kpi-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.kpi-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s;
  cursor: pointer;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.kpi-title {
  font-size: 0.875rem;
  color: var(--muted-foreground);
  margin-bottom: 0.5rem;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 0.25rem;
}

.kpi-subtitle {
  font-size: 0.75rem;
  color: var(--muted-foreground);
}

/* Charts */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.chart-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  min-height: 250px;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 1rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--muted);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Refresh Button */
.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: var(--primary-foreground);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.refresh-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Error */
.error-message {
  background: hsl(0, 80%, 95%);
  color: hsl(0, 80%, 30%);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid hsl(0, 80%, 80%);
  margin: 2rem;
}
```

### 3.6 Test the Mashup

1. **Ensure Qlik Sense Desktop is Running**
   - Open Qlik Sense Desktop
   - Verify the app is loaded and accessible at `http://localhost:4848/hub`

2. **Serve the Mashup Locally**
   ```bash
   # Option A: Using VS Code Live Server extension
   # Right-click index.html → "Open with Live Server"

   # Option B: Using Python HTTP server
   cd mashup
   python -m http.server 8080

   # Option C: Using Node.js http-server
   npx http-server -p 8080
   ```

3. **Open in Browser**
   ```
   http://localhost:8080/index.html
   ```

4. **Expected Behavior**:
   - ✅ Loading spinner appears briefly
   - ✅ Dashboard container loads
   - ✅ KPI cards display numbers (e.g., "150,234")
   - ✅ Charts render (may be empty if using minimal hypercube implementation)
   - ✅ No console errors related to Qlik connection
   - ✅ Hebrew text displays correctly in RTL layout

5. **Troubleshooting**:

   | Issue | Solution |
   |-------|----------|
   | "Failed to connect" error | Check Qlik Desktop is running on port 4848 |
   | CORS error in console | Serve mashup from `http://`, not `file://` protocol |
   | "App not found" | Verify `appId` path in config matches actual file location |
   | Blank KPI cards | Check Qlik load script ran successfully, data exists |
   | Hebrew text appears LTR | Verify `<html lang="he" dir="rtl">` in index.html |

---

## 🧪 Step 4: Testing

### 4.1 Functional Testing Checklist

```markdown
## Functional Testing

### Data Display
- [ ] KPI 1 shows total vehicle count for current year
- [ ] KPI 2 shows Union Motors count and percentage
- [ ] KPI 3 shows top brand name and count
- [ ] All numbers display with Hebrew locale formatting (123,456)
- [ ] Charts render with correct data from hypercubes

### Interactivity
- [ ] Refresh button triggers data reload
- [ ] Refresh button disables during reload
- [ ] Theme toggle switches between light/dark modes
- [ ] Theme preference persists across sessions (localStorage)

### Qlik Integration
- [ ] Dashboard connects to Qlik app on load
- [ ] Hypercubes return expected data structure
- [ ] Set analysis filters work (Current_Year_Flag, Union_Flag)
- [ ] No Qlik API errors in console

### Error Handling
- [ ] Graceful error message if Qlik connection fails
- [ ] Loading spinner hides on success or error
- [ ] Console logs helpful debug information
```

### 4.2 Visual/Design Testing

```markdown
## Visual Testing (against DASHBOARD-VISUAL-SPEC.md)

### Colors
- [ ] Light mode: Background oklch(0.96 0 0), Cards oklch(1 0 0)
- [ ] Dark mode: Background oklch(0.145 0 0), Cards oklch(0.205 0 0)
- [ ] Primary color: oklch(0.55 0.22 27) in light mode
- [ ] Chart colors use --chart-1 through --chart-5 variables

### Typography
- [ ] Titles: font-size matches spec (text-xl md:text-2xl)
- [ ] KPI values: Large, bold (text-2xl md:text-3xl font-extrabold)
- [ ] Subtitles: Small, muted (text-xs text-muted-foreground)

### Layout
- [ ] RTL layout throughout
- [ ] Responsive grid: 1 col mobile → 3 cols desktop (KPIs)
- [ ] Spacing matches spec (gap-2 = 0.5rem)

### Animations
- [ ] Hover states on KPI cards (translateY(-2px))
- [ ] Smooth transitions (transition: all 0.3s)
- [ ] Refresh button icon rotates on hover (if implemented)
```

### 4.3 Accessibility Testing

Follow the screen reader testing checklist from [research.md](research.md#research-task-6-screen-reader-compatibility-testing-approach):

```markdown
## Accessibility Testing

### NVDA/VoiceOver Testing
- [ ] Install NVDA (Windows) or enable VoiceOver (macOS)
- [ ] Tab through all interactive elements
- [ ] Verify KPI values announced with labels
- [ ] Check theme toggle has aria-label
- [ ] Verify refresh button state changes announced

### Automated Testing
- [ ] Install axe DevTools browser extension
- [ ] Run scan on dashboard page
- [ ] Fix all Critical/Serious issues
- [ ] Verify color contrast passes WCAG AA (4.5:1)

### Keyboard Navigation
- [ ] All buttons reachable via Tab key
- [ ] Enter key activates buttons
- [ ] No keyboard traps
- [ ] Focus indicators visible
```

### 4.4 Performance Testing

```markdown
## Performance Testing (Success Criteria from spec.md)

### Load Time
- [ ] SC-001: Dashboard loads in < 3 seconds (desktop, localhost)
- [ ] SC-004: Refresh completes in < 5 seconds
- [ ] SC-009: Hover interactions respond within 200ms

### Data Handling
- [ ] SC-012: Dashboard handles full dataset without crashes
- [ ] Hypercube queries use server-side aggregation (not client-side)
- [ ] No memory leaks (check DevTools Memory tab)

### Hebrew Formatting
- [ ] SC-002: Numbers format with Hebrew locale (he-IL)
- [ ] SC-003: All Hebrew text displays correctly
- [ ] RTL layout preserved on mobile
```

---

## 🚀 Step 5: Next Steps

### Phase 2: Implementation (Not covered in /speckit.plan)

The `/speckit.plan` command stops after Phase 1 (planning and design). To proceed with implementation:

1. **Run `/speckit.tasks`**: Generate actionable task list from this plan
2. **Run `/speckit.implement`**: Execute the tasks and build the dashboard

### Optional Enhancements

After completing the core dashboard, consider:

1. **Add detailed charts**: Implement all 5 chart visualizations using hypercube data
2. **Drill-down capability**: Add click-to-filter functionality on charts
3. **Export functionality**: Allow users to export data to Excel/PDF
4. **Mobile optimization**: Enhance mobile layout and touch interactions
5. **Additional KPIs**: Add more business metrics based on user feedback

### Deployment to Qlik Sense Server

When ready for production:

1. Update `qlik-config.js` with Server settings:
   ```javascript
   appId: 'YOUR-SERVER-APP-GUID'  // Not file path
   host: 'qlik-server.unionmotors.local'
   isSecure: true
   port: 443
   ```

2. Deploy mashup files to Server:
   - Via QMC (Qlik Management Console) → Extensions
   - Or via file system: `C:\ProgramData\Qlik\Sense\Repository\Extensions\`

3. Configure authentication (NTLM, Header, or Ticket)

4. Test in Server environment with actual users

---

## 📚 Additional Resources

### Documentation
- [Qlik Sense Mashup API Reference](https://help.qlik.com/en-US/sense-developer/APIs/)
- [Qlik Capability APIs Guide](https://help.qlik.com/en-US/sense-developer/Subsystems/APIs/Content/Sense_ClientAPIs/CapabilityAPIs/qlik-interface.htm)
- [Set Analysis Syntax](https://help.qlik.com/en-US/sense/Content/Sense_Helpsites/ChartFunctions/SetAnalysis/set-analysis.htm)

### Project Documentation
- [Feature Specification](spec.md) - Business requirements and success criteria
- [Implementation Plan](plan.md) - Technical architecture and decisions
- [Research Document](research.md) - Technology choices and rationale
- [Data Model](data-model.md) - Qlik data structure and transformations
- [Hypercube Contracts](contracts/hypercubes.md) - Complete hypercube definitions
- [Qlik Config Contract](contracts/qlik-config.md) - Connection configuration guide

### Support
- **Qlik Community**: [community.qlik.com](https://community.qlik.com)
- **Stack Overflow**: Tag `qlik-sense` for technical questions
- **Project Issues**: https://github.com/kevli770/Gov_Mashup/issues

---

**Last Updated**: 2025-11-06
**Phase**: 1 (Planning & Design) - Complete ✅
**Next Phase**: Tasks Generation (`/speckit.tasks`)
