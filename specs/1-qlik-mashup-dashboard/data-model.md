# Data Model: Qlik Sense Vehicle Registration Analytics

**Feature**: 1-qlik-mashup-dashboard
**Date**: 2025-11-06
**Purpose**: Define the Qlik Sense data model structure, field definitions, and data transformation logic for the Gov.il vehicle registration dashboard

## Overview

This document describes the Qlik Sense application data model that powers the mashup dashboard. The data model consists of:

1. **Fact Table**: Vehicle Registration Records (4+ million rows, 1996-2025)
2. **Dimension Tables**: Brand Master, Model Master (mapping tables)
3. **Calculated Fields**: Derived metrics and classifications
4. **Aggregations**: Pre-calculated summaries for performance

The Qlik Sense application (.qvf file) will load daily from the Gov.il CSV source, apply standardization mappings, and create calculated fields for dashboard consumption.

---

## Data Source

### Gov.il CSV File

**Source URL**: https://data.gov.il/dataset/private-and-commercial-vehicles/resource/053cea08-09bc-40ec-8f7a-156f0677aff3

**File Characteristics**:
- Format: CSV (UTF-8 encoded)
- Size: ~800MB per file
- Rows: 4+ million records (1996-present)
- Update Frequency: Daily (new records added overnight)
- Historical Data: Complete vehicle registry from 1996 to current date

**Load Strategy**:
- Full load daily (replace entire dataset)
- Filter to 2020+ for primary analysis (performance optimization)
- Retain full history in separate QVD for historical queries

---

## Fact Table: Vehicle Registration Records

### Table Name
`VehicleRegistrations`

### Description
Core fact table containing one row per registered vehicle. Each row represents a unique vehicle identified by license plate number (`mispar_rechev`).

### Source Fields (from Gov.il CSV)

| Field Name (Hebrew) | English Description | Data Type | Example | Notes |
|---------------------|---------------------|-----------|---------|-------|
| `mispar_rechev` | License plate number | String(10) | "12345678" | Unique identifier, primary key |
| `tozeret_cd` | Manufacturer code | String(10) | "TOY001" | Qlik dimension |
| `sug_degem` | Vehicle type | String(20) | "פרטי" (Private) | "פרטי" or "מסחרי" |
| `tozeret_nm` | Manufacturer name (raw) | String(100) | "טויוטה יפן" | Requires standardization |
| `degem_cd` | Model code | String(20) | "1234" | Internal code |
| `degem_nm` | Model technical name | String(100) | "ZRE212L-AEMGKW" | Katashiki (chassis code) |
| `ramat_gimur` | Trim level | String(100) | "C SPORT" | Used for Union classification |
| `ramat_eivzur_betihuty` | Safety equipment level | String(50) | "5" | Optional field |
| `kvutzat_zihum` | Emissions group | String(20) | "EURO6" | Optional field |
| `shnat_yitzur` | Manufacturing year | Integer | 2024 | Registration year (not build year) |
| `degem_manoa` | Engine model | String(50) | "2ZR-FE" | Technical field |
| `mivchan_acharon_dt` | Last inspection date | Date | "2024-01-15" | Optional field |
| `tokef_dt` | Expiry date | Date | "2025-01-15" | Optional field |
| `baalut` | Ownership type | String(20) | "פרטי", "ליסינג", "חברה" | Critical dimension |
| `misgeret` | Chassis number (VIN) | String(17) | "JTDBR3EE20J123456" | Used to identify non-Union vehicles |
| `tzeva_cd` | Color code | String(10) | "040" | Optional field |
| `tzeva_rechev` | Color description | String(50) | "לבן" (White) | Optional field |
| `zmig_kidmi` | Front tire size | String(30) | "215/55R17" | Technical field |
| `zmig_ahori` | Rear tire size | String(30) | "215/55R17" | Technical field |
| `sug_delek_nm` | Fuel type | String(50) | "בנזין", "דיזל", "חשמלי" | Critical dimension |
| `horaat_rishum` | Registration instruction | String(100) | Various | Optional field |
| `moed_aliya_lakvish` | Registration month | Date(YYYY-MM) | "2024-01" | Year-month only, no day |
| `kinuy_mishari` | Commercial model name (raw) | String(100) | "קורולה קרוס" | Requires standardization |

