# Frontend Components → Backend Dependencies - Quick Reference

## Component Summary Table

| Component | Required Backend Endpoints | Key Dependencies | Props Used |
|-----------|---------------------------|------------------|-----------|
| **PageHeader** | GET /api/notifications/count<br>GET /api/user/profile | User Auth<br>Notification System | title, searchValue, onSearchChange, notificationCount, userName |
| **GeneralSettings** | GET/PUT /api/admin/settings/{general\|security\|access-control}<br>POST /api/admin/settings/validate/stripe-disable | Settings Service<br>Maintenance Mode<br>RBAC Engine<br>2FA Service | maintenanceMode, newUserReg, twoFactorAuth, ipWhitelisting, rbac |
| **RolesAndPermissions** | GET /api/admin/roles<br>POST /api/admin/roles<br>PUT /api/admin/roles/:roleId<br>DELETE /api/admin/roles/:roleId<br>GET /api/admin/permissions<br>POST/DELETE /api/admin/roles/:roleId/permissions | RBAC Service<br>Role Manager<br>Permission Manager<br>User-Role Assoc. | None (self-contained) |
| **PaymentsAndFinance** | GET /api/admin/payments/{methods\|settings\|gateway-config}<br>PUT /api/admin/payments/settings<br>POST /api/admin/payments/gateway-config/:gateway/test | Payment Gateway Service<br>Commission Calculator<br>Fee Manager<br>Stripe/PayPal API | None (self-contained) |
| **AgreementsAndRentals** | GET/PUT /api/admin/{agreements\|rentals}/{settings\|rules\|policies\|templates} | Agreement Manager<br>Rental Rules Engine<br>Template Manager<br>Policy Service | None (self-contained) |
| **VehiclesAndCompliance** | GET/PUT /api/admin/vehicles/{approval-rules\|compliance-settings\|insurance-config}<br>GET/PUT /api/admin/compliance/score-thresholds<br>GET /api/admin/compliance/reports | Vehicle Approval<br>Compliance Engine<br>Insurance Verification<br>PUC Verification | setActiveTab |
| **NotificationSettings** | GET/POST/PUT/DELETE /api/admin/notifications/{templates\|events\|channels\|providers}<br>POST /api/admin/notifications/{test\|preview} | Email Service<br>SMS Service<br>Push Service<br>Template Engine<br>Job Scheduler | None (self-contained) |
| **ReportsAndData** | GET/PUT /api/admin/reports/{configuration\|available\|scheduled}<br>POST /api/admin/reports/create<br>GET/PUT /api/admin/data/retention-policies<br>GET /api/admin/exports/history<br>GET /api/admin/compliance/audit-logs | Report Generator<br>Data Exporter<br>RBAC/Data Access<br>Retention Service<br>Job Scheduler | None (self-contained) |
| **Integrations** | GET/PUT/DELETE /api/admin/integrations/:provider<br>POST /api/admin/integrations/:provider/{test\|validate}<br>GET /api/admin/integrations/:provider/status<br>Provider-specific endpoints | Integration Manager<br>Third-party Gateway<br>Credential Encryption<br>Webhook Manager | None (self-contained) |
| **SystemSettings** | GET /api/admin/audit-logs<br>GET /api/admin/audit-logs/search<br>GET /api/admin/system/{stats\|uptime\|health}<br>GET /api/admin/api/metrics<br>DELETE /api/admin/audit-logs/:logId | Audit Logger<br>System Monitor<br>Metrics Service<br>Health Checker | None (self-contained) |

---

## Data Model Requirements

