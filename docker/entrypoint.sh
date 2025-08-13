#!/bin/sh
set -e

# Add a message to display the internal container port
echo "Angular application is running inside the container on port 80."
echo "Access it via your host's mapped port (e.g., http://localhost:80 or http://localhost:4200 if you used -p 4200:80)."

# Execute the main command (e.g., start Nginx)
exec "$@"
