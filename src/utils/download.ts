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
 * Generates a filename with the current date
 * @returns Filename in format: moneyforward_transactions_YYYY-MM-DD
 */
export function generateFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `moneyforward_transactions_${year}${month}${day}_${hours}${minutes}${seconds}`;
}
