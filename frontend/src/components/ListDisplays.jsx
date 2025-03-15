function ListDisplay({ title, items, itemKey, itemValue, emptyMessage }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      {items.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item[itemKey]} className="mb-2 p-2 border rounded">
              {item[itemValue]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListDisplay;
