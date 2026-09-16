import type { Metadata } from "next";
import Link from "next/link";
import { PaginaLegal, Seccion, Lista, Firma } from "@/components/Legal";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Qué datos personales trata Najul (CONTRATELLI TEXTIL S.R.L.), con qué finalidad y qué derechos tenés sobre ellos.",
};

export default function PrivacidadPage() {
  return (
    <PaginaLegal titulo="Política de Privacidad" actualizado="16 de septiembre de 2026">
      <p className="leading-relaxed text-ink-soft">
        <strong className="font-semibold text-ink">CONTRATELLI TEXTIL S.R.L.</strong> (CUIT
        30-71621330-3), que opera comercialmente bajo el nombre{" "}
        <strong className="font-semibold text-ink">Najul</strong> —en adelante “Najul” o
        “nosotros”— se dedica a la venta, confección y colocación de cortinas y artículos de
        decoración, con domicilio en 19 N°624, Balcarce, Provincia de Buenos Aires, Argentina.
      </p>
      <p className="leading-relaxed text-ink-soft">
        Esta política explica qué datos personales tratamos, con qué finalidad y qué derechos
        tenés sobre ellos.
      </p>

      <Seccion titulo="Qué datos recogemos">
        <p>
          <strong className="font-semibold text-ink">Cuando nos escribís por WhatsApp:</strong>
        </p>
        <Lista>
          <li>Tu número de teléfono</li>
          <li>El nombre que tenés configurado en tu perfil de WhatsApp</li>
          <li>
            El contenido de los mensajes que nos mandás, incluidas fotos o audios si los enviás
          </li>
          <li>Si llegaste desde un anuncio, el identificador de ese anuncio</li>
        </Lista>
        <p>
          <strong className="font-semibold text-ink">
            Cuando te hacemos un presupuesto o una venta:
          </strong>
        </p>
        <Lista>
          <li>Nombre y apellido</li>
          <li>Domicilio donde se realiza la medición o la colocación</li>
          <li>Datos de contacto que nos facilites</li>
          <li>Detalle de los trabajos presupuestados o realizados</li>
        </Lista>
        <p>
          <strong className="font-semibold text-ink">No recogemos</strong> datos sensibles, ni
          datos de tarjetas de crédito a través de WhatsApp, ni información de tu dispositivo
          más allá de lo que WhatsApp nos transmite para poder responderte.
        </p>
      </Seccion>

      <Seccion titulo="Para qué los usamos">
        <Lista>
          <li>Responder tus consultas y coordinar mediciones y entregas</li>
          <li>Elaborar presupuestos y gestionar las ventas</li>
          <li>Hacer seguimiento de un presupuesto que pediste</li>
          <li>Atender reclamos y servicio de posventa</li>
          <li>Saber qué anuncios generan consultas, para orientar nuestra publicidad</li>
        </Lista>
        <p>
          No usamos tus datos para ninguna finalidad distinta de estas, y{" "}
          <strong className="font-semibold text-ink">
            no los vendemos ni los cedemos a terceros con fines comerciales
          </strong>
          .
        </p>
      </Seccion>

      <Seccion titulo="Con quién los compartimos">
        <Lista>
          <li>
            <strong className="font-semibold text-ink">Meta Platforms, Inc.</strong>, como
            operadora de WhatsApp, en la medida necesaria para que los mensajes lleguen. El
            tratamiento que Meta hace de esos datos se rige por sus propias políticas.
          </li>
          <li>
            <strong className="font-semibold text-ink">Nadie más.</strong> No compartimos tus
            datos con otras empresas.
          </li>
        </Lista>
        <p>
          Dentro de Najul, sólo acceden a esta información las personas que necesitan hacerlo
          para atenderte: vendedores, administración y quienes mantienen los sistemas.
        </p>
      </Seccion>

      <Seccion titulo="Cuánto tiempo los conservamos">
        <p>
          Conservamos las conversaciones y los datos de contacto mientras exista una relación
          comercial y por el plazo posterior que exigen las obligaciones fiscales y comerciales
          vigentes.
        </p>
        <p>
          Si pedís la baja, eliminamos tus datos salvo aquellos que estemos obligados a
          conservar por ley, por ejemplo los respaldos de operaciones facturadas.
        </p>
      </Seccion>

      <Seccion titulo="Mensajes automáticos">
        <p>
          Algunos de nuestros mensajes pueden ser enviados automáticamente por nuestro sistema
          —por ejemplo, la respuesta inicial cuando nos escribís fuera de horario, o un
          recordatorio de una medición agendada—.{" "}
          <strong className="font-semibold text-ink">
            Siempre podés pedir hablar con una persona
          </strong>
          , y siempre hay una persona detrás de la conversación.
        </p>
        <p>
          Si no querés recibir más mensajes nuestros, escribinos{" "}
          <strong className="font-semibold text-ink">“BAJA”</strong> y dejamos de escribirte.
        </p>
      </Seccion>

      <Seccion titulo="Tus derechos">
        <p>
          De acuerdo con la{" "}
          <strong className="font-semibold text-ink">
            Ley 25.326 de Protección de los Datos Personales
          </strong>
          , tenés derecho a acceder, rectificar, actualizar y suprimir tus datos personales.
        </p>
        <p>
          Para ejercerlos, escribinos a{" "}
          <a className="text-verde hover:underline" href="mailto:najul.textil@gmail.com">
            najul.textil@gmail.com
          </a>{" "}
          o por WhatsApp al número comercial. Te respondemos dentro de los plazos que fija la
          ley.
        </p>
        <p>
          La{" "}
          <strong className="font-semibold text-ink">
            Agencia de Acceso a la Información Pública
          </strong>
          , en su carácter de órgano de control de la Ley 25.326, tiene la atribución de atender
          las denuncias y reclamos que presenten quienes resulten afectados en sus derechos por
          incumplimiento de las normas vigentes en materia de protección de datos personales.
        </p>
      </Seccion>

      <Seccion titulo="Seguridad">
        <p>
          Nuestros sistemas están alojados en servidores propios con acceso restringido por
          usuario y contraseña, y las comunicaciones viajan cifradas. Los mensajes de WhatsApp
          están además protegidos por el cifrado de la propia plataforma.
        </p>
        <p>
          Ningún sistema es infalible: hacemos lo razonable para proteger tu información y te
          avisaremos si ocurriera un incidente que afecte tus datos.
        </p>
      </Seccion>

      <Seccion titulo="Cambios">
        <p>
          Si modificamos esta política, publicaremos la nueva versión en esta misma dirección
          con su fecha de actualización.
        </p>
      </Seccion>

      <Seccion titulo="Contacto">
        <Firma />
        <p className="text-sm">
          Ver también nuestras{" "}
          <Link className="text-verde hover:underline" href="/terminos">
            Condiciones del Servicio
          </Link>
          .
        </p>
      </Seccion>
    </PaginaLegal>
  );
}
