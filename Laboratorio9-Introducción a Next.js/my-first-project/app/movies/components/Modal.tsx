"use client"
import React from "react"

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-xl border border-foreground/15 bg-background p-4 shadow-2xl">
        <div className="flex justify-end">
          <button onClick={onClose} className="inline-flex h-8 items-center rounded px-2 text-sm border border-foreground/20 hover:bg-foreground/5">Cerrar</button>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}

export default Modal
