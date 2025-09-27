"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Copy,
  ExternalLink,
  Calendar,
  BarChart3,
  Clock,
  QrCode,
} from "lucide-react";
import { copyToClipboard, formatDate } from "@/lib/utils";

interface UrlData {
  id: string;
  original_url: string;
  short_code: string;
  custom_alias: string | null;
  shortUrl: string;
  click_count: number;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
}

interface UrlListProps {
  refreshTrigger: number;
}

export default function UrlList({ refreshTrigger }: UrlListProps) {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [qrCodes, setQrCodes] = useState<{ [key: string]: string }>({});

  const fetchUrls = async () => {
    try {
      const response = await fetch("/api/urls?limit=20");
      const data = await response.json();

      if (data.success) {
        setUrls(data.data);
      } else {
        toast.error("Failed to load URLs");
      }
    } catch {
      toast.error("Failed to load URLs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [refreshTrigger]);

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success("Copied to clipboard!");
    } else {
      toast.error("Failed to copy to clipboard");
    }
  };

  const generateQrCode = async (url: string, urlId: string) => {
    try {
      const response = await fetch(`/api/qr?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (data.success) {
        setQrCodes((prev) => ({ ...prev, [urlId]: data.qrCode }));
      } else {
        toast.error("Failed to generate QR code");
      }
    } catch {
      toast.error("Failed to generate QR code");
    }
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No URLs yet</h3>
        <p className="text-gray-500">
          Create your first shortened URL to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent URLs</h2>

      <div className="space-y-4">
        {urls.map((url) => (
          <div
            key={url.id}
            className={`bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${
              isExpired(url.expires_at) ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {url.custom_alias || url.short_code}
                  </h3>
                  {isExpired(url.expires_at) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Expired
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">
                      Short URL:
                    </span>
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-mono truncate"
                    >
                      {url.shortUrl}
                    </a>
                    <button
                      onClick={() => handleCopy(url.shortUrl)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Copy short URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => generateQrCode(url.shortUrl, url.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Generate QR Code"
                    >
                      <QrCode className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">
                      Original:
                    </span>
                    <a
                      href={url.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-gray-900 text-sm truncate flex items-center"
                    >
                      {url.original_url}
                      <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="ml-4 flex-shrink-0 text-right">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  <span className="font-medium">{url.click_count}</span>
                  <span className="ml-1">clicks</span>
                </div>

                <div className="flex items-center text-xs text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formatDate(url.created_at)}</span>
                </div>

                {url.expires_at && (
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Expires: {formatDate(url.expires_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {qrCodes[url.id] && (
              <div className="mt-4 text-center border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  QR Code
                </h4>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodes[url.id]}
                  alt="QR Code"
                  className="mx-auto border rounded-lg"
                  style={{ maxWidth: "150px" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {urls.length >= 20 && (
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Showing the 20 most recent URLs
          </p>
        </div>
      )}
    </div>
  );
}
