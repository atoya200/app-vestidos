import BackButton from "../components/BackButton";

export default function FAQPage() {
  return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <BackButton />
        <h1 className="text-2xl sm:text-3xl font-bold mt-4">Preguntas Frecuentes</h1>
        
        <div className="mt-8 space-y-8">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-lg font-semibold">¿Cómo funciona el alquiler?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              Elige tu prenda, selecciona las fechas y envía la solicitud. Te confirmaremos por correo la disponibilidad y los siguientes pasos.
            </p>
          </div>
          
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-lg font-semibold">¿Incluye limpieza?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              Sí, la limpieza está incluida en todos los alquileres.
            </p>
          </div>
          
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-lg font-semibold">¿Cuánto tiempo puedo alquilar?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              Entre 2 y 7 días. Si necesitas más tiempo, contáctanos.
            </p>
          </div>
          
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-lg font-semibold">¿Necesito crear una cuenta?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              No. Solo completa el formulario con tus datos y fechas.
            </p>
          </div>
          
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-lg font-semibold">¿Qué pasa si la prenda me queda mal?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              Si no te queda como esperabas, contáctanos en las primeras 24 horas y buscaremos una solución, como cambio de talla o prenda similar, según disponibilidad.
            </p>
          </div>
          
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-lg font-semibold">¿Qué sucede si daño la prenda accidentalmente?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              Pequeños daños están cubiertos. En caso de daños mayores, podría aplicarse un costo adicional según la reparación necesaria.
            </p>
          </div>
          
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-lg font-semibold">¿Cómo se realiza el pago?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              Aceptamos tarjetas de crédito, débito y transferencias.
            </p>
          </div>
          
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-lg font-semibold">¿Hacen envíos y devoluciones a domicilio?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              Sí, ofrecemos servicio de envío y retiro a tu domicilio con costo adicional según tu ubicación.
            </p>
          </div>
          
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-lg font-semibold">¿Qué pasa si no devuelvo el vestido en la fecha acordada?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              Se aplicará un cargo por retraso por cada día adicional. Si necesitas extender el plazo, comunícate con nosotros antes de la fecha de devolución.
            </p>
          </div>
          
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-lg font-semibold">¿Pueden reservarme un vestido con anticipación?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              Sí, puedes reservar con semanas o meses de anticipación pagando una seña que se descuenta del total del alquiler.
            </p>
          </div>
          
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-lg font-semibold">¿Aceptan cancelaciones?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              Puedes cancelar hasta 7 días antes de la fecha de inicio del alquiler sin costo. Pasado ese plazo, no se reembolsa la seña.
            </p>
          </div>
          
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-lg font-semibold">¿Los vestidos son originales y de calidad?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              Sí, trabajamos con marcas seleccionadas y prendas en excelente estado que se revisan y mantienen tras cada alquiler.
            </p>
          </div>
          
          <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-lg font-semibold">¿Ofrecen talles variados?</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              Contamos con una amplia gama de talles y estilos. En cada prenda verás las medidas exactas para asegurarte el mejor ajuste.
            </p>
          </div>
        </div>
      </div>
  );
}
