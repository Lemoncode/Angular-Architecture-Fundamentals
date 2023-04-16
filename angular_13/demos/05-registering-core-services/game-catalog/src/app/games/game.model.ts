export interface GameModel {
  id: number | null;
  name: string;
  code: string;
  category: string;
  tags?: string[];
  release: string;
  price: number;
  description: string;
  rating: number;
  imageUrl: string;
}
