# CodingMaster AI Brain Integration Guide

## 🎉 Integration Complete!

CodingMaster is now equipped with the AI Brain knowledge system. This integration provides:

- 🧠 **Global Knowledge Base** - Access to coding standards, tech preferences, and best practices
- 📚 **Skill System** - 4 specialized skills for React Native, OpenCode AI, and Vercel deployment
- 🎯 **Task Execution Workflow** - Mandatory planning and execution rules for all tasks
- 👤 **Personal Preferences** - Learning style, communication preferences, and development goals
- 🔄 **Adaptive Learning** - System learns from your preferences and patterns
- 🤖 **Agent Coordination** - Intelligent delegation to specialized subagents

## 📁 Installation Location

```
~/.ai-brain/                          # AI Brain root directory
├── install/
│   ├── coding-master-integration.js  # ✨ NEW: Integration module
│   ├── ai-brain-loader.js            # Core loader
│   ├── ai-brain-cli.js               # CLI interface
│   └── ...
├── coding-master-config.js           # ✨ NEW: Configuration file
├── global-knowledge/                 # Global knowledge documents
│   ├── task-execution-workflow.md    # MANDATORY workflow rules
│   ├── coding-standards.md           # Your coding preferences
│   ├── tech-stack-preferences.md     # Technology choices
│   └── ...
├── personal/                         # Personal preferences
│   ├── learning-style.md             # How you learn best
│   ├── communication-preferences.md  # Communication style
│   └── ...
├── skills/                           # Available skills
│   ├── react-native-complete-suite.md
│   ├── react-native-quick-reference.md
│   ├── vercel-skills-integration.md
│   └── opencode-ai-complete-guide.md
└── ...
```

## 🚀 How to Use AI Brain with CodingMaster

### 1. **Automatic Integration**

CodingMaster now automatically:
- ✅ Loads all AI Brain skills on startup
- ✅ Applies your coding standards to all code
- ✅ Follows your task execution workflow
- ✅ Uses your personal preferences for communication
- ✅ Suggests relevant skills for problems

### 2. **Task Execution Workflow**

All tasks now follow the **MANDATORY** workflow from `task-execution-workflow.md`:

```
User Task → Plan → Display Plan + Options → User Choice → Todo List → Execute → Complete
```

**Key Rules:**
- 🛑 **Plan First** - Never execute immediately
- 📋 **Display Plan** - Show detailed plan with proceed/cancel/amend options
- ⏳ **Wait for Approval** - User must explicitly approve before execution
- ✅ **Create Todos** - Structured step-by-step task list
- 🔄 **Execute Sequentially** - Complete each task before moving to next
- 📊 **Completion Summary** - Report what was accomplished

### 3. **Skill-Based Problem Solving**

When you ask for help, CodingMaster:
1. Analyzes your problem
2. Searches available skills for relevant solutions
3. Suggests the best matching skills
4. Applies the skill to your specific context

**Available Skills:**
- 📱 **react-native-complete-suite** - Complete React Native patterns and best practices
- 📱 **react-native-quick-reference** - Quick React Native reference guide
- 🚀 **vercel-skills-integration** - Vercel deployment and optimization
- 🎯 **opencode-ai-complete-guide** - OpenCode AI integration guide

### 4. **Personalized Development**

CodingMaster uses your preferences:
- **Coding Standards** - Your preferred code style and organization
- **Tech Stack** - Your preferred technologies and tools
- **Learning Style** - Code-first examples with explanations
- **Communication** - Direct, practical explanations with context

## 📖 Key Files to Know

### Global Knowledge (Applied to All Tasks)

1. **task-execution-workflow.md** (MANDATORY)
   - How all tasks must be executed
   - Planning, approval, and execution rules
   - Cleanup and temporary file management

2. **coding-standards.md**
   - Your preferred coding style
   - Code organization principles
   - Git workflow and best practices

3. **tech-stack-preferences.md**
   - Preferred technologies and tools
   - Decision criteria for technology choices
   - Technologies to avoid

### Personal Preferences

1. **learning-style.md**
   - How you learn best (code-first approach)
   - Preferred explanation style
   - Problem-solving approach

2. **communication-preferences.md**
   - Your preferred communication style
   - How you like feedback and explanations

## 🔧 Integration Modules

### CodingMasterBrain (coding-master-integration.js)

The core integration module that:
- Loads all skills and knowledge documents
- Searches for relevant skills
- Applies skills to problems
- Provides context-aware suggestions

**Usage:**
```javascript
const { CodingMasterBrain } = require('~/.ai-brain/install/coding-master-integration');

const brain = new CodingMasterBrain();
await brain.initialize();

// Get a skill
const skill = brain.getSkill('react-native-complete-suite');

// Search for relevant skills
const results = brain.searchSkills('performance optimization');

// Get suggestions for a problem
const suggestions = brain.suggestSkills({
  technology: 'react-native',
  problem: 'app startup time',
  keywords: ['performance', 'optimization']
});
```

### CodingMasterConfig (coding-master-config.js)

