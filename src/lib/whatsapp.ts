/**
 * Utility functions for WhatsApp link & message handling
 */

export interface ParsedWhatsAppLink {
  phone: string;
  message: string;
  fullUrl: string;
}

/**
 * Parses an existing WhatsApp URL or raw string to extract the phone number and prefilled message.
 */
export function parseWhatsAppLink(rawLink: string | null | undefined): ParsedWhatsAppLink {
  if (!rawLink || !rawLink.trim()) {
    return {
      phone: "",
      message: "",
      fullUrl: "",
    };
  }

  const trimmed = rawLink.trim();

  try {
    // If it's a full URL (e.g. https://wa.me/6281325350008?text=Halo...)
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      const url = new URL(trimmed);
      const textParam = url.searchParams.get("text") || "";
      // Extract phone from pathname: /6281325350008 or /send
      let phone = url.pathname.replace(/^\/+/, "").replace(/^send\/?/, "");
      if (!phone && url.searchParams.get("phone")) {
        phone = url.searchParams.get("phone") || "";
      }
      return {
        phone: phone.replace(/[^0-9]/g, ""),
        message: textParam,
        fullUrl: trimmed,
      };
    }
  } catch {
    // Fallback if URL parsing fails
  }

  // Handle formats like "wa.me/628xxx?text=..."
  if (trimmed.includes("wa.me/")) {
    const parts = trimmed.split("wa.me/")[1];
    const [pathPart, queryPart] = parts.split("?");
    const phone = pathPart.replace(/[^0-9]/g, "");
    let message = "";
    if (queryPart) {
      const params = new URLSearchParams(queryPart);
      message = params.get("text") || "";
    }
    return {
      phone,
      message,
      fullUrl: buildWhatsAppUrl(phone, message),
    };
  }

  // If it's just a raw phone number
  const phoneOnly = trimmed.replace(/[^0-9]/g, "");
  return {
    phone: phoneOnly,
    message: "",
    fullUrl: buildWhatsAppUrl(phoneOnly, ""),
  };
}

/**
 * Builds a valid WhatsApp wa.me URL with normalized phone number and encoded prefilled text.
 */
export function buildWhatsAppUrl(rawPhone: string, message?: string | null): string {
  if (!rawPhone || !rawPhone.trim()) {
    return "";
  }

  let cleanPhone = rawPhone.trim().replace(/[^0-9]/g, "");

  // Convert leading 08xxx to Indonesian international format 628xxx
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.slice(1);
  }

  if (!cleanPhone) {
    return "";
  }

  const trimmedMsg = (message || "").trim();
  if (trimmedMsg) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(trimmedMsg)}`;
  }

  return `https://wa.me/${cleanPhone}`;
}
