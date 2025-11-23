import { describe, it, expect } from 'vitest';
import { transactionsToCSV } from './csv';
import type { Transaction } from '@/types/transaction';

describe('transactionsToCSV', () => {
  it('generates CSV with headers', () => {
    const transactions: Transaction[] = [];
    const csv = transactionsToCSV(transactions);

    // Remove BOM for testing
    const csvWithoutBOM = csv.replace(/^\uFEFF/, '');
    expect(csvWithoutBOM).toBe(
      '計算対象,日付,内容,金額（円）,保有金融機関,大項目,中項目,メモ,振替'
    );
  });

  it('converts single transaction to CSV', () => {
    const transactions: Transaction[] = [
      {
        isCalculationTarget: true,
        date: '2025/11/22',
        content: 'ガス代（11月）',
        amount: '-3385',
        institution: 'なし',
        largeCategory: '水道・光熱費',
        middleCategory: 'ガス・灯油代',
        memo: 'メモテスト',
        isTransfer: false,
      },
    ];

    const csv = transactionsToCSV(transactions);
    const csvWithoutBOM = csv.replace(/^\uFEFF/, '');
    const lines = csvWithoutBOM.split('\n');

    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe(
      '計算対象,日付,内容,金額（円）,保有金融機関,大項目,中項目,メモ,振替'
    );
    expect(lines[1]).toBe(
      '○,2025/11/22,ガス代（11月）,-3385,なし,水道・光熱費,ガス・灯油代,メモテスト,'
    );
  });

  it('converts multiple transactions to CSV', () => {
    const transactions: Transaction[] = [
      {
        isCalculationTarget: true,
        date: '2025/11/22',
        content: '買い物',
        amount: '-1000',
        institution: 'クレカ',
        largeCategory: '食費',
        middleCategory: '食料品',
        memo: '',
        isTransfer: false,
      },
      {
        isCalculationTarget: true,
        date: '2025/11/21',
        content: '給料',
        amount: '300000',
        institution: '銀行',
        largeCategory: '収入',
        middleCategory: '給与',
        memo: '11月分',
        isTransfer: false,
      },
    ];

    const csv = transactionsToCSV(transactions);
    const csvWithoutBOM = csv.replace(/^\uFEFF/, '');
    const lines = csvWithoutBOM.split('\n');

    expect(lines).toHaveLength(3);
    expect(lines[1]).toBe('○,2025/11/22,買い物,-1000,クレカ,食費,食料品,,');
    expect(lines[2]).toBe('○,2025/11/21,給料,300000,銀行,収入,給与,11月分,');
  });

  it('handles transfer transactions', () => {
    const transactions: Transaction[] = [
      {
        isCalculationTarget: false,
        date: '2025/11/20',
        content: '振替',
        amount: '10000',
        institution: '口座A',
        largeCategory: '',
        middleCategory: '',
        memo: '',
        isTransfer: true,
      },
    ];

    const csv = transactionsToCSV(transactions);
    const csvWithoutBOM = csv.replace(/^\uFEFF/, '');
    const lines = csvWithoutBOM.split('\n');

    expect(lines[1]).toBe(',2025/11/20,振替,10000,口座A,,,,○');
  });

  it('escapes fields with commas', () => {
    const transactions: Transaction[] = [
      {
        isCalculationTarget: true,
        date: '2025/11/22',
        content: 'コンビニ, スーパー',
        amount: '-1500',
        institution: 'クレジットカード, A銀行',
        largeCategory: '食費',
        middleCategory: '食料品',
        memo: 'テスト, メモ',
        isTransfer: false,
      },
    ];

    const csv = transactionsToCSV(transactions);
    const csvWithoutBOM = csv.replace(/^\uFEFF/, '');
    const lines = csvWithoutBOM.split('\n');

    expect(lines[1]).toContain('"コンビニ, スーパー"');
    expect(lines[1]).toContain('-1500');
    expect(lines[1]).toContain('"クレジットカード, A銀行"');
    expect(lines[1]).toContain('"テスト, メモ"');
  });

  it('escapes fields with double quotes', () => {
    const transactions: Transaction[] = [
      {
        isCalculationTarget: true,
        date: '2025/11/22',
        content: '商品"特売"',
        amount: '-100',
        institution: 'なし',
        largeCategory: '食費',
        middleCategory: '食料品',
        memo: 'メモ"テスト"',
        isTransfer: false,
      },
    ];

    const csv = transactionsToCSV(transactions);
    const csvWithoutBOM = csv.replace(/^\uFEFF/, '');
    const lines = csvWithoutBOM.split('\n');

    expect(lines[1]).toContain('"商品""特売"""');
    expect(lines[1]).toContain('"メモ""テスト"""');
  });

  it('escapes fields with newlines', () => {
    const transactions: Transaction[] = [
      {
        isCalculationTarget: true,
        date: '2025/11/22',
        content: '買い物\n複数行',
        amount: '-100',
        institution: 'なし',
        largeCategory: '食費',
        middleCategory: '食料品',
        memo: 'メモ\n2行目',
        isTransfer: false,
      },
    ];

    const csv = transactionsToCSV(transactions);

    expect(csv).toContain('"買い物\n複数行"');
    expect(csv).toContain('"メモ\n2行目"');
  });

  it('includes UTF-8 BOM', () => {
    const transactions: Transaction[] = [];
    const csv = transactionsToCSV(transactions);

    expect(csv.charCodeAt(0)).toBe(0xfeff); // BOM
  });
});
