export interface Product {
  _id: string;
  name: string;
  description: string;
  images: string[];
  brand: string;
  category: string;
  price: number;
  discount?: number;
  stock: number;
  sellerName: string;
  sellerPhone: string;
  sellerWhatsapp: string;
  featured: boolean;
  specifications: Record<string, string>;
  createdAt: string;
}
