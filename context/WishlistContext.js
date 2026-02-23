import { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist, addWishlist, removeWishlist } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const { token } = useAuth();

  useEffect(() => { if (token) fetchWishlist(); else { setWishlist([]); setWishlistIds([]); } }, [token]);

  const fetchWishlist = async () => {
    try {
      const { data } = await getWishlist();
      const items = data.data || [];
      setWishlist(items);
      setWishlistIds(items.map(p => p._id));
    } catch { setWishlist([]); }
  };

  const toggleWishlist = async (productId) => {
    if (wishlistIds.includes(productId)) {
      try {
        await removeWishlist(productId);
        const newIds = wishlistIds.filter(id => id !== productId);
        setWishlistIds(newIds);
        setWishlist(wishlist.filter(p => p._id !== productId));
        toast.success('Removed from wishlist');
      } catch { toast.error('Error'); }
    } else {
      try {
        await addWishlist(productId);
        setWishlistIds([...wishlistIds, productId]);
        fetchWishlist();
        toast.success('Added to wishlist');
      } catch { toast.error('Error'); }
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, wishlistIds, toggleWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
