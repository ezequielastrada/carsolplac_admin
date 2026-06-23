export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  brand: string;
  stock?: number;
  images: string[];
};
export type Category = {
  id: string;
  name: string;
};
export interface Banner {
  id: string;
  imageUrl: string;
  order?: number;
  active?: boolean;
}
