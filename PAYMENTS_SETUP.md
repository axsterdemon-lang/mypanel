# Receipt upload and payment review

## What is implemented

Buy Now opens a checkout with bank, eZ Cash and Binance receiving instructions. Product prices and the payable total are calculated on the server. Each order has a random customer access token stored in that customer's browser (not in a shareable URL).

JPG, PNG, WEBP and PDF slips up to 3 MB are stored privately. Optional English image OCR runs on the customer's device with Tesseract.js; it downloads OCR engine/language assets. PDFs require manual field entry. No external generative AI service receives the slip. OCR and customer-entered fields are untrusted review evidence. The system compares receiving account, amount/currency, Sri Lanka date/time and reference, and conditionally reserves exact file hashes and reference numbers against cross-order reuse. Edited images, OCR errors and fabricated slip contents still need human review.

Payments always enter `pending_review`. Only an authenticated owner can approve after explicitly checking the actual incoming transaction. Approval records the decision and note. This does not automatically deliver any product. Bank, eZ Cash or Binance transaction APIs/webhooks are not connected; no claim of automatic funds verification is made.

## Enable locally

Add these to an ignored `.env.local` file. Use a new, unique password of at least 16 characters; do not use any bank/account password.

```dotenv
PAYMENT_ADMIN_PASSWORD=replace-with-a-long-unique-owner-password
```

Checkout enables when the owner password is configured. Optional `PAYMENTS_ENABLED=false` pauses new payments. Optional `PAYMENT_LKR_PER_USD` overrides the existing store rate of 300. This is a fixed LKR pricing conversion, not a live market exchange rate. Binance totals are quoted in USDT. The existing receiving ID must be confirmed inside Binance before sending; do not send to an unrecognized recipient. No crypto wallet address or network is configured.

Restart `npm run dev`. Visit `/checkout?product=starter-100&device=Android`. Review at `/admin/payments` using the new owner password. Development data goes into ignored `.payment-data/`; never place that directory in `public/` or upload it to Git.

## Enable on Netlify

1. Deploy this source with the existing Next.js runtime, build command `npm run build`, publish `.next-dev`.
2. Under this project's Environment variables (not Team shared variables), set `PAYMENT_ADMIN_PASSWORD` to the new unique password. Use the default All scopes and the same value across deploy contexts on the Free plan, then redeploy. Do not use a `NEXT_PUBLIC_` prefix for the password. No other variable is required; optional overrides are described above.
3. Production uses the site's private Netlify Blobs store `private-payment-orders-v1` with strong consistency. It fails closed if storage is unavailable; production never uses local disk. Verify an upload and owner download on the deployed function before accepting customer payments.
4. Check merchant receiving details in `src/lib/payments/config.ts`. These reuse the receiving details confirmed by the owner in this chat. The owner must confirm that the Binance receiving ID works with the intended transfer method before advertising Binance payments.
5. Visit `/admin/payments` to review slips. Compare against the actual provider transaction ledger; never approve based only on matching OCR fields. Customers see updates at `/order-confirmation` in the browser where they placed the order.

## Operational limits

Basic per-IP rate limits and file signature checks are included. Rate-limit keys use a hash and retain per-time-window counters. No automated expiry, malware scanner, account recovery, notifications, refund flow, settlement reconciliation, or receipt-retention deletion job is configured. Configure a retention/deletion policy and stronger abuse protection before large-scale use. Logs must not include slips, customer access tokens or owner passwords.

For automatic approval, implement an authenticated provider transaction feed/webhook with signature validation, replay protection, ledger uniqueness, exact recipient/amount/currency matching, and settlement checks. Binance public market-data tools cannot verify private incoming transfers. A screenshot or an AI classification must never stand in for this feed.
