# Security Policy

## Authentication & Authorization
SkillTrack Maharashtra employs a strict Zero-Trust security model.
1. **Authentication**: Handled via Supabase Auth (JWT).
2. **Authorization**: Handled via Supabase Row Level Security (RLS) policies at the database layer.
3. **Route Protection**: Handled via Next.js Edge Middleware.

## Role-Based Access Control (RBAC) Matrix
| Role | Trainee Data | Employer Data | Provider Data | System Logs |
|------|--------------|---------------|---------------|-------------|
| **Trainee** | Own only | None | None | None |
| **Employer**| Hired only | Own only | None | None |
| **Provider**| Enrolled only| None | Own only | None |
| **Gov Admin**| All | All | All | All |

## Reporting a Vulnerability
If you discover a security vulnerability within SkillTrack Maharashtra, please send an e-mail to security@maharashtra.gov.in. All security vulnerabilities will be promptly addressed.

## Security Controls
- **Input Validation**: All API inputs are validated using Zod.
- **SQL Injection**: Prevented globally by using Supabase PostgREST, which uses parameterized queries exclusively.
- **XSS Mitigation**: React escapes all string variables automatically. Content Security Policy (CSP) headers are strictly enforced.
- **CSRF Mitigation**: Next.js automatically protects against CSRF on API routes.
- **Secrets Management**: No secrets are committed to Git. `.env.local` contains all credentials. `NEXT_PUBLIC_` is strictly omitted for sensitive keys (e.g., Service Role keys).