### Derived Fields (Calculated in Qlik)

| Field Name | Description | Data Type | Calculation Logic | Example |
|------------|-------------|-----------|-------------------|---------|
| `Brand_Canonical` | Standardized brand name | String(50) | Mapping from `tozeret_nm` via BrandMaster | "Toyota" |
| `Model_Canonical` | Standardized model name | String(100) | Mapping from `kinuy_mishari` via ModelMaster | "Corolla Cross" |
| `Union_Flag` | Is this a Union Motors vehicle? | Boolean | 1 if `ramat_gimur` in UnionTrimMapping, else 0 | 1 (Yes) |
| `Parallel_Flag` | Is this a parallel import? | Boolean | 1 - `Union_Flag` | 0 (No) |
| `Registration_Date_Actual` | Actual registration date | Date | Daily load timestamp for new records | "2024-01-15" |
| `Registration_Year` | Year extracted from date | Integer | `Year(Registration_Date_Actual)` | 2024 |
| `Registration_Month_Num` | Month number | Integer | `Month(Registration_Date_Actual)` | 1 |
| `Registration_Month_Name` | Month name (Hebrew) | String | Hebrew month name lookup | "ינואר" (January) |
| `Current_Year_Flag` | Is this year 2025? | Boolean | `if(Registration_Year = 2025, 1, 0)` | 1 (Yes) |
| `Age_Years` | Vehicle age in years | Integer | `Year(Today()) - shnat_yitzur` | 1 |
| `Ownership_Type_Hebrew` | Ownership type (standardized) | String(20) | Mapped from `baalut` | "פרטי", "ליסינג", "חברה", "השכרה", "סוחר" |
| `Fuel_Type_Hebrew` | Fuel type (standardized) | String(50) | Mapped from `sug_delek_nm` | "בנזין", "דיזל", "חשמלי", "היברידי", "פלאג-אין" |

### Validation Rules

From feature spec functional requirements:

- **FR-001**: `mispar_rechev` must be unique (primary key constraint)
- **FR-002**: `Brand_Canonical` must map to one of the standardized brand names (no nulls for major brands)
- **FR-003**: `Model_Canonical` must map to standardized model names (allows null for rare models)
- **FR-004**: `ramat_gimur` must map to Union/Parallel classification (critical business logic)
- **FR-005**: `Registration_Date_Actual` must be populated for all records via daily snapshot comparison
- **FR-006**: `Union_Flag` and `Parallel_Flag` must sum to 1 for each record (mutually exclusive)
- **FR-007**: `Current_Year_Flag` must be recalculated daily to reflect actual year
- **FR-008**: `Ownership_Type_Hebrew` and `Fuel_Type_Hebrew` must be standardized (no raw variations)

---

## Mapping Tables (Dimension Tables)

### 1. BrandMaster (Brand Standardization)

**Purpose**: Map raw manufacturer names (`tozeret_nm`) to canonical brand names

**Table Name**: `BrandMaster`

**Structure**:

| Field Name | Description | Data Type | Example | Notes |
|------------|-------------|-----------|---------|-------|
| `Raw_Brand` | Original manufacturer name from CSV | String(100) | "טויוטה יפן" | From `tozeret_nm` |
| `Canonical_Brand` | Standardized brand name | String(50) | "Toyota" | Master brand name |
| `Brand_Group` | Brand parent company (optional) | String(50) | "Toyota Motor Corporation" | For grouping |
| `Is_Union_Brand` | Does Union Motors sell this brand? | Boolean | 1 (Yes) | For filtering |

**Sample Data**:

