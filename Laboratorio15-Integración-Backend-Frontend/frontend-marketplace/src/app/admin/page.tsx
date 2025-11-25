'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category, ApiResponse } from '@/types/products';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`${
                    activeTab === 'products'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Productos
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`${
                    activeTab === 'categories'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Categorías
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {activeTab === 'products' ? <ProductsManager /> : <CategoriesManager />}
          </div>
        </main>
      </div>
    </div>
  );
}

function ProductsManager() {
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
    const token = localStorage.getItem('token');

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
      } else {
        alert('Error al guardar producto');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      nombre: product.nombre,
      precio: product.precio.toString(),
      descripcion: product.descripcion || '',
      categoryId: product.CategoryId ? product.CategoryId.toString() : '',
      imageUrl: product.imageUrl || ''
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('¿Estás seguro?')) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) fetchProducts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ nombre: '', precio: '', descripcion: '', categoryId: '', imageUrl: '' });
    setEditingId(null);
  };

  if (loading) return <div>Cargando productos...</div>;

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
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{product.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${product.precio}</td>
                    <td className="px-6 py-4 text-sm text-right">
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
  );
}

function CategoriesManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  
    useEffect(() => {
      fetchCategories();
    }, []);
  
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data: ApiResponse<Category[]> = await res.json();
        if (data.success) setCategories(data.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
  
      try {
        const res = await fetch(`${API_URL}/categories`, {
          method: 'POST',
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData),
        });
  
        if (res.ok) {
          setFormData({ nombre: '', descripcion: '' });
          fetchCategories();
        } else {
            alert("Error al crear categoria")
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    if (loading) return <div>Cargando categorías...</div>;
  
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Agregar Categoría</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                Crear Categoría
              </button>
            </form>
          </div>
        </div>
  
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{category.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{category.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{category.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }