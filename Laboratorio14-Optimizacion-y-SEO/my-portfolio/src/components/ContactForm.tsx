'use client';

import { useState } from 'react';

export default function ContactForm({ email }: { email: string }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = () => {
    const { name, email: userEmail, subject, message } = formData;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nombre: ${name}\nEmail: ${userEmail}\n\nMensaje:\n${message}`)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Envíame un mensaje</h2>

      <div className="border border-neutral-100 rounded-lg p-6 bg-white">
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-500 mb-2">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Tu nombre"
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-transparent text-neutral-900 outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-500 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="tu@email.com"
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-transparent text-neutral-900 outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-neutral-500 mb-2">
              Asunto
            </label>
            <input
              type="text"
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="¿Sobre qué quieres hablar?"
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-transparent text-neutral-900 outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-neutral-500 mb-2">
              Mensaje
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              placeholder="Cuéntame más sobre tu proyecto..."
              className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-transparent text-neutral-900 outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center justify-center gap-2 rounded px-4 py-2 font-semibold cursor-pointer bg-black text-white hover:bg-neutral-800 transition w-full"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}