| Raw_Brand | Canonical_Brand | Brand_Group | Is_Union_Brand |
|-----------|-----------------|-------------|----------------|
| "טויוטה יפן" | "Toyota" | "Toyota Motor Corporation" | 1 |
| "טויוטה טורקיה" | "Toyota" | "Toyota Motor Corporation" | 1 |
| "לקסוס יפן" | "Lexus" | "Toyota Motor Corporation" | 1 |
| "לקסוס אירופה" | "Lexus" | "Toyota Motor Corporation" | 1 |
| "הונדה יפן" | "Honda" | "Honda Motor Co." | 0 |
| "מרצדס בנץ גרמניה" | "Mercedes-Benz" | "Mercedes-Benz Group AG" | 0 |
| "קיה דרום קוריאה" | "Kia" | "Hyundai Motor Group" | 0 |

**Load Strategy**:
- Maintained manually in Excel or inline table in Qlik load script
- Business user (Eran Morlevy) provides mapping quarterly for new brands
- Use `ApplyMap()` function in Qlik to map `tozeret_nm` → `Brand_Canonical`

**Qlik Load Script Example**:
```qlik
BrandMaster:
LOAD * INLINE [
Raw_Brand, Canonical_Brand, Brand_Group, Is_Union_Brand
"טויוטה יפן", "Toyota", "Toyota Motor Corporation", 1
"טויוטה טורקיה", "Toyota", "Toyota Motor Corporation", 1
"לקסוס יפן", "Lexus", "Toyota Motor Corporation", 1
"הונדה יפן", "Honda", "Honda Motor Co.", 0
// ... rest of mapping
];

// Create mapping object
BrandMap:
Mapping LOAD
  Raw_Brand,
  Canonical_Brand
RESIDENT BrandMaster;
```

### 2. ModelMaster (Model Standardization)

**Purpose**: Map raw commercial model names (`kinuy_mishari`) to canonical model names

**Table Name**: `ModelMaster`

**Structure**:

| Field Name | Description | Data Type | Example | Notes |
|------------|-------------|-----------|---------|-------|
| `Raw_Model` | Original commercial name from CSV | String(100) | "קורולה קרוס 1.8 היברידי" | From `kinuy_mishari` |
| `Canonical_Model` | Standardized model name | String(100) | "Corolla Cross" | Master model name |
| `Brand` | Associated brand | String(50) | "Toyota" | For validation |
| `Segment` | Vehicle segment (optional) | String(50) | "Compact SUV" | For analysis |
| `Body_Type` | Body style (optional) | String(30) | "SUV" | For analysis |

**Sample Data**:

| Raw_Model | Canonical_Model | Brand | Segment | Body_Type |
|-----------|-----------------|-------|---------|-----------|
| "קורולה קרוס 1.8 היברידי" | "Corolla Cross" | "Toyota" | "Compact SUV" | "SUV" |
| "קורולה קרוס 1.8 HYBRID" | "Corolla Cross" | "Toyota" | "Compact SUV" | "SUV" |
| "ראב 4 2.5 HYBRID AWD" | "RAV4" | "Toyota" | "Mid-Size SUV" | "SUV" |
| "קמרי 2.5 היברידית" | "Camry" | "Toyota" | "Mid-Size Sedan" | "Sedan" |

**Load Strategy**:
- Maintained manually in Excel or inline table
- Business user provides mapping quarterly for new models
- Use fuzzy matching or substring matching for variations

**Qlik Load Script Example**:
```qlik
ModelMaster:
LOAD * INLINE [
Raw_Model, Canonical_Model, Brand, Segment, Body_Type
"קורולה קרוס 1.8 היברידי", "Corolla Cross", "Toyota", "Compact SUV", "SUV"
"קורולה קרוס 1.8 HYBRID", "Corolla Cross", "Toyota", "Compact SUV", "SUV"
// ... rest of mapping
];

// Create mapping object
ModelMap:
Mapping LOAD
  Raw_Model,
  Canonical_Model
RESIDENT ModelMaster;
```

### 3. UnionTrimMapping (Union vs Parallel Classification)

**Purpose**: Classify vehicles as Union Motors or parallel import based on trim level (`ramat_gimur`)

**Table Name**: `UnionTrimMapping`

**Structure**:

