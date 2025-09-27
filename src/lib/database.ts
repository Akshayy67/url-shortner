import { supabase, isSupabaseConfigured } from "./supabase";
import { Url, UrlInsert, ClickInsert } from "@/types/database";
import {
  generateShortCode,
  isValidUrl,
  isValidAlias,
  normalizeUrl,
} from "./utils";

// Mock data store for demo mode
let mockUrls: Url[] = [
  {
    id: "demo-1",
    original_url: "https://github.com/vercel/next.js",
    short_code: "nextjs",
    custom_alias: "nextjs",
    click_count: 42,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    expires_at: null,
    is_active: true,
    user_ip: null,
    user_agent: null,
  },
  {
    id: "demo-2",
    original_url: "https://supabase.com/docs",
    short_code: "abc123",
    custom_alias: null,
    click_count: 15,
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    expires_at: null,
    is_active: true,
    user_ip: null,
    user_agent: null,
  },
  {
    id: "demo-3",
    original_url: "https://tailwindcss.com/docs",
    short_code: "xyz789",
    custom_alias: "tailwind-docs",
    click_count: 8,
    created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    expires_at: null,
    is_active: true,
    user_ip: null,
    user_agent: null,
  },
];
let mockClicks: any[] = [];
let mockIdCounter = 4;

export interface CreateUrlParams {
  originalUrl: string;
  customAlias?: string;
  expiresAt?: Date;
  userIP?: string;
  userAgent?: string;
}

export interface CreateUrlResult {
  success: boolean;
  data?: Url;
  error?: string;
}

// Mock functions for demo mode
async function createShortUrlMock(
  params: CreateUrlParams
): Promise<CreateUrlResult> {
  const { originalUrl, customAlias, expiresAt, userIP, userAgent } = params;

  // Normalize and validate URL
  const normalizedUrl = normalizeUrl(originalUrl);
  if (!isValidUrl(normalizedUrl)) {
    return { success: false, error: "Invalid URL format" };
  }

  // Validate custom alias if provided
  if (customAlias && !isValidAlias(customAlias)) {
    return {
      success: false,
      error:
        "Custom alias must be 3-50 characters and contain only letters, numbers, hyphens, and underscores",
    };
  }

  // Check if custom alias already exists
  if (customAlias && mockUrls.some((url) => url.custom_alias === customAlias)) {
    return { success: false, error: "Custom alias already exists" };
  }

  // Generate unique short code
  let shortCode: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    shortCode = generateShortCode();
    if (!mockUrls.some((url) => url.short_code === shortCode)) break;

    attempts++;
    if (attempts >= maxAttempts) {
      return { success: false, error: "Failed to generate unique short code" };
    }
  } while (true);

  // Create URL record
  const newUrl: Url = {
    id: `mock-${mockIdCounter++}`,
    original_url: normalizedUrl,
    short_code: shortCode,
    custom_alias: customAlias || null,
    click_count: 0,
    created_at: new Date().toISOString(),
    expires_at: expiresAt?.toISOString() || null,
    is_active: true,
    user_ip: userIP || null,
    user_agent: userAgent || null,
  };

  mockUrls.unshift(newUrl); // Add to beginning for recent first
  return { success: true, data: newUrl };
}

async function getUrlByCodeMock(code: string): Promise<Url | null> {
  const url = mockUrls.find(
    (url) => url.short_code === code || url.custom_alias === code
  );

  if (!url || !url.is_active) return null;

  // Check if URL has expired
  if (url.expires_at && new Date(url.expires_at) < new Date()) {
    return null;
  }

  return url;
}

async function recordClickMock(
  urlId: string,
  clickData: any
): Promise<boolean> {
  // Find and increment click count
  const url = mockUrls.find((u) => u.id === urlId);
  if (url) {
    url.click_count++;

    // Record click
    mockClicks.push({
      id: `click-${Date.now()}`,
      url_id: urlId,
      clicked_at: new Date().toISOString(),
      ...clickData,
    });
  }
  return true;
}

