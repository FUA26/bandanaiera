/**
 * Public Settings Data Module
 *
 * Fetches public settings from Backoffice API
 */

export interface PublicSettings {
  siteName: string;
  siteSubtitle: string | null;
  siteDescription: string | null;
  siteLogoUrl: string | null;
  citizenName: string;
  contactAddress: string | null;
  contactPhones: string[] | null;
  contactEmails: string[] | null;
  socialFacebook: string | null;
  socialTwitter: string | null;
  socialInstagram: string | null;
  socialYouTube: string | null;
  copyrightText: string | null;
  versionNumber: string | null;
}

const BACKOFFICE_API_URL = process.env.BACKOFFICE_API_URL || 'http://localhost:3001';

const cache = new Map<string, { data: PublicSettings; expires: number }>();
const CACHE_DURATION = 300; // 5 minutes

export async function getPublicSettings(): Promise<PublicSettings> {
  const cached = cache.get('settings');
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }

  try {
    const response = await fetch(`${BACKOFFICE_API_URL}/api/public/settings`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    cache.set('settings', {
      data,
      expires: Date.now() + CACHE_DURATION * 1000,
    });

    return data;
  } catch (error) {
    console.error('Error fetching public settings:', error);
    // Return defaults
    return {
      siteName: 'Super App Naiera',
      siteSubtitle: 'Kabupaten Naiera',
      siteDescription: null,
      siteLogoUrl: null,
      citizenName: 'Warga Naiera',
      contactAddress: null,
      contactPhones: null,
      contactEmails: null,
      socialFacebook: null,
      socialTwitter: null,
      socialInstagram: null,
      socialYouTube: null,
      copyrightText: null,
      versionNumber: '1.0.0',
    };
  }
}
