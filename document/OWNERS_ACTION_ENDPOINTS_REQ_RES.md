# Owners Action Endpoints - Frontend Request/Response Contract

This document describes the owner action endpoints used by the Owners Directory action column:

- Review: eye icon
- Edit: pencil icon
- Delete: trash icon

Base URL comes from `NEXT_PUBLIC_API_BASE_URL`; the frontend default is:

```text
http://localhost:5000/api/v1
```

All requests are sent with:

```http
Authorization: Bearer <admin_token>
Content-Type: application/json
```

The frontend stores the token in `localStorage.admin_token` and sends cookies with `credentials: include`.

## Owner Id Requirement

The owners list response must include a stable backend id for actions:

```json
{
  "data": {
    "owners": [
      {
        "_id": "665f0f4b6f1a9a0012ab1234",
        "ownerIdDisplay": "OWN-2F9",
        "name": "Jack Hault"
      }
    ]
  }
}
```

The frontend sends `_id` as `{ownerId}`. `ownerIdDisplay` is only shown in the table.

## 1. Review Owner

Used when the admin clicks the eye icon.

```http
GET /admin/owners/{ownerId}
```

### Path Params

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| `ownerId` | string | Yes | Backend owner id, usually Mongo `_id`. |

### Request Body

No body.

### Success Response

```json
{
  "success": true,
  "message": "Owner fetched successfully",
  "data": {
    "_id": "665f0f4b6f1a9a0012ab1234",
    "ownerIdDisplay": "OWN-2F9",
    "name": "Jack Hault",
    "email": "jack@gmail.com",
    "phone": "0401234654",
    "status": "Active",
    "complianceStatus": "Compliant",
    "vehiclesCount": 0,
    "activeListings": 0,
    "revenue": "0",
    "joinDate": "2026-06-09T05:12:00.000Z",
    "avatar": "https://example.com/avatar.jpg",
    "profile": {},
    "vehiclesList": [],
    "documents": [],
    "activityLog": []
  }
}
```

### Frontend Mapping

| API Field | UI Field |
| --- | --- |
| `_id` | action id |
| `ownerIdDisplay` | displayed ID |
| `name` | owner name |
| `email` | email |
| `phone` | phone |
| `status` | status badge |
| `complianceStatus` | compliance badge |
| `vehiclesCount` | vehicles |
| `activeListings` | active listings |
| `revenue` | revenue |
| `joinDate` | joined |

## 2. Edit Owner

Used when the admin saves the pencil icon edit form.

```http
PUT /admin/owners/{ownerId}
```

### Path Params

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| `ownerId` | string | Yes | Backend owner id, usually Mongo `_id`. |

### Request Body

```json
{
  "name": "Jack Hault",
  "email": "jack@gmail.com",
  "phone": "0401234654",
  "status": "Active",
  "complianceStatus": "Compliant"
}
```

### Field Rules

| Field | Type | Required | Allowed Values / Notes |
| --- | --- | --- | --- |
| `name` | string | Yes | Trimmed owner display name. |
| `email` | string | Yes | Valid email address. |
| `phone` | string | No | Phone number shown in admin table. |
| `status` | string | Yes | `Active`, `Suspended`. |
| `complianceStatus` | string | Yes | `Compliant`, `Has Issues`, `Expiring Soon`. |
| `notes` | string | No | Optional backend audit note. |

### Success Response

```json
{
  "success": true,
  "message": "Owner updated successfully",
  "data": {
    "_id": "665f0f4b6f1a9a0012ab1234",
    "ownerIdDisplay": "OWN-2F9",
    "name": "Jack Hault",
    "email": "jack@gmail.com",
    "phone": "0401234654",
    "status": "Active",
    "complianceStatus": "Compliant",
    "vehiclesCount": 0,
    "activeListings": 0,
    "revenue": "0",
    "joinDate": "2026-06-09T05:12:00.000Z",
    "updatedAt": "2026-06-09T06:00:00.000Z"
  }
}
```

## 3. Delete Owner

Used when the admin confirms the trash icon delete action.

```http
DELETE /admin/owners/{ownerId}
```

### Path Params

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| `ownerId` | string | Yes | Backend owner id, usually Mongo `_id`. |

### Request Body

No body.

### Success Response

```json
{
  "success": true,
  "message": "Owner deleted successfully",
  "data": {
    "ownerId": "665f0f4b6f1a9a0012ab1234",
    "deletedAt": "2026-06-09T06:10:00.000Z"
  }
}
```

## Error Response

All three endpoints should use this error shape:

```json
{
  "success": false,
  "message": "Owner not found"
}
```

Expected status codes:

| Status | Meaning |
| --- | --- |
| `400` | Invalid request body or invalid owner id. |
| `401` | Missing or expired admin token. |
| `403` | Admin does not have owner management permission. |
| `404` | Owner does not exist. |
| `409` | Edit/delete is blocked by active rentals, finance records, or other dependencies. |
| `500` | Server error. |

## Frontend Behavior

- Review opens a read-only side panel.
- Edit opens a side panel form and refreshes the current owners page after save.
- Delete uses a confirmation prompt, calls the delete endpoint, then refreshes the current page.
- If the last row on a page is deleted, the frontend moves back one page when possible.
