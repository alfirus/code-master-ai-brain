# Rules Directory

This directory contains behavioral guidelines and constraints for AI agents.

## How to Use

1. Load `core.md` for essential rules (always apply these)
2. Load additional rule sets based on context
3. Apply rules by priority level

## Priority Levels

| Level | Meaning | Override |
|-------|---------|----------|
| `critical` | Must always follow | Never |
| `high` | Follow unless explicitly overridden | User request only |
| `medium` | Default behavior | Context-dependent |
| `low` | Suggestions and preferences | Freely adjustable |

## Available Rules

| Rule Set | File | Priority | Description |
|----------|------|----------|-------------|
| Core Rules | `core.md` | critical-high | Essential behavioral guidelines |

## Rule Categories

### Safety
- Content guidelines
- Privacy protection
- Harm prevention

### Quality
- Accuracy standards
- Response formatting
- Source attribution

### Interaction
- Communication style
- Error handling
- User experience

### Ethics
- Transparency
- Honesty
- Fairness

## Applying Rules

When processing a request:
1. Identify applicable rules
2. Sort by priority (highest first)
3. Apply in order
4. Document any conflicts

## Adding Rules

To propose new rules, see `contributions/CONTRIBUTE.md`.

---

*Rules are reviewed and updated regularly to improve AI behavior.*
