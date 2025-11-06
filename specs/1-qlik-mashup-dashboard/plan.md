# Implementation Plan: Qlik Sense Mashup Dashboard for Vehicle Registration Analytics

**Branch**: `1-qlik-mashup-dashboard` | **Date**: 2025-11-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/1-qlik-mashup-dashboard/spec.md`
**Last Updated**: 2025-11-06 with user clarifications

> **CRITICAL CLARIFICATIONS**:
> - **Data Source**: 42-field structure from "table for example.xlsx" (actual raw table)
> - **Data Loading**: Entirely within Qlik Sense load script (see [qlik-app/load-scripts/data-load.qvs](../../qlik-app/load-scripts/data-load.qvs))
> - **Technology Stack**: Vanilla HTML/CSS/JS + Qlik Capabilities API (**NO** Next.js, React, Vue, or frameworks)
> - **Visual Reference**: DASHBOARD-VISUAL-SPEC.md is VISUAL INSPIRATION ONLY (colors, layout) - NOT technical implementation guide

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a Qlik Sense mashup dashboard that displays vehicle registration analytics from the Gov.il portal dataset. The dashboard will provide competitive intelligence for Union Motors by showing real-time market metrics including total vehicles, Union Motors market share, brand distribution, ownership types, fuel types, top Union models, and year-over-year trends. The implementation uses Qlik Sense Capability APIs with hypercubes for server-side data aggregation, custom visualizations following the DASHBOARD-VISUAL-SPEC.md design system, and full Hebrew/RTL support.

## Technical Context

**Language/Version**: JavaScript ES6+ (transpiled to ES5 for Qlik compatibility) / HTML5 / CSS3
**Primary Dependencies**:
- Qlik Sense Capability APIs (qlik.js via RequireJS)
- Qlik Sense Server or Desktop (data engine and application host)
- RequireJS (module loader for Qlik resources)
- Optional: Modern chart library compatible with hypercube data (evaluated in research phase)

**Storage**:
- Qlik Sense application (.qvf file) with data model
- Data source: Gov.il CSV/Excel with 42-field structure (loaded via Qlik load script)
- No separate database - all data managed by Qlik Sense engine
- Data volume determined from actual loaded data (not pre-assumed)

**Testing**:
- Manual browser testing with connected Qlik app (Chrome, Firefox, Edge, Safari)
- Accessibility testing for custom mashup UI (WCAG 2.1 AA compliance)
- Cross-environment testing (Qlik Sense Desktop and Server if available)
- Memory leak testing for Qlik object lifecycle management

**Target Platform**:
- Web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Qlik Sense Server (authenticated web deployment) or Qlik Sense Desktop (development)
- Responsive support for mobile (iOS Safari, Chrome), tablet, and desktop viewports

**Project Type**: Web mashup (single-page dashboard with Qlik integration)

**Performance Goals**:
- Initial dashboard load: < 3 seconds on desktop, < 5 seconds on mobile (3G)
- Dashboard refresh (data reload): < 5 seconds for current year aggregations
- Qlik object rendering: < 1 second per object
- Hypercube data fetch: < 2 seconds for aggregated queries (server-side processing)
- Smooth interactions: Hover states respond within 200ms

**Constraints**:
- MUST use Qlik Sense Capability APIs exclusively for data access (no direct database queries)
- MUST maintain Qlik associative experience (selections propagate across objects)
- MUST respect Qlik Sense security and data governance (section access, data reduction)
- MUST work within Qlik Server Content Security Policy constraints
- Hebrew/RTL layout MUST be preserved across all responsive breakpoints
- Data refresh limited to daily (Gov.il portal updates daily, not real-time)
- Historical data limited to 1996-present (based on Gov.il dataset)
- Performance constrained by Qlik engine capacity (4+ million records aggregated server-side)

**Scale/Scope**:
- Data structure: 42 fields from source table (see "table for example.xlsx")
- Data loading: Via Qlik Sense load script with mapping transformations
- Current year focus: Primarily current year data with historical comparisons (last 5 years)
- Visualizations: 3 KPI cards, 5 charts (pie, bar, donut, list, trend)
- User base: Sales Planning and Product Division team (< 50 concurrent users expected)
- Qlik app size: Determined by actual data volume

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Core Principles Compliance

#### I. Data-First Visualization ✅ PASS
- ✅ All visualizations use Qlik hypercubes (FR-026, FR-027, FR-028)
- ✅ No manual data replication - server-side aggregation specified
- ✅ Qlik selections preserved (FR-025: all visualizations update together)
- ✅ Hebrew number formatting follows Qlik locale (FR-010: toLocaleString('he-IL'))
- ✅ Data flows through Qlik engine (SC-001, SC-004: performance metrics via engine)
- ✅ Security respected (FR-030: error handling, no bypass of Qlik governance)

**Justification**: Feature spec explicitly requires hypercubes for all data access and server-side aggregation.

#### II. Responsive & Accessible Design ✅ PASS
- ✅ Mobile-first approach (FR-020: responsive from mobile to desktop)
- ✅ Touch targets specified (visual spec: 44px minimum from iOS/Android standards)
- ✅ Color contrast (DASHBOARD-VISUAL-SPEC.md: OKLCH color space for perceptual uniformity)
- ✅ ARIA labels required (visual spec lines 499-514: accessibility features)
- ✅ Keyboard navigation (implied in FR-023, FR-024: interactive elements)
- ⚠️ Screen reader testing: Not explicitly in spec but required by constitution

**Action Required**: Add explicit screen reader compatibility testing to Phase 1 quickstart.md

#### III. RTL & Hebrew Support ✅ PASS
- ✅ RTL layout mandatory (FR-009: Dashboard MUST display in RTL)
- ✅ Hebrew locale formatting (FR-010: toLocaleString('he-IL'))
- ✅ Text alignment (visual spec: natural RTL alignment)
- ✅ Qlik objects configured for RTL (to be validated in research phase)
- ✅ Custom CSS for RTL (visual spec: inline-start/end logical properties)
- ✅ Icons positioned for RTL (visual spec lines 402-418: RTL support section)
- ✅ Hebrew Unicode support (all user-facing text in Hebrew per spec)

**Justification**: Hebrew/RTL is a core requirement throughout the feature specification.

#### IV. Qlik Sense API Integration ✅ PASS
- ✅ Objects created via proper APIs (FR-026: Qlik Capability APIs, FR-027: app.createCube)
- ✅ Lifecycle management (FR-030: error handling implies proper lifecycle)
- ✅ Selection API usage (FR-022: refresh button, FR-025: synchronized updates)
- ✅ Hypercubes via proper APIs (FR-027, FR-028: createCube with dimensions/measures)
- ⚠️ Custom properties: N/A (not creating Qlik extensions, only mashup)
- ✅ Error handling (FR-030: connection failures, data load errors)
- ⚠️ Qlik theming: Visual spec provides custom design - need to verify coexistence

**Action Required**: Research phase must address Qlik theme integration with custom OKLCH colors from DASHBOARD-VISUAL-SPEC.md

#### V. Performance & User Experience ✅ PASS
- ✅ Initial load < 3 seconds (SC-001: explicit performance target)
- ✅ Non-blocking rendering (SC-001: all visualizations render together)
- ✅ Hypercube paging (FR-028: qHeight, qWidth specified - paging pattern)
- ✅ Efficient DOM manipulation (visual spec: hover states, animations)
- ⚠️ API call debouncing: Not explicitly specified - should be implemented
- ✅ Reduced motion support (visual spec lines 342-378: animation specifications)
- ✅ Desktop/Server performance handled (SC-012: 4M+ records without crashes)

**Action Required**: Add API call debouncing best practice to research.md

### Technology Stack Compliance

#### Mandatory Qlik Sense Stack ✅ PASS
- ✅ Platform: Qlik Sense (FR-026, assumption #1)
- ✅ Capability APIs: Required (FR-026)
- ✅ RequireJS: Implied by Qlik integration (hypercube.txt example shows require.js pattern)
- ✅ Authentication: Qlik Sense handles (out of scope per spec, assumption #5)
- ✅ JavaScript ES5+: Compatible (technical context specifies ES6→ES5 transpile)
- ✅ Resources access: Required for Qlik APIs (standard Qlik mashup pattern)

#### Frontend Technologies ✅ PASS
- ✅ HTML5: Required for mashup containers
- ✅ CSS3: Modern CSS with RTL support (DASHBOARD-VISUAL-SPEC.md)
- ✅ JavaScript: ES6+ → ES5 transpile (technical context)
- ⚠️ Framework: Not specified - research phase must evaluate lightweight options (vanilla JS vs React/Vue)

**Action Required**: Research phase must decide on framework (vanilla JS recommended for simplicity, or lightweight React if justified)

#### Qlik Integration Standards ✅ PASS
- ✅ RequireJS for Qlik modules (hypercube.txt lines 15-18 shows pattern)
- ✅ qlik.openApp connection (hypercube.txt line 32 shows pattern)
- ✅ Authentication handling (out of scope, Qlik handles)
- ⚠️ Theming: Custom design system vs Qlik theme needs resolution
- ✅ Desktop/Server testing (SC-012, testing requirements)
- ⚠️ Extensions: N/A (creating mashup, not extension)

#### Color & Styling Standards ⚠️ NEEDS RESEARCH
- ✅ CSS custom properties (DASHBOARD-VISUAL-SPEC.md lines 7-45: CSS variables)
- ⚠️ Respect Qlik theme: Custom OKLCH colors specified - need coexistence strategy
- ⚠️ Light/dark mode: Visual spec defines both - verify Qlik theme interaction
- ✅ Colorblind-friendly: OKLCH color space provides perceptual uniformity
- ⚠️ Qlik object styling: Custom styling must not break Qlik objects

**Action Required**: Research phase MUST address:
1. How custom OKLCH colors coexist with Qlik Sense theme
2. Whether to override Qlik object styling or use Qlik theme with custom container styling
3. Dark mode implementation strategy (custom CSS or Qlik theme integration)

### Quality Standards Compliance

#### Visual Consistency ✅ PASS
- ✅ Reference to DASHBOARD-VISUAL-SPEC.md (spec lines 658-667, Notes section)
- ✅ Spacing scale defined (visual spec lines 72-79)
- ✅ Typography system (visual spec lines 382-398)
- ✅ Border radius tokens (visual spec lines 484-493)
- ✅ Hover states and animations (visual spec lines 342-378)
- ⚠️ Qlik object styling: Need consistency strategy

#### Code Quality Gates ✅ PASS (with additions)
- ✅ JavaScript compilation: ES6→ES5 transpile required
- ✅ Linting: ESLint should be configured
- ✅ Browser testing: Required with Qlik app connected
- ✅ Console error-free: Qlik API errors must be handled
- ✅ Object rendering: Qlik objects must render and respond
- ✅ Memory leak checks: Object lifecycle management critical

#### Testing Requirements ⚠️ OPTIONAL (per constitution)
- Constitution states tests are optional unless explicitly requested
- Feature spec does not explicitly require automated tests
- Manual testing is required (browser, accessibility, cross-environment)
- Automated testing can be added in future if needed

### Constitution Compliance Summary

**Status**: ✅ **READY FOR PHASE 0 RESEARCH** (with research tasks identified)

**Violations**: None

**Research Tasks Required**:
1. Qlik theme integration strategy with custom OKLCH colors
2. Framework decision (vanilla JS vs lightweight React/Vue)
3. Dark mode implementation approach
4. Qlik object styling strategy (custom CSS scope and limits)
5. API call debouncing best practices for Qlik hypercubes
6. Screen reader compatibility testing approach for custom mashup UI

These are not violations but areas requiring technical research before implementation.

## Project Structure

### Documentation (this feature)

```text
specs/1-qlik-mashup-dashboard/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command) - PENDING
├── data-model.md        # Phase 1 output (/speckit.plan command) - PENDING
├── quickstart.md        # Phase 1 output (/speckit.plan command) - PENDING
├── contracts/           # Phase 1 output (/speckit.plan command) - PENDING
│   ├── hypercubes.md   # Hypercube definitions for all visualizations
│   └── qlik-config.md  # Qlik connection configuration contract
├── checklists/
│   └── requirements.md  # Specification quality checklist (COMPLETED)
└── spec.md              # Feature specification (COMPLETED)
```

### Source Code (repository root)

```text
# Qlik Sense Mashup Structure
mashup/
├── index.html                    # Main dashboard HTML (RTL layout)
├── mashup.js                     # Core Qlik integration logic
├── styles/
│   ├── main.css                  # Custom mashup styles (OKLCH colors, RTL)
│   ├── variables.css             # CSS custom properties from visual spec
│   ├── typography.css            # Hebrew-optimized typography scale
│   ├── responsive.css            # Responsive breakpoints (sm/md/lg/xl)
│   └── qlik-overrides.css        # Minimal Qlik object style overrides (if needed)
├── components/                   # Custom UI components (optional framework)
│   ├── kpi-cards.js             # Three KPI card components with hover states
│   ├── brand-chart.js           # Pie chart component (hypercube integration)
│   ├── ownership-chart.js       # Bar chart component
│   ├── fuel-chart.js            # Donut chart component
│   ├── models-list.js           # Top Union models list component
│   ├── year-chart.js            # Year distribution bar chart
│   └── refresh-button.js        # Data refresh control
├── config/
│   └── qlik-config.js           # Qlik app ID, server URL, auth settings
├── lib/
│   ├── hypercubes.js            # Hypercube definition catalog
│   ├── chart-helpers.js         # Chart rendering utilities (if using library)
│   └── hebrew-locale.js         # Hebrew number formatting utilities
└── assets/
    ├── icons/                    # Lucide React icon set (or equivalent)
    └── images/                   # Logo and visual assets

