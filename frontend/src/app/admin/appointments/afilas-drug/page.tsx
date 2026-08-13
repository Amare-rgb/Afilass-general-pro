'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { pharmaService } from '@/lib/pharma';
import { PharmaOrder } from '@/lib/types';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Clock,
  Package,
  Filter,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const STATUSES = ['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'];

export default function AfilasDrugOrdersPage() {
  const [orders, setOrders] = useState<PharmaOrder[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0
  });
  const [deleteError, setDeleteError] = useState<{show: boolean, message: string, count: number}>({
    show: false,
    message: '',
    count: 0
  });

  const LOCATION_NAME = 'Afilas Drug Manufacturing';

  async function load() {
    setLoading(true);
    setError('');
    setSuccess('');
    setDeleteError({ show: false, message: '', count: 0 });
    try {
      console.log(`📡 Fetching orders with filter: ${filter}`);
      
      const ordersData = await pharmaService.getOrders(
        filter ? { status: filter } : {},
        true
      );
      
      console.log('📊 Orders loaded:', ordersData);
      
      setOrders(ordersData);
      
      setStats({
        total: ordersData.length,
        pending: ordersData.filter(o => o.status === 'PENDING').length,
        processing: ordersData.filter(o => o.status === 'PROCESSING').length,
        completed: ordersData.filter(o => o.status === 'COMPLETED').length,
        cancelled: ordersData.filter(o => o.status === 'CANCELLED').length,
      });
      
      console.log(`✅ Loaded ${ordersData.length} pharma orders`);
    } catch (error: any) {
      console.error('❌ Failed to load pharma orders:', error);
      setError(error.message || 'Failed to load orders');
      toast.error(error.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filter]);

  const handleApprove = async (id: string) => {
    setUpdatingId(id);
    setError('');
    setSuccess('');
    try {
      await pharmaService.updateOrderStatus(id, 'COMPLETED', true);
      toast.success('✅ Order approved successfully');
      setSuccess('✅ Order approved and completed successfully');
      await load();
    } catch (error: any) {
      console.error('❌ Failed to approve order:', error);
      setError(error.message || 'Failed to approve order');
      toast.error(error.message || 'Failed to approve order');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this order?')) return;
    setUpdatingId(id);
    setError('');
    setSuccess('');
    try {
      await pharmaService.updateOrderStatus(id, 'CANCELLED', true);
      toast.success('❌ Order rejected successfully');
      setSuccess('❌ Order rejected successfully');
      await load();
    } catch (error: any) {
      console.error('❌ Failed to reject order:', error);
      setError(error.message || 'Failed to reject order');
      toast.error(error.message || 'Failed to reject order');
    } finally {
      setUpdatingId(null);
    }
  };

  async function remove(id: string) {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    if (order.status === 'PENDING' || order.status === 'PROCESSING') {
      const errorMsg = `Cannot delete order with ${order.status} status. Please complete or cancel the order first.`;
      setDeleteError({
        show: true,
        message: errorMsg,
        count: 1
      });
      toast.error(errorMsg);
      return;
    }

    if (!confirm(`Are you sure you want to delete this order?`)) return;
    
    try {
      await pharmaService.deleteOrder(id, true);
      setSuccess('🗑️ Order deleted successfully');
      toast.success('Order deleted successfully');
      await load();
    } catch (error: any) {
      console.error('❌ Failed to delete order:', error);
      setError(error.message || 'Failed to delete order');
      toast.error(error.message || 'Failed to delete order');
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-3 h-3" />;
      case 'PROCESSING': return <Loader2 className="w-3 h-3" />; // 🔥 REMOVED animate-spin
      case 'COMPLETED': return <CheckCircle className="w-3 h-3" />;
      case 'CANCELLED': return <XCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const needsAction = (status: string) => {
    return status === 'PENDING';
  };

  const canDelete = (status: string) => {
    return status === 'COMPLETED' || status === 'CANCELLED';
  };

  // Filter orders by search term
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      order.customerName.toLowerCase().includes(search) ||
      order.customerEmail.toLowerCase().includes(search) ||
      order.customerPhone.includes(search) ||
      order.drugName.toLowerCase().includes(search) ||
      order.id.toLowerCase().includes(search)
    );
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Page Header - REMOVED */}
      <div className="mb-6 flex items-center justify-end flex-wrap gap-4">
        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 font-medium">Total</p>
            <Package className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-yellow-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm text-yellow-600 font-medium">Pending</p>
            <Clock className="w-4 h-4 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-600 font-medium">Processing</p>
            <Loader2 className="w-4 h-4 text-blue-500" /> {/* 🔥 REMOVED animate-spin */}
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.processing}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-600 font-medium">Completed</p>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
        </div>
        
        <div className="bg-white rounded-xl border border-red-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-600 font-medium">Cancelled</p>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.cancelled}</p>
        </div>
      </div>

      {/* Delete Error Banner */}
      {deleteError.show && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Cannot Delete Order</p>
              <p className="text-sm text-red-600 mt-1">{deleteError.message}</p>
              <button
                onClick={() => setDeleteError({ show: false, message: '', count: 0 })}
                className="mt-3 text-xs text-red-600 hover:text-red-800 hover:underline"
              >
                Dismiss
              </button>
            </div>
            <button
              onClick={() => setDeleteError({ show: false, message: '', count: 0 })}
              className="text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-600 flex-1">{success}</p>
          <button onClick={() => setSuccess('')} className="text-green-600 hover:text-green-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600 flex-1">{error}</p>
          <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 font-medium">Status:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-300 pl-3 pr-8 py-2 bg-white text-sm appearance-none cursor-pointer hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border border-gray-300 pl-9 pr-4 py-2 bg-white text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Orders List - Clean List View */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-500">Loading orders...</p>
          </div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Orders Found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {filter || searchTerm ? 'Try changing the filters' : 'Orders will appear here when customers place them'}
          </p>
          <p className="text-xs text-gray-400">{LOCATION_NAME}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-3 bg-gray-50 px-4 py-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase">
            <div className="col-span-2">Order</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Drug</div>
            <div className="col-span-1 text-center">Qty</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Table Rows */}
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {/* Main Row - Always Visible */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 px-4 py-3 items-center">
                {/* Mobile Expand Button */}
                <div className="lg:hidden flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-mono text-gray-600">#{order.id.slice(0, 8)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {expandedId === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Order ID - Desktop */}
                <div className="hidden lg:flex lg:col-span-2 items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-mono text-gray-600">#{order.id.slice(0, 8)}</span>
                </div>

                {/* Customer - Desktop */}
                <div className="hidden lg:block lg:col-span-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800">{order.customerName}</span>
                    <span className="text-xs text-gray-500 truncate">{order.customerEmail}</span>
                  </div>
                </div>

                {/* Drug - Desktop */}
                <div className="hidden lg:block lg:col-span-2">
                  <span className="text-sm text-gray-700">{order.drugName}</span>
                </div>

                {/* Quantity - Desktop */}
                <div className="hidden lg:block lg:col-span-1 text-center">
                  <span className="text-sm font-semibold text-blue-600">{order.quantity}</span>
                </div>

                {/* Status - Desktop */}
                <div className="hidden lg:flex lg:col-span-2 justify-center">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>

                {/* Actions - Desktop */}
                <div className="hidden lg:flex lg:col-span-2 items-center justify-end gap-2">
                  {needsAction(order.status) && (
                    <>
                      <button
                        onClick={() => handleApprove(order.id)}
                        disabled={updatingId === order.id}
                        className="text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 px-3 py-1.5 flex items-center gap-1"
                      >
                        {updatingId === order.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        disabled={updatingId === order.id}
                        className="text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 px-3 py-1.5 flex items-center gap-1"
                      >
                        {updatingId === order.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <X className="w-3 h-3" />
                        )}
                        Reject
                      </button>
                    </>
                  )}

                  {(order.status === 'COMPLETED' || order.status === 'CANCELLED') && (
                    <span className={`text-xs font-medium flex items-center gap-1 ${order.status === 'COMPLETED' ? 'text-green-600' : 'text-red-600'}`}>
                      {order.status === 'COMPLETED' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {order.status === 'COMPLETED' ? 'Done' : 'Cancelled'}
                    </span>
                  )}

                  {canDelete(order.status) && (
                    <button
                      onClick={() => remove(order.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={updatingId === order.id}
                      title="Delete order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Row - Mobile Only */}
              {expandedId === order.id && (
                <div className="lg:hidden px-4 pb-3 pt-1 bg-gray-50 rounded-b-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="font-medium text-gray-800">{order.customerName}</p>
                      <p className="text-xs text-gray-500 truncate">{order.customerEmail}</p>
                      <p className="text-xs text-gray-500">{order.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Drug</p>
                      <p className="font-medium text-gray-800">{order.drugName}</p>
                      <p className="text-xs text-gray-500">Qty: {order.quantity}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm text-gray-700">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="col-span-2 flex gap-2 mt-2 pt-2 border-t border-gray-200">
                      {needsAction(order.status) && (
                        <>
                          <button
                            onClick={() => handleApprove(order.id)}
                            disabled={updatingId === order.id}
                            className="flex-1 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 px-3 py-2 flex items-center justify-center gap-1"
                          >
                            {updatingId === order.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(order.id)}
                            disabled={updatingId === order.id}
                            className="flex-1 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 px-3 py-2 flex items-center justify-center gap-1"
                          >
                            {updatingId === order.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                            Reject
                          </button>
                        </>
                      )}
                      {canDelete(order.status) && (
                        <button
                          onClick={() => remove(order.id)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
            <span>Showing {filteredOrders.length} of {orders.length} orders</span>
            <div className="flex items-center gap-4">
              <span>{LOCATION_NAME}</span>
              <span>Last updated: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}