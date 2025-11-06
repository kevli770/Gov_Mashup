# Implementation Tasks: Qlik Sense Mashup Dashboard

**Feature**: `1-qlik-mashup-dashboard`
**Generated**: 2025-11-06
**Branch**: `1-qlik-mashup-dashboard`

> **Technology Stack**: Vanilla JavaScript ES6 (transpiled to ES5), HTML5, CSS3, Qlik Sense Capabilities API
> **No Frameworks**: NO React, Next.js, Vue, or other frameworks per user clarification

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)
**User Story 1 Only** - View Real-Time Vehicle Market Overview (P1):
- 3 KPI cards (Total Vehicles, Union Motors, Top Brand)
- Basic dashboard layout with RTL/Hebrew support
- Qlik connection and hypercube integration
- Data loaded via Qlik Sense load script

**Why this MVP**:
- Delivers immediate business value (market overview)
- Validates entire technical stack (Qlik integration, RTL, Hebrew locale)
- Independently testable
- Can ship to users for feedback before building additional charts

### Incremental Delivery Plan
1. **Phase 3 (US1)**: KPI cards → Ship MVP
2. **Phase 4 (US2)**: Brand & ownership charts → Ship v1.1
3. **Phase 5 (US3)**: Fuel & models charts → Ship v1.2
4. **Phase 6 (US4)**: Year trends chart → Ship v1.3
5. **Phase 7**: Polish & accessibility → Ship v2.0

---

## Task Summary

- **Total Tasks**: 52
- **Parallelizable Tasks**: 24
- **Setup & Foundation**: 18 tasks
- **User Story 1 (P1)**: 10 tasks
- **User Story 2 (P2)**: 8 tasks
- **User Story 3 (P3)**: 6 tasks
- **User Story 4 (P4)**: 4 tasks
- **Polish & Cross-Cutting**: 6 tasks

---

## Dependencies & Execution Order

### Story Completion Order
```
Phase 1 (Setup)
    ↓
Phase 2 (Foundation) ← BLOCKING: Must complete before user stories
    ↓
Phase 3 (US1) ← MVP - Can ship independently
    ↓
Phase 4 (US2) ← Independent of US1 (different hypercubes)
    ↓
Phase 5 (US3) ← Independent of US2 (different hypercubes)
    ↓
Phase 6 (US4) ← Independent of US3 (different hypercubes)
    ↓
Phase 7 (Polish) ← Requires all stories complete
```

### Critical Path
```
T001-T011 (Setup) → T012-T018 (Foundation) → T019 (Qlik Connection Test) → T020-T029 (US1 KPI Cards)
```

**Blocking Tasks**:
- T012-T014: Qlik load script and data loading (blocks all Qlik work)
- T015-T016: Master Items setup in Qlik Sense (blocks hypercube development)
- T019: Qlik connection configuration (blocks all data fetching)
- T020: Connection validation (blocks all components)

**Parallel Opportunities**:
- Within each user story: Hypercube definitions can be written in parallel
- Across stories: US2, US3, US4 can be implemented in parallel (different hypercubes, different components)

---

## Phase 1: Setup & Project Initialization

**Goal**: Create project structure, install dependencies, configure build tools

### Tasks

- [ ] T001 Create project directory structure per plan.md (mashup/, qlik-app/, specs/)
- [ ] T002 Initialize Git repository with .gitignore (exclude node_modules, .qvf, dist/)
- [ ] T003 Create package.json with Babel and ESLint dependencies
- [ ] T004 [P] Configure Babel transpiler (.babelrc) for ES6→ES5 compatibility
- [ ] T005 [P] Configure ESLint (.eslintrc.json) with ES6 rules
- [ ] T006 [P] Create mashup/index.html with RTL layout and Hebrew lang attribute
- [ ] T007 [P] Create mashup/styles/variables.css with OKLCH color system from DASHBOARD-VISUAL-SPEC.md
- [ ] T008 [P] Create mashup/styles/main.css with RTL-aware layout (inline-start/end)
- [ ] T009 [P] Create mashup/styles/typography.css with Hebrew-optimized font scale
- [ ] T010 [P] Create mashup/styles/responsive.css with mobile-first breakpoints (sm/md/lg/xl)
- [ ] T011 Create mashup/config/qlik-config.js for Qlik Sense connection settings

**Parallel Execution Example**:
```bash
# Run in parallel (different files, no dependencies):
T004, T005, T007, T008, T009, T010
```

---

## Phase 2: Foundational Components (BLOCKING)

