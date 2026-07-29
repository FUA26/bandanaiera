/** Public Settings Data Module */
const BACKOFFICE_API_URL = process.env.BACKOFFICE_API_URL || "http://localhost:3001";

export interface PublicSettings {
  siteName: string;
  siteSubtitle: string | null;
  siteDescription: string | null;
  siteLogoUrl: string | null;
  citizenName: string | null;
  contactAddress: string | null;
  contactPhones: string[] | null;
  contactEmails: string[] | null;
  socialFacebook: string | null;
  socialTwitter: string | null;
  socialInstagram: string | null;
  socialYouTube: string | null;
  copyrightText: string | null;
  versionNumber: string | null;
  heroBackgroundUrl: string | null;
}

function normalizeProxyPath(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('/api/public/')) return url.replace('/api/public/', '/api/proxy/public/');
  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith('/api/public/')) {
      return `/api/proxy/public/${parsed.pathname.replace('/api/public/', '')}${parsed.search}`;
    }
  } catch {
    // ignore
  }
  return url;
}

export async function getPublicSettings(): Promise<PublicSettings> {
  try {
    const response = await fetch(`${BACKOFFICE_API_URL}/api/public/settings`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return {
      ...data,
      siteLogoUrl: normalizeProxyPath(data.siteLogoUrl),
      heroBackgroundUrl: normalizeProxyPath(data.heroBackgroundUrl),
    };
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return getDefaultSettings();
  }
}

function getDefaultSettings(): PublicSettings {
  return { siteName: 'Malang Digital Government', siteSubtitle: 'Kabupaten Malang', siteDescription: null, siteLogoUrl: null, citizenName: 'Warga Kabupaten Malang', contactAddress: null, contactPhones: null, contactEmails: null, socialFacebook: null, socialTwitter: null, socialInstagram: null, socialYouTube: null, copyrightText: null, versionNumber: '1.0.0', heroBackgroundUrl: null };
}
