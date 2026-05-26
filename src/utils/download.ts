/**
 * Downloads a CSV file to the user's computer
 * @param csvContent CSV content string
 * @param filename Desired filename (without extension)
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Create a Blob with UTF-8 encoding
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.style.display = 'none';

  // Append to body, click, and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the blob URL
  URL.revokeObjectURL(url);
}

/**
 * Generates a filename based on the given date string (YYYY/MM/DD).
 * @returns Filename in format: moneyforward_transactions_YYYYMM
 */
export function generateFilename(date: string): string {
  const month = date.slice(0, 7).replace('/', '');
  return `moneyforward_transactions_${month}`;
}