**Goal**: Implement data loading, Qlik connection, and core infrastructure needed by all user stories

**⚠️ CRITICAL**: This phase must complete before any user story implementation can begin.

### Tasks

- [ ] T012 Validate Qlik Sense load script in qlik-app/load-scripts/data-load.qvs (already created)
- [ ] T013 Load data into Qlik Sense Desktop application using data-load.qvs script
- [ ] T014 Validate data model in Qlik Sense: Check Brand_Canonical, Union_Flag, calculated fields
- [ ] T015 Create Master Items in Qlik Sense per qlik-app/master-items-setup.md (3 variables, 8 dimensions, 12 measures)
- [ ] T016 Test Master Items in Qlik Sense: Create test sheet and verify all measures calculate correctly
- [ ] T017 [P] Create mashup/lib/hypercubes.js catalog file (empty template for all 8 hypercubes)
- [ ] T018 [P] Create mashup/lib/hebrew-locale.js with toLocaleString('he-IL') formatting utilities
- [ ] T019 Implement mashup/mashup.js with Qlik connection logic using RequireJS and qlik.js
- [ ] T020 Test Qlik connection: Validate app.createCube() works and returns data

**Dependencies**:
- T012: Independent (script already exists - just validate)
- T013 depends on T012 (needs script validated)
- T014 depends on T013 (needs data loaded)
- T015 depends on T014 (needs data model validated)
- T016 depends on T015 (needs master items created)
- T017-T018 can run in parallel (different files)
- T019 depends on T011 (needs config)
- T020 depends on T019 (needs connection established)

**Test Criteria**:
- Qlik Sense Desktop loads data without errors
- Data model shows all calculated fields (Brand_Canonical, Union_Flag, etc.)
- All master items (3 variables, 8 dimensions, 12 measures) created successfully
- Test sheet in Qlik shows correct calculations and Hebrew labels
- mashup/mashup.js successfully connects to Qlik app
- Test hypercube returns expected data structure

---

## Phase 3: User Story 1 - View Real-Time Vehicle Market Overview (P1) 🎯 MVP

**Story Goal**: Sales planning managers can see total vehicles, Union Motors market share, and top brand at a glance.

**Independent Test Criteria**:
- [ ] Dashboard loads and displays 3 KPI cards with Hebrew-formatted numbers
- [ ] Hovering over KPI cards shows detailed breakdowns
- [ ] Refresh button updates all 3 KPI cards with latest data
- [ ] All numbers use Hebrew locale (123,456 format)
- [ ] Layout is RTL (right-to-left)

### Hypercube Definitions

- [ ] T021 [P] [US1] Define hypercube for KPI 1 (Total Vehicles) in mashup/lib/hypercubes.js
- [ ] T022 [P] [US1] Define hypercube for KPI 2 (Union Motors count & percentage) in mashup/lib/hypercubes.js
- [ ] T023 [P] [US1] Define hypercube for KPI 3 (Top Brand summary) in mashup/lib/hypercubes.js

### Component Implementation

- [ ] T024 [US1] Create mashup/components/kpi-cards.js with KPICard class for rendering
- [ ] T025 [US1] Implement KPI Card 1 (Total Vehicles) with hypercube integration in kpi-cards.js
- [ ] T026 [US1] Implement KPI Card 2 (Union Motors) with percentage calculation in kpi-cards.js
- [ ] T027 [US1] Implement KPI Card 3 (Top Brand) with brand name display in kpi-cards.js
- [ ] T028 [US1] Add hover states to KPI cards with detailed breakdowns (CSS transitions)
- [ ] T029 [US1] Create mashup/components/refresh-button.js with click handler for data reload
- [ ] T030 [US1] Integrate all 3 KPI cards into mashup/index.html and test end-to-end

**Parallel Execution Example**:
```bash
# Hypercube definitions (T021, T022, T023) can be written in parallel
# After hypercubes defined, components can be built in parallel:
# - T025 (KPI 1), T026 (KPI 2), T027 (KPI 3), T029 (Refresh button)
```

**Dependencies**:
- T021-T023 depend on T017 (hypercubes.js template)
- T024 depends on T018 (needs Hebrew locale utilities)
- T025-T027 depend on T021-T023 (need hypercube definitions)
- T028 depends on T025-T027 (needs cards implemented)
- T029 depends on T019 (needs Qlik connection)
- T030 depends on T025-T029 (integration of all components)

