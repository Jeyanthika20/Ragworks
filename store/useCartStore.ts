import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: CartItem) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  totalItems: 0,
  totalPrice: 0,

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.id === product.id);
      let updatedCart;
      if (existing) {
        updatedCart = state.cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...state.cart, { ...product, quantity: 1 }];
      }
      return {
        cart: updatedCart,
        totalItems: updatedCart.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: updatedCart.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        ),
      };
    }),

  increaseQuantity: (id) =>
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      return {
        cart: updatedCart,
        totalItems: updatedCart.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: updatedCart.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        ),
      };
    }),

  decreaseQuantity: (id) =>
    set((state) => {
      const updatedCart = state.cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
      return {
        cart: updatedCart,
        totalItems: updatedCart.reduce((sum, i) => sum + i.quantity, 0),
        totalPrice: updatedCart.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        ),
      };
    }),

  clearCart: () =>
    set({
      cart: [],
      totalItems: 0,
      totalPrice: 0,
    }),
}));