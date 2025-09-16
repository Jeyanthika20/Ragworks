"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCartStore } from "../../store/useCartStore";
import { useOrdersStore } from "../../store/useOrdersStore";
import { useRouter } from "next/navigation";
import { formatCurrency } from "../../lib/utils";
import { useEffect, useState } from "react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  postal: z.string().min(3, "Postal code must be at least 3 characters"),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCartStore();
  const { addOrder } = useOrdersStore();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (cart.length === 0) return;
    const saved = localStorage.getItem("checkoutInfo");
    if (saved) {
      const parsed = JSON.parse(saved);
      setValue("name", parsed.name);
      setValue("email", parsed.email);
      setValue("address", parsed.address);
      setValue("city", parsed.city);
      setValue("postal", parsed.postal);
    }
    setLoading(false);
  }, [cart, setValue]);

  const placeOrder = (data: FormData) => {
    const order = {
      id: Date.now().toString(),
      items: cart,
      totalPrice,
      date: new Date().toISOString(),
      customer: { ...data },
      status: "processing",
    };
    addOrder(order);
    clearCart();
    router.push("/orders");
  };

  const onSubmit = (data: FormData) => {
    localStorage.setItem("checkoutInfo", JSON.stringify(data));
    placeOrder(data);
  };

  if (cart.length === 0) {
    return <div className="p-6">Your cart is empty.</div>;
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Full name</label>
          <input id="name" {...register("name")} className="w-full px-3 py-2 rounded border" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input id="email" {...register("email")} className="w-full px-3 py-2 rounded border" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium">Address</label>
          <input id="address" {...register("address")} className="w-full px-3 py-2 rounded border" />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label htmlFor="city" className="block text-sm font-medium">City</label>
            <input id="city" {...register("city")} className="w-full px-3 py-2 rounded border" />
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
          </div>
          <div className="w-36">
            <label htmlFor="postal" className="block text-sm font-medium">Postal</label>
            <input id="postal" {...register("postal")} className="w-full px-3 py-2 rounded border" />
            {errors.postal && <p className="text-red-500 text-sm">{errors.postal.message}</p>}
          </div>
        </div>

        <div className="pt-4 border-t flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">Order total</div>
            <div className="text-lg font-bold">{formatCurrency(totalPrice)}</div>
          </div>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Place order</button>
        </div>
      </form>
    </main>
  );
}
