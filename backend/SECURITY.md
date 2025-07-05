# 🔒 Security Guidelines

## 🚨 Reporting Security Vulnerabilities

If you discover a security vulnerability, please report it responsibly:

- **Email**: security@elyanalyzer.com
- **Subject**: `[SECURITY] Brief description`
- **Please do NOT** create public GitHub issues for security vulnerabilities

We will respond within 24 hours and work with you to resolve the issue.

## 🛡️ Security Features Implemented

### ✅ Authentication & Authorization
- **JWT Token Validation**: All API endpoints validate Supabase JWT tokens
- **Admin Role Checking**: Admin endpoints verify user role in metadata
- **Protected Routes**: Authentication middleware applied to all sensitive endpoints
- **Token Expiration**: Automatic token validation with Supabase auth service
- **PKCE Flow**: Enhanced OAuth security with Proof Key for Code Exchange

### ✅ API Security
- **CORS Protection**: Configured for specific origins only
- **Rate Limiting**: Implemented per-IP rate limiting with configurable limits
- **Input Validation**: Comprehensive input sanitization on all endpoints
- **Request Timeouts**: 30-second timeout on all API requests
- **Security Headers**: Complete set of security headers implemented

### ✅ Data Privacy
- **User Data Isolation**: All queries filtered by authenticated user ID
- **Row Level Security**: Supabase RLS policies enforce data access rules
- **Admin Data Protection**: Admin functions require explicit admin role verification
- **No Data Leakage**: Dashboard stats show only user-specific data
- **Log Sanitization**: Sensitive data automatically redacted from logs

### ✅ Environment Security
- **Environment Variables**: Sensitive keys moved to environment variables
- **No Hardcoded Secrets**: API keys and database credentials externalized
- **Fallback Protection**: Graceful degradation when environment variables missing
- **Strong JWT Secrets**: Auto-generated 256-bit secrets with validation

### ✅ Frontend Security
- **Content Security Policy**: Strict CSP implemented across all apps
- **Input Sanitization**: Client-side input validation and sanitization
- **XSS Protection**: Multiple layers of XSS prevention
- **Secure Storage**: Validated authentication token storage

## 🛡️ Security Headers Implemented

### Backend Security Headers
```go
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; ...
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload (production only)
```

### Frontend Security Headers
```html
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Content-Security-Policy: default-src 'self'; ...
```

## 🚫 Input Validation & Sanitization

### Backend Validation
- **Project Names**: Alphanumeric, spaces, hyphens, underscores only (1-100 chars)
- **File Paths**: Path traversal prevention, invalid character filtering
- **Email Addresses**: RFC-compliant email validation
- **Scan Types**: Whitelist of allowed scan types only

### Frontend Validation
- **Email**: Format validation and sanitization
- **Names**: Character filtering and length limits
- **General Input**: Dangerous character removal

## 🔐 Rate Limiting

- **Default**: 60 requests per minute per IP
- **Burst Handling**: Configurable burst limit
- **Headers**: Rate limit status exposed via headers
- **Bypass**: Health checks excluded from rate limiting

## 🚫 Path Security

### Allowed Directories
- `/home` (Linux/macOS user directories)
- `/Users` (macOS user directories) 
- `/workspace` (Development environments)

### Blocked Directories
- `/etc` (System configuration)
- `/proc` (Process information)
- `/sys` (System information)
- `/dev` (Device files)
- `/root` (Root user directory)
- `/boot` (Boot files)

## 🔍 Logging Security

### Automatic Redaction
- JWT tokens and bearer tokens
- API keys and secrets
- Password fields
- IP addresses in error messages

### Log Patterns
```regex
(token|key|secret|password|bearer)\s*[:=]\s*\S+ → ***REDACTED***
\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b → [IP]
```

## 🚨 Recent Security Enhancements (2024-12-20)

### Critical Fixes
1. **Rate Limiting Implementation**: Added comprehensive rate limiting middleware
2. **Content Security Policy**: Strict CSP implemented across all applications
3. **Input Validation**: Server-side and client-side input sanitization
4. **Log Security**: Automatic sensitive data redaction
5. **Path Traversal Prevention**: Enhanced file path validation
6. **Request Timeouts**: Added timeout protection against hanging requests

### Security Headers Added
1. **Referrer-Policy**: Prevents referrer leakage
2. **Permissions-Policy**: Blocks unwanted browser features
3. **CSP**: Prevents XSS and injection attacks
4. **HSTS**: Forces HTTPS in production (when available)

## ✅ Updated Security Checklist

- [x] Environment variables configured
- [x] Supabase RLS policies enabled
- [x] JWT authentication implemented
- [x] Admin role verification added
- [x] User data isolation enforced
- [x] HTTPS enforced in production
- [x] **Rate limiting implemented**
- [x] CORS origins restricted
- [x] **Comprehensive security headers implemented**
- [x] **Input validation and sanitization added**
- [x] **Content Security Policy implemented**
- [x] **Log sanitization implemented**
- [x] **Path traversal prevention enhanced**
- [ ] JWT secrets rotated regularly
- [ ] Database backups enabled
- [ ] Monitoring and alerting setup
- [ ] Penetration testing conducted

## 🔄 Security Monitoring

### Metrics to Track
- Failed authentication attempts
- Rate limit violations
- CSP violations
- Unusual file access patterns
- Admin privilege escalations

### Alert Conditions
- Multiple failed login attempts from same IP
- Rate limit exceeded consistently
- Access to restricted system paths
- CSP violations detected
- Large number of validation errors

## 🚨 Incident Response Procedure

1. **Detection**: Automated monitoring alerts or manual discovery
2. **Assessment**: Determine scope, impact, and root cause
3. **Containment**: 
   - Block malicious IPs via rate limiting
   - Revoke compromised tokens
   - Disable affected accounts if necessary
4. **Eradication**: Fix vulnerability and update security measures
5. **Recovery**: Restore normal operations with enhanced monitoring
6. **Lessons Learned**: Document incident and improve security measures

## 📋 Security Testing

### Automated Tests
- OWASP ZAP integration
- Rate limiting verification
- Input validation testing
- CSP compliance checking

### Manual Testing
- Penetration testing (quarterly)
- Social engineering awareness
- Access control verification
- Data leakage assessment

## 📞 Emergency Contacts

- **Primary Security**: security@elyanalyzer.com
- **Development Team**: dev@elyanalyzer.com  
- **Infrastructure**: ops@elyanalyzer.com
- **Supabase Support**: support@supabase.com

---

**Security is a continuous process. This document is updated regularly to reflect the latest security measures and best practices.** 🛡️ 