# Feature Specification: Qlik Sense Mashup Dashboard for Vehicle Registration Analytics

**Feature Branch**: `1-qlik-mashup-dashboard`
**Created**: 2025-11-06
**Status**: Draft
**Input**: User description: "Create a Qlik Sense mashup dashboard to display vehicle registration data from Gov.il portal using hypercubes and custom visualizations. Visual design inspiration from DASHBOARD-VISUAL-SPEC.md. Technology stack: vanilla HTML/CSS/JS with Qlik Sense Capabilities API (no Next.js, React, or frameworks)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Real-Time Vehicle Market Overview (Priority: P1)

Sales planning managers need to see the current state of the vehicle market to understand Union Motors' position relative to competitors and make data-driven decisions about product strategy.

**Why this priority**: This is the core value proposition - providing immediate visibility into market share, brand distribution, and Union Motors vs parallel import splits. Without this, the dashboard has no value.

**Independent Test**: Can be fully tested by loading the dashboard and viewing KPI cards showing total vehicles, Union vehicles, and market share percentage. Delivers immediate business intelligence value even without other features.

**Acceptance Scenarios**:

1. **Given** the dashboard loads, **When** a user views the top section, **Then** they see three KPI cards displaying: (1) Total registered vehicles with Hebrew-formatted numbers, (2) Union Motors vehicles count and percentage, (3) Top brand distribution
2. **Given** vehicle data is available, **When** the user hovers over a KPI card, **Then** a detailed breakdown appears showing sub-categories and specific metrics
3. **Given** data updates occur, **When** the user clicks the refresh button, **Then** all metrics update to reflect the latest data from the Gov.il portal

---

### User Story 2 - Analyze Brand and Ownership Distribution (Priority: P2)

Sales teams need to understand which brands dominate the market and what types of ownership (private, leasing, company, rental, dealer) are most common for specific segments to identify opportunities and threats.

**Why this priority**: Provides critical competitive intelligence for strategic planning. This analysis helps identify market gaps and competitor strategies.

**Independent Test**: Can be tested by viewing the brand distribution pie chart and ownership distribution bar chart. Delivers actionable insights about market composition independently of other features.

**Acceptance Scenarios**:

1. **Given** the dashboard displays charts, **When** a user views the brand distribution section, **Then** they see a pie chart showing the top 5 brands with vehicle counts in Hebrew locale
2. **Given** brand data is displayed, **When** a user views the ownership distribution chart, **Then** they see a bar chart showing breakdown by ownership type (private, leasing, company, rental, dealer) with exact counts
3. **Given** the user needs detailed data, **When** they view the ownership chart, **Then** below the chart they see a data grid showing each ownership type with its percentage of total

---

### User Story 3 - Examine Fuel Types and Model Performance (Priority: P3)

Product teams need to understand fuel type preferences (gasoline, diesel, electric, hybrid, plug-in) and identify top-performing Union models to guide inventory decisions and marketing strategies.

**Why this priority**: Supports tactical decisions about inventory and product mix. Less critical than overall market view but important for operational planning.

**Independent Test**: Can be tested by viewing the fuel distribution donut chart and top Union models list. Provides insights into energy transition trends and model preferences independently.

**Acceptance Scenarios**:

1. **Given** fuel distribution data is available, **When** a user views the fuel types section, **Then** they see a donut chart showing distribution across fuel types with Hebrew-formatted counts
2. **Given** Union model data exists, **When** a user views the top models section, **Then** they see a ranked list (1-5) of Union Motors models with vehicle counts
3. **Given** the user interacts with the models list, **When** they hover over a model entry, **Then** the entry highlights and shows additional details

---

### User Story 4 - Track Registration Trends Over Time (Priority: P4)

Management needs to see registration patterns by year and month to identify seasonal trends, growth patterns, and predict future demand.

**Why this priority**: Provides historical context and trend analysis. Important for forecasting but less critical than current state analysis.

**Independent Test**: Can be tested by viewing the year distribution bar chart. Delivers time-series insights independently of real-time data.

**Acceptance Scenarios**:

1. **Given** historical data is loaded, **When** a user views the trends section, **Then** they see a bar chart showing vehicle registrations for the last 5 years
2. **Given** the year chart displays, **When** a user reviews the data, **Then** each bar shows the exact count as a label above the bar
3. **Given** the user needs to compare periods, **When** they view the chart, **Then** they can visually compare year-over-year changes

