# P2P Project - Code Patterns & Solutions

## Authentication Flow (Custom JWT)

### Pattern: Always Verify First
```typescript
const authResult = await verifyAuth(request);
if (!authResult.authenticated) {
  return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
}
const userId = authResult.user!._id;
```

### Pattern: Role-Based Access Control
```typescript
const isBuyer = trade.buyerId.toString() === userId.toString();
const isSeller = trade.sellerId.toString() === userId.toString();

if (!isBuyer && !isSeller) {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
}
```

## Trade State Machine

### Valid Transitions
```
pending → escrowed (when seller locks USDT)
escrowed → payment_confirmed (when buyer uploads proof + confirms)
payment_confirmed → completed (when seller releases USDT)
payment_confirmed → disputed (when either party opens dispute)
pending/escrowed/payment_confirmed → cancelled (mutual or unilateral)
Any state → expired (if timeLimit exceeded)
```

### Implementation Pattern
```typescript
switch (action) {
  case 'confirm_payment':
    if (trade.status !== 'escrowed') throw Error('Invalid state');
    // Validate payment proof exists
    if (!trade.paymentProof?.fileUrl) throw Error('Payment proof required');
    trade.status = 'payment_confirmed';
    trade.timeline.push({ status: 'payment_confirmed', timestamp: new Date(), ... });
    break;
}
```

## Balance Management

### Lock/Unlock Pattern
```typescript
// Lock balance when escrow starts
user.wallet.lockedBalance += amount;
user.wallet.available -= amount;

// Unlock if cancelled
user.wallet.lockedBalance -= amount;
user.wallet.available += amount;

// Deduct if released
user.wallet.lockedBalance -= amount;
// (money transfers to other party, not back to sender)
```

## API Response Pattern
Always use this structure:
```typescript
return NextResponse.json({
  success: true,
  data: resource,
  message?: 'Human readable message'
});

// Error response
return NextResponse.json(
  { success: false, error: 'Error message' },
  { status: 400 | 401 | 403 | 404 | 500 }
);
```

## File Upload Pattern (GridFS)
```typescript
const formData = await request.formData();
const file = formData.get('file') as File;
const buffer = await file.arrayBuffer();
const fileUrl = await storeFile(
  Buffer.from(buffer),
  file.name,
  `trade_${tradeId}_payment_proof`,
  file.type
);
```

## Real-Time Data Pattern (5s Polling)
```typescript
useEffect(() => {
  const fetchData = async () => { /* ... */ };
  fetchData();
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
}, []);
```

## Form Validation Pattern (Zod)
```typescript
const schema = z.object({
  action: z.enum(['confirm_payment', 'release_usdt']),
  amount: z.number().positive(),
});
const validated = schema.parse(req.body);
```

## Error Handling Pattern
```typescript
try {
  // Operation
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { success: false, error: 'Invalid request', details: error.errors },
      { status: 400 }
    );
  }
  console.error('Operation error:', error);
  return NextResponse.json(
    { success: false, error: 'Operation failed' },
    { status: 500 }
  );
}
```

## Conditional Rendering Pattern
```typescript
{isBuyer && trade.status === 'escrowed' && (
  <Button onClick={() => handleAction('confirm_payment')}>Mark as Paid</Button>
)}

{isSeller && trade.status === 'payment_confirmed' && (
  <Button onClick={() => handleAction('release_usdt')}>Release USDT</Button>
)}
```

## Loading State Pattern
```typescript
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  try {
    setLoading(true);
    // ... operation
  } finally {
    setLoading(false);
  }
};

<Button disabled={loading}>{loading ? 'Processing...' : 'Action'}</Button>
```

## Chat Auto-Scroll Pattern
```typescript
const chatEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);

// In render
<div ref={chatEndRef} />
```

## Status Color Mapping
```typescript
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  escrowed: 'bg-blue-100 text-blue-700',
  payment_confirmed: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  disputed: 'bg-orange-100 text-orange-700',
  expired: 'bg-slate-100 text-slate-700',
};

<span className={STATUS_COLORS[trade.status]}>{status}</span>
```

## Countdown Timer Pattern
```typescript
useEffect(() => {
  if (!trade || trade.status !== 'pending') return;

  const updateTimer = () => {
    const remaining = Math.max(0, new Date(trade.expiresAt).getTime() - Date.now());
    setTimeRemaining(remaining);
  };

  updateTimer();
  const interval = setInterval(updateTimer, 1000);
  return () => clearInterval(interval);
}, [trade]);
```

## Database Connection Pattern
```typescript
import { connectDB } from '@/lib/db';

export async function GET(request) {
  try {
    await connectDB();
    // ... MongoDB operations
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
```

## Response Refetch Pattern (After Mutation)
```typescript
const handleAction = async () => {
  const res = await fetch('/api/endpoint', { method: 'POST', body: ... });
  if (res.ok) {
    // Refetch to get updated data
    const refreshRes = await fetch('/api/trade/123');
    const refreshData = await refreshRes.json();
    setTrade(refreshData.data);
  }
};
```

## Pagination Pattern
```typescript
const [page, setPage] = useState(1);
const itemsPerPage = 10;

const paginatedResults = results.slice((page - 1) * itemsPerPage, page * itemsPerPage);
const totalPages = Math.ceil(results.length / itemsPerPage);
```

## Filter State Management Pattern
```typescript
const [filters, setFilters] = useState({
  priceMin: 0,
  priceMax: 10,
  paymentMethod: 'all',
  location: '',
});

const filtered = ads.filter(ad => 
  ad.price >= filters.priceMin &&
  ad.price <= filters.priceMax &&
  (filters.paymentMethod === 'all' || ad.paymentMethod === filters.paymentMethod)
);
```

## Mobile-First Responsive Pattern
```typescript
// Tailwind: Mobile first, then breakpoints
<div className="flex flex-col sm:flex-row gap-4">
  <div className="w-full sm:w-1/2"> {/* Mobile full-width, desktop half */}
  <button className="px-4 py-2 sm:px-6 sm:py-3"> {/* Smaller on mobile */}
</div>

// For touch targets
<button className="min-h-[44px] min-w-[44px]"> {/* Always at least 44x44px */}
```

## Common Bugs to Avoid
1. **Forgetting access control** - Always check `userId` against resource owner
2. **Not refetching after mutation** - Users see stale data if you don't refetch
3. **Infinite loops** - Always cleanup timers with `return () => clearInterval()`
4. **Memory leaks** - Always return cleanup functions from useEffect
5. **Race conditions** - Use loading state to prevent double-clicks
6. **Type safety** - Use `toString()` when comparing MongoDB ObjectIds
7. **Missing error handling** - Always wrap async operations in try-catch
8. **Hardcoding URLs** - Use environment variables for API endpoints
