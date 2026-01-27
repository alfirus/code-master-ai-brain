# Pattern Recognition Engine

## Automatic Pattern Detection

### Code Patterns I Watch For

#### Your Coding Patterns
- **Naming Conventions**: camelCase vs snake_case preferences
- **Function Structure**: Arrow functions vs function declarations
- **Error Handling**: Try/catch patterns vs error boundaries
- **Component Structure**: Functional components with hooks
- **State Management**: Zustand patterns vs Redux patterns

#### Problem-Solving Patterns
- **Debugging Approach**: Console.log debugging vs debugger
- **Testing Strategy**: Unit first vs TDD approach
- **Refactoring Style**: Incremental vs rewrite approach
- **Optimization Priority**: Readability vs performance first

#### Workflow Patterns
- **Git Commit Style**: Conventional commits vs descriptive
- **Development Order**: API first vs UI first
- **Documentation Timing**: Inline docs vs separate documentation

## Pattern Optimization Suggestions

### Performance Patterns
```javascript
// When I detect this pattern:
const expensiveList = useMemo(() => {
  return items.map(item => heavyComputation(item));
}, [items]);

// I'll suggest optimizations if items changes frequently
const expensiveList = useMemo(() => {
  return items.map(item => heavyComputation(item));
}, [items.length, items[0]?.id]); // More specific dependencies
```

### Code Organization Patterns
```typescript
// When I see repeated API call patterns:
// I'll suggest extracting to custom hook
const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // ... consistent pattern you like
};
```

### Anti-Pattern Detection
```javascript
// When I detect potential issues:
// ❌ Direct mutation
state.user.name = 'new name';

// I'll suggest your preferred pattern:
// ✅ Immutable update
setState(prev => ({
  ...prev,
  user: { ...prev.user, name: 'new name' }
}));
```

## Learning Your Preferences

### Technology Selection Patterns
- **Frontend**: React > Vue > Angular (based on your projects)
- **Styling**: Tailwind > CSS Modules > Styled Components
- **Backend**: Node.js > Python > Go for web APIs
- **Database**: PostgreSQL > MongoDB > SQLite

### Architecture Patterns
- **Small Projects**: Monolith with clear module boundaries
- **Medium Projects**: Service-oriented architecture
- **Large Projects**: Microservices with shared contracts

### Testing Patterns
- **React**: Jest + React Testing Library for components
- **API**: Supertest for endpoint testing
- **E2E**: Cypress for critical user flows
- **Integration**: Custom test utilities for complex scenarios

## Pattern Library

### Reusable Code Patterns
```typescript
// API Service Pattern (Based on your preferences)
export class ApiService {
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      if (!response.ok) {
        throw new ApiError(response.statusText, response.status);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Network error: ${error.message}`);
    }
  }
  
  // Consistent error handling pattern you prefer
}
```

```typescript
// React Component Pattern (Your style)
interface ComponentProps {
  data: UserData;
  onUpdate: (data: UserData) => void;
}

export const UserProfile: React.FC<ComponentProps> = ({ 
  data, 
  onUpdate 
}) => {
  // Your preferred state management
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data);
  
  // Your event handling pattern
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  }, [formData, onUpdate]);
  
  // Your component structure
  return (
    <form onSubmit={handleSubmit}>
      {/* Your preferred JSX patterns */}
    </form>
  );
};
```

## Pattern Evolution Tracking

### What I Track
1. **Repeated Solutions**: Code patterns you use multiple times
2. **Successful Approaches**: Solutions that work well for your problems
3. **Failed Attempts**: Approaches that don't work and why
4. **Preference Shifts**: How your coding style evolves

### How I Use This Data
1. **Proactive Suggestions**: Offer patterns before you ask
2. **Style Matching**: Write code that matches your style
3. **Technology Recommendations**: Suggest tools that fit your patterns
4. **Problem Solving**: Use approaches that have worked for you

## Pattern Categories

### Architectural Patterns
- **Layer Architecture**: Your preferred separation of concerns
- **Data Flow**: How you like state to flow through applications
- **Error Boundaries**: Your error handling strategies

### Implementation Patterns
- **Async Operations**: Promises, async/await, observable patterns
- **Data Transformation**: Your data mapping and processing approaches
- **Component Composition**: How you structure React components

### Development Patterns
- **File Organization**: Your preferred directory structures
- **Naming Conventions**: How you name files, variables, functions
- **Documentation**: When and how you add comments and docs

## Pattern Alerts

### Before You Code
"Based on similar problems, you might want to consider the [pattern] that worked well in [project]"

### While You Code  
"I notice you're using [anti-pattern]. In the past, [alternative] has worked better for this type of issue"

### After You Code
"This solution is similar to what worked in [project]. Consider [optimization] that helped there"

---

*This engine continuously learns from your code and becomes more personalized with every interaction.*