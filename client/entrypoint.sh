#!/bin/sh
set -e

# Ensure directory exists
mkdir -p /usr/share/nginx/html

# Write env.js to be loaded by React at runtime
cat <<EOF > /usr/share/nginx/html/env.js
window.REACT_APP_PAYPAL_CLIENT_ID="${REACT_APP_PAYPAL_CLIENT_ID}";
window.REACT_APP_PRODUCT_SERVER_URL="${REACT_APP_PRODUCT_SERVER_URL}";
window.REACT_APP_ADK_SERVER_URL="${REACT_APP_ADK_SERVER_URL}";
EOF

# Start Nginx
exec nginx -g "daemon off;"