**Acceptance Tests** (from spec.md User Story 1):
1. Dashboard loads → see 3 KPI cards with Hebrew-formatted numbers ✅
2. Hover over KPI card → detailed breakdown appears ✅
3. Click refresh button → all metrics update ✅

---

## Phase 4: User Story 2 - Analyze Brand and Ownership Distribution (P2)

**Story Goal**: Sales teams can understand brand dominance and ownership patterns.

**Independent Test Criteria**:
- [ ] Pie chart displays top 5 brands with vehicle counts
- [ ] Bar chart shows ownership distribution (private, leasing, company, etc.)
- [ ] Both charts use Hebrew locale for numbers
- [ ] Charts update when refresh button is clicked

### Hypercube Definitions

- [ ] T034 [P] [US2] Define hypercube for Brand Distribution (top 5, sorted by count) in mashup/lib/hypercubes.js
- [ ] T034 [P] [US2] Define hypercube for Ownership Distribution (all types) in mashup/lib/hypercubes.js

### Component Implementation

- [ ] T034 [P] [US2] Create mashup/components/brand-chart.js for pie chart visualization
- [ ] T034 [P] [US2] Create mashup/components/ownership-chart.js for bar chart visualization
- [ ] T038 [US2] Implement brand chart with hypercube integration and Hebrew labels in brand-chart.js
- [ ] T038 [US2] Implement ownership chart with hypercube integration in ownership-chart.js
- [ ] T038 [US2] Add tooltips to both charts showing exact values on hover
- [ ] T038 [US2] Integrate brand and ownership charts into mashup/index.html

**Parallel Execution Example**:
```bash
# Hypercube definitions can run in parallel: T030, T031
# Component creation can run in parallel: T032, T033
# Implementation can run in parallel: T034, T035, T036
```

**Dependencies**:
- T030-T031 depend on T016 (hypercubes.js template)
- T032-T033 can be created in parallel (different files)
- T034 depends on T030, T032
- T035 depends on T031, T033
- T036 depends on T034, T035
- T037 depends on T034-T036

**Acceptance Tests** (from spec.md User Story 2):
1. View brand distribution → see pie chart with top 5 brands ✅
2. View ownership distribution → see bar chart with all ownership types ✅
3. Hover over charts → see exact counts in tooltips ✅

---

## Phase 5: User Story 3 - Examine Fuel Types and Model Performance (P3)

**Story Goal**: Product teams can understand fuel type preferences and top Union models.

**Independent Test Criteria**:
- [ ] Donut chart displays fuel type distribution with Hebrew counts
- [ ] Ranked list shows top 5 Union Motors models with counts
- [ ] Hover interactions work on both components

### Hypercube Definitions

- [ ] T042 [P] [US3] Define hypercube for Fuel Distribution in mashup/lib/hypercubes.js
- [ ] T042 [P] [US3] Define hypercube for Top Union Models (filtered by Union_Flag=1) in mashup/lib/hypercubes.js

### Component Implementation

- [ ] T042 [P] [US3] Create mashup/components/fuel-chart.js for donut chart visualization
- [ ] T042 [P] [US3] Create mashup/components/models-list.js for ranked list component
- [ ] T045 [US3] Implement fuel chart with hypercube integration in fuel-chart.js
- [ ] T045 [US3] Implement models list with ranking (1-5) and hypercube integration in models-list.js
- [ ] T045 [US3] Integrate fuel chart and models list into mashup/index.html

**Parallel Execution Example**:
```bash
# Hypercube definitions: T039, T040
# Component creation: T041, T042
# Implementation: T043, T044
```

**Dependencies**:
- T039-T040 depend on T017
- T041-T042 can be created in parallel
- T043 depends on T039, T041
- T044 depends on T040, T042
- T045 depends on T043, T044

**Acceptance Tests** (from spec.md User Story 3):
1. View fuel types → see donut chart with Hebrew-formatted counts ✅
2. View top models → see ranked list (1-5) of Union Motors models ✅
3. Hover over model → entry highlights ✅

---

## Phase 6: User Story 4 - Track Registration Trends Over Time (P4)

**Story Goal**: Management can see registration patterns by year.

**Independent Test Criteria**:
- [ ] Bar chart displays vehicle registrations for last 5 years
- [ ] Each bar shows exact count as label above bar
- [ ] Years are sorted chronologically

### Hypercube Definition

- [ ] T050 [US4] Define hypercube for Year Distribution (last 5 years) in mashup/lib/hypercubes.js

### Component Implementation

