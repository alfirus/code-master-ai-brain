# Personal Automation & Custom Commands

## Custom Command Library

### Project Setup Commands
```bash
# React + TypeScript + Tailwind Starter
create-react-ts() {
  npx create-next-app@latest $1 --typescript --tailwind --eslint --app
  cd $1
  npm install -D @types/node
  cp .env.example .env.local
  echo "✅ React + TypeScript + Tailwind project '$1' ready!"
}

# Node.js API Starter
create-node-api() {
  mkdir $1 && cd $1
  npm init -y
  npm install express cors helmet morgan dotenv
  npm install -D @types/node @types/express @types/cors typescript ts-node nodemon
  echo '{"compilerOptions":{"target":"ES2020","module":"commonjs","outDir":"./dist","rootDir":"./src","strict":true}}' > tsconfig.json
  mkdir src && echo "console.log('API server starting...')" > src/index.ts
  echo "✅ Node.js API project '$1' ready!"
}
```

### Development Workflow Commands
```bash
# Enhanced development server
dev() {
  if [ -f "package.json" ]; then
    echo "🚀 Starting development server..."
    npm run dev
  else
    echo "❌ No package.json found. Run from project root."
  fi
}

# Smart testing command
test() {
  if [ -n "$1" ]; then
    echo "🧪 Running tests: $1"
    npm test -- $1
  else
    echo "🧪 Running all tests"
    npm test
  fi
}

# Project status overview
status() {
  echo "📊 Project Status:"
  echo "─────────────────"
  if [ -d ".git" ]; then
    echo "🔀 Git: $(git branch --show-current)"
    echo "📝 Changes: $(git status --porcelain | wc -l) files modified"
  fi
  if [ -f "package.json" ]; then
    echo "📦 Node: $(node --version)"
    echo "📜 NPM: $(npm --version)"
  fi
  echo "⏰ $(date)"
}
```

### Git Workflow Commands
```bash
# Smart commit with conventional commits
commit() {
  if [ -z "$1" ]; then
    echo "Usage: commit <type>: <message>"
    echo "Types: feat, fix, docs, style, refactor, test, chore"
    return 1
  fi
  
  git add .
  git commit -m "$1"
  echo "✅ Changes committed: $1"
}

# Feature branch workflow
feature() {
  if [ -z "$1" ]; then
    echo "Usage: feature <feature-name>"
    return 1
  fi
  
  git checkout -b feature/$1
  echo "🌿 Created feature branch: feature/$1"
}

# Smart push with upstream creation
push() {
  local branch=$(git branch --show-current)
  git push -u origin $branch
  echo "📤 Pushed to origin/$branch"
}
```

## Intelligent Scripts

### Context-Aware Development Script
```bash
#!/bin/bash
# smart-dev.sh - Intelligent development assistant

detect_project_type() {
  if [ -f "next.config.js" ] || [ -f "next.config.mjs" ]; then
    echo "next"
  elif [ -f "vite.config.js" ] || [ -f "vite.config.ts" ]; then
    echo "vite"
  elif grep -q "express" package.json 2>/dev/null; then
    echo "express"
  else
    echo "unknown"
  fi
}

suggest_commands() {
  local project_type=$(detect_project_type)
  
  case $project_type in
    "next")
      echo "💡 Suggested commands:"
      echo "  npm run dev          # Start development server"
      echo "  npm run build        # Build for production"
      echo "  npm run start        # Start production server"
      echo "  npm run lint         # Run ESLint"
      ;;
    "vite")
      echo "💡 Suggested commands:"
      echo "  npm run dev          # Start development server"
      echo "  npm run build        # Build for production"
      echo "  npm run preview      # Preview production build"
      echo "  npm run test         # Run tests"
      ;;
    "express")
      echo "💡 Suggested commands:"
      echo "  npm run dev          # Start with nodemon"
      echo "  npm start            # Start production server"
      echo "  npm test             # Run tests"
      echo "  npm run lint         # Run ESLint"
      ;;
  esac
}

suggest_commands
```