| Field Name | Description | Data Type | Example | Notes |
|------------|-------------|-----------|---------|-------|
| `Trim_Level` | Trim level value from CSV | String(100) | "C SPORT" | From `ramat_gimur` |
| `Brand` | Associated brand | String(50) | "Toyota" | For validation |
| `Model` | Associated model (optional) | String(100) | "Corolla Cross" | For specificity |
| `Is_Union` | Is this Union Motors? | Boolean | 1 (Yes) | Business classification |

**Sample Data**:

| Trim_Level | Brand | Model | Is_Union |
|------------|-------|-------|----------|
| "C SPORT" | "Toyota" | "Corolla Cross" | 1 |
| "XLE Premium" | "Toyota" | "Camry" | 1 |
| "LE" | "Toyota" | "Camry" | 0 (Parallel) |
| "ES 300h" | "Lexus" | "ES" | 1 |
| "RX 450h" | "Lexus" | "RX" | 1 |

**Load Strategy**:
- Maintained manually by business user (Eran Morlevy)
- Critical business logic - accuracy is paramount
- Use `ApplyMap()` with default value of 0 (assume parallel if not in mapping)

**Qlik Load Script Example**:
```qlik
UnionTrimMapping:
LOAD * INLINE [
Trim_Level, Brand, Model, Is_Union
"C SPORT", "Toyota", "Corolla Cross", 1
"XLE Premium", "Toyota", "Camry", 1
"LE", "Toyota", "Camry", 0
// ... rest of mapping
];

// Create mapping object (concatenate brand+model+trim for uniqueness)
UnionTrimMap:
Mapping LOAD
  Brand & '|' & Model & '|' & Trim_Level as Trim_Key,
  Is_Union
RESIDENT UnionTrimMapping;
```

---

## Data Transformation Logic

### Daily Data Load Process

**Sequence** (executed daily via Qlik Sense scheduled reload):

1. **Extract**: Download latest CSV from Gov.il portal
2. **Detect New Records**: Compare current CSV with yesterday's snapshot to identify new registrations
   - Use `EXISTS()` function in Qlik to flag new `mispar_rechev` values
   - Assign `Registration_Date_Actual` = today's date for new records
3. **Apply Brand Standardization**: Map `tozeret_nm` → `Brand_Canonical` using BrandMaster
4. **Apply Model Standardization**: Map `kinuy_mishari` → `Model_Canonical` using ModelMaster
5. **Classify Union/Parallel**: Map `Brand_Canonical + Model_Canonical + ramat_gimur` → `Union_Flag`
6. **Calculate Derived Fields**: `Registration_Year`, `Current_Year_Flag`, `Age_Years`, etc.
7. **Filter to Current Year**: Create optimized QVD for 2025 data only (performance)
8. **Store Historical Snapshot**: Save full dataset as QVD for daily comparison tomorrow

**Qlik Load Script Pseudo-Code**:

