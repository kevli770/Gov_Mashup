/**
 * Main Mashup Application
 * Qlik Sense Vehicle Registration Dashboard
 *
 * This file handles:
 * - Qlik Sense connection and authentication
 * - App initialization
 * - Hypercube creation and data fetching
 * - Component initialization and updates
 */

/* global require */

// Import configuration
import qlikConfig from './config/qlik-config.js';
import { HYPERCUBE_REGISTRY, createHypercube, getHypercubeData } from './lib/hypercubes.js';
import { formatNumber, formatPercentage, getCurrentTimestamp } from './lib/hebrew-locale.js';

/**
 * Global state
 */
let app = null;  // Qlik app object
let hypercubes = {};  // Store active hypercube objects

/**
 * Initialize the mashup
 */
function initMashup() {
  console.warn('[Mashup] Initializing...');

  // Configure RequireJS for Qlik Sense
  const config = qlikConfig.getConfig();
  const resourceUrl = qlikConfig.getResourceUrl();

  require.config({
    baseUrl: resourceUrl,
    webIntegrationId: config.webIntegrationId || null
  });

  // Load Qlik.js and initialize
  require(['js/qlik'], function (qlik) {
    console.warn('[Mashup] Qlik.js loaded successfully');

    // Connect to Qlik Sense app
    connectToQlik(qlik);
  });
}

/**
 * Connect to Qlik Sense application
 * @param {Object} qlik - Qlik.js API object
 */
function connectToQlik(qlik) {
  const config = qlikConfig.getConfig();

  console.warn(`[Mashup] Connecting to app: ${config.appId}`);

  try {
    // Open Qlik Sense app
    app = qlik.openApp(config.appId, qlikConfig.connectionOptions);

    console.warn('[Mashup] Successfully connected to Qlik app');

    // Initialize dashboard after connection
    initDashboard();

    // Set up refresh button
    setupRefreshButton();

  } catch (error) {
    console.error('[Mashup] Connection failed:', error);
    displayError(qlikConfig.errorMessages.connectionFailed);
  }
}

/**
 * Initialize dashboard components
 */
function initDashboard() {
  console.warn('[Mashup] Initializing dashboard components...');

  // Update last update timestamp
  updateLastUpdateTime();

  // Create all hypercubes and initialize components
  // Note: Component implementations will be added in Phase 3 (User Stories)
  console.warn('[Mashup] Dashboard initialization complete');
  console.warn('[Mashup] Ready for hypercube creation in Phase 3');
}

/**
 * Set up refresh button handler
 */
function setupRefreshButton() {
  const refreshButton = document.getElementById('refresh-button');

  if (!refreshButton) {
    console.error('[Mashup] Refresh button not found');
    return;
  }

  refreshButton.addEventListener('click', function () {
    console.warn('[Mashup] Refresh button clicked');
    refreshDashboard();
  });

  console.warn('[Mashup] Refresh button handler set up');
}

/**
 * Refresh dashboard data
 */
function refreshDashboard() {
  console.warn('[Mashup] Refreshing dashboard data...');

  // Show loading state
  document.body.classList.add('loading');

  // Clear selections (optional - refreshes data)
  if (app) {
    app.clearAll();
  }

  // Update timestamp
  updateLastUpdateTime();

  // Remove loading state after a short delay
  setTimeout(function () {
    document.body.classList.remove('loading');
    console.warn('[Mashup] Dashboard refresh complete');
  }, 500);
}

/**
 * Update last update timestamp
 */
function updateLastUpdateTime() {
  const lastUpdateElement = document.getElementById('last-update');

  if (lastUpdateElement) {
    lastUpdateElement.textContent = getCurrentTimestamp();
  }
}

/**
 * Display error message to user
 * @param {string} message - Error message in Hebrew
 */
function displayError(message) {
  console.error('[Mashup] Error:', message);

  // Create error notification
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: var(--color-error);
    color: white;
    padding: var(--space-lg);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-modal);
    max-width: 400px;
  `;

  document.body.appendChild(errorDiv);

  // Auto-remove after 5 seconds
  setTimeout(function () {
    errorDiv.remove();
  }, 5000);
}

/**
 * Create KPI Card 1: Total Vehicles (User Story 1)
 * This function will be implemented in Phase 3 - T025
 */
function createKpiCard1() {
  console.warn('[Mashup] KPI Card 1 (Total Vehicles) - To be implemented in Phase 3');
  // Implementation pending: T025
}

/**
 * Create KPI Card 2: Union Motors Count & Percentage (User Story 1)
 * This function will be implemented in Phase 3 - T026
 */
function createKpiCard2() {
  console.warn('[Mashup] KPI Card 2 (Union Motors) - To be implemented in Phase 3');
  // Implementation pending: T026
}

/**
 * Create KPI Card 3: Top Brand (User Story 1)
 * This function will be implemented in Phase 3 - T027
 */
function createKpiCard3() {
  console.warn('[Mashup] KPI Card 3 (Top Brand) - To be implemented in Phase 3');
  // Implementation pending: T027
}

/**
 * Create Brand Chart (User Story 2)
 * This function will be implemented in Phase 4 - T038
 */
function createBrandChart() {
  console.warn('[Mashup] Brand Chart - To be implemented in Phase 4');
  // Implementation pending: T038
}

/**
 * Create Ownership Chart (User Story 2)
 * This function will be implemented in Phase 4 - T038
 */
function createOwnershipChart() {
  console.warn('[Mashup] Ownership Chart - To be implemented in Phase 4');
  // Implementation pending: T038
}

/**
 * Create Fuel Chart (User Story 3)
 * This function will be implemented in Phase 5 - T045
 */
function createFuelChart() {
  console.warn('[Mashup] Fuel Chart - To be implemented in Phase 5');
  // Implementation pending: T045
}

/**
 * Create Models List (User Story 3)
 * This function will be implemented in Phase 5 - T045
 */
function createModelsList() {
  console.warn('[Mashup] Models List - To be implemented in Phase 5');
  // Implementation pending: T045
}

/**
 * Create Year Chart (User Story 4)
 * This function will be implemented in Phase 6 - T050
 */
function createYearChart() {
  console.warn('[Mashup] Year Chart - To be implemented in Phase 6');
  // Implementation pending: T050
}

/**
 * Helper: Get app object (for use in other modules)
 * @returns {Object} Qlik app object
 */
export function getApp() {
  return app;
}

/**
 * Helper: Get hypercube by key (for use in other modules)
 * @param {string} key - Hypercube key from HYPERCUBE_REGISTRY
 * @returns {Object} Hypercube object
 */
export function getHypercube(key) {
  return hypercubes[key];
}

// Initialize mashup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMashup);
} else {
  initMashup();
}

// Export for testing/debugging
export default {
  initMashup,
  connectToQlik,
  initDashboard,
  refreshDashboard,
  getApp,
  getHypercube
};
