"use client";

import { MOCK_PDF_HREF } from "@/lib/resources";

function downloadTextFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ExportButtons({
  excelFilename = "programs-overview.csv",
  pdfFilename = "programs-overview.pdf",
  excelContent,
}: {
  excelFilename?: string;
  pdfFilename?: string;
  /** CSV text used as the mock Excel export */
  excelContent: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="btn-secondary inline-flex items-center gap-2"
        onClick={() =>
          downloadTextFile(excelFilename, excelContent, "text/csv;charset=utf-8")
        }
      >
        <span aria-hidden>📊</span>
        Export to Excel
      </button>
      <a
        href={MOCK_PDF_HREF}
        download={pdfFilename}
        className="btn-secondary inline-flex items-center gap-2"
      >
        <span aria-hidden>📄</span>
        Export to PDF
      </a>
    </div>
  );
}
