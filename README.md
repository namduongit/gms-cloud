# LinkBeam URL Shortener & Cloud Storage
**React SPA + Go (Gin) API for shortening links and storing personal files**  
_Backend: Go 1.22 + Gin + GORM | Frontend: React + Vite + TypeScript_

---
## 1. Getting Started

### Clone the repository
```bash
git clone https://github.com/namduongit/go-shortener
cd go-shortener
```

### Project layout
The backend lives in this repository; the React client consumes the exposed REST API.
```text
url-shorter/
├── client/ 					# Client side (React)
├── cmd/                        # Go entrypoints (main.go bootstraps Gin server)
├── internal/
│   ├── config/                 # AppConfig, env loader, Gin response helpers
│   ├── handler/                # Auth, URL, and file HTTP handlers
│   ├── middleware/             # JWT auth middleware
│   ├── repository/             # Database access layer (GORM)
│   ├── service/                # Business logic for URLs & files
│   └── utils/                  # JWT helpers, misc utilities
├── storage/                    # Uploaded file payloads
├── go.mod / go.sum             # Go module definition
└── README.md                   # You are here
```
---
## 2. Environment Configuration
- Duplicate `.env.example` to `.env` and fill in:
	- `HOST`, `PORT` for public base URL (e.g. `http://localhost:8080`).
	- PostgreSQL credentials (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).
	- `JWT_SECRET` for signing access tokens.
- Optional: adjust URL/file limits in the seed data for user plans.

**Frontend**: create `web/.env` (or equivalent) with `VITE_API_BASE=http://localhost:8080` and enable `withCredentials` for Axios/fetch so cookies flow between SPA and API.

---
## 3. Integrated Services
- **JWT Auth**: Login returns an HttpOnly cookie (`accessToken`) plus profile metadata.
- **URL Shortening**: Generates 6-character codes per user with per-plan quotas.
- **Cloud-like File Storage**: Upload arbitrary files, download via signed route, list/delete per account.
- **Plans & Limits**: Basic `Free` plan included; extend via `model.Plan` seeds.
- **CORS**: Configured for `http://localhost:5173` by default; tweak in `internal/router/router.go`.

Documentation for new integrations lives under `HELP.md` or inline package comments.

---
## 4. Running the Stack
### Docker Compose
```bash
docker compose up -d    # start API + database + client side
docker compose logs -f  # tail logs
```

### Local commands
- Backend (hot reload friendly): `go run ./cmd/main.go`
- Frontend (from UI repo): `npm install && npm run dev`

Use `golang-migrate` or `gorm.AutoMigrate` to keep the schema aligned with models.

---
## 5. API Highlights
| Area | Endpoint | Notes |
|------|----------|-------|
| Auth | `POST /auth/register` | Creates account with default Free plan. |
|      | `POST /auth/login`    | Sets `accessToken` cookie; returns profile payload. |
|      | `GET /auth/config`    | Validates cookie; returns boolean for SPA bootstrapping. |
| URLs | `GET /api/urls/`      | Authenticated list of user URLs. |
|      | `POST /api/urls/`     | Creates short link, enforces per-plan quota. |
|      | `GET /api/urls/:code` | Redirects to long URL (no auth required). |
| Files| `GET /api/files/`     | Lists uploaded files for the account. |
|      | `POST /api/files/`    | Multipart upload stored under `storage/`. |
|      | `GET /api/files/:name`| Streams file content; auth required. |

All responses follow the `RestFulResponse` envelope defined in `internal/config/rest_ful.go`.

---
## 6. Deployment Notes
- Set `HOST` to your HTTPS domain so cookies are marked `Secure`.
- Configure an object store (S3, GCS, Azure Blob) for production file retention; the `storage/` folder is fine for development only.
- Rotate `JWT_SECRET` regularly and consider shortening token TTL in `utils.GenerateToken` for stricter policies.

---
## 7. Contact
- **Author**: Duong Nguyen
- **Email**: nguyennamduong205@gmail.com
- **GitHub**: [namduongit](https://github.com/namduongit)