async function getRecentUrlsMock(limit: number = 10): Promise<Url[]> {
  return mockUrls.slice(0, limit);
}

/**
 * Creates a new shortened URL
 */
export async function createShortUrl(
  params: CreateUrlParams
): Promise<CreateUrlResult> {
  if (!isSupabaseConfigured || !supabase) {
    return createShortUrlMock(params);
  }

  try {
    const { originalUrl, customAlias, expiresAt, userIP, userAgent } = params;

    // Normalize and validate URL
    const normalizedUrl = normalizeUrl(originalUrl);
    if (!isValidUrl(normalizedUrl)) {
      return { success: false, error: "Invalid URL format" };
    }

    // Validate custom alias if provided
    if (customAlias && !isValidAlias(customAlias)) {
      return {
        success: false,
        error:
          "Custom alias must be 3-50 characters and contain only letters, numbers, hyphens, and underscores",
      };
    }

    // Check if custom alias already exists
    if (customAlias) {
      const { data: existingAlias } = await supabase
        .from("urls")
        .select("id")
        .eq("custom_alias", customAlias)
        .single();

      if (existingAlias) {
        return { success: false, error: "Custom alias already exists" };
      }
    }

    // Generate unique short code
    let shortCode: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shortCode = generateShortCode();
      const { data: existing } = await supabase
        .from("urls")
        .select("id")
        .eq("short_code", shortCode)
        .single();

      if (!existing) break;

      attempts++;
      if (attempts >= maxAttempts) {
        return {
          success: false,
          error: "Failed to generate unique short code",
        };
      }
    } while (true);

    // Create URL record
    const urlData: UrlInsert = {
      original_url: normalizedUrl,
      short_code: shortCode,
      custom_alias: customAlias || null,
      expires_at: expiresAt?.toISOString() || null,
      user_ip: userIP || null,
      user_agent: userAgent || null,
    };

    const { data, error } = await supabase
      .from("urls")
      .insert(urlData)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return { success: false, error: "Failed to create short URL" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Retrieves a URL by short code or custom alias
 */
export async function getUrlByCode(code: string): Promise<Url | null> {
  if (!isSupabaseConfigured || !supabase) {
    return getUrlByCodeMock(code);
  }

  try {
    const { data, error } = await supabase
      .from("urls")
      .select("*")
      .or(`short_code.eq.${code},custom_alias.eq.${code}`)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return null;
    }

    // Check if URL has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error retrieving URL:", error);
    return null;
  }
}

/**
 * Records a click and increments the click count
 */
export async function recordClick(
  urlId: string,
  clickData: Omit<ClickInsert, "url_id">
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return recordClickMock(urlId, clickData);
  }

  try {
    // Insert click record
    const { error: clickError } = await supabase.from("clicks").insert({
      url_id: urlId,
      ...clickData,
    });

    if (clickError) {
      console.error("Error recording click:", clickError);
      return false;
    }

    // Increment click count
    const { error: updateError } = await supabase.rpc("increment_click_count", {
      url_id_param: urlId,
    });

    if (updateError) {
      console.error("Error incrementing click count:", updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected error recording click:", error);
    return false;
  }
}

/**
 * Retrieves recent URLs (for display purposes)
 */
export async function getRecentUrls(limit: number = 10): Promise<Url[]> {
  if (!isSupabaseConfigured || !supabase) {
    return getRecentUrlsMock(limit);
  }

  try {
    const { data, error } = await supabase
      .from("urls")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error retrieving recent URLs:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error:", error);
    return [];
  }
}

/**
 * Gets analytics data for a URL
 */
export async function getUrlAnalytics(urlId: string) {
  try {
    const { data: clicks, error } = await supabase
      .from("clicks")
      .select("clicked_at, country, city, referer")
      .eq("url_id", urlId)
      .order("clicked_at", { ascending: false });

    if (error) {
      console.error("Error retrieving analytics:", error);
      return null;
    }

    return clicks;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
}
