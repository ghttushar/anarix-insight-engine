import { api } from "@/lib/api-client";
import { CatalogProduct } from "@/types/catalog";

export interface CatalogService {
  getProducts: () => Promise<CatalogProduct[]>;
  getProductById: (id: string) => Promise<CatalogProduct | undefined>;
}

const realService: CatalogService = {
  getProducts: () => api.get<CatalogProduct[]>("/catalog/products"),
  getProductById: (id) => api.get<CatalogProduct | undefined>(`/catalog/products/${id}`),
};

let currentService: CatalogService = realService;

export function setCatalogService(service: CatalogService) {
  currentService = service;
}

export function getCatalogService(): CatalogService {
  return currentService;
}

export const getProducts = () => currentService.getProducts();
export const getProductById = (id: string) => currentService.getProductById(id);
