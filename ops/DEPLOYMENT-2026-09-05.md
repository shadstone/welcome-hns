# `welcome` deployment evidence — 2026-09-05

## Result

The `welcome` application, authoritative zone, and Handshake parent delegation are active on the approved DigitalOcean `handout-iamthat` droplet at `167.71.215.247`. The community-feedback release was deployed on 2026-09-06 after pull request 1 merged.

## Installed state

- Release: `/opt/welcome-hns/releases/b2784a9e808c`
- Active release: `/opt/welcome-hns/current`
- Release archive SHA-256: `8103fa6d207aa2b7d6d1f5196c312be93ac39dadf22a59b8f737208419f8be41`
- Knot zone serial: `2026090502`
- KSK: ECDSAP256SHA256, key tag `48802`
- ZSK: ECDSAP256SHA256, key tag `40180`
- DS: `48802 13 2 6A40B7CD158C45BA125549AE13096AE781F18522C3C7D08879326DBC45D6132C`
- TLSA: `3 1 1 7046abd89e6a7c70d9b4e50fc24b76039cb791a46aea10036c4ad7bc86943107`
- Certificate validity: 2026-09-05 05:05:58 UTC through 2027-09-05 05:05:58 UTC
- Private rollback evidence: `/var/backups/handout/welcome-activation-20260905T0530Z`
- Pre-update web rollback evidence: `/var/backups/handout/welcome-web-20260906T0457Z`
- Previous release retained for rollback: `/opt/welcome-hns/releases/96162cc2d628`

Private DNSSEC and TLS keys remain on the managed host and are not present in Git.

## Validation

- Candidate and live Knot configurations passed `conf-check`.
- The source zone passed `kzonecheck`.
- Candidate and live nginx configurations passed `nginx -t`.
- Direct authoritative `NS`, `A`, `DNSKEY`, and `TLSA` answers contain RRSIGs.
- Direct HTTP returns 200.
- Direct HTTPS returns 200 and serves the same portal bytes as HTTP.
- `/healthz` returns 200 over HTTP and HTTPS.
- The live certificate SPKI equals the TLSA digest.
- The KSK independently calculates to the submitted DS.
- Independent recursive answers for `NS`, `DS`, `A`, `DNSKEY`, and `TLSA` return `AD=true`.
- The community-feedback release removes the misleading `hnsai` listing, makes healthy cards full-card links, and fixes the narrow mobile headline overlap.
- `iamthat` remained active, returned HTTP/HTTPS 200, retained recursive `AD=true`, and retained its valid TLSA-to-SPKI match.
- The private activation backup and 2026-09-06 pre-update backup verified successfully.

The first activation attempt was automatically rolled back because Knot could not read private keys imported as root. No parent or `iamthat` state was altered. The corrected activation imported the isolated keys as the `knot` service account and passed all checks.

## Activated parent resource

The Bob update created at block `345713` became effective at block `345744`. On 2026-09-06, an independent recursive HNS resolver returned the following complete validated chain:

- `NS ns1.welcome.`
- `DS 48802 13 2 6A40B7CD158C45BA125549AE13096AE781F18522C3C7D08879326DBC45D6132C`
- `A 167.71.215.247`
- KSK `48802` and ZSK `40180`
- TLSA matching `7046abd89e6a7c70d9b4e50fc24b76039cb791a46aea10036c4ad7bc86943107`
- recursive `AD=true`
- HTTP 200 and HTTPS 200

No DNS, DNSSEC, certificate, TLSA, or Bob Wallet records changed during the 2026-09-06 application deployment.