---

### Edge Cases

- What happens when the Gov.il portal data is unavailable or fails to load? System should display cached data with a timestamp and warning message
- How does the system handle brand names that appear in multiple variations (e.g., "Toyota Japan", "Toyota Turkey")? Data must be cleaned and standardized before display
- What happens when a new month's data arrives but only includes the year-month timestamp? System should identify new records by comparing daily snapshots and assign them the actual load date
- How does the dashboard perform with 4 million+ records? Qlik hypercubes should aggregate data server-side to ensure responsive performance
- What happens when a user accesses the dashboard from a mobile device? Dashboard should display in responsive single-column layout with readable text sizes
- How does the system distinguish Union Motors vehicles from parallel imports? Uses the "ramat_gimur" (trim level) field mapping provided by the business team

## Requirements *(mandatory)*

### Functional Requirements

#### Data Preparation Requirements
- **FR-001**: System MUST load vehicle registration data in Qlik Sense load script from the Gov.il portal CSV file
- **FR-002**: System MUST standardize brand names (tozeret_nm) by mapping variations to canonical names (e.g., "Toyota Japan" and "Toyota Turkey" → "Toyota")
- **FR-003**: System MUST standardize commercial names (kinuy_mishari) by mapping model variations to canonical model names
- **FR-004**: System MUST standardize trim levels (ramat_gimur) to enable Union Motors vs parallel import classification
- **FR-005**: System MUST identify new records daily by comparing snapshots since the moed_aliya_lakvish field only contains year-month
- **FR-006**: System MUST assign actual registration dates to new records based on the daily load timestamp
- **FR-007**: System MUST classify vehicles as Union Motors or parallel import based on trim level (ramat_gimur) mapping
- **FR-008**: System MUST create calculated fields for current year (2025), brand percentages, ownership percentages, and fuel type percentages

#### Dashboard Display Requirements
- **FR-009**: Dashboard MUST display in RTL (right-to-left) layout for Hebrew content
- **FR-010**: Dashboard MUST format all numbers using Hebrew locale (e.g., 123,456 → 123,456)
- **FR-011**: Dashboard MUST display three KPI cards showing: Total vehicles, Union Motors vehicles with percentage, and top brand statistics
- **FR-012**: Dashboard MUST show hover cards on KPI elements with detailed breakdowns
- **FR-013**: Dashboard MUST display a pie chart showing top 5 brands with vehicle counts
- **FR-014**: Dashboard MUST display a bar chart showing ownership distribution (private, leasing, company, rental, dealer)
- **FR-015**: Dashboard MUST display a donut chart showing fuel type distribution
- **FR-016**: Dashboard MUST display a ranked list of top 5 Union Motors models with counts
- **FR-017**: Dashboard MUST display a bar chart showing vehicle registrations for the last 5 years
- **FR-018**: Dashboard MUST include a refresh button to reload data from the server
- **FR-019**: Dashboard MUST display a header with logo, title, and navigation structure
- **FR-020**: Dashboard MUST be responsive and adapt layout for mobile, tablet, and desktop viewports

#### Data Interaction Requirements
- **FR-021**: Users MUST be able to hover over KPI cards to see detailed breakdowns
- **FR-022**: Users MUST be able to click the refresh button to update all visualizations
- **FR-023**: Charts MUST display tooltips showing exact values when hovering over data points
- **FR-024**: List items MUST highlight on hover to indicate interactivity
- **FR-025**: All visualizations MUST update together when data refreshes to maintain consistency

#### Technical Integration Requirements
- **FR-026**: Dashboard MUST connect to the Qlik Sense application using the Qlik Capability APIs
- **FR-027**: Dashboard MUST use hypercubes (app.createCube) to fetch aggregated data for each visualization
- **FR-028**: Dashboard MUST define dimensions and measures for each hypercube based on business requirements
- **FR-029**: Dashboard MUST handle initial data fetch with appropriate page sizes (qHeight, qWidth)
- **FR-030**: Dashboard MUST implement error handling for connection failures and data load errors

### Key Entities *(include if feature involves data)*

