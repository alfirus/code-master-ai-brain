# Task Execution Workflow - Mandatory Planning Rule

> **Rule Type**: Core Execution Workflow  
> **Scope**: All CodingMaster interactions  
> **Priority**: MANDATORY - Must be followed for all tasks  
> **Version**: 1.0  

## 🎯 Workflow Overview

**MANDATORY RULE**: For every user task, you MUST follow this exact workflow sequence:

```
User Task → Plan → Display Plan + Options → User Choice → Todo List → Execute → Complete
```

## 📋 Detailed Workflow Steps

### Step 1: **PLAN FIRST** (Mandatory)
When user provides any task, you MUST:
1. ⏸️ **STOP** - Do NOT execute immediately
2. 🧠 **ANALYZE** - Break down the task completely
3. 📝 **PLAN** - Create a detailed execution plan

### Step 2: **DISPLAY PLAN + OPTIONS** (Mandatory)
Present your plan using this exact format:

```
## 📋 EXECUTION PLAN

[Your detailed plan here]

---

## 🤔 NEXT STEPS - Choose an option:

**🟢 PROCEED** - Execute this plan as-is
**🔴 CANCEL** - Stop and don't execute  
**🔄 AMEND** - Modify the plan (please specify changes)

What would you like to do?
```

### Step 3: **HANDLE USER CHOICE** (Mandatory)

**If user chooses PROCEED** or says "proceed":
- ✅ Move to Step 4 (Create Todo List)

**If user chooses CANCEL**:
- ❌ Stop workflow, don't execute anything
- 💬 Acknowledge cancellation

**If user chooses AMEND** or provides modifications:
- 🔄 Return to Step 1 with user modifications
- 📝 Create updated plan incorporating feedback
- 🔁 Display updated plan with same options (Step 2)

### Step 4: **CREATE TODO LIST** (After Proceed)
Based on approved plan, create structured todo list:

```markdown
## ✅ TODO LIST - [Task Name]

- [ ] Task 1: [Description]
- [ ] Task 2: [Description]  
- [ ] Task 3: [Description]
- [ ] Task 4: [Description]

**Execution Order**: Sequential (complete each before next)
```

### Step 5: **EXECUTE TODO LIST** (Sequential)
For each todo item:
1. 🚀 **Execute** the specific task
2. ✅ **Mark Complete** - Update todo with checkmark
3. 📊 **Report Progress** - Show what was accomplished
4. ➡️ **Move to Next** - Continue to next todo item

### Step 6: **COMPLETION SUMMARY**
After all todos complete:

```markdown
## 🎉 TASK COMPLETION SUMMARY

✅ **All todos completed successfully**

**What was accomplished:**
- ✅ Task 1: [Brief result]
- ✅ Task 2: [Brief result]
- ✅ Task 3: [Brief result]

**Files modified:** [List files if any]
**Next steps:** [Suggestions if applicable]
```

---

## 🚫 FORBIDDEN BEHAVIORS

**NEVER DO THESE:**
- ❌ Execute tasks immediately without planning
- ❌ Skip the plan display step
- ❌ Proceed without user explicit approval
- ❌ Create todos without showing the plan first
- ❌ Execute multiple todos simultaneously (must be sequential)

---

## ✅ REQUIRED BEHAVIORS

**ALWAYS DO THESE:**
- ✅ Plan first, execute second
- ✅ Display plan with proceed/cancel/amend options
- ✅ Wait for user choice before proceeding
- ✅ Create clear, actionable todo lists
- ✅ Execute todos sequentially
- ✅ Mark each todo complete when finished
- ✅ Provide completion summary

---

## 🔄 WORKFLOW EXAMPLES

### Example 1: Simple Task
**User**: "Create a React component for a login form"

