# welcome/

A welcoming, health-checked directory for useful Handshake-native websites. The MVP is a static Vinext/React site: the approved catalog lives in Git, search and categories run in the browser, and monitoring proposes reviewable pull requests.

## Local development

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Run the release checks with:

```bash
npm test
npm run lint
npm run build
```

## Catalog updates

Edit `data/sites.json` only with verification evidence. Every entry keeps Unicode and ASCII/Punycode names, native and optional normal-browser URLs, protocol classification, verification time, health state, and a short evidence note.

`npm run catalog:refresh` refreshes only entries that a maintainer has already approved. It retries the endpoint feed three times, distinguishes DANE HTTPS, HTTP-only, invalid TLSA, and unknown states, and never imports a new third-party site. The scheduled workflow opens a pull request; it does not publish directly.

Site submissions arrive through the issue form after the GitHub repository is created. A maintainer verifies ownership context, content safety, DNSSEC, TLSA, HTTP/HTTPS behavior, and visitor value before editing the catalog.

## Deployment and rollback

The static build is in `dist/client`. Publish immutable releases identified by a Git tag and artifact checksum. HostLimo should point nginx at a versioned release directory and update a `current` symlink only after validation.

Rollback is a symlink change to the previously verified release followed by `nginx -t` and an approved reload. Application rollback does not change NS, GLUE, DS, DNSKEY, TLS keys, or TLSA. Preserve native HTTP and HTTPS as separate listeners.

No production deployment, DNS change, or on-chain transaction is authorized by this checkout.
