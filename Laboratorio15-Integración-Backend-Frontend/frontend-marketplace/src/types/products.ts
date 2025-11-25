export interface Category {
    id: number;
    nombre: string;
    descripcion?: string;
}

export interface Product {
    id: number;
    nombre: string;
    precio: string;
    descripcion?: string;
    imageUrl?: string;
    CategoryId?: number;
    Category?: Category;
    createdAt? : string;
    updatedAt: string
}

export interface ApiResponse<T>{
    success: boolean;
    message: string;
    data: T;
}