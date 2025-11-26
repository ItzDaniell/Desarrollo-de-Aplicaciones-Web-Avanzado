'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Category, ApiResponse } from '@/types/products';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function AdminCategoriesPage() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
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
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = session?.accessToken;
    const url = editingId 
      ? `${API_URL}/categories/${editingId}`
      : `${API_URL}/categories`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ nombre: '', descripcion: '' });
        setEditingId(null);
        fetchCategories();
        toast.success(editingId ? 'Categoría actualizada' : 'Categoría creada');
      } else {
          const errorData = await res.json();
          toast.error(`Error: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      nombre: category.nombre,
      descripcion: category.descripcion || ''
    });
    setEditingId(category.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    const token = session?.accessToken;

    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        fetchCategories();
        toast.success('Categoría eliminada');
      } else {
        toast.error('Error al eliminar categoría');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  const handleCancel = () => {
    setFormData({ nombre: '', descripcion: '' });
    setEditingId(null);
  };

  if (loading) return <div className="text-center py-12">Cargando categorías...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingId ? 'Editar' : 'Agregar'} Categoría
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.nombre}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{category.descripcion || '-'}</td>
                  <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                    <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-800 mr-4">Editar</button>
                    <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
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
