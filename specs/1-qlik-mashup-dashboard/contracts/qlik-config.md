# Qlik Sense Configuration Contract

**Feature**: 1-qlik-mashup-dashboard
**Date**: 2025-11-06
**Purpose**: Define Qlik Sense connection configuration, authentication, and mashup integration settings

## Overview

This document specifies the configuration required to connect the mashup to a Qlik Sense application. Configuration differs between development (Qlik Sense Desktop) and production (Qlik Sense Server) environments.

---

## Configuration Object Structure

### JavaScript Configuration File

**File**: `mashup/config/qlik-config.js`

```javascript
/**
 * Qlik Sense Mashup Configuration
 * Environment-specific settings for connecting to Qlik Sense
 */

// Detect environment (development vs production)
const isDevelopment = window.location.hostname === 'localhost' ||
                      window.location.hostname === '127.0.0.1';

// Qlik Sense Desktop configuration (development)
const qlikConfigDesktop = {
  host: window.location.hostname,
  prefix: '/',
  port: window.location.port || 4848,  // Qlik Desktop default port
  isSecure: false,                      // Desktop uses HTTP by default
  appId: 'C:\\Users\\...\\Gov_Vehicles_Data.qvf'  // Local file path
};

// Qlik Sense Server configuration (production)
const qlikConfigServer = {
  host: window.location.hostname || 'qlik-server.unionmotors.local',
  prefix: window.location.pathname.substr(0, window.location.pathname.toLowerCase().lastIndexOf('/extensions') + 1),
  port: window.location.port || '',    // Use default port (443 for HTTPS)
  isSecure: window.location.protocol === 'https:',
  appId: 'ae0221f5-3033-43a5-a9d7-857c029cecef'  // App GUID from Qlik Server
};

// Export active configuration based on environment
const config = isDevelopment ? qlikConfigDesktop : qlikConfigServer;

export default config;
```

---

## Configuration Parameters

### Required Parameters

| Parameter | Type | Description | Development Example | Production Example |
|-----------|------|-------------|---------------------|-------------------|
| `host` | string | Qlik Sense server hostname | `"localhost"` | `"qlik-server.unionmotors.local"` |
| `prefix` | string | Base path for Qlik resources | `"/"` | `"/"`  |
| `port` | string/number | Server port number | `4848` (Desktop) | `443` (HTTPS) or `80` (HTTP) |
| `isSecure` | boolean | Use HTTPS (SSL/TLS)? | `false` (Desktop) | `true` (Server) |
| `appId` | string | Qlik app identifier | File path (Desktop) | GUID (Server) |

### Optional Parameters

| Parameter | Type | Description | Default | Notes |
|-----------|------|-------------|---------|-------|
| `ticket` | string | Qlik Sense authentication ticket | undefined | Required for ticket-based auth |
| `identity` | string | User identity for session | undefined | Auto-detected from browser session |

---

## Application ID (appId)

### Development (Qlik Sense Desktop)

**Format**: Full file path to `.qvf` file

**Example**:
```javascript
appId: 'C:\\Users\\kevin\\Documents\\Qlik\\Sense\\Apps\\Gov_Vehicles_Data.qvf'
```

**How to Get**:
1. Open Qlik Sense Desktop
2. Right-click on the app → Properties
3. Copy the file path from the location field
4. Use double backslashes (`\\`) for Windows paths in JavaScript strings

### Production (Qlik Sense Server)

**Format**: App GUID (Globally Unique Identifier)

**Example**:
```javascript
appId: 'ae0221f5-3033-43a5-a9d7-857c029cecef'
```

**How to Get**:
1. Open Qlik Sense Hub in browser
2. Navigate to the app
3. Look at the URL: `https://server/sense/app/{GUID}/sheet/...`
4. Copy the GUID segment (36 characters with hyphens)

**Alternative Method** (QMC):
1. Log in to Qlik Management Console (QMC)
2. Navigate to Apps section
3. Find the app → View details
4. Copy the "ID" field

---

## Authentication Strategies

### 1. Development (Qlik Sense Desktop)

**Authentication**: None (automatic login)

