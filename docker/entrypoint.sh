#!/bin/sh
set -e

# Path to the ngx-env.js file in the Nginx serving directory
NGX_ENV_FILE="/usr/share/nginx/html/ngx-env.js"

# Check if ngx-env.js exists and substitute variables
if [ -f "$NGX_ENV_FILE" ]; then
  echo "Substituting environment variables in $NGX_ENV_FILE..."
  # Use envsubst to replace placeholders with actual environment variables
  # It reads from STDIN and writes to STDOUT, so redirect accordingly.
  # The values will be replaced if they match environment variables prefixed with NG_APP_ (or your custom prefix)
  # or any other environment variable that envsubst finds.
  envsubst < "$NGX_ENV_FILE" > "$NGX_ENV_FILE.tmp" && mv "$NGX_ENV_FILE.tmp" "$NGX_ENV_FILE"
else
  echo "$NGX_ENV_FILE not found. Skipping environment variable substitution."
fi

# Add a message to display the internal container port
echo "Angular application is running inside the container on port 80."
echo "Access it via your host's mapped port (e.g., http://localhost:80 or http://localhost:4200 if you used -p 4200:80)."

# Execute the main command (e.g., start Nginx)
exec "$@"
