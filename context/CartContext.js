import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, removeCart, updateCart, clearCart } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);
  const { token } = useAuth();

  useEffect(() => { if (token) fetchCart(); else { setCart(null); setCartCount(0); } }, [token]);

  const fetchCart = async () => {
    try {
      const { data } = await getCart();
      setCart(data);
      setCartCount(data.numOfCartItems || 0);
    } catch { setCart(null); setCartCount(0); }
  };

  const addProduct = async (productId) => {
    setLoadingCart(true);
    try {
      const { data } = await addToCart(productId);
      setCart(data);
      setCartCount(data.numOfCartItems || 0);
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add to cart');
    }
    setLoadingCart(false);
  };

  const removeProduct = async (id) => {
    try {
      const { data } = await removeCart(id);
      setCart(data); setCartCount(data.numOfCartItems);
      toast.success('Removed from cart');
    } catch { toast.error('Error removing item'); }
  };

  const updateQuantity = async (id, count) => {
    if (count < 1) return;
    try {
      const { data } = await updateCart(id, count);
      setCart(data);
    } catch { toast.error('Error updating quantity'); }
  };

  const emptyCart = async () => {
    try { await clearCart(); setCart(null); setCartCount(0); } catch {}
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, loadingCart, fetchCart, addProduct, removeProduct, updateQuantity, emptyCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
