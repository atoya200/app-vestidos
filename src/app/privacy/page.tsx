import Link from "next/link";

export default function PrivacyPage() {
  return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold">Política de Privacidad</h1>
        
        <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
          Última actualización: 3 de noviembre de 2025
        </p>

        <p className="mt-6 text-slate-600 dark:text-slate-400 leading-relaxed">
          En GlamRent valoramos y respetamos tu privacidad. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos tu información personal cuando utilizas nuestra aplicación y servicios de alquiler de artículos de moda.
        </p>

        <div className="mt-8 space-y-8">
          {/* 1. Información que Recopilamos */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">1. Información que Recopilamos</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-medium">1.1 Información Personal</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                  Cuando realizas una reserva, recopilamos la siguiente información:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed ml-4 mt-2">
                  <li>Nombre completo</li>
                  <li>Número de teléfono</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Número de documento de identidad</li>
                  <li>Fechas de reserva (retiro y devolución)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mt-4">1.2 Información de Uso</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                  Recopilamos información sobre cómo utilizas nuestra aplicación, incluyendo las páginas que visitas, los artículos que consultas y las búsquedas que realizas.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mt-4">1.3 Información Técnica</h3>
                <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                  Podemos recopilar información técnica como tu dirección IP, tipo de navegador, sistema operativo y datos de cookies para mejorar la experiencia de usuario.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Cómo Utilizamos tu Información */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">2. Cómo Utilizamos tu Información</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Utilizamos la información recopilada para los siguientes propósitos:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed ml-4">
              <li>Procesar y gestionar tus reservas de alquiler</li>
              <li>Verificar tu identidad al momento del retiro</li>
              <li>Coordinar la entrega y devolución de artículos</li>
              <li>Comunicarnos contigo sobre el estado de tu reserva</li>
              <li>Enviarte confirmaciones, recordatorios y notificaciones importantes</li>
              <li>Mejorar nuestros servicios y experiencia de usuario</li>
              <li>Cumplir con obligaciones legales y fiscales</li>
              <li>Prevenir fraudes y proteger la seguridad de nuestros servicios</li>
            </ul>
          </section>

          {/* 3. Compartir Información */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">3. Compartir Información</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              No compartimos tu información personal con terceros, excepto en las siguientes circunstancias:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed ml-4">
              <li><strong>Proveedores de Servicios:</strong> Podemos compartir información con proveedores que nos ayudan a operar nuestro negocio (procesamiento de pagos, servicios de entrega, etc.).</li>
              <li><strong>Obligaciones Legales:</strong> Cuando sea requerido por ley, orden judicial o autoridad gubernamental.</li>
              <li><strong>Protección de Derechos:</strong> Para proteger nuestros derechos, propiedad o seguridad, o la de nuestros usuarios.</li>
            </ul>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              Nunca vendemos ni alquilamos tu información personal a terceros con fines de marketing.
            </p>
          </section>

          {/* 4. Seguridad de los Datos */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">4. Seguridad de los Datos</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Esto incluye:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed ml-4 mt-3">
              <li>Cifrado de datos sensibles</li>
              <li>Acceso restringido a información personal</li>
              <li>Sistemas de monitoreo y protección contra intrusiones</li>
              <li>Auditorías regulares de seguridad</li>
            </ul>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro, por lo que no podemos garantizar seguridad absoluta.
            </p>
          </section>

          {/* 5. Retención de Datos */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">5. Retención de Datos</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Conservamos tu información personal durante el tiempo necesario para cumplir con los fines descritos en esta política, a menos que la ley requiera o permita un período de retención más largo. Los datos de reservas se mantienen por razones fiscales y de cumplimiento legal durante el período establecido por la legislación vigente.
            </p>
          </section>

          {/* 6. Tus Derechos */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">6. Tus Derechos</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Conforme a la Ley de Protección de Datos Personales, tienes los siguientes derechos:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed ml-4">
              <li><strong>Derecho de Acceso:</strong> Puedes solicitar una copia de la información personal que tenemos sobre ti.</li>
              <li><strong>Derecho de Rectificación:</strong> Puedes solicitar la corrección de información inexacta o incompleta.</li>
              <li><strong>Derecho de Supresión:</strong> Puedes solicitar la eliminación de tu información personal, sujeto a obligaciones legales.</li>
              <li><strong>Derecho de Oposición:</strong> Puedes oponerte al procesamiento de tu información personal en determinadas circunstancias.</li>
              <li><strong>Derecho de Portabilidad:</strong> Puedes solicitar la transferencia de tu información a otro proveedor de servicios.</li>
            </ul>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              Para ejercer cualquiera de estos derechos, contáctanos a través de los medios indicados en la sección de Contacto.
            </p>
          </section>

          {/* 7. Cookies y Tecnologías Similares */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">7. Cookies y Tecnologías Similares</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestra aplicación. Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo. Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar la funcionalidad de ciertos aspectos de nuestra aplicación.
            </p>
            <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              Utilizamos cookies para recordar tus preferencias, analizar el uso de la aplicación y personalizar tu experiencia.
            </p>
          </section>

          {/* 8. Menores de Edad */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">8. Menores de Edad</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos intencionalmente información personal de menores de edad. Si descubrimos que hemos recopilado información de un menor sin el consentimiento parental correspondiente, tomaremos medidas para eliminar dicha información de nuestros sistemas.
            </p>
          </section>

          {/* 9. Cambios a esta Política */}
          <section className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h2 className="text-xl font-semibold mb-3">9. Cambios a esta Política</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Cuando realicemos cambios, actualizaremos la fecha de "Última actualización" en la parte superior de esta página. Te recomendamos revisar periódicamente esta política para estar informado sobre cómo protegemos tu información.
            </p>
            <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              Si realizamos cambios significativos, te notificaremos por correo electrónico o mediante un aviso destacado en nuestra aplicación.
            </p>
          </section>

          {/* 10. Contacto */}
          <section className="pb-6">
            <h2 className="text-xl font-semibold mb-3">10. Contacto</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
              Si tienes preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o el manejo de tu información personal, puedes contactarnos a través de:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400 leading-relaxed ml-4">
              <li>Email: <a href="mailto:info@glamrent.com" className="text-fuchsia-600 hover:text-fuchsia-700">info@glamrent.com</a></li>
              <li>Teléfono: <a href="tel:+5491123456789" className="text-fuchsia-600 hover:text-fuchsia-700">098 123 321</a></li>
              <li>Página de contacto: <Link href="/contact" className="text-fuchsia-600 hover:text-fuchsia-700">Contacto</Link></li>
            </ul>
          </section>
        </div>
      </div>
  );
}
