# Component Data Flow & Architecture Diagram

## Visual Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────┐
│  admin-settings/page.tsx (Parent Container)                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │ PageHeader                                               │       │
│  │ • Search functionality                                   │       │
│  │ • Notifications count                                   │       │
│  │ • User profile display                                  │       │
│  │ Dependencies: /api/notifications/count, /api/user...   │       │
│  └──────────────────────────────────────────────────────────┘       │
│                                                                       │
│  ┌──────────────────────┬──────────────────────────────────┐       │
│  │ SIDEBAR              │ CONTENT AREA                     │       │
│  ├──────────────────────┼──────────────────────────────────┤       │
│  │ • General            │ ┌────────────────────────────┐   │       │
│  │ • Users & Roles ──┬──→ │ GeneralSettings            │   │       │
│  │ • Payments ────┬──→ │ RolesAndPermissions       │   │       │
│  │ • Agreements ──┬──→ │ PaymentsAndFinance        │   │       │
│  │ • Vehicles ────┬──→ │ AgreementsAndRentals      │   │       │
│  │ • Notifications┬──→ │ VehiclesAndCompliance     │   │       │
│  │ • Reports ─────┬──→ │ NotificationSettings      │   │       │
│  │ • Integrations─┬──→ │ ReportsAndData            │   │       │
│  │ • System ──────┬──→ │ Integrations              │   │       │
│  │                │    │ SystemSettings            │   │       │
│  │                │    └────────────────────────────┘   │       │
│  └──────────────────────┴──────────────────────────────────┘       │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│  User Interaction (Settings Changes)                                 │
└────────┬─────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────┐
│  Component State Update (Local State)                                │
│  • Toggle switches                                                    │
│  • Form input changes                                                │
│  • Dropdown selections                                               │
└────────┬─────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────┐
│  Save/Submit Action                                                  │
└────────┬─────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────┐
│  API Call (POST/PUT)                                                │
│  PUT /api/admin/{category}/{setting}                                │
│  Request Body: { key: value, ... }                                  │
└────────┬─────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────┐
│  Backend Processing                                                  │
│  1. Validate input                                                   │
│  2. Check authorization/RBAC                                        │
│  3. Update database                                                 │
│  4. Trigger events/jobs if needed                                   │
│  5. Return updated config                                           │
└────────┬─────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────────────┐
│  Frontend Response Handling                                          │
│  • Display success message                                          │
│  • Update local state                                               │
│  • Refresh data if needed                                           │
└──────────────────────────────────────────────────────────────────────┘
```

## Component-to-API Mapping

### 1. GeneralSettings
```
Local State:
  maintenanceMode ────────────────────→ Settings DB
  newUserReg ─────────────────────────→ Settings DB
  twoFactorAuth ──────────────────────→ Settings DB
  ipWhitelisting ─────────────────────→ Settings DB
  rbac ───────────────────────────────→ Settings DB

API Calls:
  - GET /api/admin/settings/general → Load initial state
  - PUT /api/admin/settings/general → Save changes
  - PUT /api/admin/settings/security → Save security settings
  - POST /api/admin/settings/validate/stripe-disable → Validation
```

### 2. RolesAndPermissions
```
Local State:
  roles[] ─────────────────────────────→ Roles DB
  selectedRole ───────────────────────→ UI selection
  permissions[] ──────────────────────→ Permissions DB

API Calls:
  - GET /api/admin/roles → Load roles list
  - GET /api/admin/permissions → Load permissions
  - POST /api/admin/roles → Create new role
  - PUT /api/admin/roles/:id → Update role
  - DELETE /api/admin/roles/:id → Delete role
  - POST /api/admin/roles/:id/permissions → Assign permissions
  - DELETE /api/admin/roles/:id/permissions/:permId → Remove permissions
