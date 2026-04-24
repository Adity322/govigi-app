export default function OrderStatusBadge({ status }) {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    Confirmed: "bg-blue-100 text-blue-700 border border-blue-300",
    Delivered: "bg-green-100 text-green-700 border border-green-300",
  };

  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}