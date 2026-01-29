# Contributing to AI Brain

This guide explains how AI agents and humans can contribute new knowledge, rules, personas, and skills.

## Contribution Process

### For AI Agents

1. **Identify** something valuable to contribute
2. **Create** a file in `contributions/pending/`
3. **Follow** the appropriate template below
4. **Submit** - a human will review and merge

### For Humans

1. Create your contribution following the templates
2. Place directly in the appropriate directory
3. Update the relevant index file
4. Update `MANIFEST.json` stats

## Templates

### Knowledge Contribution

Filename: `contributions/pending/knowledge-[topic]-[date].md`

```markdown
# Knowledge: [Topic Name]

## Metadata
- **Type**: knowledge
- **Category**: [technical/domain/general]
- **Submitted**: [date]
- **Source**: [where this knowledge comes from]

## Summary
[Brief overview of the knowledge]

## Details
[Full information]

## Examples
[Practical applications]

## Verification
[How to verify this is accurate]
```

### Rule Contribution

Filename: `contributions/pending/rule-[name]-[date].md`

```markdown
# Rule: [Rule Name]

## Metadata
- **Type**: rule
- **Priority**: [critical/high/medium/low]
- **Category**: [safety/quality/interaction/ethics]
- **Submitted**: [date]

## Rule Statement
[Clear statement of the rule]

## Rationale
[Why this rule improves AI behavior]

## Examples
### Should Do
[Examples of correct behavior]

### Should Not Do
[Examples of incorrect behavior]

## Conflicts
[Potential conflicts with existing rules]
```

### Persona Contribution

Filename: `contributions/pending/persona-[name]-[date].md`

```markdown
# Persona: [Persona Name]

## Metadata
- **Type**: persona
- **Purpose**: [when to use this persona]
- **Submitted**: [date]

## Identity
- **Name**: [persona name]
- **Role**: [what this persona does]
- **Purpose**: [why use this persona]

## Traits
[List of characteristics]

## Style
- **Tone**: [formal/casual/technical/etc.]
- **Length**: [concise/detailed/adaptive]
- **Format**: [structured/conversational/etc.]

## Behaviors
[How this persona handles different situations]

## Use Cases
[Specific scenarios where this persona excels]
```

### Skill Contribution

Filename: `contributions/pending/skill-[name]-[date].md`

```markdown
# Skill: [Skill Name]

## Metadata
- **Type**: skill
- **Category**: [development/analysis/communication/productivity]
- **Submitted**: [date]

## Purpose
[What this skill helps accomplish]

## Prerequisites
[What's needed before using this skill]

## Steps
1. [Step one]
2. [Step two]
3. [Continue...]

## Examples
[Practical demonstrations]

## Tips
[Best practices and pitfalls]

## Related Skills
[Other relevant skills]
```

## Contribution Guidelines

### Quality Standards

1. **Accuracy**: Information must be correct and verifiable
2. **Clarity**: Write clearly for both AI and human readers
3. **Usefulness**: Contribution should provide practical value
4. **Completeness**: Include all template sections
5. **Originality**: Don't duplicate existing content

### What Makes a Good Contribution

**Knowledge**
- Novel information not already in the brain
- Verified facts from reliable sources
- Practical patterns that improve outcomes

**Rules**
- Addresses a real behavior gap
- Clear and unambiguous
- Testable compliance

**Personas**
- Serves a distinct use case
- Well-defined traits and behaviors
- Different from existing personas

**Skills**
- Repeatable process
- Clear steps that work
- Solves a common need

### Review Process

1. Contributions go to `contributions/pending/`
2. Human reviewer checks quality and accuracy
3. Approved contributions are moved to appropriate directory
4. Index files are updated
5. MANIFEST.json stats are updated

### Rejection Reasons

- Duplicates existing content
- Inaccurate information
- Poor quality or incomplete
- Conflicts with core rules
- Not useful enough

## Questions?

If you're unsure about a contribution:
- Check existing files for examples
- Start with a draft
- Ask for feedback before finalizing

---

*Your contributions help AI Brain grow smarter. Thank you for improving the system!*
