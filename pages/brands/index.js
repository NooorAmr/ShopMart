import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getBrands } from '../../services/api';
import Spinner from '../../components/common/Spinner';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getBrands()
      .then(r => setBrands(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head>
        <title>Brands - ShopMart</title>
      </Head>

      <div className="container py-4">
        <div className="page-header">
          <h1>Brands</h1>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="row g-3">
            {brands.map(brand => (
              <div className="col-6 col-md-3" key={brand._id}>
                <div
                  className="brand-card"
                  onClick={() => router.push(`/brands/${brand._id}`)}
                >
                  <img
                    src={brand.image}
                    alt={brand.name}
                    onError={e => { e.target.src = 'https://via.placeholder.com/130x60?text=' + brand.name; }}
                  />
                  <span className="brand-label">{brand.name}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
