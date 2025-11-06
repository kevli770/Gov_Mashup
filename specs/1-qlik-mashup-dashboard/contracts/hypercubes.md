# Hypercube Contracts: Qlik Sense Mashup Dashboard

**Feature**: 1-qlik-mashup-dashboard
**Date**: 2025-11-06
**Purpose**: Define Qlik Sense hypercube specifications for all dashboard visualizations

## Overview

This document defines the hypercube contracts for the 8 data components in the dashboard:

1. **KPI Card 1**: Total Vehicles Count
2. **KPI Card 2**: Union Motors Vehicles Count and Percentage
3. **KPI Card 3**: Top Brand Summary
4. **Chart 1**: Brand Distribution (Pie Chart - Top 5)
5. **Chart 2**: Ownership Distribution (Bar Chart)
6. **Chart 3**: Fuel Distribution (Donut Chart)
7. **Chart 4**: Top Union Models (Ranked List)
8. **Chart 5**: Year Distribution (Bar Chart - Last 5 Years)

Each hypercube definition follows the Qlik Sense `app.createCube()` API format.

---

## Hypercube Contract Template

All hypercubes follow this structure:

```javascript
app.createCube({
  qInitialDataFetch: [{         // Initial page to fetch
    qTop: 0,                     // Starting row
    qLeft: 0,                    // Starting column
    qHeight: N,                  // Number of rows
    qWidth: M                    // Number of columns (dims + measures)
  }],
  qDimensions: [/* ... */],      // Dimensions (fields to group by)
  qMeasures: [/* ... */],        // Measures (calculations/aggregations)
  qSuppressZero: true/false,     // Hide rows with zero values?
  qSuppressMissing: true/false,  // Hide rows with missing dimensions?
  qMode: "S",                    // Data reduction mode (S=Straight table)
  qInterColumnSortOrder: [/* */],// Sort priority by column index
  qStateName: "$"                // Selection state name ($ = default)
}, callbackFunction);
```

---

## 1. KPI Card 1: Total Vehicles Count

### Purpose
Display the total number of vehicles registered in the current year (2025).

### Hypercube Definition

```javascript
const hypercube_TotalVehicles = {
  qInitialDataFetch: [{
    qTop: 0,
    qLeft: 0,
    qHeight: 1,          // Only 1 row (single total)
    qWidth: 1            // Only 1 column (count measure)
  }],
  qDimensions: [],       // No dimensions - this is a total count
  qMeasures: [{
    qDef: {
      qDef: "Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)"
    },
    qLabel: "Total Vehicles 2025",
    qSortBy: {
      qSortByState: 0,
      qSortByFrequency: 0,
      qSortByNumeric: 0,
      qSortByAscii: 0,
      qSortByLoadOrder: 0,
      qSortByExpression: 0,
      qExpression: { qv: "" }
    }
  }],
  qSuppressZero: false,
  qSuppressMissing: false,
  qMode: "S",
  qInterColumnSortOrder: [],
  qStateName: "$"
};
```

### Expected Response Structure

```javascript
{
  qHyperCube: {
    qSize: { qcx: 1, qcy: 1 },  // 1 column, 1 row
    qDimensionInfo: [],          // No dimensions
    qMeasureInfo: [{
      qMin: 150000,              // Min value (approximate)
      qMax: 150000,              // Max value (same as min for single value)
      qFallbackTitle: "Total Vehicles 2025"
    }],
    qDataPages: [{
      qMatrix: [
        [                        // Row 1
          {                      // Column 1: Measure
            qText: "150,234",    // Formatted number (Hebrew locale)
            qNum: 150234,        // Numeric value
            qElemNumber: 0,
            qState: "L"          // Locked/unlocked state
          }
        ]
      ]
    }]
  }
}
```

### Usage in Mashup

```javascript
app.createCube(hypercube_TotalVehicles, function(reply) {
  const totalVehicles = reply.qHyperCube.qDataPages[0].qMatrix[0][0];
  const count = totalVehicles.qNum;
  const formatted = totalVehicles.qText;

  document.getElementById('kpi-total-value').textContent = formatted.toLocaleString('he-IL');
});
```

---

## 2. KPI Card 2: Union Motors Vehicles Count and Percentage

### Purpose
Display Union Motors vehicles count and market share percentage for current year.

### Hypercube Definition

