# Gov.il Vehicle Registration Dashboard

A Qlik Sense mashup dashboard for analyzing vehicle registration data from the Israeli Ministry of Transportation (Gov.il portal).

## Overview

This project provides real-time competitive intelligence and market analytics for Union Motors by processing and visualizing vehicle registration data from the Gov.il open data portal.

### Key Features

- **Real-time Market Analytics**: Daily updates of vehicle registration data (4+ million records)
- **Competitive Intelligence**: Track Union Motors market share vs parallel imports
- **Interactive Visualizations**:
  - KPI cards showing total vehicles, Union Motors share, and top brands
  - Brand distribution charts (top 5 manufacturers)
  - Ownership type analysis (private, leasing, company, rental, dealer)
  - Fuel type distribution (gasoline, diesel, electric, hybrid, plug-in)
  - Top performing Union Motors models
  - Year-over-year registration trends

- **Hebrew/RTL Support**: Fully localized interface with right-to-left layout
- **Responsive Design**: Optimized for desktop, tablet, and mobile viewing
- **Performance Optimized**: Server-side aggregation using Qlik hypercubes

## Business Value

- **Cost Savings**: Eliminates ₪18,000 annual spend on quarterly reports from Ministry of Transportation
- **Faster Insights**: Provides daily competitive intelligence instead of quarterly updates
- **Time Savings**: Reduces manual Excel data processing by ~16 hours per quarter
- **Better Decisions**: Enables data-driven product strategy and sales planning

## Technology Stack

- **BI Platform**: Qlik Sense (Enterprise or SaaS)
- **Frontend**: Qlik Sense Mashup (HTML/CSS/JavaScript)
- **APIs**: Qlik Capability APIs for hypercube data access
- **Data Source**: Gov.il Open Data Portal (Ministry of Transportation)
- **Visualization**: Custom charts using hypercube data with Recharts-compatible styling

## Project Structure

```
Gov_Mashup/
├── specs/                          # Feature specifications
│   └── 1-qlik-mashup-dashboard/   # Current dashboard specification
│       ├── spec.md                 # Detailed feature requirements
│       └── checklists/             # Quality validation checklists
├── DASHBOARD-VISUAL-SPEC.md        # Visual design specification
├── .specify/                       # SpecKit configuration and templates
└── README.md                       # This file
```

## Data Source

The dashboard uses the [Private and Commercial Vehicles Registry](https://data.gov.il/dataset/private-and-commercial-vehicles/resource/053cea08-09bc-40ec-8f7a-156f0677aff3) dataset from the Israeli Government Open Data Portal.

### Key Data Fields

- **mispar_rechev**: License plate number (unique identifier)
- **tozeret_nm**: Manufacturer/brand (requires standardization)
- **kinuy_mishari**: Commercial model name (requires standardization)
- **ramat_gimur**: Trim level (used for Union vs parallel classification)
- **baalut**: Ownership type (private, leasing, company, rental, dealer)
- **sug_delek_nm**: Fuel type (gasoline, diesel, electric, hybrid, plug-in)
- **shnat_yitzur**: Registration year
- **moed_aliya_lakvish**: Registration month (year-month format)

## Getting Started

### Prerequisites

1. Qlik Sense Enterprise or SaaS environment
2. Access to Gov.il open data portal
3. Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Setup

1. **Qlik Sense Data Model Setup**:
   - Create data connection to Gov.il CSV source
   - Build mapping tables for brand/model standardization
   - Configure daily data reload schedule
   - Create calculated fields (Union classification, percentages, etc.)

2. **Mashup Deployment**:
   - Deploy mashup files to web server with Qlik Sense access
   - Configure Qlik Capability API connection
   - Define hypercubes for each visualization component

3. **Business Configuration**:
   - Provide brand name standardization mapping
   - Provide model name standardization mapping
   - Provide trim level to Union/Parallel classification mapping

See [specs/1-qlik-mashup-dashboard/spec.md](specs/1-qlik-mashup-dashboard/spec.md) for detailed requirements and implementation guidance.

## Development Workflow

This project uses [SpecKit](https://github.com/your-speckit-repo) for feature specification and planning:

1. **Specify**: Define features with `/speckit.specify`
2. **Clarify**: Ask targeted questions with `/speckit.clarify`
3. **Plan**: Generate implementation plan with `/speckit.plan`
4. **Implement**: Execute tasks with `/speckit.implement`

Current branch: `1-qlik-mashup-dashboard` (initial dashboard development)

## Design System

The dashboard follows a comprehensive visual specification defined in [DASHBOARD-VISUAL-SPEC.md](DASHBOARD-VISUAL-SPEC.md):

- **Colors**: OKLCH color space for perceptual uniformity
- **Typography**: Hebrew-optimized scale with responsive sizing
- **Layout**: RTL-first responsive grid system
- **Components**: shadcn/ui compatible styling
- **Charts**: Recharts-compatible configurations

## Contributing

This is a private internal project for Union Motors. For questions or support, contact the BI team.

## License

Proprietary - Union Motors Ltd © 2025

---

**Last Updated**: 2025-11-06
**Status**: Initial specification phase
**Next Phase**: Implementation planning
