# Driver Admin Postman - Start To End

This guide matches the admin frontend driver module in this repo.

Postman collection:

`document/postman/Driver_Admin_Start_To_End.postman_collection.json`

API base from this project:

`https://skyglobal-server.onrender.com/api/v1`

## 1. Import

1. Open Postman.
2. Import `document/postman/Driver_Admin_Start_To_End.postman_collection.json`.
3. Open collection variables.
4. Update:
   - `baseUrl`
   - `adminEmail`
   - `adminPassword`
   - `driverId` if you want to test a specific driver.

## 2. Run Order

Run requests in this order:

1. `00 - Auth / Admin Login`
2. `01 - Driver List And Profile / List Drivers`
3. `01 - Driver List And Profile / Get Driver Profile`
4. `02 - Create And Update Driver / Update Driver Profile`
5. `03 - Documents And KYC / Get Driver Documents`
6. `03 - Documents And KYC / Approve Driver Document` or `Reject Driver Document`
7. `03 - Documents And KYC / Add Driver Internal Note`
8. `04 - Export / Export Drivers CSV`

The login request stores `data.token` into `adminToken`. All protected requests use `Authorization: Bearer {{adminToken}}`.

## 3. Endpoints Included

Auth:

```txt
POST /admin/auth/login
```

Drivers:

```txt
GET  /admin/drivers?limit=1
GET  /admin/drivers?page=1&limit=25
GET  /admin/drivers?page=1&limit=25&search=David&status=Active&kycStatus=Pending
GET  /admin/drivers/:driverId
POST /admin/drivers
PUT  /admin/drivers/:driverId
GET  /admin/drivers/:driverId/edit-history
```

Documents and KYC:

```txt
GET   /admin/drivers/:driverId/documents
PATCH /admin/drivers/:driverId/documents/:documentId/status
POST  /admin/drivers/:driverId/notes
GET   /admin/kyc/queue?page=1&limit=25&status=Pending
```

Export:

```txt
POST /admin/export/drivers
GET  /admin/export/history
```

## 4. Driver Profile Response

Frontend accepts either:

```json
{
  "success": true,
  "data": {
    "_id": "6a279251de01546cb1d641ec",
    "name": "David",
    "email": "david2@millionhits.com.au",
    "phone": "0401234578",
    "driverId": "DRV-2026-4224",
    "avatar": "https://example.com/uploads/david.jpg",
    "kycStatus": "Pending",
    "accountStatus": "Active",
    "licenseExpiry": "2027-12-31",
    "visaExpiry": "2027-12-31",
    "createdAt": "2026-06-09T00:00:00.000Z"
  }
}
```

or:

```json
{
  "success": true,
  "data": {
    "driver": {
      "_id": "6a279251de01546cb1d641ec",
      "personalInformation": {
        "firstName": "David",
        "email": "david2@millionhits.com.au",
        "phone": "0401234578"
      },
      "systemInformation": {
        "driverId": "DRV-2026-4224",
        "kycStatus": "Pending",
        "accountStatus": "Active"
      },
      "documentInformation": {
        "driverLicenceNumber": "DL-123",
        "licenceExpiryDate": "2027-12-31",
        "visaExpiryDate": "2027-12-31"
      }
    }
  }
}
```

Recommended backend shape is the nested `data.driver` version because it maps directly to the profile and edit pages.

## 5. Create Driver Request

`POST /admin/drivers` uses `multipart/form-data`.

Text fields:

```txt
firstName
middleName
lastName
dob
email
phone
password
addressLine1
addressLine2
driverLicenceNumber
licenceExpiry
passportNumber
visaExpiry
abn
accountStatus
kycStatus
```

File fields:

```txt
licenceFront
licenceBack
passport
proofOfAddress
```

## 6. Update Driver Request

`PUT /admin/drivers/:driverId` uses JSON.

The collection sends both flat and nested fields so it works with either backend implementation.

Minimum useful payload:

```json
{
  "firstName": "David",
  "email": "david2@millionhits.com.au",
  "phone": "0401234578",
  "accountStatus": "Active",
  "kycStatus": "Pending",
  "reasonForChange": "Postman profile update test"
}
```

Recommended backend behavior:

1. Validate driver id.
2. Validate admin token.
3. Validate editable fields.
4. Compare old and new values.
5. Update changed fields only.
6. Write edit history record with `reasonForChange`.
7. Return updated driver.

## 7. Edit History Backend Gap

The frontend can navigate to the audit tab, but a real edit-history endpoint should exist for complete Postman/backend support:

```txt
GET /admin/drivers/:driverId/edit-history?page=1&limit=25
```

Expected response:

```json
{
  "success": true,
  "data": {
    "history": [
      {
        "_id": "history-id",
        "driverId": "6a279251de01546cb1d641ec",
        "adminId": "admin-id",
        "adminName": "Sarah Admin",
        "reasonForChange": "Updated phone number",
        "changes": [
          {
            "field": "phone",
            "oldValue": "0400000000",
            "newValue": "0401234578"
          }
        ],
        "createdAt": "2026-06-10T09:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalDocuments": 1
    }
  }
}
```

If this endpoint returns `404`, backend still needs to implement edit history.

## 8. Common Errors

`401 Token is missing`

Run `Admin Login` first and check `adminToken`.

`404 Driver not found`

Use `List Drivers` first. It stores the first returned id into `driverId`.

`documentId is empty`

Run `Get Driver Documents` first. It stores the first document id into `documentId`.

Image not showing in frontend:

Backend should return one of:

```txt
avatar
profileImage
profilePhoto
image
personalInformation.avatar
user.avatar
```

If returning relative image paths, use paths like `/uploads/drivers/photo.jpg`; frontend converts them to the API host.