- **Vehicle Registration Record**: Represents a single registered vehicle with attributes including:
  - License plate number (mispar_rechev) - unique identifier
  - Brand/manufacturer (tozeret_nm) - standardized to canonical names
  - Model commercial name (kinuy_mishari) - standardized to canonical names
  - Trim level (ramat_gimur) - used for Union vs parallel classification
  - Ownership type (baalut) - private, leasing, company, rental, dealer
  - Fuel type (sug_delek_nm) - gasoline, diesel, electric, hybrid, plug-in
  - Registration year (shnat_yitzur)
  - Registration month (moed_aliya_lakvish) - year-month format only
  - Chassis number (misgeret) - used to identify non-Union vehicles
  - Actual registration date (derived field) - assigned from daily load timestamp

- **Brand**: Represents a vehicle manufacturer with attributes:
  - Canonical brand name (standardized from tozeret_nm variations)
  - Total vehicle count
  - Market share percentage
  - Relationship to vehicle records (one-to-many)

- **Union Model**: Represents a Union Motors vehicle model with attributes:
  - Canonical model name (standardized from kinuy_mishari)
  - Vehicle count for Union Motors variants
  - Rank position in top models list
  - Relationship to vehicle records (one-to-many, filtered by Union classification)

- **Ownership Type**: Represents the category of vehicle ownership:
  - Type name (private, leasing, company, rental, dealer)
  - Vehicle count per type
  - Percentage of total vehicles

- **Fuel Type**: Represents the vehicle energy source category:
  - Type name (gasoline, diesel, electric, hybrid, plug-in)
  - Vehicle count per type
  - Percentage of total vehicles

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view the complete dashboard with all KPI cards and charts fully rendered in under 3 seconds on desktop browsers
- **SC-002**: Dashboard displays accurate market share calculations within 0.1% of manual verification calculations
- **SC-003**: All Hebrew numbers format correctly with proper locale (123,456 format) across all visualizations
- **SC-004**: Dashboard refresh completes and updates all visualizations in under 5 seconds for current year data
- **SC-005**: Mobile users can view all critical metrics and charts in readable format without horizontal scrolling
- **SC-006**: Dashboard correctly classifies 100% of Union Motors vehicles vs parallel imports based on trim level mapping
- **SC-007**: Brand name standardization reduces unique brand variations by at least 80% (e.g., from 150+ to under 30 canonical brands)
- **SC-008**: Users can identify the top 5 brands and their market shares at a glance (within 5 seconds of viewing)
- **SC-009**: Hover interactions display detailed breakdowns within 200 milliseconds of mouse hover
- **SC-010**: Dashboard maintains visual consistency with the design specification (OKLCH colors, typography scale, spacing system) across all browsers
- **SC-011**: Daily data updates correctly identify new registrations by comparing previous day's snapshot with current data
- **SC-012**: Charts handle the full dataset efficiently via Qlik server-side aggregation without browser memory issues or crashes

### Business Value Metrics

- **SC-013**: Sales planning managers can answer key business questions (market share, brand distribution, ownership types) without requesting custom reports
- **SC-014**: Reduces dependency on quarterly purchased reports from Ministry of Transportation (currently ₪18,000 annually)
- **SC-015**: Enables daily competitive intelligence instead of quarterly updates, improving decision-making timeliness by 90 days
- **SC-016**: Eliminates manual Excel data cleanup work (currently 3-4 hours per report per quarter) saving approximately 16 hours quarterly

## Assumptions *(mandatory)*

### Technical Assumptions
1. The Qlik Sense application is already deployed and accessible with appropriate connection configuration
2. The Gov.il portal CSV/Excel data structure follows the field definitions shown in "table for example.xlsx"
3. Users have modern web browsers that support the Qlik Capability APIs (Chrome, Firefox, Edge, Safari)
4. The Qlik Sense load script will process the raw table data and apply all standardization mappings
5. Hypercube aggregations will be performed server-side in Qlik Sense, not client-side in the browser
6. Mashup will use vanilla JavaScript ES6 (transpiled to ES5), HTML5, and CSS3 - no React, Next.js, or other frameworks

### Business Assumptions
1. The trim level (ramat_gimur) to Union/parallel mapping will be provided by Eran Morlevy and maintained in Qlik Sense
2. Brand name standardization mapping will be provided by the business team and updated quarterly for new brands
3. Model name standardization mapping will be maintained by the business team and updated as new models appear
4. The dashboard will initially focus on current year (2025) data with historical comparisons limited to last 5 years
5. Users accessing the dashboard have authorized access to competitive market intelligence data

