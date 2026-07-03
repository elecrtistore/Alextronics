import { useNavigate } from 'react-router-dom';

export default function ProductPreview({
  name,
  price,
  image,
  productId
}: {
  name?: string;
  price?: number;
  image?: string;
  productId?: string;
}) {
  const navigate = useNavigate();

  if (!name) return null;

  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-[#F8FAFC] border-b border-[#E5E7EB]">
      {image && (
        <img src={image} alt={name} className="w-10 h-10 rounded-lg object-contain bg-white border border-[#E5E7EB]" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#111827] truncate">{name}</p>
        {price !== undefined && (
          <p className="text-xs text-[#6B7280]">KSh {price.toLocaleString()}</p>
        )}
      </div>
      {productId && (
        <button
          onClick={() => navigate(`/products/${productId}`)}
          className="text-xs font-semibold text-[#274472] hover:underline shrink-0"
        >
          View Product
        </button>
      )}
    </div>
  );
}