```

### 3. PaymentsAndFinance
```
Local State:
  paymentMethods[] ───────────────────→ PaymentMethod DB
  commissionRate ─────────────────────→ Settings DB
  fees {} ────────────────────────────→ Settings DB

API Calls:
  - GET /api/admin/payments/methods → Load payment methods
  - PUT /api/admin/payments/methods/:id → Toggle method
  - GET /api/admin/payments/settings → Load rates/fees
  - PUT /api/admin/payments/settings → Save rates/fees
  - POST /api/admin/payments/gateway-config/:gateway/test → Test gateway
```

### 4. AgreementsAndRentals
```
Local State:
  agreementSettings {} ───────────────→ Settings DB
  rentalRules {} ─────────────────────→ Settings DB

API Calls:
  - GET /api/admin/agreements/settings → Load agreement config
  - PUT /api/admin/agreements/settings → Save agreement config
  - GET /api/admin/agreements/templates → Load templates
  - GET /api/admin/rentals/rules → Load rental rules
  - PUT /api/admin/rentals/rules → Save rental rules
```

### 5. VehiclesAndCompliance
```
Local State:
  vehicleApprovalRules {} ────────────→ Settings DB
  complianceSettings {} ──────────────→ Settings DB
  scoreThreshold (80) ────────────────→ Settings DB

API Calls:
  - GET /api/admin/vehicles/approval-rules → Load approval config
  - PUT /api/admin/vehicles/approval-rules → Save approval config
  - GET /api/admin/vehicles/compliance-settings → Load compliance config
  - GET /api/admin/vehicles/insurance-config → Load insurance config
  - GET /api/admin/compliance/score-thresholds → Load thresholds
  - GET /api/admin/compliance/reports → Load reports (when navigating)
```

### 6. NotificationSettings
```
Local State:
  templates[] ────────────────────────→ NotificationTemplate DB
  channels {} ────────────────────────→ Settings DB
  providers {} ───────────────────────→ Settings DB
  schedules {} ───────────────────────→ Settings DB

API Calls:
  - GET /api/admin/notifications/templates → Load templates
  - POST /api/admin/notifications/templates → Create template
  - PUT /api/admin/notifications/templates/:id → Update template
  - DELETE /api/admin/notifications/templates/:id → Delete template
  - GET /api/admin/notifications/events → Load events
  - GET /api/admin/notifications/channels → Load channels
  - GET /api/admin/notifications/providers → Load providers
  - POST /api/admin/notifications/test → Test notification
```

### 7. ReportsAndData
```
Local State:
  exportSettings {} ──────────────────→ Settings DB
  dataScopes {} ──────────────────────→ Settings DB
  retentionPolicies {} ───────────────→ Settings DB
  reportSchedules {} ─────────────────→ ScheduledJob DB

API Calls:
  - GET /api/admin/reports/configuration → Load report config
  - PUT /api/admin/reports/configuration → Save report config
  - GET /api/admin/reports/available → Load available reports
  - POST /api/admin/reports/create → Create new report
  - GET /api/admin/data/retention-policies → Load retention config
  - PUT /api/admin/data/retention-policies → Save retention config
  - GET /api/admin/exports/history → Load export history
```

### 8. Integrations
```
Local State:
  form.stripeEnabled ────────────────→ Settings DB
  form.paypalEnabled ────────────────→ Settings DB
  form.twilioEnabled ────────────────→ Settings DB
  [16 different provider toggles] ───→ Settings DB
  API keys/secrets ──────────────────→ Encrypted Settings DB

API Calls:
  - GET /api/admin/integrations → Load all providers
  - GET /api/admin/integrations/:provider → Load provider config
  - PUT /api/admin/integrations/:provider → Save provider config
  - POST /api/admin/integrations/:provider/test → Test provider
  - POST /api/admin/integrations/:provider/validate → Validate credentials
  - DELETE /api/admin/integrations/:provider → Disconnect provider