### Data Assumptions
1. The moed_aliya_lakvish field provides year-month only (YYYY-MM format) as shown in the raw table structure
2. Data loading happens entirely within the Qlik Sense load script, not via external processes
3. The raw table structure follows the 42-field format shown in "table for example.xlsx"
4. The baalut (ownership) field values remain consistent: private, leasing, company, rental, dealer
5. Fuel type classifications include: gasoline, diesel, electric, hybrid (regular hybrid), plug-in hybrid
6. Actual data volume and historical range will be determined from the loaded data - no assumptions about specific record counts

### Design Assumptions
1. DASHBOARD-VISUAL-SPEC.md provides VISUAL INSPIRATION ONLY - not technical stack specifications
2. Actual implementation uses vanilla HTML/CSS/JS, not Next.js/React as shown in the visual spec
3. RTL layout is required for all Hebrew content
4. Responsive breakpoints follow the specification: sm (640px), md (768px), lg (1024px), xl (1280px)
5. Dark mode support will be implemented in a future iteration (not included in initial release)
6. The OKLCH color system provides sufficient contrast for accessibility (no additional WCAG validation needed initially)

## Out of Scope *(mandatory)*

### Features Explicitly Excluded
1. User authentication and authorization (assumes Qlik Sense handles this)
2. Data export to Excel or PDF formats (users can use Qlik Sense native export)
3. Advanced filtering and drill-down capabilities beyond hover cards (future enhancement)
4. Integration with CRM or sales systems
5. Predictive analytics or forecasting models
6. Custom alerts or notifications for market changes
7. Collaborative features (comments, annotations, sharing)
8. Historical trend analysis beyond 5 years
9. Detailed vehicle-level search by license plate or chassis number (focused on aggregated analytics)
10. Multi-language support beyond Hebrew (English can be added later)

### Technical Limitations
1. No offline mode or data caching in browser
2. No real-time streaming updates (daily refresh is sufficient)
3. No custom data entry or manual corrections through the dashboard
4. No integration with external data sources beyond Gov.il portal
5. No automated data quality validation or cleansing beyond standardization mappings

### Future Considerations
1. Dark mode theme toggle
2. Custom date range filters and comparisons
3. Export functionality for charts and data tables
4. Advanced segmentation by region, city, or dealership
5. Integration with sales targets and performance metrics
6. Mobile app version (currently responsive web only)
7. Drill-down to vehicle-level details with license plate and chassis information
8. Automated alerting for significant market shifts

## Dependencies *(mandatory)*

