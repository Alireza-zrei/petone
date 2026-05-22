/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './types';

const API_URL = process.env.API_URL || 'http://localhost:8000';

/** Product shape as returned by the backend (GET /products). */
interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: string;
  stock: number;
  image_url: string | null;
  brand: string;
  discount_price: number | null;
  rating: number;
  reviews_count: number;
  is_new: boolean;
  is_best_seller: boolean;
}

/** Convert a backend product into the frontend Product shape. */
function mapProduct(p: ApiProduct): Product {
  return {
    id: String(p.id),
    name: p.name,
    brand: p.brand,
    price: p.price,
    discountPrice: p.discount_price ?? undefined,
    rating: p.rating,
    reviewsCount: p.reviews_count,
    image: p.image_url ?? '',
    category: p.category,
    description: p.description ?? '',
    isNew: p.is_new,
    isBestSeller: p.is_best_seller,
    stockStatus: p.stock <= 0 ? 'out' : p.stock < 5 ? 'low' : 'available',
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products?limit=100`);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }
  const data: ApiProduct[] = await response.json();
  return data.map(mapProduct);
}
