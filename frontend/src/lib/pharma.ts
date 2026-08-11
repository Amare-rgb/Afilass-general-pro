// ============================================================
// ✅ FIXED: Use named import instead of default import
// ============================================================

import api, { extractApiData, getApiErrorMessage } from '@/lib/api';
import { PharmaOrder } from '@/lib/types'; // ← THIS IS THE FIX

// ============================================================
// TYPES
// ============================================================

export interface CreatePharmaOrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  drugName: string;
  quantity: number;
}

export interface UpdatePharmaOrderData {
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  drugName?: string;
  quantity?: number;
}

export interface PharmaOrderFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  customerEmail?: string;
  customerPhone?: string;
}

// ============================================================
// SERVICE
// ============================================================

export const pharmaService = {
  /**
   * Get all pharma orders with filters
   * GET /api/pharma-orders
   */
  async getOrders(filters: PharmaOrderFilters = {}, auth: boolean = true): Promise<PharmaOrder[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) {
        queryParams.append('status', filters.status);
      }
      if (filters.startDate) {
        queryParams.append('startDate', filters.startDate);
      }
      if (filters.endDate) {
        queryParams.append('endDate', filters.endDate);
      }
      if (filters.customerEmail) {
        queryParams.append('customerEmail', filters.customerEmail);
      }
      if (filters.customerPhone) {
        queryParams.append('customerPhone', filters.customerPhone);
      }

      const queryString = queryParams.toString();
      const endpoint = `/pharma-orders${queryString ? `?${queryString}` : ''}`;
      
      console.log(`📡 Fetching pharma orders: ${endpoint}`);
      const response = await api.get(endpoint, auth);
      console.log('📊 Pharma orders response:', response);
      
      return extractApiData<PharmaOrder[]>(response) || [];
    } catch (error) {
      console.error('Failed to fetch pharma orders:', error);
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Get a single pharma order by ID
   * GET /api/pharma-orders/:id
   */
  async getOrder(id: string, auth: boolean = true): Promise<PharmaOrder> {
    try {
      console.log(`📡 Fetching pharma order: ${id}`);
      const response = await api.get(`/pharma-orders/${id}`, auth);
      console.log('📊 Pharma order response:', response);
      
      const order = extractApiData<PharmaOrder>(response);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      console.error(`Failed to fetch pharma order ${id}:`, error);
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Create a new pharma order (public)
   * POST /api/pharma-orders
   */
  async createOrder(data: CreatePharmaOrderData): Promise<PharmaOrder> {
    try {
      console.log('📡 Creating pharma order with data:', JSON.stringify(data, null, 2));
      
      const payload = {
        customerName: data.customerName.trim(),
        customerEmail: data.customerEmail.trim(),
        customerPhone: data.customerPhone.trim(),
        drugName: data.drugName.trim(),
        quantity: data.quantity,
      };

      const response = await api.post('/pharma-orders', payload, false);
      console.log('📊 Create order response:', response);
      
      const order = extractApiData<PharmaOrder>(response);
      return order;
    } catch (error) {
      console.error('Failed to create pharma order:', error);
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Update pharma order status (admin)
   * PATCH /api/pharma-orders/:id/status
   */
  async updateOrderStatus(id: string, status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED', auth: boolean = true): Promise<PharmaOrder> {
    try {
      console.log(`📡 Updating pharma order ${id} status to: ${status}`);
      const response = await api.patch(`/pharma-orders/${id}/status`, { status }, auth);
      console.log('📊 Update status response:', response);
      
      return extractApiData<PharmaOrder>(response);
    } catch (error) {
      console.error(`Failed to update pharma order ${id} status:`, error);
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Update pharma order details (admin)
   * PUT /api/pharma-orders/:id
   */
  async updateOrder(id: string, data: UpdatePharmaOrderData, auth: boolean = true): Promise<PharmaOrder> {
    try {
      console.log(`📡 Updating pharma order: ${id}`, data);
      const response = await api.put(`/pharma-orders/${id}`, data, auth);
      console.log('📊 Update order response:', response);
      
      return extractApiData<PharmaOrder>(response);
    } catch (error) {
      console.error(`Failed to update pharma order ${id}:`, error);
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Delete a pharma order (admin)
   * DELETE /api/pharma-orders/:id
   */
  async deleteOrder(id: string, auth: boolean = true): Promise<void> {
    try {
      console.log(`📡 Deleting pharma order: ${id}`);
      const response = await api.delete(`/pharma-orders/${id}`, auth);
      console.log('📊 Delete order response:', response);
    } catch (error) {
      console.error(`Failed to delete pharma order ${id}:`, error);
      throw new Error(getApiErrorMessage(error));
    }
  },

  // ============================================================
  // STATISTICS METHODS
  // ============================================================

  /**
   * Get pharma order statistics
   */
  async getOrderStats(filters: PharmaOrderFilters = {}, auth: boolean = true): Promise<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
  }> {
    try {
      const orders = await this.getOrders(filters, auth);
      
      return {
        total: orders.length,
        pending: orders.filter(o => o.status === 'PENDING').length,
        processing: orders.filter(o => o.status === 'PROCESSING').length,
        completed: orders.filter(o => o.status === 'COMPLETED').length,
        cancelled: orders.filter(o => o.status === 'CANCELLED').length,
      };
    } catch (error) {
      console.error('Failed to get pharma order stats:', error);
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Get orders by customer email
   */
  async getOrdersByEmail(email: string, auth: boolean = true): Promise<PharmaOrder[]> {
    return this.getOrders({ customerEmail: email }, auth);
  },

  /**
   * Get orders by customer phone
   */
  async getOrdersByPhone(phone: string, auth: boolean = true): Promise<PharmaOrder[]> {
    return this.getOrders({ customerPhone: phone }, auth);
  },

  /**
   * Get pending orders
   */
  async getPendingOrders(auth: boolean = true): Promise<PharmaOrder[]> {
    return this.getOrders({ status: 'PENDING' }, auth);
  },

  /**
   * Get processing orders
   */
  async getProcessingOrders(auth: boolean = true): Promise<PharmaOrder[]> {
    return this.getOrders({ status: 'PROCESSING' }, auth);
  },

  /**
   * Get completed orders
   */
  async getCompletedOrders(auth: boolean = true): Promise<PharmaOrder[]> {
    return this.getOrders({ status: 'COMPLETED' }, auth);
  },

  /**
   * Get cancelled orders
   */
  async getCancelledOrders(auth: boolean = true): Promise<PharmaOrder[]> {
    return this.getOrders({ status: 'CANCELLED' }, auth);
  },
};

export default pharmaService;