### Automatic Environment Setup
```bash
#!/bin/bash
# setup-env.sh - Automatic environment configuration

setup_node_project() {
  echo "🔧 Setting up Node.js project..."
  
  # Create .env file from example if exists
  if [ -f ".env.example" ] && [ ! -f ".env.local" ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
  fi
  
  # Install dependencies
  if [ -f "package.json" ] && [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Installed dependencies"
  fi
  
  # Check for TypeScript configuration
  if [ -f "tsconfig.json" ]; then
    echo "📘 TypeScript project detected"
    npm install -D typescript @types/node
  fi
}

setup_git_hooks() {
  echo "🪝 Setting up Git hooks..."
  
  # Create pre-commit hook for linting
  if [ -d ".git" ] && [ ! -f ".git/hooks/pre-commit" ]; then
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
npm run lint
npm test
EOF
    chmod +x .git/hooks/pre-commit
    echo "✅ Pre-commit hook installed"
  fi
}

setup_node_project
setup_git_hooks
echo "🎉 Environment setup complete!"
```

## Productivity Automation

### Quick Project Templates
```bash
# Quick React component generator
react-component() {
  if [ -z "$1" ]; then
    echo "Usage: react-component <ComponentName>"
    return 1
  fi
  
  local component_name=$1
  local dir="src/components/${component_name}"
  
  mkdir -p $dir
  
  cat > "${dir}/${component_name}.tsx" << EOF
import React from 'react';

interface ${component_name}Props {
  // Define props here
}

export const ${component_name}: React.FC<${component_name}Props> = () => {
  return (
    <div>
      <h1>${component_name} Component</h1>
    </div>
  );
};

export default ${component_name};
EOF

  cat > "${dir}/${component_name}.test.tsx" << EOF
import { render, screen } from '@testing-library/react';
import { ${component_name} } from './${component_name}';

describe('${component_name}', () => {
  it('renders correctly', () => {
    render(<${component_name} />);
    expect(screen.getByText('${component_name} Component')).toBeInTheDocument();
  });
});
EOF

  echo "✅ React component '${component_name}' created!"
}
```

### Database Management Scripts
```bash
# Database operations helper
db() {
  case $1 in
    "reset")
      echo "🔄 Resetting database..."
      npm run db:migrate:undo:all
      npm run db:migrate
      npm run db:seed
      echo "✅ Database reset complete"
      ;;
    "migrate")
      echo "📊 Running migrations..."
      npm run db:migrate
      ;;
    "seed")
      echo "🌱 Seeding database..."
      npm run db:seed
      ;;
    "backup")
      local backup_name="backup_$(date +%Y%m%d_%H%M%S).sql"
      pg_dump $DATABASE_URL > $backup_name
      echo "✅ Database backed up to $backup_name"
      ;;
    *)
      echo "Usage: db <reset|migrate|seed|backup>"
      ;;
  esac
}
```

## Learning Automation

### Daily Learning Reminders
```bash
# Learning tracker and reminder
learn() {
  local learning_file="$HOME/.ai-brain/learning-log.md"
  
  case $1 in
    "log")
      if [ -z "$2" ]; then
        echo "Usage: learn log <what you learned>"
        return 1
      fi
      echo "## $(date '+%Y-%m-%d %H:%M')" >> $learning_file
      echo "- $2" >> $learning_file
      echo "" >> $learning_file
      echo "📝 Learning logged!"
      ;;
    "review")
      echo "📚 Recent learning:"
      tail -20 $learning_file
      ;;
    "today")
      echo "🎯 Today's learning goals:"
      echo "- Complete TypeScript advanced course section"
      echo "- Practice 2 coding problems"
      echo "- Review 1 design pattern"
      ;;
    *)
      echo "Usage: learn <log|review|today>"
      ;;
  esac
}
```

## Integration with AI Brain

### Automatic Brain Updates
```bash
# After each session, update the brain
update-brain() {
  local session_file="$HOME/.ai-brain/session-logs/$(date '+%Y-%m')/$(date '+%Y-%m-%d-session.md')"
  
  mkdir -p "$(dirname $session_file)"
  
  cat >> $session_file << EOF
# Session: $(date '+%Y-%m-%d %H:%M')

## Tasks Accomplished
- [To be filled by AI]

## Key Learnings
- [To be filled by AI]

## Code Patterns Used
- [To be filled by AI]

## Next Steps
- [To be filled by AI]

---

EOF

  echo "🧠 Session log created: $session_file"
}
```

---

*These custom commands and scripts automate your workflow and integrate seamlessly with your AI brain.*