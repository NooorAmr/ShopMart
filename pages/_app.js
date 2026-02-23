import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import Layout from '../components/layout/Layout';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { borderRadius: '8px', fontSize: '0.88rem', padding: '10px 14px' },
              success: { iconTheme: { primary: '#000', secondary: '#fff' } },
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
