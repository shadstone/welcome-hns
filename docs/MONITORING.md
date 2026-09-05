# Catalog monitoring model

The public catalog is generated from a small approved list. Endpoint monitors may update technical facts, but they are not a source of editorial trust.

## Classification

- `dane_https`: secure DNSSEC and valid TLSA evidence plus a non-server-error HTTPS response.
- `http_only`: a usable native HTTP response without valid DANE HTTPS.
- `invalid_tlsa`: TLSA exists but does not validate; always unavailable in the portal.
- `unknown`: missing or inconclusive evidence; never healthy.

Resolver and connection timeouts are retried three times. A single timeout cannot turn a healthy entry into a confirmed outage. Human review is required for health downgrades, content changes, new entries, and featured placement.

The workflow sends only public DNS and endpoint metadata to GitHub. Wallet records, portfolio exports, private keys, tokens, internal Atlas data, and owner contact details are excluded.
