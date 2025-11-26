'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Product, Category, ApiResponse } from '@/types/products';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function AdminProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    categoryId: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data: ApiResponse<Product[]> = await res.json();
      if (data.success) setProducts(data.data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data: ApiResponse<Category[]> = await res.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId
      ? `${API_URL}/products/${editingId}`
      : `${API_URL}/products`;
    const method = editingId ? 'PUT' : 'POST';
    const token = session?.accessToken;

    try {
      const res = await fetch(url, {
        method,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          precio: parseFloat(formData.precio),
          description: formData.descripcion || undefined,
          categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
          imageUrl: formData.imageUrl || null
        }),
      });

      if (res.ok) {
        setFormData({ nombre: '', precio: '', descripcion: '', categoryId: '', imageUrl: '' });
        setEditingId(null);
        fetchProducts();
        toast.success(editingId ? 'Producto actualizado' : 'Producto creado');
      } else {
        toast.error('Error al guardar producto');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      nombre: product.nombre,
      precio: typeof product.precio === 'number' ? product.precio.toString() : product.precio,
      descripcion: product.descripcion || '',
      categoryId: (product.CategoryId || product.categoryId) ? (product.CategoryId || product.categoryId)!.toString() : '',
      imageUrl: product.imageUrl || ''
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    const token = session?.accessToken;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchProducts();
        toast.success('Producto eliminado');
      } else {
        toast.error('Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  const handleCancel = () => {
    setFormData({ nombre: '', precio: '', descripcion: '', categoryId: '', imageUrl: '' });
    setEditingId(null);
  };

  const getCategoryName = (categoryId: number | null | undefined) => {
    if (!categoryId) return 'Sin categoría';
    const category = categories.find(c => c.id === categoryId);
    return category?.nombre || 'Sin categoría';
  };

  if (loading) return <div className="text-center py-12">Cargando productos...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingId ? 'Editar' : 'Agregar'} Producto
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                    <option value="">Seleccionar Categoría</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancel} className="px-4 py-2 border border-gray-300 rounded-md">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        {product.imageUrl ? (
                          <a href={product.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline max-w-xs truncate block">
                            Ver imagen
                          </a>
                        ) : (
                          <span className="text-gray-400">Sin imagen</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.nombre}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${product.precio}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{getCategoryName(product.CategoryId ?? product.categoryId)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{product.descripcion || '-'}</td>
                      <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                        <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 mr-4">Editar</button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
}