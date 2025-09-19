export default function Rating({
  value,
  count,
  disabled = false,
}: {
  value: number;
  count: number;
  disabled?: boolean;
}) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: disabled ? '#ccc' : i <= value ? '#f5a623' : '#ddd' }}>
        ★
      </span>
    );
  }

  return (
    <div style={{ fontSize: '1.2rem' }}>
      {stars} {count > 0 && !disabled && <span>({count})</span>}
    </div>
  );
}