### Settings Configuration
```
GeneralSettings:
  - maintenanceMode: boolean
  - newUserRegistration: boolean
  - twoFactorAuth: boolean
  - ipWhitelist: string[]
  - rbacEnabled: boolean
  - passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireLowercase: boolean
      requireNumbers: boolean
      requireSpecialChars: boolean
    }

PaymentSettings:
  - paymentMethods: PaymentMethod[]
  - commissionRate: number (%)
  - fees: {
      booking: number
      latReturn: number ($/hour)
      cancellation: number
    }

AgreementSettings:
  - enforceDigitalSignature: boolean
  - mandatoryIDVerification: boolean
  - autoRenewalAllowed: boolean
  - templateType: "standard" | "corporate"
  - minRentalPeriod: number
  - maxRentalPeriod: number
  - cancellationPolicy: "no_cancellation" | "full_refund" | "partial_refund"
  - lateReturnGracePeriod: number (hours)

VehicleComplianceSettings:
  - requireManualApproval: boolean
  - autoApproveVerified: boolean
  - enforceExpiryChecks: boolean
  - annualSafetyInspection: boolean
  - enforcePUC: boolean
  - commercialPermit: boolean
  - notifyAuthorities: boolean
  - mandatoryInsurance: boolean
  - verifyInsuranceAPI: boolean
  - suspendOnLapse: boolean
  - complianceScoreThreshold: number

NotificationSettings:
  - templates: NotificationTemplate[]
  - channels: {
      email: { enabled: boolean, provider: string, config: {} }
      sms: { enabled: boolean, provider: string, config: {} }
      push: { enabled: boolean, provider: string, config: {} }
    }

ReportSettings:
  - maxExportRecords: number
  - exportFrequency: "limit" (max per hour)
  - dataScopes: {
      vehicleData: "all_roles" | "admin_only"
      financialData: "super_admin" | "finance_role"
      userRecords: "super_admin" | "admin"
    }
  - retentionPolicies: {
      activeRentals: number (years)
      completedRentals: number (years)
      communicationRecords: number (years)
      userAccountData: number (years)
      vehicleHistory: number (years)
      auditLogs: number (years)
    }
  - reportSchedules: Map<reportName, frequency>
```

---

## API Endpoint Categories

### 1. Settings Management (`/api/admin/settings`)
- `GET /api/admin/settings/general` → GeneralSettings props
- `PUT /api/admin/settings/general` → Save general config
- `GET /api/admin/settings/security` → Security policies
- `PUT /api/admin/settings/security` → Update security
- `GET /api/admin/settings/access-control` → Access rules
- `PUT /api/admin/settings/access-control` → Update access rules

### 2. RBAC Management (`/api/admin/roles` & `/api/admin/permissions`)
- `GET /api/admin/roles` → List all roles
- `POST /api/admin/roles` → Create role
- `PUT /api/admin/roles/:roleId` → Update role
- `DELETE /api/admin/roles/:roleId` → Delete role
- `GET /api/admin/permissions` → List all permissions
- `POST /api/admin/roles/:roleId/permissions` → Assign permissions
- `DELETE /api/admin/roles/:roleId/permissions/:permissionId` → Remove permissions

### 3. Payment Configuration (`/api/admin/payments`)
- `GET /api/admin/payments/methods` → Payment methods config
- `PUT /api/admin/payments/methods/:methodId` → Toggle method
- `GET /api/admin/payments/settings` → Commission & fees
- `PUT /api/admin/payments/settings` → Update rates/fees
- `GET /api/admin/payments/gateway-config` → Gateway credentials
- `POST /api/admin/payments/gateway-config/:gateway/test` → Test connection

### 4. Agreement & Rental Rules (`/api/admin/agreements`, `/api/admin/rentals`)
- `GET /api/admin/agreements/settings` → Agreement config
- `PUT /api/admin/agreements/settings` → Update config
- `GET /api/admin/agreements/templates` → Agreement templates
- `GET /api/admin/rentals/rules` → Rental rules
- `PUT /api/admin/rentals/rules` → Update rules
- `GET /api/admin/rentals/policies` → Cancellation policies

### 5. Compliance & Vehicle Management (`/api/admin/vehicles`, `/api/admin/compliance`)
- `GET /api/admin/vehicles/approval-rules` → Vehicle approval config
- `PUT /api/admin/vehicles/approval-rules` → Update approval
- `GET /api/admin/vehicles/compliance-settings` → Compliance config
- `GET /api/admin/vehicles/insurance-config` → Insurance API config
- `GET /api/admin/compliance/score-thresholds` → Score settings
- `GET /api/admin/compliance/reports` → Compliance reports