```javascript
const hypercube_UnionVehicles = {
  qInitialDataFetch: [{
    qTop: 0,
    qLeft: 0,
    qHeight: 1,          // Only 1 row
    qWidth: 3            // 3 measures: Union count, Total count, Percentage
  }],
  qDimensions: [],       // No dimensions
  qMeasures: [
    {
      qDef: {
        qDef: "Count({<Current_Year_Flag={1}, Union_Flag={1}>} DISTINCT mispar_rechev)"
      },
      qLabel: "Union Vehicles",
      qSortBy: { /* default sort */ }
    },
    {
      qDef: {
        qDef: "Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)"
      },
      qLabel: "Total Vehicles",
      qSortBy: { /* default sort */ }
    },
    {
      qDef: {
        qDef: "Count({<Current_Year_Flag={1}, Union_Flag={1}>} DISTINCT mispar_rechev) / Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)",
        qNumFormat: {
          qType: "F",        // Fixed decimal format
          qnDec: 1,          // 1 decimal place
          qUseThou: 0,       // No thousands separator
          qFmt: "0.0%"       // Percentage format
        }
      },
      qLabel: "Union Market Share %",
      qSortBy: { /* default sort */ }
    }
  ],
  qSuppressZero: false,
  qSuppressMissing: false,
  qMode: "S",
  qInterColumnSortOrder: [],
  qStateName: "$"
};
```

### Expected Response Structure

```javascript
{
  qHyperCube: {
    qDataPages: [{
      qMatrix: [
        [
          { qText: "18,456", qNum: 18456 },    // Union count
          { qText: "150,234", qNum: 150234 },  // Total count
          { qText: "12.3%", qNum: 0.123 }      // Percentage
        ]
      ]
    }]
  }
}
```

### Usage in Mashup

```javascript
app.createCube(hypercube_UnionVehicles, function(reply) {
  const data = reply.qHyperCube.qDataPages[0].qMatrix[0];

  const unionCount = data[0].qNum;
  const totalCount = data[1].qNum;
  const percentage = data[2].qNum * 100; // Convert to percentage

  document.getElementById('kpi-union-value').textContent = unionCount.toLocaleString('he-IL');
  document.getElementById('kpi-union-percent').textContent = `${percentage.toFixed(1)}%`;
});
```

---

## 3. KPI Card 3: Top Brand Summary

### Purpose
Display the #1 brand name and its vehicle count for current year.

### Hypercube Definition

```javascript
const hypercube_TopBrand = {
  qInitialDataFetch: [{
    qTop: 0,
    qLeft: 0,
    qHeight: 1,          // Only top brand
    qWidth: 2            // Brand name + count
  }],
  qDimensions: [{
    qDef: {
      qFieldDefs: ["Brand_Canonical"]
    },
    qNullSuppression: true,
    qOtherTotalSpec: {
      qOtherMode: "OTHER_OFF",
      qSuppressOther: true,
      qOtherSortMode: "OTHER_SORT_DESCENDING"
    }
  }],
  qMeasures: [{
    qDef: {
      qDef: "Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)"
    },
    qLabel: "Vehicle Count",
    qSortBy: {
      qSortByNumeric: -1  // Sort descending by this measure
    }
  }],
  qSuppressZero: true,
  qSuppressMissing: true,
  qMode: "S",
  qInterColumnSortOrder: [1, 0],  // Sort by measure (index 1) first
  qStateName: "$"
};
```

### Expected Response Structure

```javascript
{
  qHyperCube: {
    qDataPages: [{
      qMatrix: [
        [
          { qText: "Toyota", qNum: NaN, qElemNumber: 0, qState: "O" },  // Dimension
          { qText: "45,678", qNum: 45678 }                              // Measure
        ]
      ]
    }]
  }
}
```

---

## 4. Chart 1: Brand Distribution (Pie Chart - Top 5)

### Purpose
Show top 5 brands by vehicle count for current year in a pie chart.

### Hypercube Definition

```javascript
const hypercube_BrandDistribution = {
  qInitialDataFetch: [{
    qTop: 0,
    qLeft: 0,
    qHeight: 5,          // Top 5 brands
    qWidth: 2            // Brand + count
  }],
  qDimensions: [{
    qDef: {
      qFieldDefs: ["Brand_Canonical"]
    },
    qNullSuppression: true,
    qOtherTotalSpec: {
      qOtherMode: "OTHER_OFF",
      qSuppressOther: true,
      qOtherSortMode: "OTHER_SORT_DESCENDING"
    }
  }],
  qMeasures: [{
    qDef: {
      qDef: "Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)"
    },
    qLabel: "Vehicles",
    qSortBy: {
      qSortByNumeric: -1  // Sort descending
    }
  }],
  qSuppressZero: true,
  qSuppressMissing: true,
  qMode: "S",
  qInterColumnSortOrder: [1, 0],  // Sort by count descending
  qStateName: "$"
};
```

### Expected Response Structure

