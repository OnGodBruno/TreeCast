#!/bin/bash

echo "Starting TreeCast Setup..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH."
    echo "Please download and install Node.js from https://nodejs.org/"
    echo
    exit 1
fi

echo "Node.js found!"
echo "Installing dependencies and starting TreeCast..."
echo

# Install and run the game
npm run install-and-run

if [ $? -ne 0 ]; then
    echo
    echo "ERROR: Failed to start TreeCast."
    echo "Please check the error messages above."
    echo
    exit 1
fi

echo
echo "TreeCast should now be running at http://localhost:3000"
echo "Press Ctrl+C to stop the server."
echo