### 6. Notification Management (`/api/admin/notifications`)
- `GET /api/admin/notifications/templates` → List templates
- `POST /api/admin/notifications/templates` → Create template
- `PUT /api/admin/notifications/templates/:templateId` → Update template
- `DELETE /api/admin/notifications/templates/:templateId` → Delete template
- `GET /api/admin/notifications/events` → Available events
- `GET /api/admin/notifications/channels` → Channel config
- `PUT /api/admin/notifications/channels/:channelId` → Update channel
- `GET /api/admin/notifications/providers` → Email/SMS providers
- `PUT /api/admin/notifications/providers/:providerId` → Update provider

### 7. Reports & Data Export (`/api/admin/reports`, `/api/admin/data`)
- `GET /api/admin/reports/configuration` → Report config
- `PUT /api/admin/reports/configuration` → Update config
- `GET /api/admin/reports/available` → List reports
- `POST /api/admin/reports/create` → Create report
- `GET /api/admin/data/retention-policies` → Data retention config
- `PUT /api/admin/data/retention-policies` → Update retention
- `GET /api/admin/exports/history` → Export history

### 8. Integrations (`/api/admin/integrations`)
- `GET /api/admin/integrations` → List all integrations
- `GET /api/admin/integrations/:provider` → Get provider config
- `PUT /api/admin/integrations/:provider` → Update provider config
- `POST /api/admin/integrations/:provider/test` → Test connection
- `POST /api/admin/integrations/:provider/validate` → Validate credentials
- `GET /api/admin/integrations/:provider/status` → Provider status
- `DELETE /api/admin/integrations/:provider` → Disconnect provider

### 9. System & Audit (`/api/admin/audit-logs`, `/api/admin/system`)
- `GET /api/admin/audit-logs` → Fetch audit logs (paginated)
- `GET /api/admin/audit-logs/search` → Search audit logs
- `GET /api/admin/system/stats` → System statistics
- `GET /api/admin/system/uptime` → System uptime
- `GET /api/admin/system/health` → System health
- `GET /api/admin/api/metrics` → API metrics
- `GET /api/admin/database/stats` → Database stats

---

## Implementation Checklist

### Frontend (Already Done)
- ✅ PageHeader component
- ✅ GeneralSettings component
- ✅ RolesAndPermissions component
- ✅ PaymentsAndFinance component
- ✅ AgreementsAndRentals component
- ✅ VehiclesAndCompliance component
- ✅ NotificationSettings component
- ✅ ReportsAndData component
- ✅ Integrations component
- ✅ SystemSettings component

### Backend (Required)
- [ ] Settings API endpoints
- [ ] RBAC management endpoints
- [ ] Payment configuration endpoints
- [ ] Agreement & rental endpoints
- [ ] Vehicle compliance endpoints
- [ ] Notification system endpoints
- [ ] Reports & data export endpoints
- [ ] Integration management endpoints
- [ ] System monitoring endpoints
- [ ] Audit logging endpoints
- [ ] Data models for each service
- [ ] Controllers/handlers for all endpoints
- [ ] Database schema updates
- [ ] Middleware for validation/auth

### Integration Required
- [ ] Connect PageHeader to actual notification system
- [ ] Connect GeneralSettings to settings API
- [ ] Connect RolesAndPermissions to RBAC API
- [ ] Connect PaymentsAndFinance to payment gateway API
- [ ] Connect AgreementsAndRentals to agreement API
- [ ] Connect VehiclesAndCompliance to vehicle/compliance API
- [ ] Connect NotificationSettings to notification API
- [ ] Connect ReportsAndData to reports API
- [ ] Connect Integrations to integration API
- [ ] Connect SystemSettings to audit/metrics API
- [ ] Add error handling for all API calls
- [ ] Add loading states for all async operations
- [ ] Add success/error notifications
- [ ] Add data validation on frontend
- [ ] Add request/response interceptors
