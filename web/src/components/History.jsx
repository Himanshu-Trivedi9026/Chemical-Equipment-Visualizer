export default function History({ history = [] }) {
  if (!Array.isArray(history) || history.length === 0) {
    return null;
  }

  return (
    <div>
      <h2>Upload History</h2>
      <ul>
        {history.map((item) => (
          <li key={item.id}>
            {item.filename} — {item.row_count} rows
          </li>
        ))}
      </ul>
    </div>
  );
}