**Configuration**:
```javascript
const config = {
  host: 'localhost',
  port: 4848,
  isSecure: false,
  appId: 'C:\\Users\\kevin\\Documents\\Qlik\\Sense\\Apps\\Gov_Vehicles_Data.qvf'
};
```

**No additional authentication required** - Qlik Desktop automatically authenticates the local user.

### 2. Production - Windows Authentication (NTLM)

**Authentication**: Integrated Windows authentication via browser

**Configuration**:
```javascript
const config = {
  host: 'qlik-server.unionmotors.local',
  isSecure: true,
  port: 443,
  appId: 'ae0221f5-3033-43a5-a9d7-857c029cecef'
  // No ticket required - browser handles NTLM
};
```

**Browser Compatibility**:
- ✅ Internet Explorer / Edge (Chromium): Native NTLM support
- ✅ Chrome: Works with domain-joined Windows machines
- ✅ Firefox: Requires manual configuration (about:config → network.automatic-ntlm-auth.trusted-uris)
- ❌ Safari: Limited NTLM support

**User Experience**:
- Users on domain-joined computers: Automatic login
- Users on non-domain computers: Username/password prompt

### 3. Production - Header Authentication

**Authentication**: Reverse proxy injects user identity header

**Configuration**:
```javascript
const config = {
  host: 'qlik-server.unionmotors.local',
  isSecure: true,
  port: 443,
  appId: 'ae0221f5-3033-43a5-a9d7-857c029cecef'
  // No changes in mashup code - proxy handles auth
};
```

**Server Setup** (requires Qlik admin):
1. Configure virtual proxy in QMC
2. Set authentication module to "Header"
3. Configure header attribute name (e.g., `X-Qlik-User`)
4. Reverse proxy (Apache/Nginx) injects user header

### 4. Production - Ticket Authentication

**Authentication**: Generate session ticket via Qlik Sense Proxy API

**Configuration**:
```javascript
// Step 1: Request ticket from server endpoint
fetch('/api/qlik-ticket', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: 'kevin.liaks' })
})
.then(response => response.json())
.then(data => {
  const ticket = data.ticket;

  // Step 2: Use ticket in Qlik config
  const config = {
    host: 'qlik-server.unionmotors.local',
    isSecure: true,
    port: 443,
    appId: 'ae0221f5-3033-43a5-a9d7-857c029cecef',
    ticket: ticket  // Inject ticket here
  };

  // Step 3: Open app with ticket
  require(['js/qlik'], function(qlik) {
    qlik.setOnError(function(error) {
      console.error('Qlik error:', error);
    });

    const app = qlik.openApp(config.appId, config);
    // ... proceed with mashup
  });
});
```

**Ticket Generation** (backend API endpoint):
```javascript
// Node.js example using Qlik Sense Repository Service API
app.post('/api/qlik-ticket', async (req, res) => {
  const { userId } = req.body;

  const ticketRequest = {
    UserDirectory: 'UNIONMOTORS',
    UserId: userId,
    Attributes: []
  };

  try {
    const response = await fetch('https://qlik-server.unionmotors.local:4243/qps/ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Qlik-Xrfkey': 'ABCDEFG123456789',  // 16-character XSRF key
        'X-Qlik-User': 'UserDirectory=Internal;UserId=sa_api'  // Service account
      },
      body: JSON.stringify(ticketRequest),
      // Client certificate required for API authentication
      cert: fs.readFileSync('path/to/client.pem'),
      key: fs.readFileSync('path/to/client_key.pem')
    });

    const data = await response.json();
    res.json({ ticket: data.Ticket });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate ticket' });
  }
});
```

**Security Notes**:
- Tickets are single-use and expire after first use or 30 seconds
- Ticket generation requires service account with RootAdmin role
- Use HTTPS to prevent ticket interception
- Do NOT expose ticket generation endpoint without authentication

---

## RequireJS Configuration

### Base RequireJS Setup