# Qlik Sense Application (separate from mashup code)
qlik-app/
├── Gov_Vehicles_Data.qvf         # Qlik Sense application file
└── load-scripts/
    ├── data-load.qvs             # Main data load script (CSV from Gov.il)
    ├── mappings.qvs              # Brand/Model/Trim standardization mappings
    └── calculated-fields.qvs     # Derived fields (Union flag, percentages)

# Project Configuration
├── package.json                  # NPM dependencies (if using build tools)
├── .eslintrc.json               # ESLint configuration
├── .babelrc                     # Babel transpile config (ES6→ES5)
├── webpack.config.js            # Webpack bundler config (optional)
└── README.md                     # Project documentation

# SpecKit Documentation (already exists)
specs/
└── 1-qlik-mashup-dashboard/     # This feature's planning docs
```

**Structure Decision**:

This is a **web mashup project** with clear separation between:

1. **Mashup code** (`mashup/`): The HTML/CSS/JavaScript dashboard that integrates with Qlik Sense via Capability APIs. This is the primary development focus.

2. **Qlik application** (`qlik-app/`): The Qlik Sense .qvf file and load scripts. This is created/maintained separately in Qlik Sense Desktop or Server UI but documented here for completeness.

3. **SpecKit documentation** (`specs/1-qlik-mashup-dashboard/`): Feature planning, research, data model, and contracts.

The mashup follows a **component-based architecture** where each visualization (KPI card, chart) is a self-contained module that:
- Creates its own Qlik hypercube via `app.createCube()`
- Manages its own DOM rendering and lifecycle
- Handles its own error states and loading indicators
- Responds to Qlik selection changes automatically (via hypercube subscription)

This structure enables:
- **Independent development**: Each component can be built and tested separately
- **Reusability**: Components can be reused across multiple dashboards if needed
- **Maintainability**: Clear separation of concerns (Qlik integration, styling, business logic)
- **Testability**: Each component can be tested with mock hypercube data

The decision to use a component-based approach (whether vanilla JS modules or a lightweight framework) will be finalized in the research phase.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. Constitution check passed with research tasks identified but no principle violations requiring justification.

