import React from "react";
import { Package, ChevronRight, CheckCircle, Clock } from "lucide-react";

const OrderHistory = () => {
  const orders = [
    {
      id: "#ORD-9921",
      date: "Oct 24, 2025",
      total: 125000,
      status: "Delivered",
      items: 2,
    },
    {
      id: "#ORD-9918",
      date: "Oct 15, 2025",
      total: 45000,
      status: "Processing",
      items: 1,
    },
    {
      id: "#ORD-9800",
      date: "Sep 30, 2025",
      total: 85000,
      status: "Delivered",
      items: 3,
    },
  ];

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
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                <Package size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{order.id}</h4>
                <p className="text-xs text-gray-500">
                  {order.date} • {order.items} items
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
