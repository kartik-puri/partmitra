"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Trash2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Address = {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    async function loadAddresses() {
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("customer_addresses")
        .select("*")
        .eq("user_id", auth.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        alert("Addresses load nahi hue. Database setup check karna hoga.");
      } else {
        setAddresses((data ?? []) as Address[]);
      }

      setLoading(false);
    }

    loadAddresses();
  }, [router]);

  function changeField(field: string, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function editAddress(address: Address) {
    setEditingId(address.id);
    setForm({
      full_name: address.full_name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      router.replace("/login");
      return;
    }

    const record = { ...form, user_id: auth.user.id };

    const result = editingId
      ? await supabase
          .from("customer_addresses")
          .update(record)
          .eq("id", editingId)
          .eq("user_id", auth.user.id)
      : await supabase.from("customer_addresses").insert(record);

    setSaving(false);

    if (result.error) {
      alert("Address save nahi hua. Database setup check karo.");
      return;
    }

    const { data, error } = await supabase
      .from("customer_addresses")
      .select("*")
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false });

    if (!error) setAddresses((data ?? []) as Address[]);

    setEditingId(null);
    setForm({
      full_name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });
  }

  async function deleteAddress(id: string) {
    if (!window.confirm("Kya aap ye address delete karna chahte hain?")) return;

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    const { error } = await supabase
      .from("customer_addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", auth.user.id);

    if (error) {
      alert("Address delete nahi hua.");
      return;
    }

    setAddresses((previous) => previous.filter((item) => item.id !== id));
  }

  if (loading) return <main className="p-6">Loading addresses...</main>;

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-gray-50 px-4 py-8 text-gray-900">
      <button onClick={() => router.push("/account")} className="mb-5 flex items-center gap-2 text-sm">
        <ArrowLeft size={18} /> Back to Account
      </button>

      <div className="mb-7 flex items-center gap-3">
        <span className="rounded-xl bg-blue-100 p-3 text-blue-700">
          <MapPin size={27} />
        </span>
        <div>
          <h1 className="text-2xl font-bold">Saved Addresses</h1>
          <p className="text-sm text-gray-500">Manage your delivery addresses</p>
        </div>
      </div>

      <form onSubmit={saveAddress} className="mb-8 space-y-4 rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit Address" : "Add New Address"}
        </h2>

        {[
          { key: "full_name", label: "Full Name", placeholder: "Customer name" },
          { key: "phone", label: "Mobile Number", placeholder: "10-digit mobile number" },
          { key: "address", label: "House / Street / Area", placeholder: "Complete delivery address" },
          { key: "city", label: "City / Town", placeholder: "City or town" },
          { key: "state", label: "State", placeholder: "State" },
          { key: "pincode", label: "PIN Code", placeholder: "6-digit PIN code" },
        ].map((field) => (
          <label key={field.key} className="block text-sm font-medium">
            {field.label}
            <input
              required
              value={form[field.key as keyof typeof form]}
              onChange={(event) => changeField(field.key, event.target.value)}
              placeholder={field.placeholder}
              type={field.key === "phone" || field.key === "pincode" ? "tel" : "text"}
              maxLength={field.key === "phone" ? 10 : field.key === "pincode" ? 6 : undefined}
              pattern={field.key === "phone" ? "[0-9]{10}" : field.key === "pincode" ? "[0-9]{6}" : undefined}
              className="mt-1 w-full rounded-lg border p-3 font-normal outline-none focus:border-blue-600"
            />
          </label>
        ))}

        <div className="flex flex-wrap gap-3">
          <button disabled={saving} className="flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 font-medium text-white disabled:opacity-60">
            <Plus size={18} /> {saving ? "Saving..." : editingId ? "Update Address" : "Save Address"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ full_name: "", phone: "", address: "", city: "", state: "", pincode: "" });
              }}
              className="rounded-lg border px-5 py-3"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="mb-3 text-lg font-semibold">Your Addresses</h2>

      {addresses.length === 0 ? (
        <div className="rounded-2xl border bg-white p-6 text-center text-gray-500">
          No saved addresses yet.
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((item) => (
            <article key={item.id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <h3 className="font-semibold">{item.full_name}</h3>
              <p className="mt-1 text-sm text-gray-600">{item.phone}</p>
              <p className="mt-2 text-sm text-gray-700">{item.address}, {item.city}, {item.state} - {item.pincode}</p>
              <div className="mt-4 flex gap-4 text-sm">
                <button onClick={() => editAddress(item)} className="font-medium text-blue-700">Edit</button>
                <button onClick={() => deleteAddress(item.id)} className="flex items-center gap-1 font-medium text-red-600">
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