**File**: `mashup/index.html`

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>דשבורד ניתוח רכבים - Union Motors</title>

  <!-- Qlik Sense CSS (optional - for Qlik object styling) -->
  <link rel="stylesheet" href="http://localhost:4848/resources/autogenerated/qlik-styles.css">

  <!-- Custom mashup styles -->
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>
  <!-- Dashboard content -->
  <div id="dashboard-container"></div>

  <!-- RequireJS configuration and Qlik integration -->
  <script>
    // Configure RequireJS baseUrl based on environment
    const isDev = window.location.hostname === 'localhost';
    const qlikHost = isDev ? 'http://localhost:4848' : 'https://qlik-server.unionmotors.local';

    var require = {
      baseUrl: qlikHost + '/resources'
    };
  </script>

  <!-- Load RequireJS -->
  <script src="http://localhost:4848/resources/assets/external/requirejs/require.js"></script>

  <!-- Load mashup entry point -->
  <script src="mashup.js" type="module"></script>
</body>
</html>
```

### Production RequireJS Configuration

**Production differences**:
1. **HTTPS URLs**: Use `https://` instead of `http://`
2. **Relative paths**: Use relative paths for resources when deployed on Qlik Server
3. **CDN fallback**: Consider hosting requirejs locally as fallback

```javascript
// Production-ready configuration
const qlikHost = window.location.protocol + '//' + window.location.hostname +
                 (window.location.port ? ':' + window.location.port : '');

var require = {
  baseUrl: qlikHost + '/resources',
  paths: {
    // Optional: Override paths for custom libraries
    'chart-library': '../libs/chart-library.min'
  }
};
```

---

## Opening the Qlik Sense App

### Standard Pattern

```javascript
require(['js/qlik'], function(qlik) {
  // Configure error handling
  qlik.setOnError(function(error) {
    console.error('Qlik Error:', error);
    // Display user-friendly error message
    document.getElementById('error-message').textContent =
      'שגיאה בחיבור לשרת Qlik Sense. אנא נסה שוב מאוחר יותר.';
  });

  // Open the app
  const app = qlik.openApp(config.appId, config);

  // Verify app opened successfully
  app.getAppLayout(function(layout) {
    console.log('App opened:', layout.qTitle);
    console.log('Last reload:', layout.qLastReloadTime);

    // Proceed with creating hypercubes and visualizations
    initializeDashboard(app);
  });
});
```

### Error Handling

```javascript
qlik.setOnError(function(error) {
  console.error('Qlik Error:', error);

  // Common error scenarios
  switch (error.code) {
    case 1000:  // Connection failed
      showError('לא ניתן להתחבר לשרת Qlik Sense. ודא שהשרת זמין.');
      break;

    case 1001:  // Authentication failed
      showError('אימות נכשל. אנא התחבר מחדש.');
      // Redirect to login page
      window.location.href = '/login';
      break;

    case 1002:  // App not found
      showError('האפליקציה לא נמצאה. פנה למנהל המערכת.');
      break;

    case 1003:  // Access denied
      showError('אין לך הרשאה לצפות באפליקציה זו.');
      break;

    default:
      showError('אירעה שגיאה לא צפויה. קוד שגיאה: ' + error.code);
  }
});

function showError(message) {
  const errorContainer = document.getElementById('error-container');
  errorContainer.innerHTML = `
    <div class="error-message">
      <svg><!-- Error icon --></svg>
      <p>${message}</p>
    </div>
  `;
  errorContainer.style.display = 'block';
}
```

---

## Security Considerations

### Content Security Policy (CSP)

If deploying on Qlik Sense Server, ensure CSP allows:

```html
<!-- Add to <head> if CSP is enforced -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self' https://qlik-server.unionmotors.local;
  script-src 'self' 'unsafe-eval' https://qlik-server.unionmotors.local;
  style-src 'self' 'unsafe-inline' https://qlik-server.unionmotors.local;
  img-src 'self' data: https://qlik-server.unionmotors.local;
  connect-src 'self' https://qlik-server.unionmotors.local wss://qlik-server.unionmotors.local;
">
```

**Notes**:
- `'unsafe-eval'` required for Qlik Sense expression engine
- `'unsafe-inline'` required for Qlik object inline styles (minimize usage)
- `wss://` required for Qlik WebSocket connections

### HTTPS/TLS

