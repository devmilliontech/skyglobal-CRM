# Frontend Admin Settings Components - Backend Dependencies Analysis

## 1. PageHeader
**Location:** `frontend/src/components/PageHeader.tsx`

**Props/Parameters:**
- `title`: Page title
- `description`: Page description
- `showBack`: Show back button
- `enableSearch`: Enable search functionality
- `searchPlaceholder`: Search input placeholder
- `searchValue`: Current search value
- `onSearchChange`: Search callback
- `onCreateClick`: Create action callback
- `onFilterClick`: Filter action callback
- `showNotifications`: Show notification bell
- `notificationCount`: Number of notifications
- `onProfileClick`: Profile action callback
- `userName`: Current user name
- `userAvatar`: User avatar URL

**Required Backend Endpoints/Data:**
- `GET /api/notifications/count` - Fetch notification count
- `GET /api/user/profile` - Fetch current user profile (name, avatar)
- User context/session data

**Backend Functionality Depends On:**
- User authentication service
- Notification system
- Profile management

**API/Fetch Calls:** None (stateless UI component)

---

## 2. GeneralSettings
**Location:** `frontend/src/components/GeneralSettings.tsx`

**Props/Parameters:**
- `maintenanceMode`: boolean
- `setMaintenanceMode`: setter function
- `newUserReg`: boolean (new user registration enabled)
- `setNewUserReg`: setter function
- `twoFactorAuth`: boolean
- `setTwoFactorAuth`: setter function
- `ipWhitelisting`: boolean
- `setIpWhitelisting`: setter function
- `rbac`: boolean (role-based access control)
- `setRbac`: setter function

**Required Backend Endpoints/Data:**
- `GET /api/admin/settings/general` - Fetch general settings
- `PUT /api/admin/settings/general` - Update general settings
- `GET /api/admin/settings/security` - Fetch security settings
- `PUT /api/admin/settings/security` - Update security settings
- `GET /api/admin/settings/access-control` - Fetch access control settings
- `PUT /api/admin/settings/access-control` - Update access control settings
- `POST /api/admin/settings/validate/stripe-disable` - Validate Stripe disable operation

**Backend Functionality Depends On:**
- Settings management service
- Maintenance mode controller
- User registration control
- 2FA configuration service
- IP whitelist management
- RBAC engine
- Password policy validation

**API/Fetch Calls:** None in current component (props-based)

---

## 3. RolesAndPermissions
**Location:** `frontend/src/components/RolesAndPermissions.tsx`

**Props/Parameters:** None

**State Management:**
```typescript
- Hardcoded roles array with: name, description, users count, permissions, status, created date
```

**Required Backend Endpoints/Data:**
- `GET /api/admin/roles` - Fetch all roles
- `GET /api/admin/roles/:roleId` - Fetch specific role details
- `POST /api/admin/roles` - Create new role
- `PUT /api/admin/roles/:roleId` - Update role
- `DELETE /api/admin/roles/:roleId` - Delete role
- `GET /api/admin/permissions` - Fetch all available permissions
- `POST /api/admin/roles/:roleId/permissions` - Assign permissions to role
- `DELETE /api/admin/roles/:roleId/permissions/:permissionId` - Remove permission from role

**Backend Functionality Depends On:**
- RBAC service
- Role management service
- Permission management service
- User-role association service
- Audit logging

**API/Fetch Calls:** None in current component (needs implementation)

---

## 4. PaymentsAndFinance
**Location:** `frontend/src/components/PaymentsAndFinance.tsx`

**Props/Parameters:** None

**State Management:**
```typescript
- Hardcoded payment methods array (Stripe, PayPal, Bank Transfer, Google Pay, Apple Pay, Cash)
- Commission rates
- Late return fees
- Booking fees
- Cancellation fees
```

**Required Backend Endpoints/Data:**
- `GET /api/admin/payments/methods` - Fetch payment methods configuration
- `PUT /api/admin/payments/methods/:methodId` - Update payment method status/fee
- `GET /api/admin/payments/settings` - Fetch payment settings
- `PUT /api/admin/payments/settings` - Update payment settings (commissions, fees)
- `GET /api/admin/payments/gateway-config` - Fetch gateway configurations
- `POST /api/admin/payments/gateway-config/:gateway/test` - Test payment gateway connection
- `GET /api/admin/payments/transaction-types` - Fetch transaction type configurations

**Backend Functionality Depends On:**
- Payment gateway integration service
- Commission calculation service
- Fee management service
- Payment method controller
- Stripe/PayPal API integration

**API/Fetch Calls:** None in current component (needs implementation)

---

## 5. AgreementsAndRentals
**Location:** `frontend/src/components/AgreementsAndRentals.tsx`

**Props/Parameters:** None