**Response**:
```
## 📋 EXECUTION PLAN

1. **Analyze Requirements**
   - Create functional React component with TypeScript
   - Include email and password fields
   - Add form validation
   - Include submit handling

2. **Component Structure**
   - Create LoginForm.tsx in components directory
   - Add proper TypeScript interfaces
   - Include form state management
   - Add CSS styling

3. **Implementation Details**
   - Use React hooks (useState) for form state
   - Add form validation logic
   - Include proper error handling
   - Export component for use

---

## 🤔 NEXT STEPS - Choose an option:

**🟢 PROCEED** - Execute this plan as-is
**🔴 CANCEL** - Stop and don't execute  
**🔄 AMEND** - Modify the plan (please specify changes)

What would you like to do?
```

### Example 2: User Amends Plan
**User**: "Amend the plan to use Formik for form handling"

**Response**:
```
## 📋 UPDATED EXECUTION PLAN

1. **Analyze Requirements**
   - Create functional React component with TypeScript
   - Include email and password fields
   - Use Formik for form handling and validation ← UPDATED
   - Include submit handling with Formik

2. **Component Structure**
   - Create LoginForm.tsx in components directory
   - Add Formik and Yup dependencies ← UPDATED
   - Include Formik form wrapper
   - Add CSS styling

3. **Implementation Details**
   - Use Formik component for form management ← UPDATED
   - Add Yup schema for validation ← UPDATED
   - Include proper error handling with Formik
   - Export component for use

---

## 🤔 NEXT STEPS - Choose an option:

**🟢 PROCEED** - Execute this plan as-is
**🔴 CANCEL** - Stop and don't execute  
**🔄 AMEND** - Modify the plan (please specify changes)

What would you like to do?
```

### Example 3: User Proceeds
**User**: "proceed"

**Response**:
```
## ✅ TODO LIST - Create React Login Component

- [ ] Install Formik and Yup dependencies
- [ ] Create TypeScript interfaces for form data
- [ ] Create LoginForm.tsx component file
- [ ] Implement Formik form with validation
- [ ] Add CSS styling
- [ ] Test component functionality

**Execution Order**: Sequential (complete each before next)

Starting execution...

✅ **Task 1 Complete**: Install Formik and Yup dependencies
   - Added formik@2.4.5 and yup@1.4.0 to package.json
   - Dependencies installed successfully

⏳ **Starting Task 2**: Create TypeScript interfaces...
```

---

## 🔧 IMPLEMENTATION NOTES

### For Complex Tasks
- Break large tasks into smaller, manageable planning phases
- If plan has 10+ steps, ask user if they want to see high-level plan first
- For multi-file projects, group related todos together

### For Simple Tasks  
- Still follow workflow but keep plan concise
- Minimum 2-3 planning steps even for simple tasks
- Always show the proceed/cancel/amend options

### Integration with CodingMaster Learning Mode
- When in learning mode, this workflow applies to both direct execution and agent delegation
- Plans should specify which specialized agent (@claude, @gemini, @github-copilot) will handle each todo
- If delegating to agents, include agent assignment in todo descriptions

---

## 📊 COMPLIANCE TRACKING

This rule ensures:
- 🎯 **Clear Communication** - User knows exactly what will happen
- 🛡️ **Risk Mitigation** - No accidental execution of unwanted tasks
- 📈 **Quality Control** - Proper planning leads to better outcomes
- 🤝 **User Control** - User has final say before execution
- 📋 **Progress Tracking** - Clear visibility into task progress

**Remember**: This workflow is MANDATORY for ALL user tasks. No exceptions.
---

## 🧹 CLEANUP RULE (MANDATORY)

**Always remove temporary files after task completion**

Temporary files: documentation summaries, test files, temporary scripts, backup files
Do NOT remove: source code, project configs, permanent documentation, user-requested files

Include cleanup in completion summary. Ask user if unsure.

### Temporary File Location

**IMPORTANT: Always create temporary files in `~/.ai-brain/temp/`**

Examples:
- Summary documents: `~/.ai-brain/temp/summary.md`
- Test scripts: `~/.ai-brain/temp/test-script.sh`
- Backup files: `~/.ai-brain/temp/backup.bak`

This keeps the workspace and AI brain clean. The temp folder is git-ignored.
