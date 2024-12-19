export interface iComment {
  _id: string;
  productId: String;
  userId: { username?: string };
  rating: number;
  comment: String;
  createdAt?: string;
  updatedAt?: string;
  hidden: Boolean;
}
