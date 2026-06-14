# email-service

Generic email service written in Node.js + TypeScript.

## Structure

This project follows the same architectural split used by `account-service`:

- `main.ts`: service entrypoint
- `config`: environment loading and validation
- `controller`: HTTP handlers
- `consumer`: message consumer kernel and transports
- `dto`: request/response contracts
- `infra`: external integrations
- `mailer`: email composition, template rendering, and mail transports
- `kernel`: app bootstrap and error handling
- `middlewares`: global and route middleware
- `packages`: shared helpers
- `route`: route registration
- `service`: business logic
- `template`: email HTML templates and template renderers

Module folders expose their wiring from `init.ts`. The service entrypoint stays at `main.ts`.

## API

### `GET /v1/email/health`

Health check endpoint.

### `POST /v1/email/send`

Send a generic email.

Example request:

```json
{
  "to": ["user@example.com"],
  "subject": "Sign in to Gauas",
  "template": "verification",
  "data": {
    "productName": "Gauas",
    "code": "A9C4H2",
    "logoUrl": "https://cdn.gauas.com/gauas/images/public/a_20260614_062644_0000.jpg",
    "footerLinks": [
      { "label": "Gauas", "url": "https://gauas.com" },
      { "label": "Product", "url": "https://gauas.com/product" },
      { "label": "Company", "url": "https://gauas.com/company" }
    ]
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

If `SECRET_KEY` is set, requests to `/v1/email/send` must include:

```txt
Secret-Key: <SECRET_KEY>
```

## Consumer

The service starts the HTTP API and the queue consumer in the same process. Set `MQ_URL` to consume from a RabbitMQ-compatible AMQP queue. If `MQ_URL` is empty, only the HTTP API starts.

Message format:

```json
{
  "id": "evt-1",
  "type": "email.send",
  "payload": {
    "to": "user@example.com",
    "subject": "Hello",
    "text": "Plain text body"
  }
}
```
