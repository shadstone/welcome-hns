# Bob Wallet records for `welcome/`

Do not broadcast this update until the HostLimo zone is signed and every pending value below has been independently verified.

## Records entered in Bob

For an in-zone nameserver at `ns1.welcome.`, the intended complete parent resource is:

```text
GLUE4
  Nameserver: ns1.welcome.
  IPv4:       PENDING_HOSTLIMO_IPV4

DS
  Key tag:    PENDING_KSK_KEY_TAG
  Algorithm:  13
  Digest type: 2
  Digest:     PENDING_KSK_SHA256_DIGEST
```

The final period in `ns1.welcome.` is required. A Handshake `GLUE4` record produces both the NS referral and the IPv4 glue, so do not add a duplicate NS record for this design. Do not add SYNTH4 alongside it.

Before submitting, compare Bob's complete queued record set with the current name resource. An update replaces the whole resource, so retain any unrelated records unless their removal is separately reviewed.

## Records that do not go in Bob

These are served from the signed HostLimo authoritative zone:

```text
welcome.             SOA     ...
welcome.             NS      ns1.welcome.
ns1.welcome.         A       PENDING_HOSTLIMO_IPV4
welcome.             A       PENDING_HOSTLIMO_IPV4
welcome.             DNSKEY  257 3 13 PENDING_KSK_PUBLIC_KEY
welcome.             DNSKEY  256 3 13 PENDING_ZSK_PUBLIC_KEY
_443._tcp.welcome.   TLSA    3 1 1 PENDING_TLS_SPKI_SHA256
                     RRSIG   generated for every signed RRset
```

TLSA is not a Handshake parent-resource record. It must be published and signed by the authoritative DNS server. The DS placed in Bob authenticates the zone's KSK; it must be calculated from the exact fresh `welcome` DNSKEY.

## Safe order

1. Confirm the intended HostLimo IPv4 and server identity.
2. Back up the server configuration and establish rollback.
3. Generate fresh `welcome`-only KSK, ZSK and TLS private key on that host.
4. Stage and validate the signed zone, nginx HTTP/HTTPS configuration and immutable site release.
5. Calculate the DS and TLSA independently, then verify the signed zone directly.
6. Review Bob's exact before/after resource without broadcasting.
7. After explicit approval, submit the update and record its transaction ID.
8. Wait for Handshake tree activation, then verify recursive `AD=true`, DNSKEY, TLSA, HTTP 200, HTTPS 200 and the live certificate SPKI match.

Never copy a DS, TLSA, DNSKEY or key file from `iamthat`, `xn--e88h` or another name.
