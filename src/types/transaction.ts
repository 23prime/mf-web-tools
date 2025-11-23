export interface Transaction {
  isCalculationTarget: boolean;
  date: string;
  content: string;
  amount: string;
  institution: string;
  largeCategory: string;
  middleCategory: string;
  memo: string;
  isTransfer: boolean;
}