```javascript
{
  qHyperCube: {
    qSize: { qcx: 2, qcy: 5 },
    qDataPages: [{
      qMatrix: [
        [{ qText: "Toyota", qElemNumber: 0 }, { qText: "45,678", qNum: 45678 }],
        [{ qText: "Kia", qElemNumber: 1 }, { qText: "38,234", qNum: 38234 }],
        [{ qText: "Hyundai", qElemNumber: 2 }, { qText: "32,156", qNum: 32156 }],
        [{ qText: "Mazda", qElemNumber: 3 }, { qText: "18,945", qNum: 18945 }],
        [{ qText: "Honda", qElemNumber: 4 }, { qText: "15,221", qNum: 15221 }]
      ]
    }]
  }
}
```

### Usage in Mashup (Recharts Pie Chart Example)

```javascript
app.createCube(hypercube_BrandDistribution, function(reply) {
  const matrix = reply.qHyperCube.qDataPages[0].qMatrix;

  const chartData = matrix.map((row, index) => ({
    name: row[0].qText,      // Brand name
    value: row[0].qNum,      // Count
    fill: `hsl(var(--chart-${(index % 5) + 1}))`  // Color from spec
  }));

  // Render Recharts PieChart with chartData
  renderPieChart('brand-chart', chartData);
});
```

---

## 5. Chart 2: Ownership Distribution (Bar Chart)

### Purpose
Show vehicle count by ownership type (private, leasing, company, rental, dealer).

### Hypercube Definition

```javascript
const hypercube_OwnershipDistribution = {
  qInitialDataFetch: [{
    qTop: 0,
    qLeft: 0,
    qHeight: 10,         // Up to 10 ownership types (usually 5)
    qWidth: 2            // Ownership type + count
  }],
  qDimensions: [{
    qDef: {
      qFieldDefs: ["baalut"]  // Ownership type (Hebrew field)
    },
    qNullSuppression: true,
    qOtherTotalSpec: {
      qOtherMode: "OTHER_OFF",
      qSuppressOther: true
    }
  }],
  qMeasures: [{
    qDef: {
      qDef: "Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)"
    },
    qLabel: "Vehicles",
    qSortBy: {
      qSortByNumeric: -1  // Sort descending by count
    }
  }],
  qSuppressZero: true,
  qSuppressMissing: true,
  qMode: "S",
  qInterColumnSortOrder: [1, 0],  // Sort by measure descending
  qStateName: "$"
};
```

### Expected Response Structure

```javascript
{
  qHyperCube: {
    qDataPages: [{
      qMatrix: [
        [{ qText: "פרטי", qElemNumber: 0 }, { qText: "95,234", qNum: 95234 }],
        [{ qText: "ליסינג", qElemNumber: 1 }, { qText: "32,456", qNum: 32456 }],
        [{ qText: "חברה", qElemNumber: 2 }, { qText: "18,123", qNum: 18123 }],
        [{ qText: "השכרה", qElemNumber: 3 }, { qText: "3,456", qNum: 3456 }],
        [{ qText: "סוחר", qElemNumber: 4 }, { qText: "965", qNum: 965 }]
      ]
    }]
  }
}
```

---

## 6. Chart 3: Fuel Distribution (Donut Chart)

### Purpose
Show vehicle count by fuel type (gasoline, diesel, electric, hybrid, plug-in).

### Hypercube Definition

```javascript
const hypercube_FuelDistribution = {
  qInitialDataFetch: [{
    qTop: 0,
    qLeft: 0,
    qHeight: 10,         // Up to 10 fuel types
    qWidth: 2            // Fuel type + count
  }],
  qDimensions: [{
    qDef: {
      qFieldDefs: ["sug_delek_nm"]  // Fuel type (Hebrew field)
    },
    qNullSuppression: true,
    qOtherTotalSpec: {
      qOtherMode: "OTHER_OFF",
      qSuppressOther: true
    }
  }],
  qMeasures: [{
    qDef: {
      qDef: "Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)"
    },
    qLabel: "Vehicles",
    qSortBy: {
      qSortByNumeric: -1  // Sort descending
    }
  }],
  qSuppressZero: true,
  qSuppressMissing: true,
  qMode: "S",
  qInterColumnSortOrder: [1, 0],
  qStateName: "$"
};
```

### Expected Response Structure

