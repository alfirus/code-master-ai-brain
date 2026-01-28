#!/bin/bash
# Global AI Brain Setup for GitHub Copilot
# This makes your AI brain accessible across ALL projects

echo "🌍 Setting up Global AI Brain Integration"
echo "=========================================="
echo ""

# 1. Create global Copilot instructions in home directory
echo "📝 Creating global instructions file..."
cat > ~/.copilot-instructions.md << 'EOF'
# Global GitHub Copilot Instructions

## AI Brain Integration (Global)

**CRITICAL: Always load AI Brain preferences before any task execution.**

### Mandatory Files to Read

1. **Task Execution Workflow** (MANDATORY)
   - `~/.ai-brain/global-knowledge/task-execution-workflow.md`
   - Rule: ALWAYS create plan → show PROCEED/CANCEL/AMEND → wait for approval → execute

2. **Coding Standards**
   - `~/.ai-brain/global-knowledge/coding-standards.md`

3. **Tech Stack Preferences**
   - `~/.ai-brain/global-knowledge/tech-stack-preferences.md`

4. **Learning Style**
   - `~/.ai-brain/personal/learning-style.md`

## Workflow (MANDATORY)

```markdown
## 📋 EXECUTION PLAN
[Plan details]

---

## 🤔 NEXT STEPS - Choose an option:
**🟢 PROCEED** - Execute this plan as-is
**🔴 CANCEL** - Stop and don't execute
**🔄 AMEND** - Modify the plan

What would you like to do?
```

**NEVER execute without user approval.**

## Available Skills
- `~/.ai-brain/skills/react-native-complete-suite.md`
- `~/.ai-brain/skills/vercel-skills-integration.md`
- `~/.ai-brain/skills/opencode-ai-complete-guide.md`

## Communication Style
- Code examples first, then explanation
- Direct and practical
- Real-world context
- Clear "why" comments

---

**This applies to ALL projects globally.**
EOF

echo "✅ Created ~/.copilot-instructions.md"
echo ""

# 2. Create VS Code global settings
VSCODE_USER_DIR="$HOME/Library/Application Support/Code/User"
mkdir -p "$VSCODE_USER_DIR"

echo "📝 Updating VS Code global settings..."

# Backup existing settings if they exist
if [ -f "$VSCODE_USER_DIR/settings.json" ]; then
    cp "$VSCODE_USER_DIR/settings.json" "$VSCODE_USER_DIR/settings.json.backup"
    echo "✅ Backed up existing settings to settings.json.backup"
fi

# Create/update global settings
cat > "$VSCODE_USER_DIR/settings.json.ai-brain" << 'EOF'
{
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": true,
    "markdown": true
  },
  "github.copilot.chat.welcomeMessage": "first",
  "github.copilot.advanced": {},
  "files.associations": {
    ".copilot-instructions.md": "markdown",
    ".github/copilot-instructions.md": "markdown"
  }
}
EOF

echo "✅ Created global settings template: settings.json.ai-brain"
echo "   (Manual merge required - see instructions below)"
echo ""

# 3. Create shell profile integration
echo "📝 Creating shell profile integration..."

SHELL_RC=""
if [ -f ~/.zshrc ]; then
    SHELL_RC=~/.zshrc
elif [ -f ~/.bashrc ]; then
    SHELL_RC=~/.bashrc
fi

if [ ! -z "$SHELL_RC" ]; then
    # Check if already added
    if ! grep -q "AI_BRAIN_PATH" "$SHELL_RC"; then
        cat >> "$SHELL_RC" << 'EOF'

# AI Brain Integration (Global)
export AI_BRAIN_PATH="$HOME/.ai-brain"
export AI_BRAIN_AUTO_LOAD=true

# Quick command to load AI brain context
alias load-brain='echo "AI Brain loaded from: $AI_BRAIN_PATH"'
alias brain-status='[ -d "$AI_BRAIN_PATH" ] && echo "✅ AI Brain accessible" || echo "❌ AI Brain not found"'
EOF
        echo "✅ Added to $SHELL_RC"
        echo "   Run: source $SHELL_RC"
    else
        echo "✅ Already added to $SHELL_RC"
    fi
fi
echo ""

# 4. Create global brain loader script
echo "📝 Creating global loader command..."
cat > ~/.ai-brain/load-brain.sh << 'EOF'
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
EOF
chmod +x ~/.ai-brain/load-brain.sh
echo "✅ Created ~/.ai-brain/load-brain.sh"
echo ""

# 5. Summary
echo "🎉 Global Setup Complete!"
echo "========================="
echo ""
echo "✅ Created ~/.copilot-instructions.md (GLOBAL)"
echo "✅ Created VS Code settings template"
echo "✅ Added shell environment variables"
echo "✅ Created brain loader command"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. Reload your shell:"
echo "   source $SHELL_RC"
echo ""
echo "2. Merge VS Code settings (IMPORTANT):"
echo "   cat '$VSCODE_USER_DIR/settings.json.ai-brain'"
echo "   # Copy the settings and manually merge into:"
echo "   # $VSCODE_USER_DIR/settings.json"
echo ""
echo "3. Restart VS Code"
echo ""
echo "4. Test with: brain-status"
echo ""
echo "💡 The global ~/.copilot-instructions.md will be available"
echo "   to GitHub Copilot across ALL your projects!"
