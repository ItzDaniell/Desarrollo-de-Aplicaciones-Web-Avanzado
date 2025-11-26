import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-white">
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20 lg:py-32 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium tracking-wide">
          Nuevo: Envíos gratis en tu primera compra
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
          El mercado digital <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
            para creadores y compradores.
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
          Descubre productos únicos, gestiona tus compras y vende al mundo. 
          Una plataforma diseñada para la velocidad y la simplicidad.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
          <Link 
            href="/register" 
            className="px-8 py-4 bg-gray-900 text-white text-lg font-medium rounded-2xl hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Empezar ahora
          </Link>
          <Link 
            href="/login" 
            className="px-8 py-4 bg-white text-gray-700 text-lg font-medium rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all hover:border-gray-300"
          >
            Iniciar Sesión
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Rápido y Seguro</h3>
            <p className="text-gray-500">Tecnología de punta para asegurar que tus transacciones sean instantáneas y protegidas.</p>
          </div>
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center mb-6 text-violet-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Panel de Control</h3>
            <p className="text-gray-500">Gestiona tus productos y ventas con un dashboard intuitivo y potente.</p>
          </div>
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Global</h3>
            <p className="text-gray-500">Accede a un mercado global sin fronteras. Compra y vende desde cualquier lugar.</p>
          </div>
        </div>

        <div className="mt-16">
            <Link href="/products" className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors">
                Continuar como invitado &rarr;
            </Link>
        </div>
      </section>
    </div>
  );
}
