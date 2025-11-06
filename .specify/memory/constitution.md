# Gov_Mashup Constitution

<!--
SYNC IMPACT REPORT
==================
Version Change: 1.0.0 → 2.0.0

**MAJOR VERSION BUMP RATIONALE**: Complete technology stack change from Next.js/React to
Qlik Sense Mashup API. This is a backward-incompatible change that fundamentally alters
the development approach, tooling, and architecture.

Modified Principles:
- REPLACED: "Component Modularity" → "Qlik Sense API Integration" (Principle IV)
- UPDATED: "Data-First Visualization" - Now emphasizes Qlik Sense data model integrity
- UPDATED: "Performance & User Experience" - Adjusted for Qlik Sense mashup constraints
- KEPT: "Responsive & Accessible Design" (still applies)
- KEPT: "RTL & Hebrew Support" (still critical)

Technology Stack Changes (BREAKING):
- REMOVED: Next.js, Tailwind CSS, shadcn/ui, Recharts
- ADDED: Qlik Sense Mashup API, RequireJS, Qlik Sense Extensions capability.js
- ADDED: Qlik Sense authentication and session management
- ADDED: Qlik objects lifecycle management

Added Sections:
- Qlik Sense Integration Requirements
- Qlik Object Management Standards
- Mashup Security & Authentication

Removed Sections:
- None (sections repurposed for Qlik context)

Templates Status:
- ✅ plan-template.md: Compatible, generic structure applies to Qlik mashups
- ✅ spec-template.md: Compatible, user stories work for mashup features
- ✅ tasks-template.md: Compatible, task structure applies to mashup development

Follow-up TODOs:
- None - all placeholders resolved for Qlik Sense Mashup context
-->

## Core Principles

### I. Data-First Visualization

Every mashup visualization MUST maintain fidelity to the Qlik Sense data model and application logic. Data integrity through the Qlik engine is non-negotiable:

- All visualizations MUST use Qlik Sense objects and hypercubes (no manual data replication)
- Qlik selections and associations MUST be preserved across all custom components
- Number formatting MUST respect Qlik app settings and locale conventions (Hebrew/RTL)
- Data updates MUST flow through Qlik engine for proper calculation and aggregation
- Mashup MUST NOT bypass Qlik security or data governance rules

**Rationale**: Qlik Sense provides a governed semantic layer and calculation engine. Bypassing it risks data inconsistency, security violations, and loss of Qlik's associative experience.

### II. Responsive & Accessible Design (Non-Negotiable)

All mashup UI components MUST be fully responsive and meet WCAG 2.1 Level AA accessibility standards:

- Mobile-first approach: Design for smallest screens first, enhance for larger viewports
- Touch targets MUST be minimum 44px × 44px for interactive elements
- Color contrast MUST meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- ARIA labels MUST be present on all interactive elements and Qlik objects
- Keyboard navigation MUST be fully supported (including Qlik object interactions)
- Screen reader compatibility MUST be tested for custom mashup UI

**Rationale**: Public-facing government dashboards must be accessible to all citizens. Qlik objects provide baseline accessibility, but custom mashup UI requires additional ARIA implementation.

### III. RTL & Hebrew Support (Critical)

Hebrew language and Right-to-Left (RTL) layout support is mandatory across all mashup features:

- All custom HTML containers MUST specify `dir="rtl"` attribute
- Number formatting MUST use `toLocaleString('he-IL')` for custom components
- Text alignment MUST flow naturally with RTL direction
- Qlik objects MUST be configured for RTL display (when supported)
- Custom CSS MUST account for RTL layout (use logical properties: inline-start/end)
- Icons and visual elements MUST be positioned appropriately for RTL layouts
- All user-facing text MUST support Hebrew Unicode characters

**Rationale**: This is a Hebrew-language government data mashup. RTL and Hebrew support are core requirements that must extend to both Qlik native objects and custom mashup UI.

### IV. Qlik Sense API Integration

All mashup features MUST properly integrate with Qlik Sense APIs and follow Qlik object lifecycle management:

- Qlik objects MUST be created using `app.visualization.create()` or `app.getObject()`
- Object lifecycle (mount, update, destroy) MUST be managed properly to prevent memory leaks
- Selections MUST use `app.field().selectValues()` or Qlik's selection API
- Hypercubes MUST be accessed through proper Qlik APIs (no direct data extraction)
- Custom properties MUST use Qlik's property panel framework when extending objects
- All Qlik API calls MUST include proper error handling
- Qlik Sense themes and styling MUST be respected in custom components

**Rationale**: Qlik Sense provides sophisticated APIs for data access, selections, and visualization management. Proper API usage ensures stability, performance, and compatibility with Qlik updates.

### V. Performance & User Experience

Mashup performance directly impacts usability within Qlik Sense constraints:

