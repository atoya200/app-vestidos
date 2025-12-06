import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900 dark:from-slate-950 dark:to-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 dark:bg-slate-950/60 border-b border-slate-200/60 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-xl tracking-tight">
            GlamRent
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/search" className="hover:text-fuchsia-600">Browse</Link>
            <Link href="/#how" className="hover:text-fuchsia-600">How it works</Link>
            <Link href="/#featured" className="hover:text-fuchsia-600">Featured</Link>
            <Link href="/faq" className="hover:text-fuchsia-600">FAQ</Link>
            <Link href="/terms" className="hover:text-fuchsia-600">Terms</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/admin/login" className="text-sm hover:text-fuchsia-600">Admin</Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold">Términos y Condiciones</h1>
        
        <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
          Última actualización: 3 de noviembre de 2025
        </p>

        <p className="mt-6 text-slate-600 dark:text-slate-400 leading-relaxed">
          Estos Términos y Condiciones regulan el uso de la aplicación destinada a la reserva y alquiler de artículos de moda, tales como vestidos, zapatos, bolsos, chaquetas y otros accesorios (en adelante, "los artículos").
        </p>

        <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
          Al confirmar una reserva y enviar sus datos personales, el usuario declara haber leído, comprendido y aceptado los presentes Términos y Condiciones.
        </p>

        <div className="mt-8 space-y-8">
          {/* 1. Objeto del servicio */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">1. Objeto del servicio</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              La aplicación permite reservar artículos disponibles para alquiler por un periodo determinado de tiempo, sujeto a disponibilidad y confirmación por parte del establecimiento.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              La reserva implica únicamente la reserva temporal del artículo. La entrega efectiva se realizará al momento del retiro presencial y pago correspondiente.
            </p>
          </section>

          {/* 2. Requisitos de reserva */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">2. Requisitos de reserva</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Para completar una reserva, el usuario deberá:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed ml-4">
              <li>Proporcionar datos personales de contacto verídicos (nombre completo, teléfono, correo electrónico y documento de identidad).</li>
              <li>Indicar fecha de retiro y fecha de devolución del artículo.</li>
              <li>Aceptar los presentes Términos y Condiciones.</li>
            </ul>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              El establecimiento se reserva el derecho de rechazar o cancelar reservas en caso de detectar información falsa, errores de disponibilidad o incumplimientos previos.
            </p>
          </section>

          {/* 3. Pago y retiro */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">3. Pago y retiro</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed ml-4">
              <li>El pago del alquiler se realiza al momento del retiro del artículo en el local designado.</li>
              <li>El cliente deberá presentarse con su documento de identidad y cumplir el horario acordado.</li>
              <li>Si el cliente no se presenta dentro del horario establecido, la reserva podrá cancelarse automáticamente, quedando el artículo disponible para otros usuarios.</li>
            </ul>
          </section>

          {/* 4. Periodo de alquiler */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">4. Periodo de alquiler</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed ml-4">
              <li>El alquiler tiene una duración determinada, indicada en la reserva.</li>
              <li>El cliente se compromete a devolver el artículo en la fecha y hora acordadas.</li>
              <li>En caso de retraso en la devolución, se podrá aplicar un cargo adicional por día de demora, según las tarifas vigentes.</li>
            </ul>
          </section>

          {/* 5. Condiciones de uso y devolución */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">5. Condiciones de uso y devolución</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              El cliente se compromete a:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed ml-4">
              <li>Cuidar y utilizar el artículo de manera responsable, evitando manchas, roturas, quemaduras o alteraciones.</li>
              <li>No modificar ni alterar el estado original del artículo (por ejemplo, tintar, cortar, lavar sin autorización, etc.).</li>
              <li>Devolver el artículo en condiciones aceptables de higiene y conservación.</li>
            </ul>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              En caso de daños, roturas o pérdida total del artículo, el cliente deberá abonar el costo de reparación o reposición, según lo determine el establecimiento.
            </p>
          </section>

          {/* 6. Cancelaciones y modificaciones */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">6. Cancelaciones y modificaciones</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed ml-4">
              <li>Las reservas podrán cancelarse o modificarse con antelación comunicándose directamente con el establecimiento.</li>
              <li>Las cancelaciones realizadas con poca antelación podrán estar sujetas a restricciones, según las políticas del local.</li>
              <li>El establecimiento se reserva el derecho de cancelar una reserva confirmada por causas de fuerza mayor, mantenimiento o indisponibilidad del artículo, notificando al cliente lo antes posible.</li>
            </ul>
          </section>

          {/* 7. Responsabilidad */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">7. Responsabilidad</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              El establecimiento no será responsable por:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed ml-4">
              <li>Daños ocasionados por el mal uso del artículo durante el periodo de alquiler.</li>
              <li>Pérdida o robo del artículo mientras esté bajo responsabilidad del cliente.</li>
              <li>Retrasos o imposibilidad de retiro o devolución por causas ajenas al control del establecimiento (por ejemplo, eventos climáticos, cortes de energía, etc.).</li>
            </ul>
          </section>

          {/* 8. Protección de datos personales */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">8. Protección de datos personales</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Los datos personales solicitados se recopilan con el fin de gestionar reservas, verificar identidad y coordinar entregas.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              El tratamiento de estos datos se realiza conforme a la Ley de Protección de Datos Personales y no se compartirán con terceros sin autorización, salvo obligación legal o necesidad operativa directa del servicio.
            </p>
          </section>

          {/* 9. Aceptación */}
          <section className="pb-6">
            <h2 className="text-xl font-semibold mb-3">9. Aceptación</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Al confirmar sus datos y enviar la reserva, el cliente declara haber leído y aceptado en su totalidad estos Términos y Condiciones, quedando sujeto a su cumplimiento durante todo el proceso de reserva y alquiler.
            </p>
          </section>
        </div>
      </div>

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">© {new Date().getFullYear()} GlamRent. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/terms" className="hover:text-fuchsia-600">Terms</Link>
            <Link href="/privacy" className="hover:text-fuchsia-600">Privacy</Link>
            <Link href="/contact" className="hover:text-fuchsia-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
