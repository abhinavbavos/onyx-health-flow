import { apiRequest, tokenManager } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';

interface Product {
  _id: string;
  name: string;
  deviceCode: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductTest {
  _id: string;
  testName: string;
  description?: string;
}

interface AddProductData {
  name: string;
  deviceCode: string;
  description?: string;
}

export const productService = {
  async addProduct(data: AddProductData): Promise<{ product: Product }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ product: Product }>(API_ENDPOINTS.product.add, {
      method: 'POST',
      body: data,
      token: token || undefined,
    });
  },

  async getProductTests(deviceCode: string): Promise<{ tests: ProductTest[] }> {
    const token = tokenManager.getAccessToken();
    return apiRequest<{ tests: ProductTest[] }>(API_ENDPOINTS.product.tests(deviceCode), {
      method: 'GET',
      token: token || undefined,
    });
  },
};
