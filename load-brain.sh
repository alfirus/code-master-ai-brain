#!/bin/bash
# Quick command to verify AI brain is loaded

echo "🧠 AI Brain Status"
echo "=================="
echo "Location: $HOME/.ai-brain"
echo "Global Instructions: ~/.copilot-instructions.md"
echo ""

if [ -d "$HOME/.ai-brain" ]; then
    echo "✅ Brain accessible"
    echo ""
    echo "Available knowledge:"
    echo "  - Workflow: $(ls -lh ~/.ai-brain/global-knowledge/task-execution-workflow.md 2>/dev/null | awk '{print $5}')"
    echo "  - Standards: $(ls -lh ~/.ai-brain/global-knowledge/coding-standards.md 2>/dev/null | awk '{print $5}')"
    echo "  - Skills: $(ls -1 ~/.ai-brain/skills 2>/dev/null | wc -l) files"
else
    echo "❌ Brain not found"
fi
