"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserRound,
  Package,
  MapPin,
  Heart,
  Headset,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const sections = [
  { title: "My Orders", description: "Track your orders and delivery", icon: Package, href: "/orders" },
  { title: "Saved Addresses", description: "Add or manage delivery addresses", icon: MapPin, href: "/addresses" },
  { title: "My Wishlist", description: "View your saved auto parts", icon: Heart, href: "/wishlist" },
  { title: "Help & Support", description: "Get help with products and orders", icon: Headset, href: "/support" },
];

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }

      setUser(data.user);
      setName(data.user.user_metadata?.full_name ?? "");
      setPhone(data.user.user_metadata?.phone ?? "");
      setLoading(false);
    });
  }, [router]);

  async function saveProfile() {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name, phone },
    });
    if (error) {
      alert(error.message);
    } else {
      alert("Profile saved successfully!");
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
      return;
    }
    router.replace("/login");
  }

  if (loading) return <main className="p-8">Loading account...</main>;

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-gray-50 px-4 py-8 text-gray-900">
      <h1 className="mb-2 text-3xl font-bold">My Account</h1>
      <p className="mb-8 text-gray-500">Manage your PartMitra account</p>

      <section className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-full bg-blue-50 p-3 text-blue-700">
            <UserRound size={28} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Profile</h2>
            <p className="text-sm text-gray-500">Your personal details</p>
          </div>
        </div>

        <label className="mb-1 block text-sm font-medium">Full name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="mb-4 w-full rounded-lg border p-3"
        />

        <label className="mb-1 block text-sm font-medium">Email address</label>
        <input
          value={user?.email ?? ""}
          readOnly
          className="mb-4 w-full rounded-lg border bg-gray-100 p-3"
        />

        <label className="mb-1 block text-sm font-medium">Mobile number</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter mobile number"
          type="tel"
          className="mb-4 w-full rounded-lg border p-3"
        />

        <button onClick={saveProfile} className="rounded-lg bg-blue-700 px-5 py-3 font-medium text-white">
          Save Profile
        </button>
      </section>

      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        {sections.map(({ title, description, icon: Icon, href }) => (
          <button
            key={title}
            onClick={() => router.push(href)}
            className="flex w-full items-center gap-4 border-b p-5 text-left last:border-b-0 hover:bg-gray-50"
          >
            <span className="rounded-xl bg-gray-100 p-3 text-gray-700">
              <Icon size={23} />
            </span>
            <span className="flex-1">
              <span className="block font-semibold">{title}</span>
              <span className="mt-1 block text-sm text-gray-500">{description}</span>
            </span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        ))}
      </section>

      <button
        onClick={logout}
        className="mt-6 flex w-full items-center gap-4 rounded-2xl border border-red-200 bg-white p-5 text-left text-red-600 hover:bg-red-50"
      >
        <span className="rounded-xl bg-red-50 p-3">
          <LogOut size={23} />
        </span>
        <span>
          <span className="block font-semibold">Logout</span>
          <span className="mt-1 block text-sm">Sign out of your account</span>
        </span>
      </button>
    </main>
  );
}
