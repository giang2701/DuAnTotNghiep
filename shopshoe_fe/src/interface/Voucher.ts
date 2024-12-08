export interface Voucher {
  _id: string;
  name: string;
  code: string;
  discount: number;
  type: string;
  expiryDate: Date;
  isActive: boolean;
  minPrice: number;
}
