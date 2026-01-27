# Common Commands & Workflows

## Git Commands
```bash
# Start new feature
git checkout -b feature/feature-name

# Commit with good message
git add .
git commit -m "feat: add user authentication flow"

# Push and create PR
git push -u origin feature/feature-name
gh pr create --title "Add User Authentication" --body "Implements login and registration"

# Clean up branches
git branch -d feature/feature-name
git push origin --delete feature/feature-name
```

## Package Management
```bash
# Node.js
npm install -D typescript @types/node prettier eslint
npm install express
npm run dev
npm run build
npm test

# Python
pip install -r requirements.txt
python -m venv venv
source venv/bin/activate
python -m pytest
```

## Docker Commands
```bash
# Build and run
docker build -t app-name .
docker run -p 3000:3000 app-name

# Development with volume
docker run -p 3000:3000 -v .:/app app-name

# Clean up
docker system prune -f
docker rmi $(docker images -f "dangling=true" -q)
```

## Database Commands
```bash
# PostgreSQL
psql -h localhost -U username -d database
\d table_name
\dt

# MongoDB
mongo
db.collection.find()
db.collection.insertOne()
```

## Testing Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- user.test.ts

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

## Development Server Patterns
```bash
# Start development with hot reload
npm run dev

# Common dev servers
- React: npm start (port 3000)
- Next.js: npm run dev (port 3000)
- Express: npm run dev (port varies)
- Vite: npm run dev (port 5173)
```

## Linting & Formatting
```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Format specific file
npx prettier --write src/file.ts
```

## Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Generate TypeScript types
npm run generate-types

# Install dependencies
npm ci  # Use exact versions from package-lock.json
```

## Common Debugging
```bash
# Node.js debugging
node --inspect-brk app.js

# Check network requests
curl -I http://localhost:3000/api/users

# Check logs
docker logs container-name
tail -f logs/app.log
```