- [ ] T050 [US4] Create mashup/components/year-chart.js for year distribution bar chart
- [ ] T050 [US4] Implement year chart with hypercube integration and year labels in year-chart.js
- [ ] T050 [US4] Add value labels above each bar showing exact counts
- [ ] T050 [US4] Integrate year chart into mashup/index.html

**Dependencies**:
- T045 depends on T016
- T046 is independent (new file)
- T047 depends on T045, T046
- T048 depends on T047
- T049 depends on T048

**Acceptance Tests** (from spec.md User Story 4):
1. View trends section → see bar chart with last 5 years ✅
2. Review data → each bar shows exact count as label ✅
3. Compare periods → visually compare year-over-year changes ✅

---

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: Accessibility, performance, and final quality improvements

### Tasks

- [ ] T051 Run axe DevTools accessibility scan on complete dashboard and fix all critical issues
- [ ] T052 Test screen reader compatibility (NVDA on Windows) for all KPI cards and charts
- [ ] T053 Validate performance targets: Dashboard load < 3s desktop, < 5s mobile 3G
- [ ] T054 Test responsive layout on mobile (375px), tablet (768px), desktop (1280px)
- [ ] T055 Add error handling for Qlik connection failures (display user-friendly message)
- [ ] T056 Create mashup/README.md with setup instructions and deployment guide

**Dependencies**:
- T050-T053 depend on all user stories being complete (T029, T037, T044, T049)
- T054 depends on T018 (connection logic)
- T055 is independent

**Acceptance Tests**:
- axe DevTools shows 0 critical accessibility violations ✅
- Screen reader announces all KPI card values and chart labels ✅
- Dashboard loads in < 3 seconds on desktop ✅
- All layouts work on mobile, tablet, desktop ✅

---

## Validation Checklist

### Task Format Validation ✅
- [x] All tasks use checkbox format: `- [ ]`
- [x] All tasks have sequential IDs (T001-T055)
- [x] User story tasks have [US#] labels
- [x] Parallelizable tasks have [P] markers
- [x] All tasks include file paths

### Completeness Validation ✅
- [x] Each user story has hypercube definition tasks
- [x] Each user story has component implementation tasks
- [x] Each user story has integration tasks
- [x] Each user story has independent test criteria
- [x] All 8 hypercubes from contracts/hypercubes.md are included
- [x] All FR requirements from spec.md are covered
- [x] Accessibility tasks included (T050-T051)
- [x] Performance validation included (T052)

### Dependency Validation ✅
- [x] Phase 2 (Foundation) blocks all user stories
- [x] User stories are independent of each other (P2-P4 can run in parallel)
- [x] Critical path identified (Setup → Foundation → US1)
- [x] Parallel opportunities documented

---

## Implementation Notes

### Qlik Sense Load Script
The comprehensive load script is already created in `qlik-app/load-scripts/data-load.qvs` (420+ lines) with:
- Section 1: Mapping tables (Brand, Model, Trim, Ownership, Fuel)
- Section 2: Raw data load (all 42 fields from Excel)
- Section 3: Data transformations (Brand_Canonical, Union_Flag, etc.)
- Section 4: Data quality validation
- Section 5: Performance optimization

**Task T012** validates this script is correct and ready to use.

### Technology Stack Reminder
- **JavaScript**: ES6 modules, transpiled to ES5 with Babel
- **HTML/CSS**: Semantic HTML5, CSS3 with OKLCH colors, RTL layout
- **Qlik Integration**: Capability APIs via RequireJS
- **No Frameworks**: Pure vanilla JavaScript per user clarification

### Hebrew Locale Formatting
All numbers must use:
```javascript
const formatted = count.toLocaleString('he-IL');  // 123,456
```

### RTL Layout
All CSS must use logical properties:
```css
margin-inline-start: 1rem;  /* Right in RTL */
padding-inline: 1rem;       /* Both sides */
```

---

## Success Criteria

### MVP Success (After Phase 3)
- [ ] Dashboard displays 3 KPI cards with real data from Qlik Sense
- [ ] All numbers formatted in Hebrew locale
- [ ] RTL layout works correctly
- [ ] Refresh button updates data
- [ ] Load time < 3 seconds

### Full Release Success (After Phase 7)
- [ ] All 8 visualizations working (3 KPIs + 5 charts)
- [ ] All user stories independently testable
- [ ] Accessibility validated (axe DevTools + screen reader)
- [ ] Performance targets met (< 3s load, < 5s refresh)
- [ ] Responsive on mobile/tablet/desktop

---

**Generated by**: /speckit.tasks command
**Ready for**: /speckit.implement command or manual task execution
