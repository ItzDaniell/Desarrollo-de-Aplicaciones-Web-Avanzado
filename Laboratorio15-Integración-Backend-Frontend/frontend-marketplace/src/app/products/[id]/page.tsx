import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Product, Category, ApiResponse } from '@/types/products'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data: ApiResponse<Product> = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getCategory(categoryId: number): Promise<Category | null> {
  try {
    const res = await fetch(`${API_URL}/categories/${categoryId}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data: ApiResponse<Category> = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Fetch category if product has one
  let category: Category | null = null;
  const categoryId = product.CategoryId ?? product.categoryId;
  if (categoryId) {
    category = await getCategory(categoryId);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/products"
        className="inline-block mb-6 text-gray-600 hover:text-gray-900 transition-colors"
      >
        ← Volver a productos
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="p-8">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.nombre} 
                className="w-full h-auto rounded-lg shadow-md object-cover"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-lg">Sin imagen disponible</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.nombre}
            </h1>
            
            <div className="text-3xl font-bold text-blue-600 mb-6">
              ${typeof product.precio === 'number' ? product.precio.toFixed(2) : product.precio}
            </div>

            {category && (
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {category.nombre}
                </span>
              </div>
            )}

            {product.descripcion && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Descripción
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {product.descripcion}
                </p>
              </div>
            )}

            {/* Additional Product Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información del Producto
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Precio:</dt>
                  <dd className="font-semibold text-gray-900">
                    ${typeof product.precio === 'number' ? product.precio.toFixed(2) : product.precio}
                  </dd>
                </div>
                {category && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Categoría:</dt>
                    <dd className="font-semibold text-gray-900">{category.nombre}</dd>
                  </div>
                )}
                {product.imageUrl && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Imagen:</dt>
                    <dd className="text-blue-600 hover:text-blue-800">
                      <a href={product.imageUrl} target="_blank" rel="noopener noreferrer">
                        Ver imagen completa
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}