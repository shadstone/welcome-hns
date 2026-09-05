# Bob Wallet records for `welcome/`

Do not broadcast this update until the HostLimo zone is signed and every pending value below has been independently verified.

## Records entered in Bob

For an in-zone nameserver at `ns1.welcome.`, the proposed complete parent resource is:

```text
GLUE4
  Nameserver: ns1.welcome.
  IPv4:       167.71.215.247

DS
  Key tag:    48802
  Algorithm:  13
  Digest type: 2
  Digest:     6A40B7CD158C45BA125549AE13096AE781F18522C3C7D08879326DBC45D6132C
```

These values were staged and independently calculated on 2026-09-05. The owner submitted them in Bob on 2026-09-05; confirmation and active-tree publication must still be verified independently.

The final period in `ns1.welcome.` is required. A Handshake `GLUE4` record produces both the NS referral and the IPv4 glue, so do not add a duplicate NS record for this design. Do not add SYNTH4 alongside it.

Before submitting, compare Bob's complete queued record set with the current name resource. An update replaces the whole resource, so retain any unrelated records unless their removal is separately reviewed.

## Records that do not go in Bob

These are served from the signed HostLimo authoritative zone:

```text
welcome.             SOA     ...
welcome.             NS      ns1.welcome.
ns1.welcome.         A       167.71.215.247
welcome.             A       167.71.215.247
welcome.             DNSKEY  257 3 13 Gs+i86fLAcDkZ40/50Zrj0+cYDvdG6Ci7VqPxNuavUhvV7GuJe0OFxmP5QQgbPxQ3PKr8lgm3EJcufh8mekuZQ==
welcome.             DNSKEY  256 3 13 shZB12aO2+zsKoT3vJ7I7qzEP/6hod5p4pbMuQMv8R48oILASM5pfbvqJJirO1KiH147ZsH0WHg9U/mrWKEGgg==
_443._tcp.welcome.   TLSA    3 1 1 7046abd89e6a7c70d9b4e50fc24b76039cb791a46aea10036c4ad7bc86943107
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
