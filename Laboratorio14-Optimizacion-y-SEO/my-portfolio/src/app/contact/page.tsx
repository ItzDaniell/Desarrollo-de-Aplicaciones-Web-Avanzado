// app/contact/page.tsx
import { Metadata } from 'next';
import { personalInfo } from '@/lib/data';
import ContactForm from '@/components/ContactForm';


export const metadata: Metadata = {
  title: 'Contacto',
  description: `Ponte en contacto con ${personalInfo.name}. Estoy disponible para proyectos y colaboraciones.`,
};

export default function ContactPage() {
  const contactMethods = [
    {
      title: 'Email',
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      description: 'Envíame un correo electrónico',
    },
    {
      title: 'LinkedIn',
      value: 'Perfil profesional',
      href: personalInfo.linkedin,
      description: 'Conéctate conmigo',
    },
    {
      title: 'GitHub',
      value: 'Repositorios',
      href: personalInfo.github,
      description: 'Revisa mis proyectos',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Contacto</h1>
        <p className="text-xl text-neutral-600 mb-12">
          ¿Tienes un proyecto en mente? ¿Quieres colaborar? ¡Me encantaría saber de ti!
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Methods */}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Métodos de Contacto
            </h2>
            
            <div className="space-y-4">
              {contactMethods.map((method) => (
                <a
                  key={method.title}
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white p-4 rounded-lg border border-neutral-100 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div>
                      <h3 className="font-bold text-neutral-900 mb-1">
                        {method.title}
                      </h3>
                      <p className="text-sm text-neutral-500 mb-1">
                        {method.description}
                      </p>
                      <p className="text-black hover:underline">
                        {method.value}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm email={personalInfo.email} />
        </div>

        {/* Additional Info */}
        <div className="bg-neutral-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-neutral-900 mb-3">
            Ubicación
          </h3>
          <p className="text-neutral-600 mb-4">
            Actualmente basado en Lima.
            Disponible para proyectos remotos y colaboraciones internacionales.
          </p>
          
          <h3 className="text-xl font-bold text-neutral-900 mb-3">
            Disponibilidad
          </h3>
          <p className="text-neutral-600">
            Generalmente respondo en 24-48 horas. Para consultas urgentes,
            contáctame por LinkedIn.
          </p>
        </div>
      </div>
    </div>
  );
}