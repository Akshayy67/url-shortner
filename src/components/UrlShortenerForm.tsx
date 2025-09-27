"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link, Copy, QrCode, Calendar, Settings, Download } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

interface ShortenedUrl {
  id: string;
  original_url: string;
  short_code: string;
  custom_alias: string | null;
  shortUrl: string;
  click_count: number;
  created_at: string;
  expires_at: string | null;
}

interface UrlShortenerFormProps {
  onUrlCreated: (url: ShortenedUrl) => void;
}

export default function UrlShortenerForm({
  onUrlCreated,
}: UrlShortenerFormProps) {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [result, setResult] = useState<ShortenedUrl | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Fetch configuration status from API
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        console.log("Config API response:", data);
        if (data.success) {
          setIsSupabaseConfigured(data.configured);
          console.log("Supabase configured:", data.configured);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch config:", error);
        setIsSupabaseConfigured(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setIsLoading(true);
    setResult(null);
    setQrCode(null);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url.trim(),
          customAlias: customAlias.trim() || undefined,
          expiresAt: expiresAt || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      setResult(data.data);
      onUrlCreated(data.data);
      toast.success("URL shortened successfully!");

      // Reset form
      setUrl("");
      setCustomAlias("");
      setExpiresAt("");
      setShowAdvanced(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to shorten URL"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success("Copied to clipboard!");
    } else {
      toast.error("Failed to copy to clipboard");
    }
  };

  const generateQrCode = async (url: string) => {
    try {
      const response = await fetch(`/api/qr?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (data.success) {
        setQrCode(data.qrCode);
      } else {
        toast.error("Failed to generate QR code");
      }
    } catch {
      toast.error("Failed to generate QR code");
    }
  };

  const downloadQrCode = () => {
    if (!qrCode || !result) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `qr-code-${result.short_code || result.custom_alias}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR code downloaded!");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Database Status Indicator - Only render on client to avoid hydration mismatch */}
      {isClient && (
        <div
          className={`mb-4 p-3 rounded-lg border ${
            isSupabaseConfigured
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-yellow-50 border-yellow-200 text-yellow-800"
          }`}
        >
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured ? "bg-green-500" : "bg-yellow-500"
              }`}
            ></div>
            <span className="text-sm font-medium">
              {isSupabaseConfigured
                ? "🟢 Connected to Real Database"
                : "🟡 Demo Mode - Using Sample Data"}
            </span>
          </div>
          {!isSupabaseConfigured && (
            <p className="text-xs mt-1 text-yellow-700">
              To use real database, follow the setup guide in SUPABASE_SETUP.md
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter your long URL
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/url"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-800"
            >
              <Settings className="h-4 w-4 mr-1" />
              Advanced Options
            </button>
          </div>

          {showAdvanced && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label
                  htmlFor="customAlias"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Custom Alias (optional)
                </label>
                <input
                  type="text"
                  id="customAlias"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  placeholder="my-custom-link"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  3-50 characters, letters, numbers, hyphens, and underscores
                  only
                </p>
              </div>

              <div>
                <label
                  htmlFor="expiresAt"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Expiration Date (optional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="datetime-local"
                    id="expiresAt"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    disabled={isLoading}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-4">
            URL Shortened Successfully!
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={result.shortUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900"
                />
                <button
                  onClick={() => handleCopy(result.shortUrl)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => generateQrCode(result.shortUrl)}
                  className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  title="Generate QR Code"
                >
                  <QrCode className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original URL
              </label>
              <input
                type="text"
                value={result.original_url}
                readOnly
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600"
              />
            </div>
          </div>

          {qrCode && (
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <h4 className="text-sm font-medium text-gray-700">QR Code</h4>
                <button
                  onClick={downloadQrCode}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Download QR Code"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCode}
                alt="QR Code"
                className="mx-auto border rounded-lg"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
