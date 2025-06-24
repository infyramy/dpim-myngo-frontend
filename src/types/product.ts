export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Business {
  value: number;
  label: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  images?: string[];
  status: "active" | "inactive";
  featured: boolean;
  slug: string;
  businessId: number;
  business?: Business;
  tags: Tag[];
  link?: string;
  createdAt: string;
  modifiedAt?: string;
}

export interface Category {
  value: string;
  label: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  images?: (File | string)[];
  status: "active" | "inactive";
  featured: boolean;
  tags: string[];
  businessId: string;
  link?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  category: string;
  images?: File[];
  status: "active" | "inactive";
  featured: boolean;
  tags: string[];
  businessId: number;
  link?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}

export interface ProductValidationErrors {
  name?: string;
  description?: string;
  category?: string;
  businessId?: string;
  images?: string;
} 