# IGBC AI Platform API Testing Guide

## Files

- Postman collection: `src/docs/IGBC-AI-Platform.postman_collection.json`
- Sample request bodies: `src/docs/sample-api-request-bodies.json`
- Seed data script: `src/docs/mongodb-seed-data.js`

## Seed Accounts

Run the seed script before the full workflow so admin and assessor users exist:

```bash
node src/docs/mongodb-seed-data.js
```

Seeded credentials:

- Admin: `admin.tester@igbc.local` / `Admin123!`
- Assessor: `assessor.tester@igbc.local` / `Assessor123!`
- Company: `company.tester@igbc.local` / `Company123!`

Fixed seeded IDs:

- Assessor ID: `665000000000000000000002`
- Seed project ID: `665000000000000000000102`
- Seed document ID: `665000000000000000000201`
- Seed assessment ID: `665000000000000000000301`
- Seed report ID: `665000000000000000000401`
- Seed certificate number: `IGBC-2026-SEED0001`

## Required API Execution Order

Use `http://localhost:5000` as `baseUrl`.

1. `GET /health`
   Confirms server is running.

2. `POST /api/auth/login`
   Login as seeded admin. Store `data.token` as `adminToken`.

3. `POST /api/auth/login`
   Login as seeded assessor. Store `data.token` as `assessorToken`.

4. `POST /api/auth/register`
   Register a company user. Store `data.token` as `companyToken`.

5. `POST /api/projects`
   Use `companyToken`. Store `data.project._id` as `projectId`.

6. `POST /api/documents/upload`
   Use `companyToken`. Send multipart form-data:
   - `projectId`: stored project ID
   - `category`: `Energy`
   - `file`: attach a PDF/XLSX/XLS/PNG/JPG/JPEG file using field name `file`
   Store `data.document._id` as `documentId`.

7. `POST /api/assessments`
   Use `adminToken`. Create an assessment for `projectId` and seeded assessor ID `665000000000000000000002`.
   Store `data.assessment._id` as `assessmentId`.

8. `POST /api/ai/analyze/:documentId`
   Use `assessorToken`. This validates the uploaded document and updates document AI fields.

9. `POST /api/ai/score/:projectId`
   Use `assessorToken`. This generates AI score data for the assigned assessment.

10. `GET /api/ai/recommendations/:projectId`
    Use `assessorToken`. Review project recommendations.

11. `POST /api/assessments/:id/submit`
    Use `assessorToken`. Submit the assessment with an eligible rating such as `Gold`.

12. `POST /api/reports/generate/:projectId`
    Use `assessorToken`. Body must include `reportType` and `assessmentId`.
    Store `data.report._id` as `reportId`.

13. `POST /api/certificates/generate/:projectId`
    Use `adminToken`. Requires a completed eligible assessment.
    Store `data.certificate._id` as `certificateId` and `data.certificate.certificateNumber` as `certificateNumber`.

14. `GET /api/certificates/verify/:certificateNumber`
    Use `adminToken`. Certificate verification is currently protected by JWT.

15. `GET /api/dashboard/stats`
    Use `adminToken`. Confirms aggregate counts for the workflow.

## Notes

- Public registration intentionally creates `company` users only.
- Admin and assessor test users must be seeded because role escalation through registration is blocked.
- `POST /api/documents/upload` requires a real local file in Postman.
- AI validation is mock plus parser-backed for PDF/Excel documents.
- Certificate generation requires `Assessment.status = Completed` and `rating != NotEligible`.
