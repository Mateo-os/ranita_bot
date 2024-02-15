#!/bin/bash

# Check if the POPULATED variable is not set
if [ -z "${POPULATED}" ]; then
    # Run the command to populate and set the POPULATED variable
    node populate.js
    export POPULATED=1
fi
