# Admin Settings Components: Specific Frontend-Backend Gaps

**Analysis Date**: May 18, 2026  
**Status**: All 10 components analyzed for missing backend support  
**Critical Finding**: 66% of admin features lack backend endpoints

---

## 📋 Executive Summary

| Component | Total Fields | Connected | Missing | Priority |
|-----------|--------------|-----------|---------|----------|
| **GeneralSettings** | 21 | 0 | 21 | 🔴 CRITICAL |
| **VehiclesAndCompliance** | 15 | 2 | 13 | 🔴 HIGH |
| **AgreementsAndRentals** | 9 | 0 | 9 | 🔴 HIGH |
| **NotificationSettings** | 14 | 2 | 12 | 🟡 MEDIUM |
| **ReportsAndData** | 19 | 4 | 15 | 🟡 MEDIUM |
| **Integrations** | 28 | 8 | 20 | 🟡 MEDIUM |
| **SystemSettings** | 8 | 3 | 5 | 🟢 LOW |
| **RolesAndPermissions** | 12 | 12 | 0 | ✅ DONE |
| **PaymentsAndFinance** | 18 | 18 | 0 | ✅ DONE |
| **TOTAL** | **144** | **49** | **95** | - |

---

## 1. 🔴 CRITICAL: GeneralSettings (100% Missing)

### Current State
- ✅ Frontend: Fully built with all UI components
- ❌ Backend: No endpoints exist whatsoever

### Specific Form Fields Needing Backend

#### Platform Configuration (NO SAVE ENDPOINT)
```
✗ platformName (input)
  └─ Frontend: displays "iRent" by default
  └─ Backend: GET /admin/general-settings needs this field
  
✗ platformUrl (input)
  └─ Frontend: displays "https://irent.com" by default
  └─ Backend: needs field in GET /admin/general-settings

✗ platformDescription (textarea)
  └─ Frontend: displays multi-line text
  └─ Backend: needs field in GET /admin/general-settings

✗ defaultLanguage (select)
  └─ Options: English (US), Spanish, French
  └─ Backend: needs field + list of language options
  
✗ defaultCurrency (select)
  └─ Options: USD, EUR, GBP
  └─ Backend: needs field + list of currencies

✗ timezone (select)
  └─ Options: UTC-5, UTC-8, UTC+0, etc.
  └─ Backend: needs field + list of timezones

✗ dateFormat (select)
  └─ Options: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
  └─ Backend: needs field + list of formats
```

#### Access Control (NO TOGGLE ENDPOINTS)
```
✗ ipWhitelisting (switch/toggle)
  └─ Frontend: Toggle switch implemented
  └─ Backend: needs toggle persistence
  └─ Likely needs: PUT /admin/general-settings/toggle/ip-whitelisting
  
✗ rbac (switch/toggle)
  └─ Frontend: Toggle switch implemented
  └─ Backend: needs toggle persistence
  └─ Likely needs: PUT /admin/general-settings/toggle/rbac
```

#### Login & Security Settings (NO SAVE ENDPOINT)
```
✗ minimumPasswordLength (select: 8, 10, 12, 16)
  └─ Frontend: Dropdown selector
  └─ Backend: needs persist in password policy
  
✗ passwordComplexity (4 checkboxes - all checked)
  └─ Require uppercase (A-Z)
  └─ Require lowercase (a-z)
  └─ Require numbers (0-9)
  └─ Require special characters (!@#$%)
  └─ Backend: needs array of enabled requirements
  
✗ sessionTimeout (select: 15min, 30min, 45min, 60min, 2hrs)
  └─ Frontend: Select dropdown
  └─ Backend: needs field in GET /admin/general-settings
```

#### Feature Toggles (NO ENDPOINTS)
```
✗ maintenanceMode (switch)
  └─ Frontend: Large toggle card implemented
  └─ Backend: needs POST /admin/general-settings/toggle/maintenance-mode
  
✗ newUserRegistration (switch)
  └─ Frontend: Toggle card implemented
  └─ Backend: needs POST /admin/general-settings/toggle/user-registration
  
✗ twoFactorAuth (switch)
  └─ Frontend: Toggle card implemented
  └─ Backend: needs POST /admin/general-settings/toggle/2fa
```

