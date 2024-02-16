#!/bin/bash

# Check if the POPULATED variable is not set
if [ -z "${POPULATED}" ]; then
    # Run the Sequelize migrations
    npx sequelize-cli db:migrate

    # Run the script to populate data
    node populate.js

    node index.js
    # Set the POPULATED variable to 1
    export POPULATED=1
fi
