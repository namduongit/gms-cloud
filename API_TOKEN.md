# API Token Routes

Tai lieu nay mo ta cac API trong nhom route `/api/token`.

## Base route

- Prefix: `/api/token`
- Middleware: `APIMiddleware`

## Xac thuc bat buoc

Moi request den `/api/token/*` phai gui day du 2 header:

- `X-Public-Key`: public token
- `X-Private-Key`: private token

Neu thieu hoac sai key, API se tra ve loi.

## 1) Upload image

- Method: `POST`
- Path: `/api/token/upload-image`
- Content-Type: `multipart/form-data`

### Request

Form-data fields:

- `file` (file, required): tep can upload
- `folder` (string, optional): UUID cua folder muon luu tep vao

Headers:

- `X-Public-Key` (required)
- `X-Private-Key` (required)

### cURL example

```bash
curl -X POST "http://localhost:8080/api/token/upload-image" \
  -H "X-Public-Key: gpk_public_xxx" \
  -H "X-Private-Key: gsk_private_xxx" \
  -F "file=@/path/to/avatar.png" \
  -F "folder=optional-folder-uuid"
```

### Success response

HTTP status: `200 OK`

```json
{
  "code": 200,
  "message": "Success",
  "errs": null,
  "data": {
    "uuid": "1d4fb4b4-0dbb-4f2f-bcf2-04e2618c7e7d",
    "file_name": "avatar.png",
    "file_type": "image",
    "content_type": "image/png",
    "public_url": "http://localhost:8080/api/public/images/1d4fb4b4-0dbb-4f2f-bcf2-04e2618c7e7d"
  }
}
```

### Error responses

#### 403 Forbidden - Missing API key

```json
{
  "code": 403,
  "message": "Forbidden",
  "errs": "Missing API key",
  "data": null
}
```

#### 401 Unauthorized - Invalid token

```json
{
  "code": 401,
  "message": "Unauthorized",
  "errs": "Invalid token",
  "data": null
}
```

#### 401 Unauthorized - Account not found

```json
{
  "code": 401,
  "message": "Unauthorized",
  "errs": "Account not found",
  "data": null
}
```

#### 400 Bad Request - Invalid request body

```json
{
  "code": 400,
  "message": "Invalid request",
  "errs": "Invalid request body",
  "data": null
}
```

#### 400 Bad Request - Storage limit exceeded

```json
{
  "code": 400,
  "message": "Invalid request",
  "errs": "Storage limit exceeded",
  "data": null
}
```

#### 500 Internal Server Error

```json
{
  "code": 400,
  "message": "Invalid request",
  "errs": "<error message>",
  "data": null
}
```

Ghi chu: Truong hop nay HTTP status la `500`, nhung `code` trong body hien tai dang la `400` theo implementation trong handler.

## 2) Delete image

Route `DELETE /api/token/delete-image` hien chua implement trong handler, nen tam thoi bo qua.
