# Express MongoDB JWT Auth

Este proyecto es una aplicación web de autenticación y autorización usando Node.js, Express, MongoDB y JWT. Permite el registro y login de usuarios, gestión de roles (usuario y administrador), y acceso a dashboards protegidos.

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repo>
   cd express-mongo-jwt
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura el archivo `.env` (puedes copiar `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Ajusta los valores según tu entorno.
4. Inicia el servidor:
   ```bash
   npm run dev
   ```

## Acceso

- **Usuario administrador:**
  - Email: `admin@example.com`
  - Password: `Admin#2024`
  - Acceso a `/dashboardAdmin` para ver y gestionar usuarios.
- **Usuario normal:**
  - Regístrate en `/signUp` y accede a `/dashboard` y `/profile`.

## Estructura del proyecto

```
express-mongo-jwt/
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── views/
├── .env.example
├── package.json
└── README.md
```
- **controllers/**: Lógica de las rutas y vistas.
- **middlewares/**: Autenticación y autorización.
- **models/**: Esquemas de Mongoose para usuarios y roles.
- **repositories/**: Acceso a la base de datos.
- **routes/**: Definición de rutas Express.
- **services/**: Lógica de negocio (registro, login, etc).
- **utils/**: Seeders y utilidades.
- **views/**: Vistas EJS para frontend.

## Funcionalidades
- Registro y login de usuarios.
- Autenticación con JWT y cookies.
- Roles: usuario y administrador.
- Dashboard protegido para cada tipo de usuario.
- Listado de usuarios para el administrador.

