export default function groupOrdersByDate(orders) {
  const groups = {};

  orders.forEach((entry) => {
    const dateObj = new Date(entry.order.order_time);
    const dateStr = dateObj.toISOString().split("T")[0]; // "YYYY-MM-DD"

    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(entry);
  });

  // Convert to array and sort descending by date
  const sortedArray = Object.entries(groups)
    .map(([date, entries]) => ({ date, entries }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return sortedArray;
}
