import { describe, expect, it } from 'vitest';
import type { SiteEntry } from './catalog';
import { classifyStatus, matchesSite, nativeUrlForName } from './catalog';

const site: SiteEntry = {
  unicodeName: '🛒', asciiName: 'xn--e88h', title: 'The Handshake Cart', description: 'A market',
  category: 'Shops and Markets', nativeUrl: 'https://xn--e88h/', protocol: 'dane-https',
  lastVerified: '2026-09-05T00:00:00Z', verifiedLabel: 'Sep 5', health: 'healthy', featured: false,
  symbol: '🛒', evidence: 'fixture',
};

describe('catalog filtering', () => {
  it('matches Unicode, Punycode, title, and category', () => {
    expect(matchesSite(site, '🛒')).toBe(true);
    expect(matchesSite(site, 'XN--E88H')).toBe(true);
    expect(matchesSite(site, 'cart')).toBe(true);
    expect(matchesSite(site, 'markets')).toBe(true);
    expect(matchesSite(site, 'games')).toBe(false);
  });
});

describe('native URL handling', () => {
  it('normalizes Unicode roots to HTTPS Punycode URLs', () => expect(nativeUrlForName('🛒/')).toBe('https://xn--e88h/'));
  it('accepts an HNS root and rejects paths, ICANN-style names, and unsafe text', () => {
    expect(nativeUrlForName('iamthat')).toBe('https://iamthat/');
    expect(nativeUrlForName('example.com')).toBeNull();
    expect(nativeUrlForName('iamthat/path')).toBeNull();
    expect(nativeUrlForName('javascript:alert(1)')).toBeNull();
  });
});

describe('status classification', () => {
  it('requires valid DANE plus a non-server-error HTTPS response for DANE health', () => {
    expect(classifyStatus({ daneStatus: 'valid', httpsStatus: 200 })).toEqual({ protocol: 'dane-https', health: 'healthy' });
    expect(classifyStatus({ daneStatus: 'invalid', httpsStatus: 200 })).toEqual({ protocol: 'unknown', health: 'unavailable' });
  });
  it('distinguishes HTTP-only and repeated failure states', () => {
    expect(classifyStatus({ httpStatus: 200 })).toEqual({ protocol: 'native-http', health: 'healthy' });
    expect(classifyStatus({ httpStatus: 200, consecutiveFailures: 2 })).toEqual({ protocol: 'native-http', health: 'degraded' });
    expect(classifyStatus({ httpStatus: 500 })).toEqual({ protocol: 'native-http', health: 'unavailable' });
  });
});
