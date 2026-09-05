#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const source = process.env.HNS_DIRECTORY_SOURCE || 'https://hns.denuoweb.com/hns-live/data/sites.json';
const catalogPath = resolve('data/sites.json');
const attempts = 3;

async function fetchWithRetry(url) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((done) => setTimeout(done, attempt * 1_500));
    }
  }
  throw new Error(`Monitor unavailable after ${attempts} attempts: ${lastError?.message || 'unknown error'}`);
}

function stateFor(row) {
  if (row.dane_status === 'valid' && row.https_status_code && row.https_status_code < 500) return { protocol: 'dane-https', health: 'healthy', monitorState: 'dane_https' };
  if (String(row.tlsa_status || '').startsWith('present') && row.dane_status !== 'valid') return { protocol: 'unknown', health: 'unavailable', monitorState: 'invalid_tlsa' };
  if (row.http_status_code && row.http_status_code < 400) return { protocol: 'native-http', health: row.listing_state === 'degraded' ? 'degraded' : 'healthy', monitorState: 'http_only' };
  return { protocol: row.http_status_code ? 'native-http' : 'unknown', health: 'unavailable', monitorState: 'unknown' };
}

const [catalog, remote] = await Promise.all([
  readFile(catalogPath, 'utf8').then(JSON.parse),
  fetchWithRetry(source),
]);
const rows = new Map((remote.rows || []).map((row) => [row.root_name, row]));
const updated = catalog.map((site) => {
  const row = rows.get(site.asciiName);
  if (!row) return site;
  const status = stateFor(row);
  return {
    ...site,
    ...status,
    lastVerified: row.checked_at || site.lastVerified,
    verifiedLabel: row.checked_at ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(row.checked_at)) : site.verifiedLabel,
    evidence: `DenuoWeb monitor: DNSSEC ${row.dnssec_status || 'unknown'}, DANE ${row.dane_status || 'unknown'}, HTTP ${row.http_status_code ?? 'none'}, HTTPS ${row.https_status_code ?? 'none'}; ${row.checked_at || 'time unavailable'}.`,
  };
});
await writeFile(catalogPath, `${JSON.stringify(updated, null, 2)}\n`);
console.log(`Updated ${updated.filter((site) => rows.has(site.asciiName)).length} approved entries; no new sites added.`);
