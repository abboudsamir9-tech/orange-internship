"use client";

import { MOCK_PDF_HREF } from "@/lib/resources";

export function DownloadPdfButton({
  label = "Download PDF",
  fileName = "document.pdf",
  className = "btn-primary",
  href,
  onClick,
}: {
  label?: string;
  fileName?: string;
  className?: string;
  /** Authenticated or remote download URL. Falls back to mock PDF when omitted. */
  href?: string;
  /** Prefer this for authenticated API downloads (e.g. apiDownload helpers). */
  onClick?: () => void | Promise<void>;
}) {
  if (onClick) {
    return (
      <button
        type="button"
        className={`${className} inline-flex items-center gap-2`}
        onClick={() => void onClick()}
      >
        <span aria-hidden>📄</span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <a
      href={href ?? MOCK_PDF_HREF}
      download={fileName}
      className={`${className} inline-flex items-center gap-2`}
    >
      <span aria-hidden>📄</span>
      <span>{label}</span>
    </a>
  );
}