### External Dependencies
1. **Gov.il Data Portal**: Daily access to the vehicle registration CSV dataset (https://data.gov.il/dataset/private-and-commercial-vehicles/resource/053cea08-09bc-40ec-8f7a-156f0677aff3)
2. **Qlik Sense Server**: Installed and configured Qlik Sense Enterprise or SaaS environment
3. **Qlik Capability APIs**: JavaScript libraries for mashup development (qlik.js, require.js)
4. **Modern Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+ for optimal performance

### Internal Dependencies
1. **Business Mappings**: Eran Morlevy to provide and maintain:
   - Trim level (ramat_gimur) mapping for Union vs parallel classification
   - Brand name standardization dictionary (tozeret_nm variations → canonical names)
   - Model name standardization dictionary (kinuy_mishari variations → canonical names)
2. **Qlik Sense Data Model**: Data load scripts in Qlik Sense must:
   - Load daily CSV files from Gov.il portal
   - Apply standardization mappings to brand, model, and trim fields
   - Calculate derived fields (percentages, Union classification, actual registration dates)
   - Create optimized data model for hypercube queries
3. **Web Server**: Hosting environment for mashup HTML/JS/CSS files with access to Qlik Sense server

### Team Dependencies
1. **Sales Planning Manager (Eran)**: Define and maintain business logic for:
   - What constitutes "Union Motors" vs "parallel import"
   - Which brands and models should be standardized and how
   - Which metrics are most critical for KPI cards
2. **IT/BI Team**: Configure and maintain:
   - Qlik Sense server connectivity and security
   - Daily automated data refresh schedules
   - Web server hosting for mashup files
3. **Design Review**: Validate visual implementation matches DASHBOARD-VISUAL-SPEC.md specifications

## Constraints *(optional)*

### Performance Constraints
1. Dashboard must load and render within 3 seconds on standard business desktop hardware (8GB RAM, modern CPU)
2. Hypercube queries must aggregate 4+ million records efficiently using Qlik Sense engine (not browser-side)
3. Maximum memory footprint in browser should not exceed 500MB to support tablets and lower-end devices
4. Refresh operations must complete within 5 seconds to maintain user experience

### Technical Constraints
1. Must use Qlik Sense Capability APIs exclusively (no third-party BI tools)
2. Hypercubes must be defined in JavaScript using app.createCube() with proper dimensions and measures
3. Cannot modify the Gov.il portal data structure (must work with fields as provided)
4. RTL layout must be maintained across all responsive breakpoints
5. Hebrew locale number formatting must be consistent across all visualizations

### Business Constraints
1. Data refresh frequency limited to daily (Gov.il portal updates daily, not real-time)
2. Historical data limited to 1996-present (based on Gov.il dataset availability)
3. Focus on Union Motors and Toyota brand competitive intelligence only
4. Dashboard access limited to authorized Sales Planning and Product Division users
5. Must maintain confidentiality of competitive intelligence data

### Design Constraints
1. Must follow DASHBOARD-VISUAL-SPEC.md exactly for:
   - Color palette (OKLCH color space)
   - Typography scale
   - Spacing system
   - Component styling
   - Responsive breakpoints
2. Must use Recharts-compatible chart types that can be implemented with hypercube data
3. Cannot deviate from the three-column KPI card layout on desktop
4. Must maintain Hebrew right-to-left text alignment throughout

## Notes *(optional)*

### Implementation Guidance

**Qlik Sense Data Preparation Checklist**:
1. Create data connection to Gov.il portal CSV source
2. Build data load script with daily reload schedule
3. Implement three mapping tables:
   - Brand standardization: map tozeret_nm variations → canonical brand names
   - Model standardization: map kinuy_mishari variations → canonical model names
   - Trim classification: map ramat_gimur values → Union/Parallel flag
4. Create calculated fields:
   - Union_Flag: Boolean indicating if ramat_gimur is in Union mapping
   - Brand_Canonical: Standardized brand name from mapping
   - Model_Canonical: Standardized model name from mapping
   - Registration_Date_Actual: Date field from daily load timestamp for new records
   - Market_Share_Pct: Calculated percentage fields for all distributions
5. Optimize data model:
   - Create aggregated tables for current year metrics
   - Index key fields (brand, ownership type, fuel type, year)
   - Remove unnecessary historical data (pre-2020) if performance issues occur

**Hypercube Design Pattern**:
```javascript
// Example structure for Brand Distribution hypercube
app.createCube({
  qInitialDataFetch: [{ qHeight: 5, qWidth: 2 }],
  qDimensions: [{
    qDef: { qFieldDefs: ["Brand_Canonical"] },
    qNullSuppression: true
  }],
  qMeasures: [{
    qDef: { qDef: "Count({<Year={2025}>} mispar_rechev)" },
    qLabel: "Vehicle Count"
  }],
  qInterColumnSortOrder: [1, 0], // Sort by measure descending
  qSuppressZero: true
}, callbackFunction);
```

**Visual Implementation Notes**:
- Use the OKLCH color system from DASHBOARD-VISUAL-SPEC.md lines 7-45
- Implement responsive grid from lines 49-70: 1 column mobile, 3 columns desktop for KPIs
- Follow exact chart configurations from lines 227-297
- Implement hover states and animations from lines 342-378
- Use Hebrew locale formatting for all numbers: `count.toLocaleString('he-IL')`

**Critical Success Factors**:
1. Data quality depends entirely on business-provided mappings being accurate and complete
2. Performance relies on Qlik Sense server-side aggregation (hypercubes), not client-side processing
3. User adoption depends on dashboard loading quickly and displaying accurate, timely data
4. Business value realized only if daily refresh automation works reliably

**Risk Mitigation**:
- Create fallback cached data in case Gov.il portal is unavailable
- Implement error boundaries in hypercube callbacks to handle connection failures gracefully
- Version control the business mappings (brand, model, trim) to track changes over time
- Document mapping maintenance procedures for business users

**Future Enhancement Opportunities**:
- Add drill-down from aggregated metrics to vehicle-level details
- Implement custom date range selectors
- Create comparison views (month-over-month, year-over-year)
- Add export to Excel functionality for deeper analysis
- Integrate with sales targets and performance tracking systems
