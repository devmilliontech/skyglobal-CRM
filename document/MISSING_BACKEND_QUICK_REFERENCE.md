# Missing Backend Features - Quick Reference

## 🚨 SUMMARY: What Frontend Has vs Backend Missing

**Total Gap: 95 missing backend features across 8 components (66% incomplete)**

---

## 1. 🔴 CRITICAL: GeneralSettings - 100% Missing (21 Features)

Frontend Has | Backend Missing | Severity
---|---|---
Platform name/URL inputs | No endpoint to save | CRITICAL
Language, Currency, Timezone dropdowns | No dropdown data endpoint | CRITICAL
Maintenance mode toggle | No toggle endpoint | CRITICAL
2FA enable/disable | No 2FA settings endpoint | CRITICAL
IP whitelisting toggle | No IP whitelist endpoint | CRITICAL
RBAC toggle | No RBAC toggle endpoint | CRITICAL
Password policy settings | No password policy endpoint | CRITICAL
Session timeout configuration | No session config endpoint | CRITICAL

**What you need to build:**
```
GET /admin/general-settings
PUT /admin/general-settings
POST /admin/general-settings/toggle/:feature
```

---

## 2. 🔴 HIGH: VehiclesAndCompliance - 13 Features Missing

Frontend Has | Backend Missing | Severity
---|---|---
Vehicle approval toggles (manual/auto) | Not saved anywhere | HIGH
Min vehicle age input | No DB field | HIGH
Max odometer reading input | No DB field | HIGH
Required documents checklist | No way to mark mandatory docs | HIGH
Approval SLA/turnaround time | No way to track SLA | HIGH
8 compliance rule toggles | None are saved | HIGH
Insurance verification toggle | Partial support | HIGH
Suspension rules toggle | Not saved | HIGH

**What you need to build:**
```
GET /admin/vehicle-approval-rules
PUT /admin/vehicle-approval-rules
POST /admin/vehicle-approval-rules/required-documents
```

---

## 3. 🔴 HIGH: AgreementsAndRentals - 9 Features Missing

Frontend Has | Backend Missing | Severity
---|---|---
Digital signature enforcement toggle | Not saved | HIGH
Mandatory ID verification toggle | Not saved | HIGH
Auto-renewal allowed toggle | Not saved | HIGH
Minimum rental period input | Not saved | HIGH
Maximum rental period input | Not saved | HIGH
Cancellation policy selector | No cancellation rules | HIGH
Late return grace period | No grace period logic | HIGH
Agreement template type selector | No template variants | HIGH

**What you need to build:**
```
GET /admin/agreement-rules
PUT /admin/agreement-rules
POST /admin/agreement-rules/templates
```

---

## 4. 🟡 MEDIUM: NotificationSettings - 12 Features Missing

Frontend Has | Backend Missing | Severity
---|---|---
Create Template button | No POST endpoint | MEDIUM
Template list sidebar | No GET list endpoint | MEDIUM
Edit template icon | No PUT endpoint | MEDIUM
Delete template icon | No DELETE endpoint | MEDIUM
Template name input | No persistence | MEDIUM
Event type selector | No template-event mapping | MEDIUM
Email subject input | Not saved | MEDIUM
Email body textarea | Not saved | MEDIUM
6 template variables | No DB of available variables | MEDIUM
Email enabled toggle | No persistence | MEDIUM
SMS enabled toggle | No persistence | MEDIUM
Push enabled toggle | No persistence | MEDIUM

**What you need to build:**
```
GET /admin/notification-templates
POST /admin/notification-templates
PUT /admin/notification-templates/:id
DELETE /admin/notification-templates/:id
GET /admin/notification-channels
PUT /admin/notification-channels/:channel/toggle
```

---

## 5. 🟡 MEDIUM: ReportsAndData - 15 Features Missing

Frontend Has | Backend Missing | Severity
---|---|---
Export format checkboxes (CSV, Excel, PDF, JSON) | No format restrictions | MEDIUM
Max export records selector | No record limit | MEDIUM
Export frequency limit (5/hour) | No rate limiting | MEDIUM
PII masking checkbox | No data masking logic | MEDIUM
Payment details exclusion | No data filtering | MEDIUM
Watermark exports checkbox | No watermarking | MEDIUM
8 data retention selectors | None persisted | MEDIUM
Active rental retention | No auto-delete logic | MEDIUM
Completed rental retention (5yr) | No archive logic | MEDIUM
Communication records (1yr) | No cleanup job | MEDIUM
Financial records (5yr) | No compliance logic | MEDIUM
4 report schedule selectors | None persisted | MEDIUM
Daily/Weekly/Monthly schedule options | No scheduling | MEDIUM

**What you need to build:**
```
GET /admin/export-settings
PUT /admin/export-settings
GET /admin/data-retention-policies
PUT /admin/data-retention-policies
GET /admin/report-schedules
PUT /admin/report-schedules/:reportName
```

---

## 6. 🟡 MEDIUM: Integrations - 20 Features Missing

### AWS SNS (Completely Missing)
Frontend Has | Backend Missing
---|---
Access Key input | No save endpoint
Secret Access Key input | No save endpoint
Region selector | No save endpoint
Test Connection button | No test endpoint

### Google Maps (Completely Missing)
Frontend Has | Backend Missing
---|---
API Key input | No save endpoint
Test Connection button | No test endpoint

