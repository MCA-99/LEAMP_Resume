#!/bin/bash

# Stop the project
echo "✔ ··· Stopping project"
docker-compose -f docker-compose.dev.yml down

# Change permissions to be able to push to github
echo "✔ ... Changing permissions"
sudo chown -R 1000:1000 db/