**Production requirements**:
- ✅ Use HTTPS for all connections (`isSecure: true`)
- ✅ Valid SSL/TLS certificate on Qlik Server
- ✅ No mixed content (HTTP resources on HTTPS page)
- ❌ Do NOT bypass certificate validation in production

### Session Management

**Session timeout handling**:

```javascript
// Detect session expiration
qlik.setOnError(function(error) {
  if (error.code === 1001 || error.message.includes('session')) {
    // Session expired - prompt re-authentication
    if (confirm('ההפעלה פגה. האם ברצונך להתחבר מחדש?')) {
      window.location.reload();
    }
  }
});

// Optional: Heartbeat to keep session alive
setInterval(() => {
  if (app) {
    app.getAppLayout().then(() => {
      console.log('Session keepalive ping');
    });
  }
}, 5 * 60 * 1000);  // Ping every 5 minutes
```

---

## Environment-Specific Configuration File

### Development (Qlik Sense Desktop)

**File**: `mashup/config/qlik-config.dev.js`

```javascript
export default {
  host: 'localhost',
  prefix: '/',
  port: 4848,
  isSecure: false,
  appId: 'C:\\Users\\kevin\\Documents\\Qlik\\Sense\\Apps\\Gov_Vehicles_Data.qvf',
  environment: 'development',
  debug: true  // Enable verbose logging
};
```

### Production (Qlik Sense Server)

**File**: `mashup/config/qlik-config.prod.js`

```javascript
export default {
  host: 'qlik-server.unionmotors.local',
  prefix: '/',
  port: '',  // Use default HTTPS port (443)
  isSecure: true,
  appId: 'ae0221f5-3033-43a5-a9d7-857c029cecef',
  environment: 'production',
  debug: false  // Disable verbose logging
};
```

### Build-time Configuration Selection

**Webpack configuration** (if using bundler):

```javascript
// webpack.config.js
const environment = process.env.NODE_ENV || 'development';

module.exports = {
  // ...
  resolve: {
    alias: {
      'qlik-config': path.resolve(__dirname, `config/qlik-config.${environment}.js`)
    }
  }
};
```

**Usage in mashup**:

```javascript
import config from 'qlik-config';  // Resolves to dev or prod based on build

require(['js/qlik'], function(qlik) {
  const app = qlik.openApp(config.appId, config);
  // ...
});
```

---

## Configuration Validation

### Pre-flight Checks

```javascript
function validateConfig(config) {
  const errors = [];

  // Check required parameters
  if (!config.host) errors.push('Missing required parameter: host');
  if (!config.appId) errors.push('Missing required parameter: appId');

  // Check parameter types
  if (typeof config.isSecure !== 'boolean') {
    errors.push('Parameter isSecure must be boolean');
  }

  // Check format (app ID should be GUID on Server, path on Desktop)
  const isGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(config.appId);
  const isPath = /^[A-Z]:\\.+\.qvf$/i.test(config.appId);

  if (!isGuid && !isPath) {
    errors.push('Invalid appId format. Expected GUID (Server) or file path (Desktop)');
  }

  // Check HTTPS requirement for production
  if (config.environment === 'production' && !config.isSecure) {
    console.warn('WARNING: Production deployment should use HTTPS (isSecure: true)');
  }

  return errors;
}

// Usage
const configErrors = validateConfig(config);
if (configErrors.length > 0) {
  console.error('Configuration errors:', configErrors);
  throw new Error('Invalid Qlik configuration');
}
```

---

## Summary

This configuration contract defines:

- ✅ Required and optional configuration parameters
- ✅ Development vs production configuration differences
- ✅ Application ID formats (file path vs GUID)
- ✅ Four authentication strategies (Desktop, NTLM, Header, Ticket)
- ✅ RequireJS setup for Qlik resource loading
- ✅ Error handling and session management
- ✅ Security considerations (CSP, HTTPS, session timeout)
- ✅ Configuration validation helpers

**Next Steps**:
1. Create `mashup/config/qlik-config.js` with development settings
2. Test connection in Qlik Sense Desktop
3. Configure production settings when deploying to Qlik Server
4. Implement error handling and session management

**Ready for**: quickstart.md (development setup guide)
