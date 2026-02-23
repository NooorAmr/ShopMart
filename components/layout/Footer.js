import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="shopmart-footer">
      <div className="container">
        <div className="row g-4">

          {/* Brand Col */}
          <div className="col-12 col-md-4 col-lg-3">
            <Link href="/" className="footer-brand">
              <span style={{
                width: 28, height: 28, background: '#000', color: '#fff',
                borderRadius: 5, display: 'inline-flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 800, fontSize: '0.95rem', flexShrink: 0
              }}>S</span>
              ShopMart
            </Link>
            <p className="footer-desc">
              Your one-stop destination for the latest technology, fashion, and lifestyle products. Quality guaranteed with fast shipping and excellent customer service.
            </p>
            <div className="footer-contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>123 Shop Street, October City, DC 12345</span>
            </div>
            <div className="footer-contact-item">
              <i className="fas fa-phone"></i>
              <span>(+20) 01093333333</span>
            </div>
            <div className="footer-contact-item">
              <i className="fas fa-envelope"></i>
              <span>support@shopmart.com</span>
            </div>
          </div>

          {/* Shop */}
          <div className="col-6 col-md-2">
            <div className="footer-col-title">SHOP</div>
            <ul className="footer-links">
              <li><Link href="/categories/electronics">Electronics</Link></li>
              <li><Link href="/categories/fashion">Fashion</Link></li>
              <li><Link href="/categories/home-garden">Home & Garden</Link></li>
              <li><Link href="/categories/sports">Sports</Link></li>
              <li><Link href="/products">Deals</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-6 col-md-2">
            <div className="footer-col-title">CUSTOMER SERVICE</div>
            <ul className="footer-links">
              <li><Link href="#">Contact Us</Link></li>
              <li><Link href="#">Help Center</Link></li>
              <li><Link href="/orders">Track Your Order</Link></li>
              <li><Link href="#">Returns & Exchanges</Link></li>
              <li><Link href="#">Size Guide</Link></li>
            </ul>
          </div>

          {/* About */}
          <div className="col-6 col-md-2">
            <div className="footer-col-title">ABOUT</div>
            <ul className="footer-links">
              <li><Link href="#">About shopmart</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#">Press</Link></li>
              <li><Link href="#">Investor Relations</Link></li>
              <li><Link href="#">Sustainability</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="col-6 col-md-2">
            <div className="footer-col-title">POLICIES</div>
            <ul className="footer-links">
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms of Service</Link></li>
              <li><Link href="#">Cookie Policy</Link></li>
              <li><Link href="#">Shipping Policy</Link></li>
              <li><Link href="#">Refund Policy</Link></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
