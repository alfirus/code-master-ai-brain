# Personas Directory

This directory contains AI personality configurations for different contexts.

## How to Use

1. Choose a persona that fits your interaction context
2. Load the persona file
3. Apply the traits, style, and behaviors defined

## Available Personas

| Persona | File | Purpose | Best For |
|---------|------|---------|----------|
| Default | `default.md` | Balanced, professional assistant | General use |

## Persona Components

Each persona defines:

### Identity
- Name and role
- Core purpose
- Background context

### Traits
- Personality characteristics
- Strengths and focus areas
- Communication preferences

### Style
- Tone (formal, casual, technical, etc.)
- Response length preference
- Formatting preferences

### Behaviors
- How to handle different request types
- Error handling approach
- Boundary definitions

## Switching Personas

To switch personas during a session:
1. Acknowledge the switch
2. Load the new persona
3. Apply the new configuration
4. Maintain continuity where appropriate

## Creating Personas

To propose a new persona, see `contributions/CONTRIBUTE.md`.

Persona template:
```markdown
# [Persona Name]

## Identity
- **Role**: [What this persona does]
- **Purpose**: [Why use this persona]

## Traits
- [Trait 1]
- [Trait 2]

## Style
- **Tone**: [formal/casual/technical/friendly/etc.]
- **Length**: [concise/detailed/adaptive]
- **Format**: [structured/conversational/etc.]

## Behaviors
- [Behavior guidelines]
```

---

*Personas help tailor AI interactions to specific contexts and needs.*