```javascript
{
  qHyperCube: {
    qDataPages: [{
      qMatrix: [
        [{ qText: "בנזין", qElemNumber: 0 }, { qText: "85,234", qNum: 85234 }],
        [{ qText: "היברידי", qElemNumber: 1 }, { qText: "42,156", qNum: 42156 }],
        [{ qText: "דיזל", qElemNumber: 2 }, { qText: "15,678", qNum: 15678 }],
        [{ qText: "חשמלי", qElemNumber: 3 }, { qText: "5,891", qNum: 5891 }],
        [{ qText: "פלאג-אין", qElemNumber: 4 }, { qText: "1,275", qNum: 1275 }]
      ]
    }]
  }
}
```

---

## 7. Chart 4: Top Union Models (Ranked List)

### Purpose
Show top 5 Union Motors models by vehicle count for current year.

### Hypercube Definition

```javascript
const hypercube_TopUnionModels = {
  qInitialDataFetch: [{
    qTop: 0,
    qLeft: 0,
    qHeight: 5,          // Top 5 models
    qWidth: 2            // Model name + count
  }],
  qDimensions: [{
    qDef: {
      qFieldDefs: ["Model_Canonical"]
    },
    qNullSuppression: true,
    qOtherTotalSpec: {
      qOtherMode: "OTHER_OFF",
      qSuppressOther: true
    }
  }],
  qMeasures: [{
    qDef: {
      // Only Union Motors vehicles (Union_Flag = 1)
      qDef: "Count({<Current_Year_Flag={1}, Union_Flag={1}>} DISTINCT mispar_rechev)"
    },
    qLabel: "Union Vehicles",
    qSortBy: {
      qSortByNumeric: -1  // Sort descending
    }
  }],
  qSuppressZero: true,
  qSuppressMissing: true,
  qMode: "S",
  qInterColumnSortOrder: [1, 0],  // Sort by count descending
  qStateName: "$"
};
```

### Expected Response Structure

```javascript
{
  qHyperCube: {
    qDataPages: [{
      qMatrix: [
        [{ qText: "Corolla Cross", qElemNumber: 0 }, { qText: "5,678", qNum: 5678 }],
        [{ qText: "RAV4", qElemNumber: 1 }, { qText: "4,234", qNum: 4234 }],
        [{ qText: "Camry", qElemNumber: 2 }, { qText: "3,891", qNum: 3891 }],
        [{ qText: "Yaris Cross", qElemNumber: 3 }, { qText: "2,456", qNum: 2456 }],
        [{ qText: "Highlander", qElemNumber: 4 }, { qText: "1,234", qNum: 1234 }]
      ]
    }]
  }
}
```

---

## 8. Chart 5: Year Distribution (Bar Chart - Last 5 Years)

### Purpose
Show vehicle registrations by year for the last 5 years (2021-2025).

### Hypercube Definition

```javascript
const hypercube_YearDistribution = {
  qInitialDataFetch: [{
    qTop: 0,
    qLeft: 0,
    qHeight: 5,          // Last 5 years
    qWidth: 2            // Year + count
  }],
  qDimensions: [{
    qDef: {
      qFieldDefs: ["Registration_Year"]
    },
    qNullSuppression: true,
    qOtherTotalSpec: {
      qOtherMode: "OTHER_OFF",
      qSuppressOther: true
    }
  }],
  qMeasures: [{
    qDef: {
      // Filter to last 5 years only
      qDef: "Count({<Registration_Year={\"$(=Max(Registration_Year)-4)\",\"$(=Max(Registration_Year)-3)\",\"$(=Max(Registration_Year)-2)\",\"$(=Max(Registration_Year)-1)\",\"$(=Max(Registration_Year))\"}>} DISTINCT mispar_rechev)"
    },
    qLabel: "Vehicles",
    qSortBy: {
      qSortByNumeric: 1  // Sort ascending by year
    }
  }],
  qSuppressZero: true,
  qSuppressMissing: true,
  qMode: "S",
  qInterColumnSortOrder: [0, 1],  // Sort by year (dimension) ascending
  qStateName: "$"
};
```

### Expected Response Structure

```javascript
{
  qHyperCube: {
    qDataPages: [{
      qMatrix: [
        [{ qText: "2021", qNum: 2021 }, { qText: "128,456", qNum: 128456 }],
        [{ qText: "2022", qNum: 2022 }, { qText: "135,234", qNum: 135234 }],
        [{ qText: "2023", qNum: 2023 }, { qText: "142,891", qNum: 142891 }],
        [{ qText: "2024", qNum: 2024 }, { qText: "148,567", qNum: 148567 }],
        [{ qText: "2025", qNum: 2025 }, { qText: "150,234", qNum: 150234 }]
      ]
    }]
  }
}
```

---

## Common Hypercube Patterns

### Set Analysis Syntax

All hypercubes use Qlik Set Analysis to filter data:

