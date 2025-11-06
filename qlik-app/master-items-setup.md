# Qlik Sense Master Items Setup Guide

**Feature**: 1-qlik-mashup-dashboard
**Date**: 2025-11-06
**Purpose**: Step-by-step guide for creating Master Dimensions, Master Measures, and Variables in Qlik Sense Desktop

> **IMPORTANT**: Complete this setup AFTER running the data-load.qvs script and BEFORE building the mashup UI.

---

## Prerequisites

✅ Qlik Sense Desktop installed and running
✅ Data loaded successfully using [qlik-app/load-scripts/data-load.qvs](load-scripts/data-load.qvs)
✅ All calculated fields present: Brand_Canonical, Union_Flag, Parallel_Flag, Current_Year_Flag, etc.

---

## Setup Steps Overview

1. **Create Variables** (3 variables)
2. **Create Master Dimensions** (8 dimensions)
3. **Create Master Measures** (12 measures)
4. **Validate Setup** (test in sheet)

**Estimated Time**: 20-30 minutes

---

## Step 1: Create Variables

Variables store dynamic values that can be reused across expressions.

### How to Create Variables

1. Open your Qlik Sense app in Desktop
2. Click **Edit** mode (top right)
3. Go to **Variables** panel (left sidebar, variable icon)
4. Click **Create new** (+)
5. Enter name and definition
6. Click **Create**

### Variables to Create

| Variable Name | Definition | Description | Example Value |
|---------------|------------|-------------|---------------|
| `vCurrentYear` | `=Year(Today())` | Current year (dynamic) | 2025 |
| `vTotalVehicles` | `=Count(DISTINCT mispar_rechev)` | Total vehicle count expression | - |
| `vUnionVehicles` | `=Count({<Union_Flag={1}>} DISTINCT mispar_rechev)` | Union vehicles count expression | - |

**Why use variables?**
- `vCurrentYear`: Automatically updates every year without changing code
- `vTotalVehicles`, `vUnionVehicles`: Reusable expressions for consistency

---

## Step 2: Create Master Dimensions

Master Dimensions are reusable field definitions with labels and descriptions.

### How to Create Master Dimensions

1. In Edit mode, go to **Master items** panel (left sidebar)
2. Click **Dimensions** tab
3. Click **Create new** (+)
4. Select field from the list
5. Enter Label (Hebrew name for display)
6. Optional: Add Description
7. Click **Add dimension**

### Dimensions to Create

| # | Field Name | Label (Hebrew) | Label (English) | Description |
|---|------------|----------------|-----------------|-------------|
| 1 | `Brand_Canonical` | מותג | Brand | Standardized vehicle brand name |
| 2 | `Model_Canonical` | דגם | Model | Standardized vehicle model name |
| 3 | `baalut` | סוג בעלות | Ownership Type | Type of ownership (private, leasing, company, rental, dealer) |
| 4 | `sug_delek_nm` | סוג דלק | Fuel Type | Fuel type (gasoline, diesel, electric, hybrid, plug-in) |
| 5 | `shnat_yitzur` | שנת ייצור | Manufacturing Year | Vehicle manufacturing year |
| 6 | `Registration_Year` | שנת רישום | Registration Year | Year vehicle was registered |
| 7 | `Registration_Month_Name_Hebrew` | חודש רישום | Registration Month | Month name in Hebrew |
| 8 | `Union_Flag` | דגל יוניון | Union Flag | Is Union Motors? (1=Yes, 0=No) |

**Tips**:
- Use Hebrew labels for user-facing display
- English field names remain unchanged (used in code)
- Add descriptions to help future maintenance

---

## Step 3: Create Master Measures

Master Measures are reusable calculations/expressions.

### How to Create Master Measures

