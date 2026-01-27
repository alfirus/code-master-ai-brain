#!/bin/bash
# AI Brain Global Environment Setup
export AI_BRAIN_PATH="/Users/alfirusahmad/.ai-brain"
export AI_BRAIN_ENABLED=true
export PATH="$PATH:/Users/alfirusahmad/.ai-brain"

# Auto-sync function
ai-brain-sync() {
  cd "/Users/alfirusahmad/.ai-brain"
  git add . 2>/dev/null
  if [ -n "$(git status --porcelain)" ]; then
    git commit -m "Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null
    git push origin main 2>/dev/null
    echo "🧠 AI Brain synced to repository"
  fi
}

# Auto-update function  
ai-brain-update() {
  cd "/Users/alfirusahmad/.ai-brain"
  git pull origin main 2>/dev/null
  echo "🧠 AI Brain updated from repository"
}
