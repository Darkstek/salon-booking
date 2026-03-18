function ServiceCard({ name, price, duration }) {
  return (
    <div className="flex justify-between items-center bg-pink-50 border-l-4 border-pink-300 rounded-lg px-5 py-4 mb-3">
      <h3 className="font-semibold text-gray-800 flex-1">{name}</h3>
      <span className="text-gray-500 text-sm w-24 text-right">{price} Kč</span>
      <span className="text-gray-500 text-sm w-20 text-right">{duration} min</span>
    </div>
  );
}

export default ServiceCard;