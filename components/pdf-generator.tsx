'use client';

import type React from 'react';
import { type DocumentProps, pdf } from '@react-pdf/renderer';

/**
 * Generates a PDF from a React element and triggers a download.
 * @param element - The React element to render into the PDF.
 * @param fileName - The desired file name for the downloaded PDF.
 */
export const generatePdf = async (
  element: React.ReactElement,
  fileName = 'document.pdf',
) => {
  try {
    const blob = await pdf(
      element as React.ReactElement<DocumentProps>,
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Clean up the DOM and revoke the URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    // Optionally, handle the error in the UI, e.g., show a toast notification
  }
};
