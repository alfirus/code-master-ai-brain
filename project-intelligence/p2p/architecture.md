# P2P Cryptocurrency Exchange - Project Intelligence

## Project Overview
- **Name:** P2P USDT↔MYR Exchange Platform
- **Tech Stack:** Next.js 16 (App Router), TypeScript, MongoDB, BSC (Binance Smart Chain)
- **Status:** Active Development - P0 Complete, P1 In Progress (60% complete)
- **Repository:** ~/Desktop/ebase.work/source codes/p2p

## Architecture

### Frontend (Next.js 16 App Router)
- **Design System:** Tailwind CSS + shadcn/ui components
- **Mobile First:** Breakpoints 375px-1536px with 44px touch targets
- **State Management:** React hooks (useState, useContext)
- **Real-time Updates:** 5-second polling (chat, trades, ads)

### Backend (Next.js API Routes)
- **Database:** MongoDB with Mongoose ORM
- **File Storage:** MongoDB GridFS (no S3/Cloudinary)
- **Blockchain:** ethers.js for BSC USDT listener
- **Exchange Rates:** CoinGecko API with 60s client-side caching
- **Authentication:** Custom JWT (no NextAuth.js)

### Key Models
- **User:** Auth, KYC status, wallet balances, security settings
- **Trade:** State machine (pending→escrowed→payment_confirmed→completed|cancelled|disputed|expired)
- **Advertisement:** Buy/sell ads with price settings and payment methods
- **Wallet:** USDT/MYR balances with locked/available separation
- **Transaction:** Audit log for all balance changes
- **AdminFees:** Deposit fees and trade completion fees

## Completed Features (P0 & P1)

### P0 (All Complete - 14 Sections)
✅ Agent Framework, Project Foundation, Mobile-first baseline, Environment setup
✅ Custom auth (no NextAuth), File upload (GridFS), Wallet models
✅ KYC gate, BSC listener, USDT fee deduction, Bilateral escrow
✅ Fee on trade completion, Dispute double-compensation, Security controls

### P1 (60% Complete - 3 of 5 Sections)
✅ **Ads with KYC enforcement** - Full implementation
  - CoinGecko integration with margin-based pricing
  - 6 API routes (list, create, get, update, delete, my-ads)
  - Real-time exchange rate caching
  
✅ **Trade UX** - Fully implemented
  - Trade detail page with chat, timeline, payment proof
  - 5 trade actions: confirm_payment, release_usdt, confirm_receipt, cancel, dispute
  - Payment proof upload via GridFS
  - Trades listing page with status filters

## In Progress - P1 Remaining (40%)
- [ ] Wallet UX (deposits, withdrawals, transaction history, locked balance display)
- [ ] Admin dashboards (KYC review, deposit monitoring, user management, disputes, stats)
- [ ] Notifications (email/SMS/in-app for deposits, trades, disputes, bans)
- [ ] Payment methods (CRUD bank accounts, e-wallets, verification)
- [ ] User reputation system (ratings, completion rate, trade limits based on reputation)

## Critical Code Patterns

### API Route Structure
```typescript
// 1. Verify auth → 2. Find resource → 3. Check access → 4. Perform action → 5. Save → 6. Return
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const authResult = await verifyAuth(request); // Always first
  const resource = await Model.findById(params.id); // Then find
  if (resource.userId.toString() !== authResult.user!._id.toString()) return 403; // Then check access
  // Perform action
  await resource.save();
  return NextResponse.json({ success: true, data: resource });
}
```

### State Management
- Use `useState` for form inputs, loading states, error messages
- Use `useEffect` for initial data fetching and polling
- Use `useRef` for DOM references (chat scrolling, file inputs)
- Refetch after mutations (not websockets, just polling)

### UI Patterns
- Status badges with color mapping: `TRADE_STATUS_COLORS[status]`
- Loading states: `disabled={loading}`, `{loading ? 'Processing...' : 'Button'}`
- Error cards: Red-bordered Card component with error message
- Mobile-first card layout: Stack on mobile, grid on desktop

### Trade State Transitions
- `pending` → user creates trade from ad
- `escrowed` → seller locks USDT, buyer locks MYR
- `payment_confirmed` → buyer uploads proof + confirms payment
- `completed` → seller releases USDT to buyer (fee deducted)
- `cancelled` → either party cancels (refunds escrow if locked)
- `disputed` → either party opens dispute with reason
- `expired` → trade expires after timeLimit (24 hours default)

## File Organization
```
web/
├── app/
│   ├── api/ (API routes)
│   │   ├── auth/ (login, register, verify-email)
│   │   ├── wallet/ (trades, transactions, limits)
│   │   ├── ads/ (CRUD, filters)
│   │   ├── kyc/ (upload, review)
│   │   └── admin/ (user management, disputes)
│   ├── auth/, kyc/, wallet/, trade/, ads/ (Pages)
│   └── components/ (UI components)
├── lib/ (Business logic)
│   ├── auth.ts (JWT, verification)
│   ├── db.ts (MongoDB connection)
│   ├── wallet-service.ts (balance management)
│   ├── exchange-rate.ts (CoinGecko integration)
│   ├── bsc-listener.ts (blockchain monitoring)
│   └── fee-calculator.ts
├── models/ (Mongoose schemas)
└── types/ (TypeScript interfaces)
```

## Common Issues & Solutions

### Problem: File upload fails
- **Solution:** Check GridFS is connected (storeFile function), verify file size < 10MB, ensure Content-Type header is correct

### Problem: Trade state stuck
- **Solution:** Check timeline entries exist, verify balance locking/unlocking in action handlers, check dispute status

### Problem: Real-time chat delayed
- **Solution:** Current implementation uses 5s polling (not websockets). For instant chat, consider Socket.io later in P2

### Problem: Exchange rate stale
- **Solution:** CoinGecko cache is 60s client-side. Clear cache or wait for refetch interval

## Next Steps Priority
1. **P1: Wallet UX** - Users need deposit/withdrawal flows (highest friction point)
2. **P1: Admin dashboards** - Platform needs KYC review queue + dispute resolution
3. **P1: Notifications** - Users won't notice trade events without notifications
4. **P1: Payment methods** - Users need to configure bank/e-wallet details
5. **P1: Reputation system** - Trust mechanism critical for peer-to-peer trading

## Performance Notes
- Polling interval: 5 seconds (trades, chat, ads)
- Exchange rate cache: 60 seconds client-side
- MongoDB indexes needed on: userId, status, createdAt, expiresAt
- GridFS for files: Use mongod with GridFS enabled

## Security Checklist
- ✅ JWT auth with verifyAuth middleware
- ✅ KYC enforcement on ad creation + trade initiation
- ✅ Rate limiting (implicit via polling delays)
- ✅ Access control (buyer/seller role checks)
- ✅ Brute-force protection on login (in User model)
- ✅ File validation (type, size) on upload
- ⏳ CSRF protection (implement in P2)
- ⏳ Input sanitization (use Zod validation, which is done)

## Metrics to Track
- Active trades (by status)
- Average trade completion time
- Dispute rate (should be < 5%)
- Fee revenue (track in AdminFees)
- User KYC completion rate
- Escrow amount locked (TVL indicator)

## Session Log
- **Last Session:** January 28, 2026
- **Completed:** P1 Trade UX (all 10 subtasks)
- **Files Created:** 7 new routes + 1 new page
- **Next Session Focus:** P1 Wallet UX (deposits, withdrawals, balance display)