- Initial mashup load MUST complete within 3 seconds on 3G connections
- Qlik object rendering MUST not be blocked by custom JavaScript
- Large data requests MUST use Qlik hypercube paging (`qPage` parameter)
- Custom components MUST use efficient DOM manipulation (virtual scrolling for lists)
- Qlik object updates MUST be debounced to prevent excessive API calls
- All animations MUST respect `prefers-reduced-motion`
- Mashup MUST handle Qlik Sense Desktop and Server performance differences

**Rationale**: Qlik Sense mashups operate within the Qlik engine's processing model. Inefficient API usage or DOM manipulation can severely degrade the user experience and overwhelm the Qlik engine.

## Technology Stack Requirements

### Mandatory Qlik Sense Stack

- **Platform**: Qlik Sense Desktop or Qlik Sense Server (authenticated)
- **API**: Qlik Sense Capability APIs (requirejs-based)
- **Module Loader**: RequireJS for loading Qlik Sense resources
- **Authentication**: Qlik Sense authentication (NTLM, header auth, or tickets)
- **JavaScript**: ES5+ (compatible with Qlik Sense environment)
- **Qlik Resources**: Access to `/resources/` path for qlik-styles.css and Capability APIs

### Frontend Technologies (Mashup UI)

- **HTML5**: Semantic HTML for custom mashup containers
- **CSS3**: Modern CSS with RTL support (logical properties: `inline-start`, `block-start`)
- **JavaScript/TypeScript**: ES6+ transpiled to ES5 for Qlik compatibility
- **Optional Framework**: Lightweight frameworks allowed (React, Vue, vanilla JS) if integrated properly with Qlik lifecycle

### Qlik Sense Integration Standards

- MUST use `require.js` to load Qlik modules (`js/qlik`, `qlik-styles`, etc.)
- MUST establish Qlik app connection via `qlik.openApp(appId, config)`
- MUST handle Qlik authentication states and redirect to login if needed
- MUST use Qlik's theming system or ensure custom CSS doesn't conflict
- MUST test in both Qlik Sense Desktop and Server environments
- MUST support Qlik Sense extensions if creating reusable components

### Color & Styling Standards

- MUST use CSS custom properties for theming
- SHOULD respect Qlik Sense theme colors when available
- MUST support both light and dark modes (if Qlik theme supports it)
- Chart colors MUST be colorblind-friendly with sufficient contrast
- Custom styling MUST NOT override critical Qlik object styling

**Rationale**: Qlik Sense mashups require specific integration patterns with RequireJS and Capability APIs. Following these standards ensures compatibility across Qlik environments and proper data integration.

## Quality Standards

### Visual Consistency

All mashup implementations SHOULD reference `DASHBOARD-VISUAL-SPEC.md` for UI guidelines, adapted to Qlik Sense constraints:

- Spacing scale SHOULD follow defined values where applicable
- Typography SHOULD be consistent with Qlik Sense theme or custom design system
- Border radius SHOULD use defined tokens for custom components
- Hover states SHOULD follow animation specifications
- Qlik objects SHOULD be styled consistently (via themes or CSS overrides when necessary)

### Code Quality Gates

Before any commit:

- JavaScript/TypeScript MUST compile/transpile without errors
- Linting MUST pass without warnings (ESLint or TSLint)
- All modified mashup pages MUST be tested in browser with Qlik app connected
- Browser console MUST be free of Qlik API errors
- Qlik objects MUST render and respond to selections properly
- Memory leaks MUST be checked (object destroy called on unmount)

### Testing Requirements (When Specified)

Tests are optional unless explicitly requested in feature specifications. When tests are required:

- Integration tests MUST verify complete user journeys with Qlik selections
- API tests MUST verify proper Qlik Capability API usage
- Accessibility tests MUST verify WCAG compliance of custom mashup UI
- Cross-browser tests MUST cover modern browsers (Chrome, Firefox, Edge, Safari)

**Rationale**: Qlik mashups have unique quality considerations around API integration, memory management, and object lifecycle. These gates ensure stable production mashups.

## Qlik Sense Integration Requirements

### Mashup Project Structure

```
mashup/
├── index.html              # Main mashup page
├── mashup.js               # Core mashup logic (Qlik integration)
├── styles/
│   ├── main.css           # Custom mashup styles (RTL-aware)
│   └── qlik-overrides.css # Qlik object style overrides (use sparingly)
├── components/             # Custom UI components (optional)
├── config/
│   └── qlik-config.js     # Qlik app ID, server URL, auth config
└── resources/              # Local assets (link to Qlik /resources/ for Qlik assets)
```

### Qlik Object Lifecycle Management

All Qlik objects MUST follow proper lifecycle:

```javascript
// Mount: Create Qlik object
app.visualization.create(type, columns, options).then(viz => {
  viz.show('containerId');
});

// Update: Respond to external changes (selections handled automatically)

// Unmount: Destroy object to prevent memory leaks
viz.close().then(() => {
  // Object destroyed
});
```

### Selection Management

Selections MUST use Qlik's native APIs:

```javascript
// Select values in a field
app.field('FieldName').selectValues([{qText: 'Value'}], false, false);

// Clear selections
app.clearAll();

// Lock selections
app.lockAll();
```

