export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  brand: string;
  stock?: number;
  images: string[];
};
export type Category = {
  id: number;
  name: string;
};
export interface Banner {
  id: string;
  imageUrl: string;
  order?: number;
  active?: boolean;
}