**State Management:**
```typescript
- Agreement rules toggles (digital signature, ID verification, auto-renewal)
- Agreement template type
- Minimum/maximum rental period
- Rental cancellation policy
- Late return grace period
```

**Required Backend Endpoints/Data:**
- `GET /api/admin/agreements/settings` - Fetch agreement settings
- `PUT /api/admin/agreements/settings` - Update agreement settings
- `GET /api/admin/agreements/templates` - Fetch agreement templates
- `PUT /api/admin/agreements/templates/:templateId` - Update template
- `GET /api/admin/rentals/rules` - Fetch rental rules
- `PUT /api/admin/rentals/rules` - Update rental rules
- `GET /api/admin/rentals/policies` - Fetch cancellation policies
- `PUT /api/admin/rentals/policies` - Update cancellation policies

**Backend Functionality Depends On:**
- Agreement management service
- Rental rules engine
- Digital signature verification service
- ID verification service
- Template management service
- Policy management service

**API/Fetch Calls:** None in current component (needs implementation)

---

## 6. VehiclesAndCompliance
**Location:** `frontend/src/components/VehiclesAndCompliance.tsx`

**Props/Parameters:**
- `setActiveTab`: Function to switch tabs (used to navigate to Reports tab)

**State Management:**
```typescript
- Vehicle approval settings (manual approval, auto-approve, expiry checks)
- Safety inspection toggles
- Insurance verification settings
- Compliance score threshold (default: 80)
- Various compliance enforcement toggles
```

**Required Backend Endpoints/Data:**
- `GET /api/admin/vehicles/approval-rules` - Fetch vehicle approval rules
- `PUT /api/admin/vehicles/approval-rules` - Update approval rules
- `GET /api/admin/vehicles/compliance-settings` - Fetch compliance settings
- `PUT /api/admin/vehicles/compliance-settings` - Update compliance settings
- `GET /api/admin/vehicles/insurance-config` - Fetch insurance verification config
- `PUT /api/admin/vehicles/insurance-config` - Update insurance configuration
- `GET /api/admin/compliance/score-thresholds` - Fetch compliance score thresholds
- `PUT /api/admin/compliance/score-thresholds` - Update score thresholds
- `GET /api/admin/compliance/reports` - Fetch compliance reports (when navigating to Reports)

**Backend Functionality Depends On:**
- Vehicle approval service
- Compliance check service
- Insurance verification API integration
- PUC (Pollution Under Control) verification service
- Safety inspection controller
- Compliance score calculation engine
- Authority notification service

**API/Fetch Calls:** None in current component (needs implementation)

---

## 7. NotificationSettings
**Location:** `frontend/src/components/NotificationSettings.tsx`

**Props/Parameters:** None

**State Management:**
```typescript
- Active notification type (Email/SMS/Push)
- Template name
- Event type
- Subject line
- Email body
- Email/SMS/Push enabled flags
- Email configuration (provider, credentials)
- SMS provider configuration
- Notification frequency limits
- Retry policies
```

**Required Backend Endpoints/Data:**
- `GET /api/admin/notifications/templates` - Fetch all notification templates
- `POST /api/admin/notifications/templates` - Create new template
- `PUT /api/admin/notifications/templates/:templateId` - Update template
- `DELETE /api/admin/notifications/templates/:templateId` - Delete template
- `GET /api/admin/notifications/events` - Fetch available notification events
- `GET /api/admin/notifications/channels` - Fetch notification channels (Email/SMS/Push)
- `PUT /api/admin/notifications/channels/:channelId` - Update channel configuration
- `GET /api/admin/notifications/providers` - Fetch email/SMS providers
- `PUT /api/admin/notifications/providers/:providerId` - Update provider config
- `GET /api/admin/notifications/test` - Test send notification
- `POST /api/admin/notifications/preview` - Preview template rendering

**Backend Functionality Depends On:**
- Email service (SendGrid/Mailgun/SMTP)
- SMS service (Twilio)
- Push notification service
- Template engine
- Notification queue/job scheduler
- Event management service

**API/Fetch Calls:** None in current component (needs implementation)

---

## 8. ReportsAndData
**Location:** `frontend/src/components/ReportsAndData.tsx`

**Props/Parameters:** None

**State Management:**
```typescript
- Export settings (max records, frequency, formats)
- Data scope settings (vehicle, financial, user records access by role)
- Data retention policies
- Report schedules and configurations
- Compliance automation settings
```

