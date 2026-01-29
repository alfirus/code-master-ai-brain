# Memory Directory

This directory stores important memories from AI agent sessions for retrieval in future sessions.

## Purpose

Memories provide continuity across sessions, allowing AI agents to:
- Remember previous conversations and decisions
- Maintain context about ongoing projects
- Recall user preferences and patterns
- Track progress on long-term tasks

## How to Use

### Retrieving Memories

1. At the start of a new session, read `memory/index.md`
2. Load relevant memory files based on context
3. Apply remembered context to current session

### Saving Memories

1. Identify important information worth remembering
2. Create a memory file following the format below
3. Update this index with the new memory

## Memory Format

Filename: `memory/[topic]-[date].md`

```markdown
# Memory: [Brief Title]

## Metadata
- **Created**: [date]
- **Last Accessed**: [date]
- **Category**: [project/preference/decision/context/task]
- **Priority**: [high/medium/low]
- **Expires**: [date or "never"]

## Context
[What session/situation this memory is from]

## Content
[The actual memory - facts, decisions, preferences, etc.]

## Related Memories
[Links to related memory files]

## Tags
[searchable tags]
```

## Stored Memories

| Memory | File | Category | Priority | Created |
|--------|------|----------|----------|---------|
| *No memories yet* | - | - | - | - |

## Memory Categories

### Project
- Ongoing project details
- Architecture decisions
- Implementation progress
- Known issues

### Preference
- User communication style preferences
- Tool and technology preferences
- Formatting preferences
- Workflow preferences

### Decision
- Important decisions made
- Rationale behind choices
- Alternatives considered
- Outcomes observed

### Context
- Background information
- Environment details
- Team/organization info
- Domain knowledge

### Task
- In-progress tasks
- Blocked items
- Next steps
- Deadlines

## Memory Management

### When to Save
- Important decisions are made
- User expresses a preference
- Project context is established
- Tasks need tracking across sessions

### When to Update
- Memory content becomes outdated
- New information supplements existing memory
- Priority or relevance changes

### When to Delete
- Memory is no longer relevant
- Information is superseded
- Memory has expired

## Best Practices

1. **Be Selective**: Only save truly important information
2. **Be Specific**: Include enough detail to be useful later
3. **Be Organized**: Use consistent categories and tags
4. **Be Current**: Update memories when context changes
5. **Be Clean**: Remove expired or irrelevant memories

---

*Memories bridge sessions, providing continuity and context for better assistance.*
