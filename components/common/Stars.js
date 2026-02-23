export default function Stars({ rating = 0, count = null }) {
  return (
    <div className="stars-row">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className="star" style={{ color: i <= Math.round(rating) ? '#f5c518' : '#ddd', fontSize: '0.78rem' }}>
          ★
        </span>
      ))}
      {count !== null && <span className="reviews-count">({count})</span>}
    </div>
  );
}
