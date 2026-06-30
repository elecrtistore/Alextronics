export type InquiryStatus = 'New' | 'Contacted' | 'Negotiating' | 'Reserved' | 'Sold' | 'Cancelled';

export interface InquiryItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface InquiryCustomer {
  name: string;
  phone: string;
  county?: string;
  town?: string;
  estate?: string;
  landmark?: string;
  notes?: string;
}

export interface Inquiry {
  _id: string;
  customer: InquiryCustomer;
  items: InquiryItem[];
  estimatedTotal: number;
  status: InquiryStatus;
  createdAt: string;
}