```qlik
// 1. Load yesterday's snapshot for comparison
Yesterday:
LOAD
  mispar_rechev as Prev_mispar_rechev
FROM [lib://DataConnection/Yesterday_Snapshot.qvd] (qvd);

// 2. Load today's CSV from Gov.il
VehicleRegistrations_Raw:
LOAD
  mispar_rechev,
  tozeret_nm,
  kinuy_mishari,
  ramat_gimur,
  baalut,
  sug_delek_nm,
  shnat_yitzur,
  moed_aliya_lakvish,
  misgeret,
  // ... all other fields
FROM [lib://DataConnection/gov_il_vehicles.csv]
(txt, utf8, embedded labels, delimiter is ',', msq);

// 3. Detect new records and assign registration date
VehicleRegistrations:
LOAD
  *,
  // Assign today's date if new record, else use moed_aliya_lakvish
  if(not Exists(Prev_mispar_rechev, mispar_rechev), Today(), Date(moed_aliya_lakvish, 'YYYY-MM-DD')) as Registration_Date_Actual,

  // Apply brand standardization
  ApplyMap('BrandMap', tozeret_nm, 'Unknown') as Brand_Canonical,

  // Apply model standardization
  ApplyMap('ModelMap', kinuy_mishari, kinuy_mishari) as Model_Canonical,

  // Classify Union/Parallel (create composite key)
  ApplyMap('UnionTrimMap',
    ApplyMap('BrandMap', tozeret_nm, 'Unknown') & '|' &
    ApplyMap('ModelMap', kinuy_mishari, kinuy_mishari) & '|' &
    ramat_gimur,
    0) as Union_Flag,

  // Derived fields
  Year(if(not Exists(Prev_mispar_rechev, mispar_rechev), Today(), Date(moed_aliya_lakvish))) as Registration_Year,
  Year(Today()) - shnat_yitzur as Age_Years,
  if(Year(if(not Exists(Prev_mispar_rechev, mispar_rechev), Today(), Date(moed_aliya_lakvish))) = 2025, 1, 0) as Current_Year_Flag

RESIDENT VehicleRegistrations_Raw;

DROP TABLE VehicleRegistrations_Raw;

// 4. Calculate Parallel Flag
Left Join (VehicleRegistrations)
LOAD
  mispar_rechev,
  1 - Union_Flag as Parallel_Flag
RESIDENT VehicleRegistrations;

// 5. Store today's snapshot for tomorrow's comparison
STORE VehicleRegistrations INTO [lib://DataConnection/$(vToday)_Snapshot.qvd] (qvd);

// 6. Create optimized 2025-only QVD
Vehicles_2025:
LOAD *
RESIDENT VehicleRegistrations
WHERE Current_Year_Flag = 1;

STORE Vehicles_2025 INTO [lib://DataConnection/Vehicles_2025.qvd] (qvd);
```

### Aggregation Tables (Optional - for Performance)

If dashboard performance is slow, create pre-aggregated tables:

**Aggregation 1: Brand Summary**
```qlik
BrandSummary:
LOAD
  Brand_Canonical,
  Count(DISTINCT mispar_rechev) as Total_Vehicles,
  Sum(Union_Flag) as Union_Vehicles,
  Sum(Parallel_Flag) as Parallel_Vehicles
RESIDENT VehicleRegistrations
WHERE Current_Year_Flag = 1
GROUP BY Brand_Canonical;
```

**Aggregation 2: Ownership Summary**
```qlik
OwnershipSummary:
LOAD
  baalut,
  Count(DISTINCT mispar_rechev) as Total_Vehicles
RESIDENT VehicleRegistrations
WHERE Current_Year_Flag = 1
GROUP BY baalut;
```

---

## Data Quality Considerations

### Missing Data Handling

| Field | Missing Data Strategy | Justification |
|-------|----------------------|---------------|
| `tozeret_nm` | Map to "Unknown" brand | Rare, but possible for very old vehicles |
| `kinuy_mishari` | Keep raw value if no mapping | Not all models need standardization |
| `ramat_gimur` | Default `Union_Flag = 0` (parallel) | Conservative approach - assume not Union unless proven |
| `baalut` | Map to "לא ידוע" (Unknown) | Rare, data quality issue in source |
| `sug_delek_nm` | Map to "לא ידוע" (Unknown) | Very rare, likely data entry error |
| `moed_aliya_lakvish` | Use load date as proxy | Should never happen for valid registrations |

### Data Validation Checks

Implemented in Qlik load script to alert on data quality issues:

```qlik
// Check for missing license plates (critical failure)
IF NoOfRows('VehicleRegistrations') WHERE Len(Trim(mispar_rechev)) = 0 > 0 THEN
  TRACE *** ERROR: Records with missing mispar_rechev found! ***;
  EXIT Script;
END IF

// Check for unmapped brands (warning)
UnmappedBrands:
LOAD
  tozeret_nm,
  Count(*) as Unmapped_Count
RESIDENT VehicleRegistrations
WHERE Brand_Canonical = 'Unknown'
GROUP BY tozeret_nm;

IF NoOfRows('UnmappedBrands') > 0 THEN
  TRACE *** WARNING: $(NoOfRows('UnmappedBrands')) unmapped brands found ***;
  // Log to QVW monitoring table for business review
END IF

// Check for Union classification rate (business logic validation)
LET vUnionPct = Sum(Union_Flag) / Count(DISTINCT mispar_rechev);
IF $(vUnionPct) < 0.05 OR $(vUnionPct) > 0.30 THEN
  TRACE *** WARNING: Union classification rate is $(vUnionPct) - expected 5-30% ***;
  // Alert business user for mapping review
END IF
```

