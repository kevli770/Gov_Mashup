/**
 * Hypercube Definitions Catalog
 * All hypercube definitions for the vehicle registration dashboard
 *
 * Reference: contracts/hypercubes.md from spec
 * Total Hypercubes: 8 (3 for KPIs, 5 for charts)
 */

/**
 * Hypercube 1: KPI - Total Vehicles (Current Year)
 * Purpose: Display total vehicle count for current year in KPI card
 * User Story: US1 (View Real-Time Vehicle Market Overview)
 */
export const HYPERCUBE_TOTAL_VEHICLES = {
  qInfo: {
    qType: 'hypercube',
    qId: 'HC01_TotalVehicles'
  },
  qHyperCubeDef: {
    qDimensions: [],
    qMeasures: [
      {
        qDef: {
          qDef: 'Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)',
          qLabel: 'סה"כ רכבים'
        },
        qSortBy: {
          qSortByNumeric: -1
        }
      }
    ],
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qHeight: 1,
        qWidth: 1
      }
    ]
  }
};

/**
 * Hypercube 2: KPI - Union Motors Count & Percentage
 * Purpose: Display Union Motors vehicle count and percentage
 * User Story: US1
 */
export const HYPERCUBE_UNION_MOTORS = {
  qInfo: {
    qType: 'hypercube',
    qId: 'HC02_UnionMotors'
  },
  qHyperCubeDef: {
    qDimensions: [],
    qMeasures: [
      {
        qDef: {
          qDef: 'Count({<Current_Year_Flag={1}, Union_Flag={1}>} DISTINCT mispar_rechev)',
          qLabel: 'רכבי יוניון'
        }
      },
      {
        qDef: {
          qDef: 'Count({<Current_Year_Flag={1}, Union_Flag={1}>} DISTINCT mispar_rechev) / Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)',
          qLabel: 'אחוז יוניון',
          qNumFormat: {
            qType: 'F',
            qnDec: 1,
            qUseThou: 0,
            qFmt: '0.0%'
          }
        }
      }
    ],
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qHeight: 1,
        qWidth: 2
      }
    ]
  }
};

/**
 * Hypercube 3: KPI - Top Brand Summary
 * Purpose: Display the top brand and its vehicle count
 * User Story: US1
 */
export const HYPERCUBE_TOP_BRAND = {
  qInfo: {
    qType: 'hypercube',
    qId: 'HC03_TopBrand'
  },
  qHyperCubeDef: {
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ['Brand_Canonical'],
          qFieldLabels: ['מותג'],
          qSortCriterias: [
            {
              qSortByNumeric: -1
            }
          ]
        }
      }
    ],
    qMeasures: [
      {
        qDef: {
          qDef: 'Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)',
          qLabel: 'מספר רכבים'
        }
      }
    ],
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qHeight: 1,  // Only fetch top 1 brand
        qWidth: 2
      }
    ]
  }
};

/**
 * Hypercube 4: Brand Distribution (Top 5)
 * Purpose: Pie chart showing top 5 brands by vehicle count
 * User Story: US2 (Analyze Brand and Ownership Distribution)
 */
export const HYPERCUBE_BRAND_DISTRIBUTION = {
  qInfo: {
    qType: 'hypercube',
    qId: 'HC04_BrandDistribution'
  },
  qHyperCubeDef: {
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ['Brand_Canonical'],
          qFieldLabels: ['מותג'],
          qSortCriterias: [
            {
              qSortByNumeric: -1
            }
          ]
        }
      }
    ],
    qMeasures: [
      {
        qDef: {
          qDef: 'Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)',
          qLabel: 'מספר רכבים'
        },
        qSortBy: {
          qSortByNumeric: -1
        }
      }
    ],
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qHeight: 5,  // Top 5 brands only
        qWidth: 2
      }
    ]
  }
};

/**
 * Hypercube 5: Ownership Distribution
 * Purpose: Bar chart showing all ownership types
 * User Story: US2
 */
export const HYPERCUBE_OWNERSHIP_DISTRIBUTION = {
  qInfo: {
    qType: 'hypercube',
    qId: 'HC05_OwnershipDistribution'
  },
  qHyperCubeDef: {
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ['baalut'],
          qFieldLabels: ['סוג בעלות'],
          qSortCriterias: [
            {
              qSortByNumeric: -1
            }
          ]
        }
      }
    ],
    qMeasures: [
      {
        qDef: {
          qDef: 'Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)',
          qLabel: 'מספר רכבים'
        },
        qSortBy: {
          qSortByNumeric: -1
        }
      }
    ],
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qHeight: 10,  // All ownership types (expect ~7)
        qWidth: 2
      }
    ]
  }
};

/**
 * Hypercube 6: Fuel Type Distribution
 * Purpose: Donut chart showing all fuel types
 * User Story: US3 (Examine Fuel Types and Model Performance)
 */
