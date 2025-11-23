import type { Transaction } from '@/types/transaction';

/**
 * Converts an array of transactions to CSV format
 * @param transactions Array of transaction objects
 * @returns CSV string with UTF-8 BOM, LF line endings
 */
export function transactionsToCSV(transactions: Transaction[]): string {
  const headers = [
    '計算対象',
    '日付',
    '内容',
    '金額（円）',
    '保有金融機関',
    '大項目',
    '中項目',
    'メモ',
    '振替',
  ];

  const rows = transactions.map((transaction) => [
    transaction.isCalculationTarget ? '○' : '',
    transaction.date,
    transaction.content,
    transaction.amount,
    transaction.institution,
    transaction.largeCategory,
    transaction.middleCategory,
    transaction.memo,
    transaction.isTransfer ? '○' : '',
  ]);

  const allRows = [headers, ...rows];
  const csvLines = allRows.map((row) => row.map(escapeCSVField).join(','));

  // Add UTF-8 BOM for proper encoding in Excel
  const BOM = '\uFEFF';
  return BOM + csvLines.join('\n');
}

/**
 * Escapes a CSV field according to RFC 4180
 * @param field Field value to escape
 * @returns Escaped field value
 */
function escapeCSVField(field: string): string {
  // If field contains comma, newline, or double quote, wrap in quotes
  if (field.includes(',') || field.includes('\n') || field.includes('"')) {
    // Escape double quotes by doubling them
    const escaped = field.replace(/"/g, '""');
    return `"${escaped}"`;
  }
  return field;
}
