# Quick Fix: Database Reset with Seed

## The Issue
Running `npm run db:reset` fails because there are no migrations to re-create the tables.

## Immediate Solution

Run these commands in sequence in your terminal at `D:\new project\careertodonew`:

```powershell
# Step 1: Create the initial migration
npx prisma migrate dev --name init

# Step 2: Reset and seed
npm run db:reset
```

## Alternative: If Step 2 Still Fails

```powershell
# Step 1: Clear database
npx prisma migrate reset --force --skip-seed

# Step 2: Push schema to create tables
npx prisma db push

# Step 3: Run seed
npx tsx prisma/seed.ts
```

## What This Does

1. **`npx prisma migrate dev --name init`**
   - Creates your first migration file
   - Applies it to your Supabase database
   - Creates all tables defined in schema.prisma

2. **`npx prisma migrate reset --force`**
   - Drops all tables
   - Re-runs the migration (recreates tables)
   - Runs the seed command

## Expected Output

After running these commands, you should see:

```
🌱 Starting comprehensive database seeding...
🗑️  Cleaning existing data...
✅ Existing data cleared
📚 Creating universities...
✅ Created 5 universities
👥 Creating users...
✅ Created 14 users
...
✅ Seeding completed successfully!
```

## Verification

```powershell
# Open Prisma Studio to verify data
npx prisma studio
```

This will open http://localhost:5555 where you can browse all your data.

## For Future Resets

After creating the initial migration once, you can use:

```powershell
npm run db:reset
```

This will work correctly going forward.

## Note

The seed file has been renamed from `seed-comprehensive.ts` to `seed.ts`, so you can now use:
- `npm run db:seed` (uses seed.ts)
- `npx tsx prisma/seed.ts` (direct execution)
