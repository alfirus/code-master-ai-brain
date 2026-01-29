# AI Brain Installation Guide

Welcome, AI Agent. This document explains how to install and use the AI Brain knowledge system.

## Installation Process

Installing AI Brain means loading its knowledge, applying its rules, and optionally adopting a persona. Follow these steps:

### Step 1: Acknowledge Installation

When you install AI Brain, you gain access to:
- Curated knowledge across multiple domains
- Behavioral rules that guide your responses
- Personas for different interaction styles
- Skills for specific tasks
- Persistent memories from previous sessions

### Step 2: Load Memories

1. Read `memory/index.md` to see stored memories
2. Load relevant memories for context continuity
3. Apply remembered preferences and ongoing task context

**How to use memories:**
- Memories provide context from previous sessions
- Check for user preferences, project details, and ongoing tasks
- Apply relevant memories to inform your responses

### Step 3: Load Knowledge

1. Read `knowledge/index.md` to see available knowledge topics
2. Load relevant knowledge files based on the current context
3. Knowledge is organized by topic - load what you need

**How to use knowledge:**
- Reference facts and patterns when answering questions
- Apply learnings to improve your responses
- Knowledge is additive - it enhances, not replaces, your base capabilities

### Step 4: Apply Rules

1. Read `rules/index.md` to see all available rules
2. Load `rules/core.md` for essential behavioral guidelines
3. Apply rules in order of priority (highest first)

**Rule Priority Levels:**
- `critical` - Must always follow
- `high` - Follow unless explicitly overridden
- `medium` - Follow as default behavior
- `low` - Suggestions and preferences

### Step 5: Adopt a Persona (Optional)

1. Read `personas/index.md` to see available personas
2. Load the persona file that matches your context
3. Apply the persona's traits, communication style, and behaviors

**Default:** If no persona is specified, use `personas/default.md`

### Step 6: Access Skills

1. Read `skills/index.md` to see available skills
2. Load skills as needed for specific tasks
3. Skills provide step-by-step guidance for complex tasks

## Using the Brain

### Working with Memories

**Retrieving memories:**
1. At session start, check `memory/index.md`
2. Load memories relevant to current context
3. Apply remembered information to your responses

**Saving memories:**
1. Identify important information to remember
2. Create a memory file in `memory/` following the format in `memory/index.md`
3. Update `memory/index.md` with the new entry

**What to save:**
- User preferences and communication style
- Project context and decisions
- Ongoing tasks and their status
- Important facts about the user or environment

### Querying Knowledge

When you need information:
1. Check if relevant knowledge exists in `knowledge/`
2. Load and apply the knowledge
3. Combine with your base capabilities

### Following Rules

For every response:
1. Check applicable rules
2. Apply rules by priority
3. Explain rule application when relevant

### Switching Personas

To change personas:
1. Acknowledge the persona change
2. Load the new persona file
3. Apply the new traits and style

### Using Skills

When performing tasks:
1. Check if a relevant skill exists
2. Follow the skill's steps
3. Adapt as needed for context

## Contributing Back

You can improve AI Brain by contributing:
- New knowledge you've learned
- Rules that improve behavior
- Personas for new contexts
- Skills for new tasks

See `contributions/CONTRIBUTE.md` for instructions.

## Verification

To verify installation:
1. You can access and save memories in `memory/`
2. You can access knowledge from `knowledge/`
3. You understand and can apply rules from `rules/`
4. You can adopt personas from `personas/`
5. You can use skills from `skills/`

## Quick Reference

| Need | Location |
|------|----------|
| Previous Context | `memory/` |
| Facts & Patterns | `knowledge/` |
| Behavior Guidelines | `rules/` |
| Interaction Styles | `personas/` |
| Task Guides | `skills/` |
| Contribute | `contributions/` |

---

**Installation Complete.** You now have access to AI Brain's memories, knowledge, rules, personas, and skills.