### Required Backend Implementation

**Endpoint 1: Fetch General Settings**
```
GET /admin/general-settings
Response:
{
  platformName: "iRent",
  platformUrl: "https://irent.com",
  platformDescription: "...",
  defaultLanguage: "en_US",
  defaultCurrency: "USD",
  timezone: "UTC-5",
  dateFormat: "MM/DD/YYYY",
  ipWhitelistingEnabled: false,
  rbacEnabled: true,
  maintenanceMode: false,
  userRegistrationEnabled: true,
  twoFactorAuthEnabled: false,
  minimumPasswordLength: 8,
  passwordComplexityRules: ["uppercase", "lowercase", "numbers", "special"],
  sessionTimeoutMinutes: 30
}
```

**Endpoint 2: Update General Settings**
```
PUT /admin/general-settings
Request:
{
  platformName: "iRent",
  platformUrl: "https://irent.com",
  platformDescription: "...",
  defaultLanguage: "en_US",
  defaultCurrency: "USD",
  timezone: "UTC-5",
  dateFormat: "MM/DD/YYYY",
  minimumPasswordLength: 8,
  passwordComplexityRules: [...],
  sessionTimeoutMinutes: 30
}
```

**Endpoint 3: Toggle Features**
```
POST /admin/general-settings/toggle/:feature
Payload: { enabled: true/false }

Features to toggle:
- ip-whitelisting
- rbac
- maintenance-mode
- user-registration
- 2fa
```

---

## 2. 🔴 HIGH: VehiclesAndCompliance (87% Missing)

