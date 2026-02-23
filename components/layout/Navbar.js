import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { href: '/products', label: 'Products' },
    { href: '/brands', label: 'Brands' },
    { href: '/categories', label: 'Categories' },
  ];

  return (
    <nav className="shopmart-navbar">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          {/* Brand */}
          <Link href="/" className="navbar-brand">
            <span className="brand-logo-box">S</span>
            ShopMart
          </Link>

          {/* Desktop Nav Links */}
          <div className="d-none d-md-flex align-items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className="nav-link-item">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="nav-icons">
            {token ? (
              <>
                {/* User icon with dropdown */}
                <div style={{ position: 'relative' }} ref={dropRef}>
                  <button className="icon-btn" onClick={() => setDropOpen(!dropOpen)} title="Account">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  {dropOpen && (
                    <div style={{
                      position: 'absolute', top: '42px', right: 0,
                      background: 'white', border: '1px solid #eee',
                      borderRadius: '8px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                      minWidth: '160px', zIndex: 9999, overflow: 'hidden'
                    }}>
                      <div style={{ padding: '10px 14px', borderBottom: '1px solid #eee' }}>
                        <div style={{ fontSize: '0.78rem', color: '#888' }}>Signed in as</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</div>
                      </div>
                      <Link href="/wishlist" style={{ display: 'block', padding: '9px 14px', fontSize: '0.85rem', color: '#333', textDecoration: 'none' }}
                        onClick={() => setDropOpen(false)}>
                        <i className="far fa-heart me-2"></i> Wishlist
                      </Link>
                      <Link href="/orders" style={{ display: 'block', padding: '9px 14px', fontSize: '0.85rem', color: '#333', textDecoration: 'none' }}
                        onClick={() => setDropOpen(false)}>
                        <i className="fas fa-box me-2"></i> My Orders
                      </Link>
                      <Link href="/auth/change-password" style={{ display: 'block', padding: '9px 14px', fontSize: '0.85rem', color: '#333', textDecoration: 'none' }}
                        onClick={() => setDropOpen(false)}>
                        <i className="fas fa-key me-2"></i> Change Password
                      </Link>
                      <button
                        onClick={() => { setDropOpen(false); logout(); }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '9px 14px', fontSize: '0.85rem', color: '#dc3545',
                          background: 'none', border: 'none', borderTop: '1px solid #eee',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i> Logout
                      </button>
                    </div>
                  )}
                </div>

                {/* Cart */}
                <Link href="/cart" className="icon-btn" style={{ textDecoration: 'none', color: 'inherit' }} title="Cart">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && <span className="cart-count">{cartCount > 9 ? '9+' : cartCount}</span>}
                </Link>
              </>
            ) : (
              <div className="d-flex gap-2">
                <Link href="/auth/login" className="btn-shopmart-outline" style={{ padding: '7px 18px', fontSize: '0.85rem' }}>
                  Login
                </Link>
                <Link href="/auth/register" className="btn-shopmart-primary" style={{ padding: '7px 18px', fontSize: '0.85rem' }}>
                  Register
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button className="icon-btn d-md-none" onClick={() => setMenuOpen(!menuOpen)}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="d-md-none pt-3 pb-2 border-top mt-2">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className="nav-link-item d-block mb-1"
                onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
