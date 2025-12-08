export type Category = "dress" | "shoes" | "bag" | "jacket";

export interface Item {
  id: number;
  name: string;
  category: Category;
  pricePerDay: number;
  sizes: string[];
  color: string;
  colorId?: number;
  style?: string;
  description: string;
  images: string[];
  alt: string;
  stock?: number;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface Rental {
  id: string;
  itemId: number;
  sizeId: number;
  start: string;
  end: string;
  customer: Customer;
  createdAt: string;
  status: "active" | "canceled";
}

export interface ItemFilters {
  q?: string;
  category?: Category;
  size?: string;
  color?: string;
  style?: string;
}
