import type { Transaction } from '@/types/transaction';

/**
 * Scrapes transaction data from the MoneyForward transaction table
 * @returns Array of Transaction objects, or null if table not found
 */
export function scrapeTransactionTable(): Transaction[] | null {
  const table = document.getElementById('cf-detail-table');
  if (!table) {
    return null;
  }

  const tbody = table.querySelector('tbody.list_body');
  if (!tbody) {
    return null;
  }

  const rows = tbody.querySelectorAll('tr.transaction_list');
  const transactions: Transaction[] = [];

  rows.forEach((row) => {
    const transaction = extractTransactionFromRow(row as HTMLTableRowElement);
    if (transaction) {
      transactions.push(transaction);
    }
  });

  return transactions;
}

/**
 * Extracts transaction data from a single table row
 */
function extractTransactionFromRow(
  row: HTMLTableRowElement
): Transaction | null {
  try {
    // 計算対象 - check if icon-check exists in first td.calc
    const calcTd = row.querySelector(':scope > td.calc');
    const isCalculationTarget = !!calcTd?.querySelector('i.icon-check');

    // 日付 - extract from data-table-sortable-value
    const dateTd = row.querySelector(':scope > td.date');
    const dateValue = dateTd?.getAttribute('data-table-sortable-value') || '';
    const date = dateValue.split('-')[0] || ''; // Format: "2025/11/22-{id}"

    // 内容
    const contentTd = row.querySelector(':scope > td.content .noform span');
    const content = contentTd?.textContent?.trim() || '';

    // 金額 - remove commas for numeric value
    const amountTd = row.querySelector(':scope > td.amount .noform span');
    const amountText = amountTd?.textContent?.trim() || '';
    const amount = amountText.replace(/,/g, ''); // Remove commas

    // 保有金融機関
    const institutionTd = row.querySelector(
      ':scope > td.sub_account_id_hash .noform span'
    );
    const institution = institutionTd?.textContent?.trim() || '';

    // 大項目
    const largeCategoryTd = row.querySelector(':scope > td.lctg .v_l_ctg');
    const largeCategory = largeCategoryTd?.textContent?.trim() || '';

    // 中項目
    const middleCategoryTd = row.querySelector(':scope > td.mctg .v_m_ctg');
    const middleCategory = middleCategoryTd?.textContent?.trim() || '';

    // メモ
    const memoTd = row.querySelector(':scope > td.memo .noform span');
    const memo = memoTd?.textContent?.trim() || '';

    // 振替 - check for checkbox or other indicator in the second td.calc
    const allCalcTds = row.querySelectorAll(':scope > td.calc');
    const transferTd = allCalcTds[1]; // Second td.calc is for transfer
    const isTransfer = !!transferTd?.querySelector('i.icon-check');

    return {
      isCalculationTarget,
      date,
      content,
      amount,
      institution,
      largeCategory,
      middleCategory,
      memo,
      isTransfer,
    };
  } catch (error) {
    console.error('Error extracting transaction from row:', error);
    return null;
  }
}
