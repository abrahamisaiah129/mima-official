import React from "react";
import { Package, ChevronRight, CheckCircle, Clock } from "lucide-react";

import { useUser } from "../context/UserContext";

const OrderHistory = () => {
  const { user } = useUser();
  const orders = user?.orderHistory || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
          Order History
        </h2>
      </div>

      <div className="divide-y divide-gray-100">
        {orders.map((order) => (
          <div
            key={order.id}
            className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition cursor-pointer group"
          >
            <div className="flex items-start space-x-4 mb-4 sm:mb-0">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${order.status === "Delivered"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
                  }`}
              >
                <Package size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{order.id}</h4>
                <p className="text-xs text-gray-500">
                  {order.date} • {Array.isArray(order.items) ? order.items.length : (order.items || 0)} items
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end sm:space-x-8 w-full sm:w-auto">
              <div className="text-right">
                <p className="font-bold text-slate-900">
                  ₦{order.total.toLocaleString()}
                </p>
                <div className="flex items-center justify-end space-x-1 text-xs font-medium">
                  {order.status === "Delivered" ? (
                    <CheckCircle size={12} className="text-green-600" />
                  ) : (
                    <Clock size={12} className="text-yellow-600" />
                  )}
                  <span
                    className={
                      order.status === "Delivered"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              <ChevronRight
                size={20}
                className="text-gray-300 group-hover:text-slate-900 transition"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
