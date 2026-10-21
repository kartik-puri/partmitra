"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string | number;
  created_at?: string;
  full_name?: string;
  customer_name?: string;
  name?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  full_address?: string;
  total_amount?: number;
  total?: number;
  payment_status?: string;
  order_status?: string;
  order_items?: {
    id?: string | number;
    product_name?: string;
    part_number?: string;
    quantity?: number;
    price?: number;
  }[];
};

const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [saving, setSaving] = useState<string | number | null>(null);

  async function loadOrders() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setOrders([]);
    } else {
      setOrders((data || []) as Order[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateOrder(id: string | number, field: "order_status" | "payment_status", value: string) {
    if (!window.confirm(`Change ${field.replace("_", " ")} to "${value}"?`)) return;
    setSaving(id);
    setError("");
    try {
      const { data, error } = await supabase.from("orders").update({ [field]: value }).eq("id", id).select("id");
      if (error) {
        setError(`Update failed: ${error.message} (Code: ${error.code || "unknown"})`);
        window.alert(`Status update failed: ${error.message}`);
      } else if (!data || data.length === 0) {
        const msg = "No order updated. Check Supabase UPDATE permissions and order ID.";
        setError(msg);
        window.alert(msg);
      } else {
        await loadOrders();
        window.alert("Status updated successfully!");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(`Update failed: ${msg}`);
      window.alert(msg);
    } finally {
      setSaving(null);
    }
  }

  const filteredOrders = orders.filter((order) => {
    const customer =
      order.full_name || order.customer_name || order.name || "";

    const matchesSearch = [
      String(order.id),
      customer,
      order.phone || "",
      order.mobile || "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.order_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const money = (value?: number) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              View customer orders and manage their status.
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Refresh Orders
          </button>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total Orders", value: orders.length },
            {
              label: "Pending Orders",
              value: orders.filter(
                (o) => (o.order_status || "pending") === "pending"
              ).length,
            },
            {
              label: "Paid Orders",
              value: orders.filter(
                (o) => o.payment_status === "paid"
              ).length,
            },
            {
              label: "Pending Payments",
              value: orders.filter(
                (o) => (o.payment_status || "pending") === "pending"
              ).length,
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, customer or phone..."
            className="min-w-0 flex-1 rounded-lg border bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border bg-white px-4 py-3 text-sm"
          >
            <option value="all">All Order Statuses</option>
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">Could not load or update orders.</p>
            <p className="mt-1 break-words">{error}</p>
            <p className="mt-2">
              Check your database table, column names and Supabase permissions.
            </p>
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border bg-white p-10 text-center text-gray-500">
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            <p className="text-lg font-semibold text-gray-800">
              No orders found
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Orders will appear here when they are available in the database.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const customer =
                order.full_name ||
                order.customer_name ||
                order.name ||
                "Customer";

              const items = order.order_items || [];

              return (
                <section
                  key={order.id}
                  className="overflow-hidden rounded-xl border bg-white shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b bg-gray-50 p-4">
                    <div>
                      <p className="font-bold text-gray-900">
                        Order #{order.id}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString("en-IN")
                          : "Date not available"}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      {money(order.total_amount ?? order.total)}
                    </p>
                  </div>

                  <div className="grid gap-5 p-4 md:grid-cols-2">
                    <div>
                      <h2 className="mb-2 font-semibold text-gray-800">
                        Customer Details
                      </h2>
                      <p className="text-sm text-gray-700">{customer}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        {order.phone || order.mobile || "Phone not available"}
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                        {order.full_address ||
                          order.address ||
                          "Address not available"}
                      </p>
                      <a
                        href={`https://wa.me/91${(order.phone || order.mobile || "").replace(/\\D/g, "").replace(/^91/, "")}?text=${encodeURIComponent(
                          `Namaste ${customer} ji! 🙏

Aapka PartMitra Order #${order.id} receive ho gaya hai.

${items.length ? items.map((item) => `Product: ${item.product_name || item.part_number || "Product"} | Qty: ${item.quantity ?? 1}`).join("\\n") : "Aapke order ki details hum jald share karenge."}

Total Amount: ${money(order.total_amount ?? order.total)}
Payment Status: ${(order.payment_status || "pending").toUpperCase()}

Aapke order ke liye dhanyavaad!
Team PartMitra`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
                      >
                        Confirm on WhatsApp
                      </a>
                    </div>

                    <div>
                      <h2 className="mb-2 font-semibold text-gray-800">
                        Order Items ({items.length})
                      </h2>
                      {items.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No item details available.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {items.map((item, index) => (
                            <div
                              key={item.id ?? index}
                              className="flex justify-between gap-3 border-b pb-2 text-sm last:border-0"
                            >
                              <div>
                                <p className="font-medium text-gray-800">
                                  {item.product_name ||
                                    item.part_number ||
                                    "Product"}
                                </p>
                                {item.part_number && item.product_name && (
                                  <p className="text-xs text-gray-500">
                                    Part No.: {item.part_number}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500">
                                  Qty: {item.quantity ?? 1}
                                </p>
                              </div>
                              <p className="whitespace-nowrap font-medium">
                                {money(
                                  (item.price || 0) * (item.quantity || 1)
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-800">
                        Order Status
                      </label>
                      <select
                        value={order.order_status || "pending"}
                        disabled={saving === order.id}
                        onChange={(e) =>
                          updateOrder(order.id, "order_status", e.target.value)
                        }
                        className="w-full rounded-lg border bg-white px-3 py-3 text-sm disabled:opacity-50"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-800">
                        Payment Status
                      </label>
                      <select
                        value={order.payment_status || "pending"}
                        disabled={saving === order.id}
                        onChange={(e) =>
                          updateOrder(
                            order.id,
                            "payment_status",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border bg-white px-3 py-3 text-sm disabled:opacity-50"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                      <p className="mt-2 text-xs text-gray-500">
                        Mark as Paid only after verifying the UPI payment.
                      </p>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
