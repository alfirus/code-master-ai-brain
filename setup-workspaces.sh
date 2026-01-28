#!/bin/bash

# AI Brain Workspace Setup Wrapper Script
# Easily set up VS Code workspaces that include AI Brain
#
# Usage:
#   bash setup-workspaces.sh <project-path>
#   bash setup-workspaces.sh <project1> <project2> <project3>
#   bash setup-workspaces.sh --auto

set -e

AI_BRAIN_PATH="${HOME}/.ai-brain"
SETUP_SCRIPT="${AI_BRAIN_PATH}/install/setup-workspaces.js"

# Check if setup script exists
if [ ! -f "$SETUP_SCRIPT" ]; then
  echo "❌ Setup script not found: $SETUP_SCRIPT"
  echo "Make sure AI Brain is installed at: $AI_BRAIN_PATH"
  exit 1
fi

# Show help if no arguments
if [ $# -eq 0 ]; then
  echo "🧠 AI Brain VS Code Workspace Setup"
  echo "═══════════════════════════════════════════"
  echo ""
  echo "Usage:"
  echo "  bash setup-workspaces.sh <project-path>"
  echo "  bash setup-workspaces.sh <project1> <project2> <project3>"
  echo "  bash setup-workspaces.sh --auto"
  echo ""
  echo "Examples:"
  echo "  bash setup-workspaces.sh ~/projects/my-app"
  echo "  bash setup-workspaces.sh ~/Desktop/pilotv4 ~/Desktop/system3.2"
  echo "  bash setup-workspaces.sh --auto    # Auto-detect projects"
  echo ""
  exit 0
fi

# Run setup script with arguments
node "$SETUP_SCRIPT" "$@"
