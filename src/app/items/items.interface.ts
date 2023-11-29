import { ItemType } from './enums/item-type.enum';

export interface ItemInterface {
  _id?: string;
  name: string;
  brand: string;
  model: string;
  color: string;
  image: string;
  quantity: number;
  description: string;
  price: number;
  category: ItemType;
  isAvailable: boolean;
  showPrice: boolean;
}