### Current State
- ✅ Frontend: Fully built with all settings toggles and forms
- ⚠️ Backend: 30% done (dashboard exists, settings don't save)

### Specific Missing Fields

#### Vehicle Approval Rules (ALL NOT SAVED)
```
✗ requireManualApproval (toggle - currently ON)
  └─ Frontend: Toggle switch + description implemented
  └─ Backend: needs persistence in approval rules

✗ autoApproveVerified (toggle - currently OFF)
  └─ Frontend: Toggle switch + description implemented
  └─ Backend: needs persistence in approval rules

✗ minimumVehicleAge (input + unit selector)
  └─ Frontend: Input shows "10" + dropdown for "years"
  └─ Backend: needs field in vehicle approval rules
  └─ Currently: No DB field to store this

✗ maximumOdometerReading (input + unit selector)
  └─ Frontend: Input shows "200000" + dropdown for "km" or "miles"
  └─ Backend: needs field in vehicle approval rules

✗ approvalTurnaroundTime/SLA (input + unit)
  └─ Frontend: Input shows "48" + dropdown for "hours" or "days"
  └─ Backend: needs field in approval rules
  └─ No way to track SLA compliance currently
```

#### Required Documents Checklist (ALL NOT SAVED)
```
Currently displays 7 checkboxes - ALL CHECKED:
  ✓ Vehicle Registration Certificate
  ✓ Valid Insurance Policy
  ✓ Pollution Under Control (PUC) Certificate
  ✓ Owner KYC Documents (ID + Address Proof)
  ☐ Fitness Certificate (Commercial vehicles)
  ☐ Vehicle Inspection Report
  ☐ Vehicle Photos (Minimum 6 angles)

Problem: Frontend shows these but NO BACKEND STORES which are required
  └─ Need: Array field in DB to track required document types
  └─ Need: API to save which documents are mandatory
```

#### Compliance Rules Toggles (ALL NOT SAVED)
```
✗ enforceExpiryChecks (toggle - ON)
  └─ Frontend: Toggle implemented
  └─ Backend: No persistence

✗ annualSafetyInspection (toggle - ON)
  └─ Frontend: Toggle implemented
  └─ Backend: No persistence

✗ enforcePUC (toggle - ON)
  └─ Frontend: Toggle implemented
  └─ Backend: No persistence

✗ commercialPermit (toggle - OFF)
  └─ Frontend: Toggle implemented
  └─ Backend: No persistence

✗ notifyAuthorities (toggle - OFF)
  └─ Frontend: Toggle implemented
  └─ Backend: No persistence

✗ mandatoryInsurance (toggle - ON)
  └─ Frontend: Toggle implemented
  └─ Backend: Likely partially there

✗ verifyInsuranceAPI (toggle - ON)
  └─ Frontend: Toggle implemented
  └─ Backend: Likely partially there

✗ suspendOnLapse (toggle - ON)
  └─ Frontend: Toggle implemented
  └─ Backend: No persistence
```

### Required Backend Implementation

**Endpoint: Get Vehicle Approval Rules**
```
GET /admin/vehicle-approval-rules
Response:
{
  requireManualApproval: true,
  autoApproveVerified: false,
  minimumVehicleAge: 10,
  minimumVehicleAgeUnit: "years",
  maximumOdometerReading: 200000,
  maximumOdometerUnit: "km",
  approvalTurnaroundTimeSLA: 48,
  approvalTurnaroundUnit: "hours",
  requiredDocuments: [
    "registration",
    "insurance", 
    "puc",
    "kyc"
  ],
  complianceRules: {
    enforceExpiryChecks: true,
    annualSafetyInspection: true,
    enforcePUC: true,
    commercialPermit: false,
    notifyAuthorities: false,
    mandatoryInsurance: true,
    verifyInsuranceAPI: true,
    suspendOnLapse: true
  }
}
```

**Endpoint: Update Vehicle Approval Rules**
```
PUT /admin/vehicle-approval-rules
Accepts all fields from GET response
```

---

## 3. 🔴 HIGH: AgreementsAndRentals (100% Missing)

### Current State
- ✅ Frontend: All agreement policy settings built
- ❌ Backend: No settings save endpoints exist

### Specific Missing Fields

#### Agreement Rules (ALL NOT SAVED)
```
✗ enforceDigitalSignature (toggle - ON)
  └─ Frontend: Toggle switch + description
  └─ Backend: no persistence

✗ mandatoryIDVerification (toggle - ON)
  └─ Frontend: Toggle switch + description
  └─ Backend: no persistence

✗ autoRenewalAllowed (toggle - OFF)
  └─ Frontend: Toggle switch + description
  └─ Backend: no persistence

✗ agreementTemplateType (select)
  └─ Frontend: Dropdown with options: "Standard Rental", "Corporate Rental"
  └─ Backend: no persistence
  └─ Cannot manage different agreement templates per type
```

#### Rental Period Rules (ALL NOT SAVED)
```
✗ minimumRentalPeriod (input + unit)
  └─ Frontend: Input shows "1" + dropdown: Days/Hours
  └─ Backend: no persistence
  └─ Cannot enforce minimum rental duration

✗ maximumRentalPeriod (input + unit)
  └─ Frontend: Input shows "12" + dropdown: Months/Weeks/Days
  └─ Backend: no persistence
  └─ Cannot enforce maximum rental duration

✗ agreementCancellationPolicy (select)
  └─ Frontend: Dropdown with 3 options:
      - "No cancellations allowed"
      - "Cancellations allowed with full refund"
      - "Cancellations allowed with partial refund"
  └─ Backend: no persistence
  └─ Cannot enforce cancellation policies

✗ lateReturnGracePeriod (input)
  └─ Frontend: Input shows "2" hours
  └─ Backend: no persistence
  └─ Cannot apply late fees after grace period expires
```

### Required Backend Implementation

**Endpoint: Get Agreement Rules**
```
GET /admin/agreement-rules
Response:
{
  enforceDigitalSignature: true,
  mandatoryIDVerification: true,
  autoRenewalAllowed: false,
  agreementTemplateType: "standard",
  minimumRentalPeriod: 1,
  minimumRentalPeriodUnit: "days",
  maximumRentalPeriod: 12,
  maximumRentalPeriodUnit: "months",
  cancellationPolicy: "partial_refund",
  lateReturnGracePeriodHours: 2
}
```

**Endpoint: Update Agreement Rules**
```
PUT /admin/agreement-rules
Accepts all fields from GET response
```

---

## 4. 🟡 MEDIUM: NotificationSettings (86% Missing)

### Current State
- ✅ Frontend: Full template builder with preview implemented
- ⚠️ Backend: Partial (only user-level endpoints exist, no admin API)

### Specific Missing Features

#### Template Management (NO ADMIN ENDPOINTS)
```
✗ New Template Button (+ icon)
  └─ Frontend: Button visible
  └─ Backend: No POST /admin/notification-templates endpoint
  └─ Cannot create templates

✗ Template List (sidebar showing existing templates)
  └─ Frontend: Shows "Booking Confirmation", "Payment Reminder"
  └─ Backend: No GET /admin/notification-templates endpoint
  └─ Cannot list templates for admin

✗ Edit Template (edit icon on existing templates)
  └─ Frontend: Edit button visible
  └─ Backend: No PUT /admin/notification-templates/:id endpoint
  └─ Cannot update templates

✗ Delete Template (trash icon on templates)
  └─ Frontend: Delete button visible
  └─ Backend: No DELETE /admin/notification-templates/:id endpoint
  └─ Cannot delete templates
```

#### Template Form Fields (NO PERSISTENCE)
```
✗ templateName (input field)
  └─ Frontend: Input shows "Vehicle Approval Confirmation"
  └─ Backend: User can type but changes not saved to DB

✗ eventType (select dropdown)
  └─ Frontend: Dropdown with 5 event types:
      1. Vehicle Approval
      2. Booking Confirmation
      3. Payment Reminder
      4. Driver Registration
      5. Rental Completion
  └─ Backend: No persistence of template-to-event mapping

✗ subjectLine (input field)
  └─ Frontend: Input shows "Your vehicle {{vehicle_name}} has been approved!"
  └─ Backend: No persistence

✗ emailBody (textarea)
  └─ Frontend: Large textarea with template text
  └─ Backend: No persistence

✗ templateVariables (available variables)
  └─ Frontend: Shows 6 available variables:
      - {{owner_name}}
      - {{vehicle_name}}
      - {{vehicle_reg}}
      - {{approval_date}}
      - {{platform_url}}
      - {{support_email}}
  └─ Backend: No database to track which variables are available
```

#### Channel Settings (NO ENDPOINTS)
```
✗ emailEnabled (toggle)
  └─ Frontend: Toggle switch
  └─ Backend: no GET/PUT endpoint

✗ smsEnabled (toggle)
  └─ Frontend: Toggle switch
  └─ Backend: no GET/PUT endpoint

✗ pushEnabled (toggle)
  └─ Frontend: Toggle switch
  └─ Backend: no GET/PUT endpoint
```

### Required Backend Implementation

**Endpoint: List Admin Notification Templates**
```
GET /admin/notification-templates
Response:
[
  {
    id: "template_1",
    name: "Vehicle Approval Confirmation",
    eventType: "Vehicle Approval",
    subjectLine: "Your vehicle {{vehicle_name}} has been approved!",
    emailBody: "Hello {{owner_name}},...",
    variables: ["owner_name", "vehicle_name", "vehicle_reg", "approval_date"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  }
]
```

**Endpoint: Create Notification Template**
```
POST /admin/notification-templates
Request:
{
  name: string,
  eventType: "Vehicle Approval" | "Booking Confirmation" | ...,
  subjectLine: string,
  emailBody: string,
  channel: "email" | "sms" | "push"
}
```

**Endpoint: Update Notification Template**
```
PUT /admin/notification-templates/:templateId
Same request body as POST
```

**Endpoint: Delete Notification Template**
```
DELETE /admin/notification-templates/:templateId
```

**Endpoint: Toggle Notification Channels**
```
GET /admin/notification-channels
Response:
{
  email: { enabled: true },
  sms: { enabled: true },
  push: { enabled: false }
}

PUT /admin/notification-channels/:channel/toggle
```

---

## 5. 🟡 MEDIUM: ReportsAndData (79% Missing)

### Current State
- ✅ Frontend: Export settings and data retention configuration built
- ⚠️ Backend: 50% done (report generation exists, config missing)

### Specific Missing Fields

#### Export Configuration (NO SAVE ENDPOINTS)
```
✗ allowedExportFormats (4 checkboxes)
  ✓ CSV (Comma Separated Values) - CHECKED
  ✓ Excel (.xlsx) - CHECKED
  ☐ PDF Document (.pdf) - UNCHECKED
  ☐ JSON (API Integration) - UNCHECKED
  └─ Backend: No API to save which formats are allowed
  └─ Cannot enforce format restrictions

✗ maximumExportRecords (select)
  └─ Frontend: Dropdown showing "10,000 records"
  └─ Options: 1k, 5k, 10k, 50k
  └─ Backend: No persistence in config

✗ exportFrequencyLimit (select)
  └─ Frontend: Dropdown showing "5 per hour"
  └─ Options: 1/hr, 5/hr, 10/hr, Unlimited
  └─ Backend: No rate limiting configuration
  └─ Cannot enforce export quotas

✗ sensitiveDataHandling (3 checkboxes)
  ✓ Mask personal identifiers (PII) - CHECKED
  ✓ Exclude payment details - CHECKED
  ☐ Watermark exports - UNCHECKED
  └─ Backend: No persistence
  └─ Cannot enforce data masking rules
```

#### Data Retention Policies (ALL NOT SAVED)
```
✗ activeRentalData (select)
  └─ Frontend: Select dropdown (shows duration)
  └─ Backend: no persistence
  └─ Cannot auto-delete old rental records

✗ completedRentalData (select)
  └─ Frontend: Select dropdown (shows "5 years")
  └─ Backend: no persistence
  └─ Cannot archive old completed rentals

✗ communicationRecords (select)
  └─ Frontend: Select dropdown (shows "1 year")
  └─ Backend: no persistence
  └─ Cannot auto-delete old messages

✗ userAccountData (select)
  └─ Frontend: Select dropdown (shows "2 years")
  └─ Backend: no persistence
  └─ Cannot auto-delete old user records

✗ vehicleHistoryData (select)
  └─ Frontend: Select dropdown (shows "5 years")
  └─ Backend: no persistence
  └─ Cannot auto-delete old vehicle history

✗ auditLogs (select)
  └─ Frontend: Select dropdown (shows "3 years")
  └─ Backend: no persistence
  └─ Cannot auto-delete old audit logs

✗ financialRecords (select)
  └─ Frontend: Select dropdown (shows "5 years")
  └─ Backend: no persistence
  └─ Cannot comply with financial regulations

✗ deletedUserData (select)
  └─ Frontend: Select dropdown (shows "30 days")
  └─ Backend: no persistence
  └─ Cannot permanently delete user data
```

#### Report Schedules (NO PERSISTENCE)
```
Four reports with configurable schedules:

✗ Financial Summary Report
  └─ Frontend: Schedule selector (shows "Daily")
  └─ Backend: no persistence

✗ Vehicle Performance Report
  └─ Frontend: Schedule selector (shows "Weekly")
  └─ Backend: no persistence

✗ Compliance Audit Report
  └─ Frontend: Schedule selector (shows "Monthly")
  └─ Backend: no persistence

✗ Customer Analytics Report
  └─ Frontend: Schedule selector (shows "Weekly")
  └─ Backend: no persistence
```

### Required Backend Implementation

**Endpoint: Get Export Settings**
```
GET /admin/export-settings
Response:
{
  allowedFormats: ["csv", "excel"],
  maxRecords: 10000,
  frequencyLimit: {
    count: 5,
    periodMinutes: 60
  },
  sensitiveDataHandling: {
    maskPII: true,
    excludePayments: true,
    watermarkExports: false
  }
}
```

**Endpoint: Update Export Settings**
```
PUT /admin/export-settings
Request: same as GET response
```

**Endpoint: Get Data Retention Policies**
```
GET /admin/data-retention-policies
Response:
{
  activeRentalData: "1 year",
  completedRentalData: "5 years",
  communicationRecords: "1 year",
  userAccountData: "2 years",
  vehicleHistoryData: "5 years",
  auditLogs: "3 years",
  financialRecords: "5 years",
  deletedUserData: "30 days"
}
```

**Endpoint: Update Data Retention Policies**
```
PUT /admin/data-retention-policies
Request: same as GET response
```

**Endpoint: Get Report Schedules**
```
GET /admin/report-schedules
Response:
{
  "Financial Summary": "daily",
  "Vehicle Performance": "weekly",
  "Compliance Audit": "monthly",
  "Customer Analytics": "weekly"
}
```

**Endpoint: Update Report Schedule**
```
PUT /admin/report-schedules/:reportName
Request: { schedule: "daily" | "weekly" | "monthly" | "quarterly" }
```

---

## 6. 🟡 MEDIUM: Integrations (71% Missing)

### Current State
- ✅ Frontend: All integration forms built with credential inputs
- ⚠️ Backend: 40% done (Stripe/PayPal work, others incomplete)

### Specific Missing Features

#### AWS SNS Integration (COMPLETELY MISSING)
```
✗ accessKeyId (input field)
  └─ Frontend: Input field visible
  └─ Backend: No save endpoint

✗ secretAccessKey (input field)
  └─ Frontend: Input field visible
  └─ Backend: No save endpoint

✗ region (select dropdown)
  └─ Frontend: Dropdown with AWS regions
  └─ Backend: No save endpoint

✗ Test Connection Button
  └─ Frontend: Button visible
  └─ Backend: No POST /admin/integrations/aws-sns/test-connection
```

#### Google Maps Integration (MISSING)
```
✗ apiKey (masked input)
  └─ Frontend: Input field visible
  └─ Backend: No save endpoint

✗ Test Connection Button
  └─ Frontend: Button visible
  └─ Backend: No test endpoint
```

#### Twilio SMS Integration (PARTIAL - MISSING TEST)
```
✗ accountSID (input)
  └─ Frontend: Shows masked value AC•••...
  └─ Backend: Likely partial

✗ authToken (masked input)
  └─ Frontend: Masked password field
  └─ Backend: Likely partial

✗ phoneNumber (input)
  └─ Frontend: Shows "+1 (555) 000-0000"
  └─ Backend: Likely partial

✗ Test Connection Button
  └─ Frontend: Button visible
  └─ Backend: No POST /admin/integrations/twilio/test-connection endpoint
```

#### PayPal Integration (PARTIAL - MISSING FULL SAVE)
```
✗ clientId (input)
  └─ Frontend: Input field
  └─ Backend: Partial - needs complete endpoint

✗ clientSecret (password input)
  └─ Frontend: Password field
  └─ Backend: Partial - needs complete endpoint

✗ environment (select)
  └─ Frontend: Dropdown: Sandbox | Production
  └─ Backend: Partial - needs to persist environment selection
```

#### SendGrid Email (PARTIAL)
```
✗ apiKey (input)
  └─ Frontend: Input field
  └─ Backend: Likely partial

✗ fromEmail (input)
  └─ Frontend: Input field
  └─ Backend: Needs persistence

✗ Test Connection Button
  └─ Frontend: Button visible
  └─ Backend: No complete test endpoint
```

#### Stripe Integration (PARTIAL)
```
✗ Publishable Key (input)
  └─ Frontend: Shows "pk_live_51..."
  └─ Backend: Partial

✗ Secret Key (masked)
  └─ Frontend: Masked password field
  └─ Backend: Partial

✗ Webhook URL (input)
  └─ Frontend: Shows "https://api.irent.com/webhooks/stripe"
  └─ Backend: Needs webhook configuration

✗ Test Connection Button
  └─ Frontend: Button visible
  └─ Backend: Partial - may not fully test webhook
```

### Required Backend Implementation

**Endpoint: Get Integration Config**
```
GET /admin/integrations/:provider
Response:
{
  provider: "stripe" | "paypal" | "twilio" | etc.,
  enabled: boolean,
  config: {
    // Provider-specific fields
  },
  lastTested: timestamp,
  status: "connected" | "disconnected" | "error"
}
```

**Endpoint: Save Integration Config**
```
POST /admin/integrations/:provider/config
Request:
{
  config: {
    // Provider-specific credentials
  }
}
```

**Endpoint: Test Integration Connection**
```
POST /admin/integrations/:provider/test-connection
Response:
{
  success: boolean,
  message: string,
  error: string (if failed)
}
```

---

## 7. 🟢 LOW: SystemSettings (63% Missing)

### Current State
- ✅ Frontend: Audit logs display and activity monitoring built
- ⚠️ Backend: 60% done (audit logs exist, export/backup missing)

### Specific Missing Features

#### Logs Export (MISSING)
```
✗ Export Logs Button
  └─ Frontend: Download button visible
  └─ Backend: No POST /admin/audit-logs/export endpoint
  └─ Cannot export audit logs to file

✗ Date Filter (calendar input)
  └─ Frontend: Calendar icon visible
  └─ Backend: No date range parameter support
```

#### Database Backup (COMPLETELY MISSING)
```
✗ Backup Database (action button)
  └─ Frontend: Not visible (but would be in full component)
  └─ Backend: No POST /admin/backup endpoint
  └─ Cannot backup database

✗ Backup Schedule (configuration)
  └─ Frontend: Not visible
  └─ Backend: No backup schedule persistence
  └─ Cannot automate backups
```

#### Logs Cleanup (MISSING)
```
✗ Cleanup Automation
  └─ Frontend: Not visible
  └─ Backend: No DELETE /admin/logs/cleanup endpoint
  └─ Cannot automatically clean old logs
```

### Required Backend Implementation

**Endpoint: Export Audit Logs**
```
POST /admin/audit-logs/export
Request:
{
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  format: "csv" | "json" | "pdf"
}
Response: File download
```

**Endpoint: Create Database Backup**
```
POST /admin/backup
Response:
{
  backupId: string,
  timestamp: string,
  size: number,
  status: "in_progress" | "completed" | "failed"
}
```

**Endpoint: List Backups**
```
GET /admin/backup/history
Response:
[
  {
    id: string,
    timestamp: string,
    size: number
  }
]
```

**Endpoint: Cleanup Old Logs**
```
DELETE /admin/logs/cleanup
Request:
{
  olderThanDays: 30
}
```

---

## Summary: Implementation Priority

### 🔴 CRITICAL (Start First)
1. **GeneralSettings** - Blocks admin functionality (21 fields)
   - Estimated effort: 2-3 hours
   - Impact: Very High (platform-wide settings)

### 🔴 HIGH (Second)
2. **VehiclesAndCompliance** - Breaks compliance rules (13 fields)
   - Estimated effort: 2-3 hours
   - Impact: High (safety/compliance)

3. **AgreementsAndRentals** - Breaks rental policies (9 fields)
   - Estimated effort: 1-2 hours
   - Impact: High (business operations)

### 🟡 MEDIUM (Third)
4. **Integrations** - Security/payment processing (20 fields)
   - Estimated effort: 3-4 hours
   - Impact: Medium-High (payment processing)

5. **NotificationSettings** - Communication templates (12 fields)
   - Estimated effort: 2-3 hours
   - Impact: Medium (admin templates needed)

6. **ReportsAndData** - Data management (15 fields)
   - Estimated effort: 2-3 hours
   - Impact: Medium (compliance/retention)

### 🟢 LOW (Last)
7. **SystemSettings** - Maintenance features (5 fields)
   - Estimated effort: 1-2 hours
   - Impact: Low (nice-to-have)

---

## Total Implementation Estimate
- **Total Missing Endpoints**: 27
- **Total Missing Fields**: 95
- **Estimated Total Effort**: 12-18 hours
- **Recommended Timeline**: 2-3 sprints