**Required Backend Endpoints/Data:**
- `GET /api/admin/reports/configuration` - Fetch report configuration
- `PUT /api/admin/reports/configuration` - Update report configuration
- `GET /api/admin/reports/available` - Fetch list of available reports
- `POST /api/admin/reports/create` - Create new report
- `PUT /api/admin/reports/:reportId` - Update report settings
- `DELETE /api/admin/reports/:reportId` - Delete report
- `GET /api/admin/data/retention-policies` - Fetch data retention settings
- `PUT /api/admin/data/retention-policies` - Update data retention
- `GET /api/admin/exports/history` - Fetch export history
- `POST /api/admin/exports/test` - Test export with sample data
- `GET /api/admin/reports/scheduled` - Fetch scheduled reports
- `PUT /api/admin/reports/scheduled/:reportId` - Update scheduled report
- `GET /api/admin/compliance/audit-logs` - Fetch audit logs for compliance

**Backend Functionality Depends On:**
- Report generation service
- Data export service
- Role-based data access control
- Data retention/archival service
- Scheduled job service
- Audit logging service
- Compliance reporting service
- Report scheduling engine

**API/Fetch Calls:** None in current component (needs implementation)

---

## 9. Integrations
**Location:** `frontend/src/components/Integrations.tsx`

**Props/Parameters:** None

**State Management:**
```typescript
- Multiple provider enable/disable toggles:
  - Payment: Stripe, PayPal
  - SMS: Twilio, AWS SNS
  - Email: SendGrid, Mailgun
  - Storage: AWS S3
  - Maps: Google Maps
  - Analytics: Google Analytics, Mixpanel
  - Communication: Slack
  - Design: Figma
- API keys, secrets, tokens
- Environment (sandbox/production)
```

**Required Backend Endpoints/Data:**
- `GET /api/admin/integrations` - Fetch all integrations
- `GET /api/admin/integrations/:provider` - Fetch specific provider config
- `PUT /api/admin/integrations/:provider` - Update provider configuration
- `POST /api/admin/integrations/:provider/test` - Test integration connection
- `POST /api/admin/integrations/:provider/validate` - Validate credentials
- `GET /api/admin/integrations/:provider/status` - Get integration status
- `DELETE /api/admin/integrations/:provider` - Disconnect integration

**For Each Provider:**
- Stripe: `GET /api/admin/integrations/stripe/webhooks` - Fetch webhook info
- PayPal: `GET /api/admin/integrations/paypal/environment` - Fetch environment config
- Twilio: `GET /api/admin/integrations/twilio/verify` - Verify credentials
- AWS SNS: `GET /api/admin/integrations/aws/sns/topics` - Fetch SNS topics
- SendGrid: `GET /api/admin/integrations/sendgrid/senders` - Fetch verified senders
- Google Maps: `GET /api/admin/integrations/maps/quota` - Fetch API quota
- AWS S3: `GET /api/admin/integrations/s3/buckets` - Fetch S3 buckets
- Slack: `GET /api/admin/integrations/slack/channels` - Fetch Slack channels

**Backend Functionality Depends On:**
- Integration management service
- Third-party API gateway
- Credential encryption service
- Webhook management service
- Environment configuration service
- API key management and rotation

**API/Fetch Calls:** None in current component (needs implementation)

---

## 10. SystemSettings
**Location:** `frontend/src/components/SystemSettings.tsx`

**Props/Parameters:** None

**State Management:**
```typescript
- Hardcoded audit logs array (user, action, module, timestamp, IP, details)
- System statistics (active users, uptime, API calls/hour, error rate)
- Pagination state
```

**Required Backend Endpoints/Data:**
- `GET /api/admin/audit-logs` - Fetch audit logs (paginated)
- `GET /api/admin/audit-logs/search` - Search audit logs
- `GET /api/admin/audit-logs/export` - Export audit logs
- `GET /api/admin/system/stats` - Fetch system statistics
- `GET /api/admin/system/uptime` - Fetch system uptime
- `GET /api/admin/system/health` - Fetch system health status
- `GET /api/admin/api/metrics` - Fetch API metrics (calls/hour, errors)
- `GET /api/admin/database/stats` - Fetch database statistics
- `DELETE /api/admin/audit-logs/:logId` - Delete audit log entry (if needed)

**Backend Functionality Depends On:**
- Audit logging service
- System monitoring service
- Metrics collection service
- Health check service
- API rate limiting service
- Error tracking service

**API/Fetch Calls:** None in current component (needs implementation)

---

## Summary: Backend Endpoints Required

### Authentication & Authorization
```
GET /api/user/profile
GET /api/admin/permissions
GET /api/admin/roles
```

### General Settings
```
GET /api/admin/settings/general
PUT /api/admin/settings/general
GET /api/admin/settings/security
PUT /api/admin/settings/security
GET /api/admin/settings/access-control
PUT /api/admin/settings/access-control
POST /api/admin/settings/validate/stripe-disable
```

