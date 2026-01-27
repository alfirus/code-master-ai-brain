# Global Coding Standards

## General Preferences
- **Language**: TypeScript > JavaScript when possible
- **Style**: Prettier for formatting, ESLint for linting
- **Testing**: Jest for unit tests, Cypress for E2E
- **Documentation**: JSDoc for functions, README for modules

## Code Organization
- Prefer functional programming patterns
- Use descriptive variable and function names
- Keep functions small and focused on one responsibility
- Use TypeScript interfaces for type safety

## Git Workflow
- Feature branch workflow
- Descriptive commit messages
- Pull requests for code review
- Semantic versioning

## Performance Guidelines
- Optimize for readability first, then performance
- Use lazy loading for large dependencies
- Implement proper error handling
- Consider accessibility requirements

## Security Practices
- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Implement proper authentication and authorization
- Keep dependencies updated regularly