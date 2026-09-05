'use client';

import { ArrowRight, BookOpen, Check, ChevronDown, Compass, ExternalLink, Gamepad2, Globe2, Heart, Landmark, Search, ShieldCheck, Sparkles, Store, Users, Wrench } from 'lucide-react';
import { useMemo, useState } from 'react';
import catalog from '@/data/sites.json';
import type { Category, SiteEntry } from '@/lib/catalog';
import { matchesSite, nativeUrlForName } from '@/lib/catalog';

const sites = catalog as SiteEntry[];
const categories: Array<{ id: Category | 'All'; label: string; icon: typeof Gamepad2 }> = [
  { id: 'All', label: 'All places', icon: Compass },
  { id: 'Games and Fun', label: 'Games & fun', icon: Gamepad2 },
  { id: 'Community', label: 'Community', icon: Users },
  { id: 'Tools and Browsers', label: 'Tools & browsers', icon: Wrench },
  { id: 'Identity and Profiles', label: 'Identity', icon: Heart },
  { id: 'Shops and Markets', label: 'Shops & markets', icon: Store },
  { id: 'Learning', label: 'Learning', icon: BookOpen },
  { id: 'Experimental', label: 'Experimental', icon: Sparkles },
];
const statusCopy = { healthy: 'Working now', degraded: 'Needs another look', unavailable: 'Temporarily unavailable' };

