# email-service

Generic email service written in Node.js + TypeScript.

## Structure

This project follows the same architectural split used by `account-service`:

- `cmd`: service entrypoint
- `config`: environment loading and validation
- `controller`: HTTP handlers
- `dto`: request/response contracts
- `infra`: external integrations
- `kernel`: app bootstrap and error handling
- `middlewares`: global and route middleware
- `packages`: shared HTTP response helpers
- `route`: route registration
- `service`: business logic
- `supports`: template rendering support

## API

### `GET /v1/email/health`

Health check endpoint.

### `POST /v1/email/send`

Send a generic email.

Example request:

```json
{
  "to": ["user@example.com"],
  "subject": "Verify your email",
  "template": "verification",
  "data": {
    "productName": "Gauas",
    "recipientName": "Bao",
    "actionUrl": "https://gauas.com/verify",
    "actionLabel": "Verify Email"
  }
}
```

You can also send raw content:

```json
{
  "to": "user@example.com",
  "subject": "Hello",
  "text": "Plain text body",
  "html": "<p>HTML body</p>"
}
```

## Environment

Copy `.env.example` into `.env` and adjust values.

- `MAIL_MODE=log`: log payload instead of sending
- `MAIL_MODE=smtp`: send via SMTP using `SMTP_*`

If `INTERNAL_API_KEY` is set, requests to `/v1/email/send` must include:

```txt
x-api-key: <INTERNAL_API_KEY>
```
