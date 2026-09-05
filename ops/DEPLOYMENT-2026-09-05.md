# `welcome` deployment evidence — 2026-09-05

## Result

The `welcome` application and authoritative zone are active on the approved DigitalOcean `handout-iamthat` droplet at `167.71.215.247`. The Handshake parent update has been submitted by the owner but was not yet visible in the active recursive tree at the final check in this document.

## Installed state

- Release: `/opt/welcome-hns/releases/96162cc2d628`
- Active release: `/opt/welcome-hns/current`
- Release archive SHA-256: `a970bc6a8c0a896a8d7105b66cc1ef648e7edff11f2e7e53b31add89391b96ea`
- Knot zone serial: `2026090502`
- KSK: ECDSAP256SHA256, key tag `48802`
- ZSK: ECDSAP256SHA256, key tag `40180`
- DS: `48802 13 2 6A40B7CD158C45BA125549AE13096AE781F18522C3C7D08879326DBC45D6132C`
- TLSA: `3 1 1 7046abd89e6a7c70d9b4e50fc24b76039cb791a46aea10036c4ad7bc86943107`
- Certificate validity: 2026-09-05 05:05:58 UTC through 2027-09-05 05:05:58 UTC
- Private rollback evidence: `/var/backups/handout/welcome-activation-20260905T0530Z`

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
- `iamthat` remained active, returned HTTP/HTTPS 200, retained recursive `AD=true`, and retained its valid TLSA-to-SPKI match.
- The private pre-change archive and post-change evidence hashes verified successfully.

The first activation attempt was automatically rolled back because Knot could not read private keys imported as root. No parent or `iamthat` state was altered. The corrected activation imported the isolated keys as the `knot` service account and passed all checks.

## Remaining activation gate

Wait for the submitted Bob update to become active in the Handshake tree, then require all of the following through an independent recursive HNS resolver:

- `NS ns1.welcome.`
- `DS 48802 13 2 6A40B7CD158C45BA125549AE13096AE781F18522C3C7D08879326DBC45D6132C`
- `A 167.71.215.247`
- KSK `48802` and ZSK `40180`
- TLSA matching `7046abd89e6a7c70d9b4e50fc24b76039cb791a46aea10036c4ad7bc86943107`
- recursive `AD=true`
- HTTP 200 and HTTPS 200

Do not edit Bob again merely because confirmation and tree activation take time.
