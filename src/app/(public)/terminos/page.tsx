import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal, Seccion, Firma } from "@/components/Legal";

export const metadata: Metadata = {
  title: "Condiciones del Servicio",
  description:
    "Condiciones de uso del canal de atención por WhatsApp de Najul (CONTRATELLI TEXTIL S.R.L.).",
};

export default function TerminosPage() {
  return (
    <PaginaLegal
      titulo="Condiciones del Servicio"
      actualizado="16 de septiembre de 2026"
    >
      <p className="leading-relaxed text-ink-soft">
        Estas condiciones regulan el uso del canal de atención por WhatsApp de{" "}
        <strong className="font-semibold text-ink">CONTRATELLI TEXTIL S.R.L.</strong> (CUIT
        30-71621330-3), que opera comercialmente bajo el nombre{" "}
        <strong className="font-semibold text-ink">Najul</strong>, con domicilio en 19 N°624,
        Balcarce, Provincia de Buenos Aires, Argentina.
      </p>
      <p className="leading-relaxed text-ink-soft">
        Al escribirnos por WhatsApp aceptás estas condiciones.
      </p>

      <Seccion titulo="Qué es este canal">
        <p>
          Un medio de contacto para consultar por nuestros productos y servicios, pedir
          presupuestos, coordinar mediciones y entregas, y hacer consultas de posventa.
        </p>
        <p>
          <strong className="font-semibold text-ink">No es un canal de emergencias.</strong> Si
          necesitás una respuesta inmediata, llamanos o acercate al local en nuestro horario de
          atención.
        </p>
      </Seccion>

      <Seccion titulo="Horario y tiempos de respuesta">
        <p>
          Atendemos de{" "}
          <strong className="font-semibold text-ink">
            lunes a viernes de 9 a 18 hs y sábados de 9 a 13 hs
          </strong>
          .
        </p>
        <p>
          Fuera de ese horario podés escribirnos igual y te respondemos al abrir. Hacemos lo
          posible por contestar rápido, pero no garantizamos un plazo determinado.
        </p>
      </Seccion>

      <Seccion titulo="Mensajes automáticos">
        <p>
          Algunos mensajes pueden ser enviados automáticamente por nuestro sistema: una
          respuesta inicial, un aviso de que tu presupuesto está listo, o el recordatorio de una
          medición agendada.
        </p>
        <p>
          <strong className="font-semibold text-ink">
            Siempre hay una persona detrás del canal
          </strong>{" "}
          y siempre podés pedir hablar con alguien.
        </p>
        <p>
          Si no querés recibir más mensajes nuestros, escribinos{" "}
          <strong className="font-semibold text-ink">“BAJA”</strong> y dejamos de escribirte.
        </p>
      </Seccion>

      <Seccion titulo="Presupuestos">
        <p>
          Los precios que te pasemos por este medio son{" "}
          <strong className="font-semibold text-ink">
            estimativos y no constituyen una oferta en firme
          </strong>
          , salvo que se indique expresamente lo contrario.
        </p>
        <p>
          El presupuesto definitivo surge de la medición en el domicilio, y su validez es la que
          se indique en cada caso. Los precios pueden variar por disponibilidad de telas,
          materiales y condiciones de mercado.
        </p>
      </Seccion>

      <Seccion titulo="Uso adecuado">
        <p>
          Te pedimos no usar este canal para enviar contenido ofensivo, publicidad no solicitada
          o material que infrinja derechos de terceros. Nos reservamos el derecho de dejar de
          responder a quien lo haga.
        </p>
      </Seccion>

      <Seccion titulo="Datos personales">
        <p>
          El tratamiento de tus datos se rige por nuestra{" "}
          <Link className="text-verde hover:underline" href="/privacidad">
            Política de Privacidad
          </Link>
          , disponible en https://najul.com.ar/privacidad
        </p>
      </Seccion>

      <Seccion titulo="WhatsApp">
        <p>
          Este canal funciona sobre WhatsApp, un servicio de Meta Platforms, Inc. El
          funcionamiento de la aplicación, su disponibilidad y sus propias condiciones no
          dependen de nosotros.
        </p>
      </Seccion>

      <Seccion titulo="Cambios">
        <p>
          Si modificamos estas condiciones, publicaremos la nueva versión en esta misma
          dirección con su fecha de actualización.
        </p>
      </Seccion>

      <Seccion titulo="Contacto">
        <Firma />
      </Seccion>
    </PaginaLegal>
  );
}