export const HYPERCUBE_FUEL_DISTRIBUTION = {
  qInfo: {
    qType: 'hypercube',
    qId: 'HC06_FuelDistribution'
  },
  qHyperCubeDef: {
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ['sug_delek_nm'],
          qFieldLabels: ['סוג דלק'],
          qSortCriterias: [
            {
              qSortByNumeric: -1
            }
          ]
        }
      }
    ],
    qMeasures: [
      {
        qDef: {
          qDef: 'Count({<Current_Year_Flag={1}>} DISTINCT mispar_rechev)',
          qLabel: 'מספר רכבים'
        },
        qSortBy: {
          qSortByNumeric: -1
        }
      }
    ],
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qHeight: 10,  // All fuel types
        qWidth: 2
      }
    ]
  }
};

/**
 * Hypercube 7: Top Union Models (Top 5)
 * Purpose: Ranked list of top Union Motors models
 * User Story: US3
 */
export const HYPERCUBE_UNION_MODELS = {
  qInfo: {
    qType: 'hypercube',
    qId: 'HC07_UnionModels'
  },
  qHyperCubeDef: {
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ['Model_Canonical'],
          qFieldLabels: ['דגם'],
          qSortCriterias: [
            {
              qSortByNumeric: -1
            }
          ]
        }
      }
    ],
    qMeasures: [
      {
        qDef: {
          qDef: 'Count({<Current_Year_Flag={1}, Union_Flag={1}>} DISTINCT mispar_rechev)',
          qLabel: 'מספר רכבים'
        },
        qSortBy: {
          qSortByNumeric: -1
        }
      }
    ],
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qHeight: 5,  // Top 5 models
        qWidth: 2
      }
    ]
  }
};

/**
 * Hypercube 8: Year Distribution (Last 5 Years)
 * Purpose: Bar chart showing registration trends by year
 * User Story: US4 (Track Registration Trends Over Time)
 */
export const HYPERCUBE_YEAR_DISTRIBUTION = {
  qInfo: {
    qType: 'hypercube',
    qId: 'HC08_YearDistribution'
  },
  qHyperCubeDef: {
    qDimensions: [
      {
        qDef: {
          qFieldDefs: ['Registration_Year'],
          qFieldLabels: ['שנת רישום'],
          qSortCriterias: [
            {
              qSortByNumeric: 1  // Ascending (chronological order)
            }
          ]
        }
      }
    ],
    qMeasures: [
      {
        qDef: {
          qDef: 'Count(DISTINCT mispar_rechev)',
          qLabel: 'מספר רכבים'
        }
      }
    ],
    qInitialDataFetch: [
      {
        qTop: 0,
        qLeft: 0,
        qHeight: 5,  // Last 5 years
        qWidth: 2
      }
    ]
  }
};

/**
 * Hypercube Registry
 * Maps hypercube IDs to their definitions for easy lookup
 */
export const HYPERCUBE_REGISTRY = {
  totalVehicles: HYPERCUBE_TOTAL_VEHICLES,
  unionMotors: HYPERCUBE_UNION_MOTORS,
  topBrand: HYPERCUBE_TOP_BRAND,
  brandDistribution: HYPERCUBE_BRAND_DISTRIBUTION,
  ownershipDistribution: HYPERCUBE_OWNERSHIP_DISTRIBUTION,
  fuelDistribution: HYPERCUBE_FUEL_DISTRIBUTION,
  unionModels: HYPERCUBE_UNION_MODELS,
  yearDistribution: HYPERCUBE_YEAR_DISTRIBUTION
};

/**
 * Helper function to create a hypercube in Qlik app
 * @param {Object} app - Qlik app object
 * @param {Object} hypercubeDef - Hypercube definition
 * @param {Function} callback - Callback function to handle data
 * @returns {Promise} Promise that resolves with hypercube object
 */
export function createHypercube(app, hypercubeDef, callback) {
  return new Promise((resolve, reject) => {
    app.createCube(hypercubeDef, (reply) => {
      if (callback) {
        callback(reply);
      }
      resolve(reply);
    });
  });
}

/**
 * Helper function to get data from hypercube reply
 * @param {Object} reply - Qlik hypercube reply object
 * @returns {Array} Array of data rows
 */
export function getHypercubeData(reply) {
  if (!reply || !reply.qHyperCube || !reply.qHyperCube.qDataPages) {
    return [];
  }

  const dataPages = reply.qHyperCube.qDataPages;
  if (dataPages.length === 0) {
    return [];
  }

  return dataPages[0].qMatrix || [];
}

/**
 * Helper function to extract dimension and measure values from a data row
 * @param {Array} row - Data row from qMatrix
 * @returns {Object} Object with dimension and measure values
 */
export function extractRowData(row) {
  const result = {
    dimensions: [],
    measures: []
  };

  row.forEach((cell, index) => {
    if (cell.qState === 'L') {  // L = Locked (dimension value)
      result.dimensions.push({
        text: cell.qText,
        value: cell.qNum
      });
    } else {  // Measure value
      result.measures.push({
        text: cell.qText,
        value: cell.qNum
      });
    }
  });

  return result;
}