### Roles & Permissions
```
GET /api/admin/roles
POST /api/admin/roles
PUT /api/admin/roles/:roleId
DELETE /api/admin/roles/:roleId
GET /api/admin/permissions
POST /api/admin/roles/:roleId/permissions
DELETE /api/admin/roles/:roleId/permissions/:permissionId
```

### Payments & Finance
```
GET /api/admin/payments/methods
PUT /api/admin/payments/methods/:methodId
GET /api/admin/payments/settings
PUT /api/admin/payments/settings
GET /api/admin/payments/gateway-config
POST /api/admin/payments/gateway-config/:gateway/test
GET /api/admin/payments/transaction-types
```

### Agreements & Rentals
```
GET /api/admin/agreements/settings
PUT /api/admin/agreements/settings
GET /api/admin/agreements/templates
PUT /api/admin/agreements/templates/:templateId
GET /api/admin/rentals/rules
PUT /api/admin/rentals/rules
GET /api/admin/rentals/policies
PUT /api/admin/rentals/policies
```

### Vehicles & Compliance
```
GET /api/admin/vehicles/approval-rules
PUT /api/admin/vehicles/approval-rules
GET /api/admin/vehicles/compliance-settings
PUT /api/admin/vehicles/compliance-settings
GET /api/admin/vehicles/insurance-config
PUT /api/admin/vehicles/insurance-config
GET /api/admin/compliance/score-thresholds
PUT /api/admin/compliance/score-thresholds
GET /api/admin/compliance/reports
```

### Notifications
```
GET /api/admin/notifications/templates
POST /api/admin/notifications/templates
PUT /api/admin/notifications/templates/:templateId
DELETE /api/admin/notifications/templates/:templateId
GET /api/admin/notifications/events
GET /api/admin/notifications/channels
PUT /api/admin/notifications/channels/:channelId
GET /api/admin/notifications/providers
PUT /api/admin/notifications/providers/:providerId
POST /api/admin/notifications/test
POST /api/admin/notifications/preview
```

### Reports & Data
```
GET /api/admin/reports/configuration
PUT /api/admin/reports/configuration
GET /api/admin/reports/available
POST /api/admin/reports/create
PUT /api/admin/reports/:reportId
DELETE /api/admin/reports/:reportId
GET /api/admin/data/retention-policies
PUT /api/admin/data/retention-policies
GET /api/admin/exports/history
POST /api/admin/exports/test
GET /api/admin/reports/scheduled
PUT /api/admin/reports/scheduled/:reportId
GET /api/admin/compliance/audit-logs
```

### Integrations
```
GET /api/admin/integrations
GET /api/admin/integrations/:provider
PUT /api/admin/integrations/:provider
POST /api/admin/integrations/:provider/test
POST /api/admin/integrations/:provider/validate
GET /api/admin/integrations/:provider/status
DELETE /api/admin/integrations/:provider
[Provider-specific endpoints for Stripe, PayPal, Twilio, etc.]
```

### System Settings
```
GET /api/admin/audit-logs
GET /api/admin/audit-logs/search
GET /api/admin/audit-logs/export
GET /api/admin/system/stats
GET /api/admin/system/uptime
GET /api/admin/system/health
GET /api/admin/api/metrics
GET /api/admin/database/stats
DELETE /api/admin/audit-logs/:logId
```

### Notifications (System)
```
GET /api/notifications/count
```

---

## Component Dependencies Graph

```
PageHeader
  ├─ User Profile Data
  └─ Notifications Count

admin-settings/page (Parent)
  ├─ GeneralSettings
  │  ├─ Settings Management Service
  │  ├─ Maintenance Mode Service
  │  └─ RBAC Service
  ├─ RolesAndPermissions
  │  ├─ RBAC Service
  │  └─ Permission Management Service
  ├─ PaymentsAndFinance
  │  ├─ Payment Gateway Service
  │  └─ Commission Calculation Service
  ├─ AgreementsAndRentals
  │  ├─ Agreement Management Service
  │  ├─ Rental Rules Engine
  │  └─ Policy Management Service
  ├─ VehiclesAndCompliance
  │  ├─ Vehicle Approval Service
  │  ├─ Compliance Check Service
  │  └─ Insurance Verification Service
  ├─ NotificationSettings
  │  ├─ Email Service (SendGrid/Mailgun)
  │  ├─ SMS Service (Twilio)
  │  ├─ Push Notification Service
  │  └─ Template Engine
  ├─ ReportsAndData
  │  ├─ Report Generation Service
  │  ├─ Data Export Service
  │  └─ Data Retention Service
  ├─ Integrations
  │  ├─ Integration Management Service
  │  └─ Third-party API Gateway
  └─ SystemSettings
     ├─ Audit Logging Service
     ├─ System Monitoring Service
     └─ Metrics Collection Service
```