```qlik
Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)
       └────────────────────┘         └──────────────┘
         Selection criteria            Field to count

// Multiple conditions (AND logic)
Count({<Current_Year_Flag={1}, Union_Flag={1}>} DISTINCT mispar_rechev)

// Exclude condition
Count({<Current_Year_Flag={1}, baalut-={"סוחר"}>} DISTINCT mispar_rechev)
                                        └────┘
                                    Exclude "סוחר" (dealer)

// Dollar sign expansion (dynamic values)
Count({<Registration_Year={"$(=Max(Registration_Year))"}>} DISTINCT mispar_rechev)
                            └──────────────────────────┘
                        Expands to current max year at runtime
```

### Sorting Patterns

```javascript
// Sort by measure descending (most common)
qSortBy: {
  qSortByNumeric: -1   // -1 = descending, 1 = ascending, 0 = no sort
}

// Sort by dimension ascending
qSortBy: {
  qSortByAscii: 1      // Alphabetical sort
}

// Sort by load order
qSortBy: {
  qSortByLoadOrder: 1  // Order data was loaded into Qlik
}
```

### Paging (for Large Datasets)

If data exceeds initial fetch, request additional pages:

```javascript
app.createCube(hypercubeDef, function(reply) {
  const totalRows = reply.qHyperCube.qSize.qcy;
  const initialRows = reply.qHyperCube.qDataPages[0].qMatrix.length;

  if (totalRows > initialRows) {
    // Fetch next page
    reply.qHyperCube.getDataPage({
      qTop: initialRows,
      qLeft: 0,
      qHeight: 100,  // Next 100 rows
      qWidth: 2
    }).then(function(page) {
      // Process additional data
    });
  }
});
```

---

## Hypercube Lifecycle Management

### Create Hypercube

```javascript
let hypercubeHandle = null;

app.createCube(hypercubeDef, function(reply) {
  // Store handle for later cleanup
  hypercubeHandle = reply.qHyperCube;

  // Render visualization
  renderChart(reply);
});
```

### Update Hypercube (Automatic)

Qlik hypercubes automatically update when:
- User makes a selection in any Qlik object
- Data is reloaded in the app
- Field values change

The callback function fires automatically on updates.

### Destroy Hypercube (Prevent Memory Leaks)

```javascript
// When component unmounts or dashboard closes
if (hypercubeHandle) {
  app.destroySessionObject(hypercubeHandle.qInfo.qId).then(function() {
    hypercubeHandle = null;
    console.log('Hypercube destroyed');
  });
}
```

---

## Testing Hypercubes

### Manual Testing in Qlik Sense Dev Hub

1. Open Qlik Sense Dev Hub: `http://your-server/dev-hub/`
2. Create a new mashup template
3. Paste hypercube definition into `mashup.js`
4. Add console.log to callback: `console.log(JSON.stringify(reply, null, 2))`
5. Open mashup in browser, check console for data structure
6. Verify:
   - ✅ Row count matches expected (qHeight)
   - ✅ Column count matches (dimensions + measures)
   - ✅ Data types correct (qNum for numbers, qText for strings)
   - ✅ Sorting works as expected
   - ✅ Hebrew text displays correctly

### Automated Testing (Optional)

```javascript
// Test helper function
function testHypercube(app, hypercubeDef, expectedShape) {
  return new Promise((resolve, reject) => {
    app.createCube(hypercubeDef, (reply) => {
      const actual = reply.qHyperCube.qSize;
      if (actual.qcx !== expectedShape.columns || actual.qcy !== expectedShape.rows) {
        reject(new Error(`Expected ${expectedShape.rows}x${expectedShape.columns}, got ${actual.qcy}x${actual.qcx}`));
      } else {
        resolve(reply);
      }
    });
  });
}

// Usage
testHypercube(app, hypercube_TotalVehicles, { rows: 1, columns: 1 })
  .then(() => console.log('✓ Total Vehicles hypercube test passed'))
  .catch((err) => console.error('✗ Test failed:', err));
```

---

## Summary

All 8 hypercube contracts are defined and ready for implementation in the mashup. Each hypercube:

- ✅ Uses proper Qlik Set Analysis syntax
- ✅ Filters to current year (`Current_Year_Flag={1}`)
- ✅ Handles Hebrew field names correctly
- ✅ Specifies appropriate initial data fetch size
- ✅ Implements correct sorting for visualization type
- ✅ Includes proper null and zero suppression

**Next Steps**:
1. Copy hypercube definitions into `mashup/lib/hypercubes.js`
2. Create component files that use these hypercubes
3. Test each hypercube in Qlik Sense Dev Hub
4. Integrate with visualization library (Recharts or custom)