### Twilio SMS (Partial)
Frontend Has | Backend Missing
---|---
Account SID input | Likely partial
Auth Token input | Likely partial
Phone Number input | Likely partial
Test Connection button | No test endpoint

### Email Service (SendPulse)
Frontend Has | Backend Missing
---|---
API Key input | Partial support
Test Connection button | Partial test

### Cloudinary
Frontend Has | Backend Missing
---|---
Cloud Name input | Partial support
API Key input | Partial support
Upload Preset input | Partial support
Test Connection button | No test endpoint

**What you need to build:**
```
POST /admin/integrations/aws-sns/test-connection
POST /admin/integrations/google-maps/test-connection
POST /admin/integrations/twilio/test-connection
POST /admin/integrations/sendpulse/test-connection
POST /admin/integrations/cloudinary/test-connection
(Complete endpoints for save/update for each)
```

---

## 7. 🟢 LOW: SystemSettings - 5 Features Missing

Frontend Has | Backend Missing | Severity
---|---|---
Audit logs display | Partial (no export) | LOW
System health metrics | Partial (no detailed export) | LOW
Export logs button | No export endpoint | LOW
Database backup button | No backup endpoint | LOW
Backup history display | No backup history API | LOW

**What you need to build:**
```
POST /admin/system/backup
GET /admin/system/backup/history
POST /admin/logs/export
POST /admin/logs/cleanup
```

---

## 📊 Quick Implementation Checklist

### Week 1 (Critical - 2-3 days)
- [ ] GeneralSettings endpoints (2-3 hrs)
- [ ] VehiclesAndCompliance rules (2-3 hrs)
- [ ] AgreementsAndRentals rules (1-2 hrs)

### Week 2 (High Priority - 2-3 days)
- [ ] NotificationSettings template CRUD (2-3 hrs)
- [ ] ReportsAndData config endpoints (2-3 hrs)
- [ ] Integrations test endpoints (2-3 hrs)

### Week 3 (Medium Priority - 2-3 days)
- [ ] Data retention policies implementation (2-3 hrs)
- [ ] Export settings and rate limiting (2-3 hrs)
- [ ] System backup/logs endpoints (1-2 hrs)

---

## 🎯 Impact by Component

### Frontend-Backend Gaps by Percentage
```
GeneralSettings:        ████████████████████ 100% (21/21 missing)
AgreementsAndRentals:   ████████████████████ 100% (9/9 missing)
VehiclesAndCompliance:  ██████████████████░░ 87% (13/15 missing)
NotificationSettings:   ██████████████████░░ 86% (12/14 missing)
ReportsAndData:         ████████████████░░░░ 79% (15/19 missing)
Integrations:           ████████████████░░░░ 71% (20/28 missing)
SystemSettings:         ███████████░░░░░░░░░ 63% (5/8 missing)
─────────────────────────────────────────────────────
OVERALL:                ██████████████░░░░░░ 66% (95/144 missing)
```

### Total Effort Estimate
| Component | Hours | Priority |
|-----------|-------|----------|
| GeneralSettings | 2-3 | CRITICAL |
| VehiclesAndCompliance | 2-3 | CRITICAL |
| AgreementsAndRentals | 1-2 | CRITICAL |
| NotificationSettings | 2-3 | HIGH |
| ReportsAndData | 2-3 | HIGH |
| Integrations | 3-4 | HIGH |
| SystemSettings | 1-2 | MEDIUM |
| **TOTAL** | **16-20** | - |

---

## 🔧 Files You Need to Create/Update

### New Backend Controllers
```
backend/src/controllers/admin/generalSettings.controller.js
backend/src/controllers/admin/vehicleApprovalRules.controller.js
backend/src/controllers/admin/agreementRules.controller.js
backend/src/controllers/admin/exportSettings.controller.js
backend/src/controllers/admin/dataRetention.controller.js
```

### New Backend Routes
```
backend/src/routes/v1/admin/general-settings.route.js
backend/src/routes/v1/admin/vehicle-rules.route.js
backend/src/routes/v1/admin/agreement-rules.route.js
backend/src/routes/v1/admin/export-settings.route.js
backend/src/routes/v1/admin/data-retention.route.js
```

### Database Updates
```
Update SystemConfig model - add general settings fields
Update complianceRules in Vehicle/Compliance - add missing fields
Update Agreement model - add agreement rules fields
Create NotificationTemplate model (if not exists)
Create ExportSettings model
Create DataRetentionPolicy model
```

### Frontend Service Layer (Missing entirely)
```
frontend/src/services/api/settings.service.js
frontend/src/services/api/admin.service.js
frontend/src/services/api/compliance.service.js
frontend/src/services/api/agreements.service.js
frontend/src/services/api/notifications.service.js
frontend/src/services/api/reports.service.js
frontend/src/services/api/integrations.service.js
```

---

## 🚀 Start Here

**Pick ONE component to start:**

1. **GeneralSettings** (FASTEST TO SEE RESULTS)
   - Simplest structure
   - Single GET/PUT endpoint
   - No complex logic
   - 2-3 hours complete

2. **VehiclesAndCompliance** (MOST IMPORTANT)
   - Safety-related rules
   - Already has 30% backend done
   - High impact for users
   - 2-3 hours to complete

**Don't start with Integrations** - too many separate providers, comes later.
