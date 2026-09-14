import { useEffect, useState } from 'react';
import { ProductCard, type Product } from '../components/ProductCard';
import { fetchProducts } from '../services/api';

export const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, []);

    if (loading) return <div>Loading products...</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => (
                <ProductCard key={item.id} product={item} />
            ))}
        </div>
    );
};