The configuration module that:
- Integrates AI Brain with CodingMaster
- Loads all preferences and standards
- Manages workflow configuration
- Coordinates agent delegation

**Usage:**
```javascript
const { getCodingMasterConfig } = require('~/.ai-brain/coding-master-config');

const config = await getCodingMasterConfig();

// Get task execution workflow
const workflow = config.getTaskExecutionWorkflow();

// Get development preferences
const devPrefs = config.getDevelopmentPreferences();

// Suggest skills for a problem
const skills = config.suggestSkillsForProblem('optimize React app');
```

## 🎯 Workflow Rules (MANDATORY)

### For Every Task:

1. **PLAN** - Analyze and break down the task
2. **DISPLAY** - Show plan with these options:
   - 🟢 **PROCEED** - Execute as planned
   - 🔴 **CANCEL** - Stop execution
   - 🔄 **AMEND** - Modify the plan
3. **WAIT** - For user to choose
4. **TODO** - Create structured task list
5. **EXECUTE** - Complete tasks sequentially
6. **SUMMARY** - Report what was accomplished

### Forbidden Behaviors:
- ❌ Execute immediately without planning
- ❌ Skip the plan display step
- ❌ Proceed without explicit user approval
- ❌ Execute multiple todos simultaneously

### Required Behaviors:
- ✅ Plan first, execute second
- ✅ Display plan with proceed/cancel/amend options
- ✅ Wait for user choice before proceeding
- ✅ Create clear, actionable todo lists
- ✅ Execute todos sequentially
- ✅ Mark each todo complete when finished
- ✅ Provide completion summary

## 🧹 Cleanup Rules

**Always remove temporary files after task completion**

- **Temporary files**: Documentation summaries, test files, temporary scripts, backup files
- **Do NOT remove**: Source code, project configs, permanent documentation, user-requested files
- **Location**: Create temporary files in `~/.ai-brain/temp/`

## 📊 AI Brain Status

Check the health of your AI Brain:

```bash
# Check status
cd ~/.ai-brain && node install/status.js

# List all skills
ai-brain list

# Get a specific skill
ai-brain get react-native-complete-suite

# Search skills
ai-brain search "performance"

# Export brain data
ai-brain export json
```

## 🔄 How CodingMaster Uses AI Brain

### 1. **Problem Analysis**
When you ask a question, CodingMaster:
- Analyzes the problem
- Searches AI Brain skills for relevant solutions
- Identifies applicable patterns from global knowledge

### 2. **Solution Generation**
CodingMaster:
- Applies relevant skills to your specific context
- Uses your coding standards and preferences
- Follows your learning style for explanations

### 3. **Task Execution**
CodingMaster:
- Follows the mandatory task execution workflow
- Creates structured todo lists
- Executes tasks sequentially
- Provides completion summaries

### 4. **Agent Coordination**
CodingMaster:
- Delegates to specialized agents (@claude, @gemini, @github-copilot)
- Provides context from AI Brain to agents
- Coordinates results from multiple agents

## 🎓 Learning & Adaptation

AI Brain learns from your interactions:
- **Patterns** - Recognizes your preferred approaches
- **Preferences** - Learns your coding style and preferences
- **Feedback** - Improves based on your feedback
- **Context** - Understands your current project challenges

## 🚀 Next Steps

1. **Review Your Preferences**
   - Check `~/.ai-brain/global-knowledge/coding-standards.md`
   - Review `~/.ai-brain/personal/learning-style.md`
   - Update any preferences that don't match your style

2. **Explore Available Skills**
   - Run `ai-brain list` to see all skills
   - Run `ai-brain get <skill-name>` to read a skill
   - Use skills in your development work

3. **Follow the Workflow**
   - Always follow the task execution workflow
   - Plan before executing
   - Wait for approval before proceeding

4. **Provide Feedback**
   - Let CodingMaster know what works well
   - Suggest improvements to the workflow
   - Help AI Brain learn your preferences

## 📞 Support

For issues or questions:
1. Check the AI Brain status: `cd ~/.ai-brain && node install/status.js`
2. Review the task execution workflow: `cat ~/.ai-brain/global-knowledge/task-execution-workflow.md`
3. Check available skills: `ai-brain list`
4. Search for relevant information: `ai-brain search <query>`

## 🎉 You're All Set!

CodingMaster is now equipped with AI Brain and ready to provide intelligent, personalized assistance for all your development tasks!

**Key Features:**
- ✅ Global knowledge base with coding standards and best practices
- ✅ 4 specialized skills for common development tasks
- ✅ Mandatory task execution workflow for intentional development
- ✅ Personal preferences for learning and communication
- ✅ Adaptive learning system that improves over time
- ✅ Intelligent agent coordination for complex tasks

**Start using AI Brain by asking CodingMaster for help with your next task!**

---

**Integration Date**: January 29, 2026  
**AI Brain Version**: 1.0.0  
**CodingMaster Version**: 1.0.0  
**Status**: ✅ Active & Integrated
