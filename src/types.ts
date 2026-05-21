/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  category: string;
  description: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  stockStatus: 'available' | 'low' | 'out';
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  image: string;
  path: string;
  subcategories?: string[];
}

export interface TrustBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
}
