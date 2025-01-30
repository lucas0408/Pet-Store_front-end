export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  errors: string[];
}

export interface Product {
  id?: string;
  name: string;
  unitPrice: number;
  unitsInStock: number;
  categories: Category[];
  imageUrl: string;
}

export interface Category {
  id?: string;
  name: string;
  imageUrl: string;
}

export interface User {
  id?: string;
  name: string;
  password: string;
  role: string;
  login: string;
}

export interface Login{
  login: string;
  password: string;

}

export interface JwtPayload {
  sub: string;
  roles: string[];
  exp: number;
}
