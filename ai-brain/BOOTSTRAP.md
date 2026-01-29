# AI Brain Bootstrap

Copy the appropriate prompt below into your AI agent's system prompt or settings.

---

## Universal Prompt (Copy This)

Add this to your AI agent's system prompt, custom instructions, or first message:

```
You have access to an AI Brain knowledge system at: [PATH_TO_AI_BRAIN]

At the START of every session:
1. Read [PATH_TO_AI_BRAIN]/install.md to understand the system
2. Read [PATH_TO_AI_BRAIN]/memory/index.md and load relevant memories
3. Read [PATH_TO_AI_BRAIN]/rules/core.md and apply the rules
4. Apply knowledge, personas, and skills as needed

Before ENDING a session (when user says goodbye or conversation ends):
1. Identify important information to remember (preferences, decisions, context)
2. Save new memories to [PATH_TO_AI_BRAIN]/memory/ following the format in memory/index.md
3. Update [PATH_TO_AI_BRAIN]/memory/index.md with new entries

Always reference your memories to maintain continuity across sessions.
```

**Replace `[PATH_TO_AI_BRAIN]`** with your actual path, e.g.:
- `/Users/username/ai-brain`
- `~/projects/ai-brain`
- `./ai-brain`

---

## Agent-Specific Examples

### Claude Code / Anthropic Claude

Add to project instructions or CLAUDE.md:
```
You have access to an AI Brain knowledge system at: ./ai-brain

At session start, read ./ai-brain/install.md and ./ai-brain/memory/index.md
Apply rules from ./ai-brain/rules/core.md
Save important memories before session ends.
```

### OpenCode / Cursor / Windsurf

Add to custom instructions or rules file:
```
AI Brain installed at: ./ai-brain

START: Read ./ai-brain/install.md, then ./ai-brain/memory/index.md
DURING: Apply ./ai-brain/rules/core.md, use knowledge and skills as needed
END: Save important context to ./ai-brain/memory/
```

### ChatGPT / Custom GPTs

Add to system instructions:
```
You have an AI Brain knowledge system. When the user shares files from the ai-brain folder:
- install.md explains how the system works
- memory/ contains context from previous sessions
- rules/core.md contains behavioral guidelines
- Ask user to share relevant memory files at session start
- Provide memory updates for user to save at session end
```

### API-based Agents

Include in system message:
```json
{
  "role": "system",
  "content": "You have access to an AI Brain at ./ai-brain. Read install.md at start. Load memories from memory/. Apply rules from rules/core.md. Save new memories before session ends."
}
```

---

## Quick Start Checklist

1. [ ] Copy the universal prompt above
2. [ ] Replace `[PATH_TO_AI_BRAIN]` with actual path
3. [ ] Add to your AI agent's system prompt/settings
4. [ ] Test by starting a new session - AI should read the brain files

---

## Verification

Ask your AI agent:
> "Have you loaded the AI Brain? What memories do you have?"

It should reference the brain structure and any stored memories.
