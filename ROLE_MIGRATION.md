# Role System Migration: Operator to User Flag

This document tracks the migration from a role-based operator system to a flag-based system where operators are users with additional privileges.

## Summary of Changes

### Before
- Roles: `superadmin`, `admin`, `operator`, `user`
- Operators were a separate role entirely
- Navigation was role-specific

### After
- Roles: `superadmin`, `admin`, `user`
- Operators are users with `is_operator: true` flag
- Users with operator privileges see both user and operator navigation

## API Response Structure

The new API response from `verify-otp` includes:

```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": 19,
      "user_role": "user",
      // ... other user fields
    },
    "is_operator": true,
    "operator_states": {
      "state_title": "Perak",
      "state_code": "PRK",
      "state_flag": "https://example.com/flag.png"
    },
    "access_token": "..."
  }
}
```

## Files Modified

### Core Types & Authentication
- `src/types/auth.ts` - Updated UserRole type, added is_operator and operator_states fields
- `src/stores/auth.ts` - Added isOperator computed property and updated permission handling
- `src/stores/navigation.ts` - Modified to show combined navigation for operators

### Router & Routes
- `src/router/index.ts` - Updated role checking logic for operator routes
- `src/router/routes/operator-routes.ts` - Changed role requirements from "operator" to "user"
- `src/router/routes/common-routes.ts` - Removed operator from allowed roles

### UI Components
- `src/layouts/dashboard.vue` - Updated role display logic and added ViewSwitcher
- `src/components/ViewSwitcher.vue` - New component for switching between user/operator views

### Pages
- `src/pages/verify-otp.vue` - Updated to handle new response structure
- `src/pages/login.vue` - Removed operator redirect logic
- `src/pages/index.vue` - Updated routing logic
- `src/pages/not-found.vue` - Updated redirect logic

### Other
- `src/constants/example-users.ts` - Updated to use new structure

## Key Features

### ViewSwitcher Component
- Appears in sidebar header for users with operator privileges
- Allows switching between User and Operator views
- Shows current view with appropriate icons and descriptions

### Navigation Behavior
- Regular users: See only user navigation
- Users with operator privileges: See both user and operator navigation sections
- Navigation updates dynamically based on is_operator flag

### Route Protection
- Operator routes now require user role + is_operator flag
- Users without operator privileges are redirected to their appropriate dashboard
- Maintains backward compatibility with existing user routes

## Testing Checklist

- [ ] Regular user login shows only user navigation
- [ ] User with is_operator: true shows both navigation sections
- [ ] ViewSwitcher appears only for users with operator privileges
- [ ] Route protection works correctly for operator routes
- [ ] Role display in sidebar shows correct information
- [ ] Build completes without TypeScript errors ✅

## Migration Benefits

1. **Simplified Role Management**: One less role to manage
2. **Flexible Permissions**: Users can have operator privileges without changing their base role
3. **Better UX**: Users with operator privileges can easily switch between views
4. **Maintainability**: Reduced complexity in role-based logic
5. **Scalability**: Easy to add more flags for different privileges in the future 