'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '../types/products';

interface Props {
  categories: Category[];
}

export default function CategoryFilter({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategoryId = searchParams.get('categoryId');

  const handleCategoryClick = (id: number | null) => {
    if (id === null) {
      router.push('/products');
    } else {
      router.push(`/products?categoryId=${id}`);
    }
  };

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <button
        onClick={() => handleCategoryClick(null)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          !currentCategoryId
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            currentCategoryId === String(category.id)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category.nombre}
        </button>
      ))}
    </div>
  );
}