### Hypercube Data Access

Custom components using hypercube data MUST:

- Use `app.createCube()` or `app.createList()` for data access
- Implement paging for large datasets (`qPage: {qTop, qLeft, qWidth, qHeight}`)
- Handle data invalidation events properly
- Close hypercubes when no longer needed

**Rationale**: Proper Qlik integration patterns ensure mashups behave like native Qlik apps, maintaining data governance, security, and the associative user experience.

## Development Workflow

### Git Workflow Standards

- MUST commit and push after completing each feature or significant modification
- MUST test mashup with connected Qlik app before committing
- MUST use descriptive commit messages following conventional commits format:
  - `feat:` for new mashup features
  - `fix:` for bug fixes (especially Qlik API integration issues)
  - `docs:` for documentation updates
  - `style:` for visual/styling changes (custom UI or Qlik object styling)
  - `refactor:` for code improvements (mashup structure, Qlik API usage)
  - `perf:` for performance improvements (hypercube optimization, object lifecycle)
  - `qlik:` for Qlik-specific updates (API version changes, object configuration)
  - `chore:` for maintenance tasks

### Branch Strategy

- Feature branches MUST follow pattern: `###-feature-name`
- MUST keep branches short-lived (merge within 1 week)
- MUST create pull requests for review before merging to main
- MUST test in both Qlik Sense Desktop and Server (if available) before merge

### Mashup Verification Protocol

IMMEDIATELY after implementing any mashup change:

1. **Open mashup in browser** with Qlik app connected
2. **Verify Qlik objects render** without errors in console
3. **Test selections** work across all objects (associative behavior)
4. **Check visual consistency** against `DASHBOARD-VISUAL-SPEC.md`
5. **Verify RTL layout** works correctly for Hebrew content
6. **Test responsive behavior** at mobile, tablet, desktop viewports
7. **Check memory usage** (open DevTools → Performance → Memory)
8. **Validate accessibility** (keyboard navigation, screen reader)

For comprehensive design reviews, use the design review agent after completing significant mashup UI features.

**Rationale**: Qlik mashups have unique testing requirements around API integration, selections, and object lifecycle. This protocol catches regressions early.

## Mashup Security & Authentication

### Authentication Requirements

- Mashup MUST handle Qlik Sense authentication state
- MUST redirect to Qlik login page if session expired
- MUST NOT store Qlik credentials in mashup code
- MUST use Qlik's session management (cookies/tickets)
- MUST test authentication flow in target deployment environment

### Data Security

- MUST respect Qlik app section access and data reduction
- MUST NOT attempt to bypass Qlik security model
- MUST validate user permissions before showing sensitive mashup features
- MUST use HTTPS in production for Qlik Server connections

### Content Security Policy

- Mashup MUST work within Qlik Sense Server CSP constraints
- External resources MUST be whitelisted if required
- Inline scripts SHOULD be avoided (use external .js files)

**Rationale**: Qlik Sense has sophisticated security and governance. Mashups must respect this security model to ensure data protection and compliance.

## Governance

### Constitutional Authority

This constitution supersedes all other development practices and guidelines. When conflicts arise between this document and other guidance:

1. Constitution principles take precedence
2. Qlik Sense API documentation takes precedence for technical implementation
3. Visual specifications (`DASHBOARD-VISUAL-SPEC.md`) take precedence for custom UI details
4. Template structures take precedence for project organization

### Amendment Process

Constitution changes MUST follow semantic versioning:

- **MAJOR** (X.0.0): Backward-incompatible governance changes or principle removals
- **MINOR** (0.X.0): New principles added or significant expansion of existing principles
- **PATCH** (0.0.X): Clarifications, wording improvements, or non-semantic refinements

All amendments MUST:

1. Document rationale for the change
2. Update sync impact report in this file
3. Validate consistency with all template files
4. Receive approval before implementation
5. Include migration plan if breaking changes introduced

### Compliance Verification

All pull requests and code reviews MUST verify:

- ✅ Adherence to core principles (I-V)
- ✅ Qlik Sense API integration compliance
- ✅ Quality standards met
- ✅ Workflow steps followed
- ✅ Security and authentication requirements met
- ✅ Visual specification conformance (for custom UI)

Complexity that violates constitution principles MUST be explicitly justified in `plan.md` with documented alternatives considered and rejected.

### Runtime Development Guidance

For day-to-day development practices, refer to:

- `.claude/CLAUDE.md` - Claude AI assistant instructions
- `DASHBOARD-VISUAL-SPEC.md` - Visual design specifications (for custom mashup UI)
- Template files in `.specify/templates/` - Feature planning and task structures
- Qlik Sense Capability APIs documentation - Official Qlik API reference
- Qlik Sense Mashup tutorials - Qlik's official mashup development guide

---

**Version**: 2.0.0 | **Ratified**: 2025-01-06 | **Last Amended**: 2025-01-06