```

### 9. SystemSettings
```
Local State:
  auditLogs[] ────────────────────────→ AuditLog DB (read-only)
  systemStats {} ─────────────────────→ Metrics Service (read-only)
  activePage ─────────────────────────→ Pagination state

API Calls:
  - GET /api/admin/audit-logs → Load audit logs
  - GET /api/admin/audit-logs/search → Search audit logs
  - GET /api/admin/system/stats → Load system statistics
  - GET /api/admin/system/uptime → Load uptime data
  - GET /api/admin/api/metrics → Load API metrics
```

---

## API Response Structure Examples

### Settings Response
```json
{
  "success": true,
  "data": {
    "maintenanceMode": false,
    "newUserRegistration": true,
    "twoFactorAuth": true,
    "ipWhitelisting": {
      "enabled": false,
      "whitelist": ["192.168.1.1"]
    },
    "rbac": {
      "enabled": true,
      "roles": ["super_admin", "admin", "manager"]
    },
    "passwordPolicy": {
      "minLength": 10,
      "requireUppercase": true,
      "requireLowercase": true,
      "requireNumbers": true,
      "requireSpecialChars": true
    }
  },
  "timestamp": "2024-01-15T14:32:00Z"
}
```

### Role Response
```json
{
  "success": true,
  "data": {
    "id": "role_123",
    "name": "Manager",
    "description": "Operations oversight",
    "permissions": [
      "view_vehicles",
      "approve_bookings",
      "manage_disputes",
      "view_reports"
    ],
    "userCount": 8,
    "status": "active",
    "createdAt": "2024-02-03T10:15:00Z"
  }
}
```

### Notification Template Response
```json
{
  "success": true,
  "data": {
    "id": "template_456",
    "name": "Vehicle Approval Confirmation",
    "eventType": "Vehicle Approval",
    "channel": "email",
    "subject": "Your vehicle {{vehicle_name}} has been approved!",
    "body": "Hello {{owner_name}},...",
    "variables": [
      "owner_name",
      "vehicle_name",
      "vehicle_reg",
      "approval_date"
    ],
    "status": "active",
    "updatedAt": "2024-01-15T14:32:00Z"
  }
}
```

### System Stats Response
```json
{
  "success": true,
  "data": {
    "activeUsers": 142,
    "uptime": 99.98,
    "apiCallsPerHour": 12500,
    "errorRate": 0.02,
    "databaseSize": "2.3 GB",
    "lastUpdated": "2024-01-15T14:32:00Z"
  }
}
```

---

## Error Handling Pattern

```javascript
// Expected error responses from backend
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "SERVER_ERROR",
    "message": "Human-readable error message",
    "details": {
      "field": "error details" // For validation errors
    }
  }
}

// Example:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Commission rate must be between 0% and 50%",
    "details": {
      "commissionRate": "Value 85 exceeds maximum of 50"
    }
  }
}
```

---

## Performance Optimization Notes

### Caching Strategy
- Payment methods config: Cache for 1 hour
- Notification templates: Cache for 30 minutes
- System statistics: Update every 5 minutes
- Audit logs: Paginate (25-50 per page)

### Lazy Loading
- Load component data only when tab becomes active
- Pagination for large data sets (audit logs, export history)
- Virtual scrolling for long lists (roles, permissions)

### Batch Operations
- Allow bulk role permission updates
- Batch update payment method statuses
- Batch delete templates/reports

---

## Testing Checklist

### Unit Tests Required
- [ ] Component render with different props
- [ ] State management (switches, inputs, selects)
- [ ] Form validation
- [ ] Error message display

### Integration Tests Required
- [ ] API call on save
- [ ] State updates after successful API response
- [ ] Error handling on failed API calls
- [ ] Loading states during API calls

### E2E Tests Required
- [ ] Create new role workflow
- [ ] Update payment settings workflow
- [ ] Disable/enable integrations workflow
- [ ] Test notification template creation
- [ ] System settings view and audit logs
