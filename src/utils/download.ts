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
 * Generates a filename based on the transaction month stored in cookies
 * @returns Filename in format: moneyforward_transactions_YYYYMMDDhhmmss
 * @throews Error if transaction month cannot be determined from cookies
 */
export function generateFilename(): string {
  const transactionMonth = getTransactionMonth();
  if (!transactionMonth) {
    throw new Error('Unable to determine transaction month from cookies.');
  }
  return `moneyforward_transactions_${transactionMonth}`;
}

/**
 * Retrieves the transaction month (YYYYMM) from cookies
 * @returns Transaction month in YYYYMM format or null if not found
 */
function getTransactionMonth(): string | undefined {
  const cookieName = 'cf_last_fetch_from_date';
  const fromDate = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${cookieName}=`))
    ?.split('=')[1];

  // URL decode: 2025%2F10%2F01 => 2025/10/01
  const urlDecoded = fromDate ? decodeURIComponent(fromDate) : undefined;

  return urlDecoded?.slice(0, 7).replace(/\//g, '');
}
