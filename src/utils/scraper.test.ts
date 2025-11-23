import { describe, it, expect, beforeEach } from 'vitest';
import { scrapeTransactionTable } from './scraper';

describe('scrapeTransactionTable', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('returns null if table is not found', () => {
    const result = scrapeTransactionTable();
    expect(result).toBeNull();
  });

  it('returns null if tbody is not found', () => {
    document.body.innerHTML = `
      <table id="cf-detail-table">
        <thead></thead>
      </table>
    `;
    const result = scrapeTransactionTable();
    expect(result).toBeNull();
  });

  it('returns empty array if no transaction rows', () => {
    document.body.innerHTML = `
      <table id="cf-detail-table">
        <tbody class="list_body"></tbody>
      </table>
    `;
    const result = scrapeTransactionTable();
    expect(result).toEqual([]);
  });

  it('extracts transaction data correctly', () => {
    document.body.innerHTML = `
      <table id="cf-detail-table">
        <tbody class="list_body">
          <tr class="transaction_list">
            <td class="calc"><i class="icon-check"></i></td>
            <td class="date" data-table-sortable-value="2025/11/22-123456">11/22(土)</td>
            <td class="content"><div class="noform"><span>ガス代（11月）</span></div></td>
            <td class="amount"><div class="noform"><span>-3,385</span></div></td>
            <td class="sub_account_id_hash"><div class="noform"><span>なし</span></div></td>
            <td class="lctg"><a class="v_l_ctg">水道・光熱費</a></td>
            <td class="mctg"><a class="v_m_ctg">ガス・灯油代</a></td>
            <td class="memo"><div class="noform"><span>メモテスト</span></div></td>
            <td class="calc"></td>
          </tr>
        </tbody>
      </table>
    `;

    const result = scrapeTransactionTable();
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual({
      isCalculationTarget: true,
      date: '2025/11/22',
      content: 'ガス代（11月）',
      amount: '-3385',
      institution: 'なし',
      largeCategory: '水道・光熱費',
      middleCategory: 'ガス・灯油代',
      memo: 'メモテスト',
      isTransfer: false,
    });
  });

  it('handles transfer transactions correctly', () => {
    document.body.innerHTML = `
      <table id="cf-detail-table">
        <tbody class="list_body">
          <tr class="transaction_list">
            <td class="calc"></td>
            <td class="date" data-table-sortable-value="2025/11/20-789">11/20(木)</td>
            <td class="content"><div class="noform"><span>振替</span></div></td>
            <td class="amount"><div class="noform"><span>10,000</span></div></td>
            <td class="sub_account_id_hash"><div class="noform"><span>口座A</span></div></td>
            <td class="lctg"><a class="v_l_ctg"></a></td>
            <td class="mctg"><a class="v_m_ctg"></a></td>
            <td class="memo"><div class="noform"><span></span></div></td>
            <td class="calc"><i class="icon-check"></i></td>
          </tr>
        </tbody>
      </table>
    `;

    const result = scrapeTransactionTable();
    expect(result).toHaveLength(1);
    expect(result![0]).toEqual({
      isCalculationTarget: false,
      date: '2025/11/20',
      content: '振替',
      amount: '10000',
      institution: '口座A',
      largeCategory: '',
      middleCategory: '',
      memo: '',
      isTransfer: true,
    });
  });

  it('handles multiple transactions', () => {
    document.body.innerHTML = `
      <table id="cf-detail-table">
        <tbody class="list_body">
          <tr class="transaction_list">
            <td class="calc"><i class="icon-check"></i></td>
            <td class="date" data-table-sortable-value="2025/11/22-1">11/22</td>
            <td class="content form-switch-td"><div class="noform"><span>買い物</span></div></td>
            <td class="amount form-switch-td"><div class="noform"><span>-1,000</span></div></td>
            <td class="sub_account_id_hash form-switch-td"><div class="noform"><span>クレカ</span></div></td>
            <td class="lctg"><a class="v_l_ctg">食費</a></td>
            <td class="mctg"><a class="v_m_ctg">食料品</a></td>
            <td class="memo form-switch-td"><div class="noform"><span></span></div></td>
            <td class="calc"></td>
          </tr>
          <tr class="transaction_list">
            <td class="calc"><i class="icon-check"></i></td>
            <td class="date" data-table-sortable-value="2025/11/21-2">11/21</td>
            <td class="content form-switch-td"><div class="noform"><span>給料</span></div></td>
            <td class="amount form-switch-td"><div class="noform"><span>300,000</span></div></td>
            <td class="sub_account_id_hash form-switch-td"><div class="noform"><span>銀行</span></div></td>
            <td class="lctg"><a class="v_l_ctg">収入</a></td>
            <td class="mctg"><a class="v_m_ctg">給与</a></td>
            <td class="memo form-switch-td"><div class="noform"><span>11月分</span></div></td>
            <td class="calc"></td>
          </tr>
        </tbody>
      </table>
    `;

    const result = scrapeTransactionTable();
    expect(result).toHaveLength(2);
    expect(result![0].content).toBe('買い物');
    expect(result![0].amount).toBe('-1000');
    expect(result![1].content).toBe('給料');
    expect(result![1].amount).toBe('300000');
  });
});