---

## Field Naming Conventions

**Qlik Sense Field Names** (for consistency and clarity):

- **Raw fields**: Keep original Hebrew names from CSV (e.g., `tozeret_nm`, `mispar_rechev`)
- **Standardized fields**: Use English names with suffix (e.g., `Brand_Canonical`, `Model_Canonical`)
- **Flags/Booleans**: Use `_Flag` suffix (e.g., `Union_Flag`, `Current_Year_Flag`)
- **Calculated dates**: Use `_Actual` suffix to distinguish from raw (e.g., `Registration_Date_Actual`)
- **Mapping tables**: Use `Master` suffix (e.g., `BrandMaster`, `ModelMaster`)

**Hypercube Dimension Names** (for mashup):

- Use clear English labels: `"Brand"`, `"Model"`, `"Ownership Type"`, `"Fuel Type"`
- Avoid technical field names in hypercube labels (user-facing)
- Example: `qDef: { qFieldDefs: ["Brand_Canonical"], qLabel: "Brand" }`

---

## Data Model Diagram (Text Representation)

```
┌─────────────────────────────────────────────────────────────┐
│ VehicleRegistrations (Fact Table)                           │
│ ─────────────────────────────────────────────────────────── │
│ PK: mispar_rechev (License Plate)                           │
│                                                              │
│ Raw Fields (from CSV):                                      │
│   - tozeret_nm, kinuy_mishari, ramat_gimur                 │
│   - baalut, sug_delek_nm, shnat_yitzur                     │
│   - moed_aliya_lakvish, misgeret, degem_nm                 │
│   - (... 20+ other fields)                                  │
│                                                              │
│ Derived Fields (calculated):                                │
│   - Brand_Canonical ──────┐                                 │
│   - Model_Canonical ──────┤                                 │
│   - Union_Flag ───────────┤                                 │
│   - Parallel_Flag         │                                 │
│   - Registration_Date_Actual                                │
│   - Registration_Year, Current_Year_Flag                    │
│   - Age_Years, Ownership_Type_Hebrew, Fuel_Type_Hebrew     │
└──────────────────────────┬────────────────────────────────┬─┘
                           │                                │
                           │                                │
         ┌─────────────────┴──────┐          ┌──────────────┴────────────┐
         │                        │          │                            │
┌────────▼───────────┐  ┌─────────▼────────┐ │  ┌────────────────────────▼───┐
│ BrandMaster        │  │ ModelMaster      │ │  │ UnionTrimMapping           │
│ (Dimension)        │  │ (Dimension)      │ │  │ (Classification)           │
│ ───────────────── │  │ ──────────────── │ │  │ ─────────────────────────  │
│ - Raw_Brand       │  │ - Raw_Model      │ │  │ - Trim_Level               │
│ - Canonical_Brand │  │ - Canonical_Model│ │  │ - Brand, Model             │
│ - Brand_Group     │  │ - Brand          │ │  │ - Is_Union (0/1)           │
│ - Is_Union_Brand  │  │ - Segment        │ │  └────────────────────────────┘
└───────────────────┘  │ - Body_Type      │ │
                       └──────────────────┘ │
                                            │
                         Mapping Relationships
                       (ApplyMap in Qlik Load Script)
```

---

## Next Steps

This data model document will be used to:

1. **Generate Qlik Sense load script** (`qlik-app/load-scripts/data-load.qvs`)
2. **Define hypercube contracts** (`contracts/hypercubes.md`)
3. **Populate quickstart guide** with data setup instructions (`quickstart.md`)

**Ready for**: Phase 1 - Contracts Generation
