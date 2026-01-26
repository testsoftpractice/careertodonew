# Runtime Error Fix - SelectItem Empty Value

## Error Description
**Runtime Error:** "A <Select.Item /> must have a value prop that is not an empty string."

**Root Cause:**
The shadcn/ui Select component doesn't allow empty string values in SelectItem components. This is a common pattern for showing "no selection" options but needs to be handled differently.

## Location
**File:** `src/components/task/TaskFormDialog.tsx`
**Line:** 428
**Code:**
```tsx
<SelectItem value="">No project</SelectItem>
```

## Solution
Changed the empty string value to use "none" instead, and handle the conversion in the parent Select component.

### Changes Made:
```tsx
// Before:
<Select
  value={formData.projectId}
  onValueChange={(value) => handleChange('projectId', value)}
>
  <SelectTrigger id="project">
    <SelectValue placeholder="No project selected" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="">No project</SelectItem>  // ❌ Empty string not allowed
    {projects.map((project) => (
      <SelectItem key={project.id} value={project.id}>
        {project.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

// After:
<Select
  value={formData.projectId || 'none'}  // ✅ Use 'none' as default
  onValueChange={(value) => handleChange('projectId', value === 'none' ? '' : value)}  // ✅ Convert back to empty string
>
  <SelectTrigger id="project">
    <SelectValue placeholder="No project selected" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="none">No project</SelectItem>  // ✅ Use 'none' instead of empty string
    {projects.map((project) => (
      <SelectItem key={project.id} value={project.id}>
        {project.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

## How It Works
1. **Default State:** When `formData.projectId` is empty, the Select shows value 'none'
2. **Selection:** User selects "No project" → value is 'none'
3. **Conversion:** In `onValueChange`, when value is 'none', convert it back to empty string ''
4. **Result:** The component behavior remains the same, but satisfies the SelectItem constraint

## Verification
✅ ESLint: No warnings or errors
✅ Functionality: User can still select "No project" option
✅ Data flow: Empty string is still stored in formData when "No project" is selected

## Alternative Solutions (Not Chosen)
- Remove "No project" option entirely (would reduce UX)
- Use a special ID like "none-project-id" (adds complexity)
- Use separate radio button for project selection (changes UI pattern)

The chosen solution maintains existing UX while fixing the runtime error.
