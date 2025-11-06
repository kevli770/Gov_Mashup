/**
 * Qlik Sense Connection Configuration
 * Settings for connecting to Qlik Sense Desktop or Server
 */

const qlikConfig = {
  // Qlik Sense Desktop Configuration (default)
  desktop: {
    host: 'localhost',
    port: 4848,
    prefix: '/',
    isSecure: false,
    appId: 'GOV_MASHUP.qvf', // Update this with your actual .qvf file name
  },

  // Qlik Sense Server Configuration (for production)
  server: {
    host: 'qlik-server.example.com',
    port: 443,
    prefix: '/virtual-proxy-prefix/',
    isSecure: true,
    appId: 'APP-ID-GUID', // Update with actual app GUID from server
  },

  // Active environment ('desktop' or 'server')
  activeEnv: 'desktop',

  // Get current configuration
  getConfig() {
    return this[this.activeEnv];
  },

  // Get full resource URL
  getResourceUrl() {
    const config = this.getConfig();
    const protocol = config.isSecure ? 'https' : 'http';
    return `${protocol}://${config.host}:${config.port}${config.prefix}resources`;
  },

  // Get app URL
  getAppUrl() {
    const config = this.getConfig();
    const protocol = config.isSecure ? 'https' : 'http';
    return `${protocol}://${config.host}:${config.port}${config.prefix}app/${config.appId}`;
  },

  // Qlik connection options
  connectionOptions: {
    // Set to true to use existing session (Qlik Sense Desktop)
    reloadURI: false,

    // Authentication (not needed for Desktop, required for Server)
    // identity: 'DOMAIN\\USERNAME', // For Windows authentication
    // ticket: 'YOUR-TICKET',        // For ticket authentication
  },

  // Hebrew locale configuration
  locale: {
    language: 'he-IL',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    direction: 'rtl',
  },

  // Chart configuration defaults
  chartDefaults: {
    // Number formatting for Hebrew locale
    numberFormat: {
      type: 'number',
      fmt: '#,##0',
      dec: '.',
    },

    // Percentage formatting
    percentageFormat: {
      type: 'number',
      fmt: '0.0%',
      dec: '.',
    },
  },

  // Refresh interval (in milliseconds)
  // Set to 0 to disable auto-refresh
  refreshInterval: 0, // Manual refresh only via button

  // Error messages (Hebrew)
  errorMessages: {
    connectionFailed: 'שגיאה בחיבור לשרת Qlik Sense. אנא בדוק את ההגדרות.',
    appNotFound: 'האפליקציה לא נמצאה. אנא בדוק את מזהה האפליקציה.',
    dataLoadFailed: 'שגיאה בטעינת נתונים. אנא נסה שוב.',
    timeout: 'תם הזמן המוקצב לבקשה. אנא נסה שוב.',
    generic: 'אירעה שגיאה. אנא נסה שוב מאוחר יותר.',
  },
};

// Export for use in mashup.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = qlikConfig;
}
