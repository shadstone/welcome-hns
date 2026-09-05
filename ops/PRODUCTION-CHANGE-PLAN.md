# `welcome` production change plan

Prepared on 2026-09-05 for the approved DigitalOcean droplet `handout-iamthat` (`167.71.215.247`). This document contains public values only. It is a proposal, not evidence that the service or Handshake parent resource is live.

## Staged identity

- Immutable application commit: `96162cc2d628`
- Release archive SHA-256: `a970bc6a8c0a896a8d7105b66cc1ef648e7edff11f2e7e53b31add89391b96ea`
- Fresh `welcome` KSK: ECDSAP256SHA256, key tag `48802`
- Fresh `welcome` ZSK: ECDSAP256SHA256, key tag `40180`
- KSK DNSKEY: `257 3 13 Gs+i86fLAcDkZ40/50Zrj0+cYDvdG6Ci7VqPxNuavUhvV7GuJe0OFxmP5QQgbPxQ3PKr8lgm3EJcufh8mekuZQ==`
- TLSA `3 1 1` SPKI SHA-256: `7046abd89e6a7c70d9b4e50fc24b76039cb791a46aea10036c4ad7bc86943107`
- Certificate SANs: `welcome`, `*.welcome`
- Certificate validity: 2026-09-05 05:05:58 UTC through 2027-09-05 05:05:58 UTC
- Root-only staging directory: `/var/lib/handout/staging/welcome-20260905T0510Z`

The DNSSEC and TLS private keys exist only in that root-only server staging directory. They are not stored in Git and are not shared with `iamthat`.

## HNS parent resource

Current activated recursive state: no `NS`, `GLUE4`, `DS`, `A`, `DNSKEY`, or `TLSA` answers for `welcome`.

Proposed Bob Wallet resource entries:

```text
GLUE4  ns1.welcome.  167.71.215.247
DS     48802  13  2  6A40B7CD158C45BA125549AE13096AE781F18522C3C7D08879326DBC45D6132C
```

`GLUE4` supplies the `NS ns1.welcome.` referral and IPv4 glue for this in-zone nameserver. Do not add `SYNTH4`. Bob replaces the full resource, so the controlling wallet must be read immediately before signing and any unrelated records must be preserved.

## Proposed live files

- Release: `/opt/welcome-hns/releases/96162cc2d628/`
- Active release symlink: `/opt/welcome-hns/current`
- Zone: `/var/lib/handout/zones/welcome.zone`
- Certificate: `/var/lib/handout/certs/welcome.crt`
- TLS private key: `/var/lib/handout/certs/welcome.key`
- nginx site: `/etc/nginx/sites-available/welcome.conf`
- nginx enablement: `/etc/nginx/sites-enabled/welcome.conf`
- Knot configuration: add a separate `welcome.` zone using the existing `handout-default` template and DNSSEC signing
- Knot KASP: import the staged `welcome` KSK and ZSK; never share `iamthat` keys

The proposed public zone is in `ops/proposed/welcome.zone`; the proposed dual HTTP/HTTPS vhost is in `ops/proposed/welcome.nginx.conf`.

## Approval-gated live sequence

1. Re-read the Bob controlling output and complete parent resource.
2. Create a dated private backup of Knot configuration/KASP state, nginx configuration, Handout manifest, zones, certificates, and current release state; record hashes and verify the archive.
3. Install the immutable release, `welcome` certificate/key, and unsigned source zone without enabling them.
4. Import only the staged `welcome` KSK and ZSK into Knot's live KASP database.
5. Install the candidate nginx and Knot configuration.
6. Validate with `nginx -t`, `knotc conf-check`, zone semantic checks, release checksum, certificate/key equality, independent DS calculation, and independent TLSA calculation.
7. Reload Knot and nginx only after validation succeeds.
8. Verify direct authoritative signed `NS`, `A`, `DNSKEY`, and `TLSA`, plus HTTP and HTTPS by pinned IP. The public resolver will still have no delegation at this point.
9. Present the final Bob before/after resource again and obtain explicit on-chain approval.
10. Submit the Bob update, retain the transaction ID, and wait for tree activation separately from confirmation.
11. Require recursive `AD=true`, DS-to-KSK validation, TLSA-to-live-SPKI equality, HTTP 200, HTTPS 200, `/healthz` 200, and HNS browser verification before declaring launch complete.

## Rollback

Before parent publication, rollback is local: restore the dated backup, disable the `welcome` nginx vhost and Knot zone, restore the prior configs, validate, reload, and leave Bob unchanged.

After parent publication, first restore the last known-good server state. If the new delegation itself must be withdrawn, use a separate explicitly approved Bob update based on the captured pre-change resource. Never alter or remove `iamthat` records or keys as part of `welcome` rollback.
