export interface Product {
  id: string;
  name: string;
  description: string;
  heroImg?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: string) => void;
}
export const ProductCard = ({ 
  product: { heroImg = "https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg", name, description }
}: ProductCardProps) => {
  return (
    <div className="max-w-xs rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <img 
        src={heroImg} 
        className="w-[170px] h-[179px] object-cover rounded-lg mx-auto" 
        alt="Product thumbnail" 
      />
      <h2 className="mt-3 text-lg font-bold text-gray-900">
        Product Name
      </h2>
      <p className="mt-1 text-sm text-gray-600 leading-relaxed">
        Description of the product.
      </p>
      <button className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors">
        Add to Cart
      </button>
    </div>
  );
};