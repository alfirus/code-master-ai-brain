# Common Patterns & Templates

## React Patterns
```typescript
// Custom Hook Pattern
const useApi = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchData();
  }, [url]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return { data, loading, error };
};
```

## Node.js API Pattern
```typescript
// Express Route Handler
export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Business logic
    const user = await userService.createUser({ email, password });
    
    // Response
    res.status(201).json({
      success: true,
      data: { id: user.id, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## Database Pattern
```typescript
// Repository Pattern
export class UserRepository {
  constructor(private db: Database) {}
  
  async findById(id: string): Promise<User | null> {
    const result = await this.db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }
  
  async create(data: CreateUserData): Promise<User> {
    const result = await this.db.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
      [data.email, data.passwordHash]
    );
    return result.rows[0];
  }
}
```

## Error Handling Pattern
```typescript
// Custom Error Classes
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Usage
if (!user) {
  throw new AppError('User not found', 404, 'USER_NOT_FOUND');
}
```

## Testing Pattern
```typescript
// Unit Test Example
describe('UserService', () => {
  let userService: UserService;
  let mockDb: jest.Mocked<Database>;
  
  beforeEach(() => {
    mockDb = {
      query: jest.fn()
    } as any;
    userService = new UserService(mockDb);
  });
  
  it('should create user successfully', async () => {
    const userData = { email: 'test@example.com', password: 'password123' };
    const expectedUser = { id: '1', email: userData.email };
    
    mockDb.query.mockResolvedValue({ rows: [expectedUser] });
    
    const result = await userService.createUser(userData);
    
    expect(result).toEqual(expectedUser);
    expect(mockDb.query).toHaveBeenCalledWith(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
      [userData.email, expect.any(String)]
    );
  });
});
```