function SiteCard({ site, featured = false }: { site: SiteEntry; featured?: boolean }) {
  const isAvailable = site.health !== 'unavailable';
  return (
    <article className={`site-card ${featured ? 'featured-card' : ''}`}>
      <div className="card-topline">
        <span className="site-mark" aria-hidden="true">{site.symbol}</span>
        <div className="badge-row" aria-label="Site status"><span className={`status-dot ${site.health}`} /><span>{statusCopy[site.health]}</span></div>
      </div>
      <div>
        <p className="eyebrow">{site.category}</p><h3>{site.title}</h3><p className="native-name">{site.unicodeName}/</p>
        <p className="description">{site.description}</p>
      </div>
      <div className="card-footer">
        <div className="protocols">
          {site.protocol === 'dane-https' && <span className="protocol dane"><ShieldCheck size={13} /> DANE HTTPS</span>}
          {site.protocol === 'native-http' && <span className="protocol http">Native HTTP</span>}
          <span className="verified">Checked {site.verifiedLabel}</span>
        </div>
        {isAvailable ? <a className="open-link" href={site.nativeUrl} aria-label={`Open ${site.title}`}>Open <ArrowRight size={16} /></a> : <span className="open-link disabled">Paused</span>}
      </div>
    </article>
  );
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [copied, setCopied] = useState(false);
  const visibleSites = useMemo(() => sites.filter((site) => (category === 'All' || site.category === category) && matchesSite(site, query)), [category, query]);
  const featured = sites.filter((site) => site.featured && site.health === 'healthy');

  function goToHns(event: { preventDefault(): void }) {
    event.preventDefault();
    const exact = sites.find((site) => [site.unicodeName, site.asciiName].some((name) => name.toLocaleLowerCase() === query.trim().toLocaleLowerCase()));
    const destination = exact?.health !== 'unavailable' ? exact?.nativeUrl : nativeUrlForName(query);
    if (destination) window.location.assign(destination);
  }

  async function copySubmissionTemplate() {
    const template = `Handshake site submission\n\nNative name:\nPunycode name (if any):\nSite title:\nCategory:\nNative HTTP URL:\nNative HTTPS URL:\nNormal-browser URL (optional):\nWhy it belongs in welcome/:\nOwner contact:\n`;
    await navigator.clipboard.writeText(template); setCopied(true); window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <main>
      <header className="topbar">
        <a href="#top" className="brand" aria-label="welcome home"><span className="brand-sun" aria-hidden="true"><Globe2 size={22} /></span><span>welcome<span className="slash">/</span></span></a>
        <nav aria-label="Main navigation"><a href="#directory">Explore</a><a href="#new-to-hns">How it works</a><a href="#submit">Add your site</a></nav>
        <a className="small-cta" href="#new-to-hns">New to HNS?</a>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy">
          <p className="kicker"><span /> Your friendly doorway to the Handshake web</p>
          <h1>Where would you<br />like to <em>go?</em></h1>
          <p className="hero-intro">Discover useful, curious, and genuinely working places on the decentralized web.</p>
          <form className="go-box" onSubmit={goToHns}>
            <Search aria-hidden="true" size={21} /><label className="sr-only" htmlFor="hns-search">Search or enter a Handshake name</label>
            <input id="hns-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search, or type an HNS name…" autoComplete="off" />
            <button type="submit">Go <ArrowRight size={17} /></button>
          </form>
          <p className="search-hint"><ShieldCheck size={14} /> Health checked before a site is recommended</p>
        </div>
        <aside className="hero-note" aria-label="About this directory"><span className="note-number">01</span><p>Like the web’s earliest directories, but made for what comes next.</p><div className="orbit" aria-hidden="true"><span /><span /><span /></div></aside>
      </section>

      <section className="featured-section" aria-labelledby="featured-heading">
        <div className="section-heading"><div><p className="eyebrow">Good places to begin</p><h2 id="featured-heading">Featured & verified</h2></div><p>Small signals, checked carefully. Every featured destination was recently reachable through Handshake.</p></div>
        <div className="featured-grid">{featured.slice(0, 3).map((site) => <SiteCard key={site.asciiName} site={site} featured />)}</div>
      </section>

      <section id="directory" className="directory-section" aria-labelledby="directory-heading">
        <div className="directory-title"><div><p className="eyebrow">The directory</p><h2 id="directory-heading">Wander by category</h2></div><p>{visibleSites.length} {visibleSites.length === 1 ? 'place' : 'places'} shown</p></div>
        <nav className="category-strip" aria-label="Filter by category">
          {categories.map(({ id, label, icon: Icon }) => <button key={id} className={category === id ? 'active' : ''} onClick={() => setCategory(id)} aria-pressed={category === id}><Icon size={17} /> {label}</button>)}
        </nav>
        {visibleSites.length ? <div className="site-grid">{visibleSites.map((site) => <SiteCard key={site.asciiName} site={site} />)}</div> : <div className="empty-state"><Compass size={28} /><h3>No paths found yet</h3><p>Try a different word or browse all places.</p><button onClick={() => { setQuery(''); setCategory('All'); }}>Reset directory</button></div>}
      </section>

      <section id="new-to-hns" className="learn-section" aria-labelledby="learn-heading">
        <div className="learn-copy"><p className="eyebrow">New to Handshake?</p><h2 id="learn-heading">A different root.<br />A more open web.</h2><p>Handshake names do not usually open through your internet provider’s default DNS. Use a browser or resolver that understands the Handshake root, then visit names just like any other website.</p><a href="https://skyinclude.com" target="_blank" rel="noreferrer">Get SkyInclude <ExternalLink size={15} /></a></div>
        <ol className="steps"><li><span>1</span><div><h3>Choose a way in</h3><p>Install SkyInclude Browser or configure a compatible HNS resolver.</p></div></li><li><span>2</span><div><h3>Pick a destination</h3><p>Browse this directory or type a root name such as <code>iamthat/</code>.</p></div></li><li><span>3</span><div><h3>Read the signals</h3><p>DANE HTTPS is cryptographically linked to DNSSEC. HTTP sites are labeled clearly.</p></div></li></ol>
      </section>

      <section className="trust-section" aria-label="Status badge guide">
        <div><Landmark size={24} /><h2>What the badges mean</h2></div>
        <dl><div><dt><span className="legend dane" />DANE HTTPS</dt><dd>Secure DNS authorizes the site’s TLS key.</dd></div><div><dt><span className="legend http" />Native HTTP</dt><dd>Reachable over Handshake, without DANE HTTPS.</dd></div><div><dt><span className="legend recent" />Recently verified</dt><dd>Observed by the directory monitor at the date shown.</dd></div><div><dt><span className="legend down" />Unavailable</dt><dd>Kept for context, never presented as healthy.</dd></div></dl>
        <p>Handshake is experimental. Sites can move, change, or take a nap. We retry timeouts before changing a listing.</p>
      </section>

      <section id="submit" className="submit-section" aria-labelledby="submit-heading">
        <div><p className="eyebrow">Made something good?</p><h2 id="submit-heading">Add your corner<br />of the HNS web.</h2></div>
        <div className="submit-copy"><p>Submissions are checked for ownership context, reachable content, DNSSEC, TLSA, and clear visitor value. Nothing is published automatically.</p><button onClick={copySubmissionTemplate}>{copied ? <Check size={17} /> : <ArrowRight size={17} />}{copied ? 'Template copied' : 'Copy submission template'}</button><a href="https://github.com/shadstone/welcome-hns/issues/new?template=site-submission.yml" target="_blank" rel="noreferrer">Submit for directory review <ExternalLink size={14} /></a></div>
      </section>

      <footer><a href="#top" className="brand"><span className="brand-sun"><Globe2 size={20} /></span><span>welcome<span className="slash">/</span></span></a><p>A handcrafted map of the Handshake web.</p><div><a href="https://learnhns.com" target="_blank" rel="noreferrer">LearnHNS</a><a href="https://skyinclude.com" target="_blank" rel="noreferrer">SkyInclude</a><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top <ChevronDown className="up" size={15} /></button></div></footer>
    </main>
  );
}
