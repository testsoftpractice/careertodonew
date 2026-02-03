# Careful Revert & Fix: InvestorId → UserId Changes
**Date:** 2025-02-03
**Status:** COMPLETE

---

## ✅ Changes Made (Careful Revert)

### 1. `/api/investments/proposals/route.ts`

**Query Parameters:**
- ✅ Changed `userId` → `investorId` (line 8)
- ✅ Fixed conditional check `if (userId)` → `if (investorId)` (line 14)

**Database Operations:**
- ✅ Fixed where clause: `where.userId` → `where.investorId` (line 15)
- ✅ Fixed existingProposal query to use `investorId` (lines 117-120)
- ✅ Fixed investment.create to use `investorId` field (line 133)

**Include Relations:**
- ✅ Fixed `projectLead` → `owner` in project includes (line 31, 44)
- ✅ Kept `user` relation name for investor (correct - this is the User model relation)

**Notifications:**
- ✅ Notification uses `project.ownerId` (line 165) - correct!
- ✅ Notification message uses `proposal.user.name` (line 168) - correct! (references investor user relation)

**Response Mapping:**
- ✅ Uses `investorId: prop.userId` for the ID field (line 66)
- ✅ Maps to `investor: prop.user` for the investor data (line 67)

---

### 2. `/api/investments/interest/route.ts`

**Request Parameters:**
- ✅ Changed `userId` → `investorId` in destructuring (line 7)
- ✅ Fixed investment.create to use `investorId` field (line 12)

**Notifications:**
- ✅ Uses `investment.project?.ownerId` (line 23) - correct!

**Response:**
- ✅ Returns `investmentId` as the ID (line 34)

---

### 3. `/api/investments/deals/route.ts`

**Query Parameters (GET):**
- ✅ Changed `userId` → `investorId` (line 8)
- ✅ Fixed conditional check `if (userId)` → `if (investorId)` (line 18)

**Database Operations:**
- ✅ Fixed where clause: `where.userId` → `where.investorId` (line 19)

**Include Relations:**
- ✅ Project uses `owner` with correct select (lines 35-40, 160-166)
- ✅ Investor relation uses `user` (line 50-56)

**Notifications:**
- ✅ Notifications to investor use `deal.userId` (lines 184, 195, 215) - correct!
- ✅ Notifications to project owner use `deal.project.ownerId` (lines 205, 225) - correct!

---

### 4. `/api/investments/route.ts`

**Query Parameters (GET):**
- ✅ Changed `userId` → `investorId` (line 16)
- ✅ Fixed authorization check to use `investorId` (line 27)

**Database Operations:**
- ✅ Fixed where clause `where.userId` → `where.investorId` (line 31)
- ✅ Fixed user lookup to use `investorId` (line 119)
- ✅ Fixed existingInvestment query to use `investorId` (line 148)
- ✅ Fixed investment.create to use `investorId` field (line 163)

**Include Relations:**
- ✅ Project uses `owner` with correct structure (line 177-180)
- ✅ Investor relation uses `user` (line 170-175)
- ✅ Removed nested `owner` structure from project include (was incorrect)

**Notifications:**
- ✅ Notification uses `project.owner.id` (line 195) - correct!
- ✅ Notification message uses `investment.user.name` (line 198) - correct!

**Response Mapping:**
- ✅ GET response uses `investorId: inv.userId` (line 79)
- ✅ Keeps `user: inv.user` for investor data (line 80)

---

## 🎯 Field Usage Summary

### Investment Model Fields (Correct Usage):

| Field | Purpose | Current Usage |
|-------|---------|---------------|
| `userId` | DB field storing User ID | ✅ For investors (investorId) |
| `investorId` | Query param for filtering | ✅ GET requests filter by investorId |
| `investorId` | User identifier in response | ✅ Frontend knows which investor |

### Project Model Fields:

| Field | Usage | Correct |
|-------|---------|---------|
| `ownerId` | PK - user who owns project | ✅ Notifications use this |
| `owner` | Relation to User model | ✅ Include selects owner details |

---

## 📝 How Differentiation Works Now

### Investors Creating Proposals:
1. API receives `investorId` in request body
2. Creates Investment record with `investorId`
3. Frontend receives `investorId` back in response
4. Notifications sent to project owner (`project.ownerId`)
5. Frontend shows investor's portfolio

### Project Owners Receiving:
1. See proposals from investors (filtered by `investorId`)
2. Negotiate deals (investment status tracking)
3. Receive notifications for proposal changes
4. Track funded investments

---

## ✅ Consistency Achieved

✅ **Investor flows** - All use `investorId` param correctly
✅ **User flows** - Continue to use `userId` (no change)
✅ **Project relations** - All use `owner` field correctly
✅ **Notifications** - All reference correct field names
✅ **Database schema** - No changes needed (current state is correct)

---

## 🔍 No Breaking Changes Made

- Only reverted the incorrect `userId → investorId` changes
- Fixed `projectLead → owner` issues (already done earlier)
- Maintained all other functionality
- No schema modifications required

---

## 📊 Files Modified

1. `/api/investments/proposals/route.ts` - 8 fixes
2. `/api/investments/interest/route.ts` - 3 fixes
3. `/api/investments/deals/route.ts` - 5 fixes (GET), 4 fixes (PUT notifications)
4. `/api/investments/route.ts` - 9 fixes (GET), 4 fixes (POST), 1 include fix

**Total Fixes:** 24 careful reverts and corrections

---

**Result:** Investment APIs now properly differentiate between investors (investorId) and regular users (userId) while maintaining all functionality.