1. In Edit mode, go to **Master items** panel
2. Click **Measures** tab
3. Click **Create new** (+)
4. Enter Expression (see table below)
5. Enter Label (Hebrew)
6. Optional: Add Number formatting (e.g., # ##0 for thousands separator)
7. Click **Add measure**

### Measures to Create

#### KPI Measures (User Story 1)

| # | Measure Name | Label (Hebrew) | Expression | Number Format |
|---|--------------|----------------|------------|---------------|
| 1 | `Total_Vehicles` | סה"כ רכבים | `Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)` | # ##0 |
| 2 | `Union_Vehicles_Count` | סה"כ רכבי יוניון | `Count({<Current_Year_Flag={1}, Union_Flag={1}>} DISTINCT mispar_rechev)` | # ##0 |
| 3 | `Union_Vehicles_Percentage` | אחוז יוניון | `Count({<Current_Year_Flag={1}, Union_Flag={1}>} DISTINCT mispar_rechev) / Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)` | 0.0% |
| 4 | `Parallel_Vehicles_Count` | סה"כ רכבי יבוא מקביל | `Count({<Current_Year_Flag={1}, Parallel_Flag={1}>} DISTINCT mispar_rechev)` | # ##0 |

#### Chart Measures (User Stories 2-4)

| # | Measure Name | Label (Hebrew) | Expression | Number Format |
|---|--------------|----------------|------------|---------------|
| 5 | `Brand_Vehicle_Count` | מספר רכבים לפי מותג | `Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)` | # ##0 |
| 6 | `Ownership_Vehicle_Count` | מספר רכבים לפי בעלות | `Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)` | # ##0 |
| 7 | `Fuel_Vehicle_Count` | מספר רכבים לפי דלק | `Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)` | # ##0 |
| 8 | `Union_Models_Count` | מספר רכבי יוניון לפי דגם | `Count({<Current_Year_Flag={1}, Union_Flag={1}>} DISTINCT mispar_rechev)` | # ##0 |
| 9 | `Year_Vehicle_Count` | מספר רכבים לפי שנה | `Count(DISTINCT mispar_rechev)` | # ##0 |

#### Percentage Measures (Optional - for advanced visuals)

| # | Measure Name | Label (Hebrew) | Expression | Number Format |
|---|--------------|----------------|------------|---------------|
| 10 | `Brand_Percentage` | אחוז מותג | `Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev) / Count({<Current_Year_Flag={1}>} TOTAL DISTINCT mispar_rechev)` | 0.0% |
| 11 | `Ownership_Percentage` | אחוז בעלות | `Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev) / Count({<Current_Year_Flag={1}>} TOTAL DISTINCT mispar_rechev)` | 0.0% |
| 12 | `Fuel_Percentage` | אחוז דלק | `Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev) / Count({<Current_Year_Flag={1}>} TOTAL DISTINCT mispar_rechev)` | 0.0% |

**Number Format Notes**:
- `# ##0`: Thousands separator (e.g., 150 234)
- `0.0%`: Percentage with 1 decimal (e.g., 15.3%)
- Hebrew locale will automatically use Hebrew numerals if system is set to Hebrew

---

## Step 4: Validate Setup

### Create Test Sheet

1. Create a new sheet: **Test Master Items**
2. Add a **Table** visualization
3. Add dimensions: Brand_Canonical, Model_Canonical
4. Add measure: Total_Vehicles
5. Verify data appears correctly

### Validation Checklist

- [ ] All 3 variables created and show correct values
- [ ] All 8 master dimensions appear in dimension list
- [ ] All 12 master measures appear in measure list
- [ ] Test table shows data with correct Hebrew labels
- [ ] Numbers format correctly (thousands separator)
- [ ] Percentages calculate correctly (should sum to ~100%)

**Expected Results**:
- Table shows brands with vehicle counts
- Hebrew labels display correctly (right-to-left)
- Counts match expectations (use your knowledge of the data)

---

## Quick Reference: Using Master Items in Mashup

Once master items are created, reference them in your mashup hypercubes:

### Example: Using Master Dimension

```javascript
// Instead of inline field definition:
qDimensions: [{
  qDef: { qFieldDefs: ["Brand_Canonical"] }
}]

// Use master dimension (OPTIONAL - either approach works):
qDimensions: [{
  qLibraryId: "Brand_Canonical"  // References master dimension by field name
}]
```

### Example: Using Master Measure

```javascript
// Instead of inline expression:
qMeasures: [{
  qDef: { qDef: "Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)" }
}]

// Use master measure (OPTIONAL):
qMeasures: [{
  qLibraryId: "Total_Vehicles"  // References master measure by name
}]
```

**Note**: The mashup hypercubes will use **inline definitions** (not master items) for simplicity. Master items are created here for:
1. Testing and validation in Qlik Sense Desktop
2. Future maintenance and troubleshooting
3. Consistency across different mashups/sheets

---

## Troubleshooting

### Problem: Variable shows "Error in expression"
**Solution**: Check syntax - variables should start with `=` for expressions

### Problem: Master dimension not showing data
**Solution**: Verify the field exists in the data model (check Fields list)

### Problem: Master measure returns zero
**Solution**:
1. Check if Current_Year_Flag field exists and has value 1
2. Verify data was loaded correctly (check table viewer)
3. Test expression in a chart before creating master measure

### Problem: Hebrew labels not displaying
**Solution**: Make sure Qlik Sense Desktop is set to support Hebrew (Edit → Preferences → Regional settings)

---

## Next Steps

After completing this setup:

1. ✅ Validate all master items work in a test sheet
2. ✅ Proceed to **Task T020** in [tasks.md](../specs/1-qlik-mashup-dashboard/tasks.md) - Define hypercubes for mashup
3. ✅ Reference these master items when building hypercube definitions (for consistency)

**Master items are ready to use!** 🎉

---

## Appendix: Complete Variable List

Copy-paste these into Qlik Sense variable editor:

```
Variable Name: vCurrentYear
Definition: =Year(Today())

Variable Name: vTotalVehicles
Definition: =Count(DISTINCT mispar_rechev)

Variable Name: vUnionVehicles
Definition: =Count({<Union_Flag={1}>} DISTINCT mispar_rechev)
```

## Appendix: Set Analysis Cheat Sheet

For reference when creating custom measures:

```qlik
// Current year filter
{<Current_Year_Flag={1}>}

// Union Motors filter
{<Union_Flag={1}>}

// Parallel import filter
{<Parallel_Flag={1}>}

// Combine filters (AND logic)
{<Current_Year_Flag={1}, Union_Flag={1}>}

// Multiple years (OR logic)
{<Registration_Year={2024, 2025}>}

// TOTAL keyword (for percentage calculations)
Count(DISTINCT mispar_rechev) / Count(TOTAL DISTINCT mispar_rechev)
```
