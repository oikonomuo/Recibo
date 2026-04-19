/* ═══════════════════════════════════════════════════════════════
   RECIBO DIGITAL PRO — pdf-template.js
   Genera el HTML del documento de recibo para impresión/PDF.
   Usa solo estilos inline + background-color explícito.
═══════════════════════════════════════════════════════════════ */

function buildReceiptHTML(d) {

  /* ── Fecha ── */
  const fecha = [d.dia, d.mes, d.anio].filter(Boolean).join(' de ')
    || new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });

  /* ── Logo ── */
  const logoBlock = d.logo
    ? `<img src="${d.logo}"
         style="max-height:110px;max-width:220px;object-fit:contain;display:block;"
         alt="Logo"/>`
    : `<div style="width:110px;height:80px;background-color:#2c3e6e;border-radius:10px;
         display:inline-block;"></div>`;

  /* ── Info empresa ── */
  const empInfo = [
    d.dir   && `<div style="margin-top:4px;font-size:12.5px;color:#c7d2ee;">${d.dir}</div>`,
    d.tel   && `<div style="margin-top:3px;font-size:12.5px;color:#94a3d4;">Tel: ${d.tel}</div>`,
    d.email && `<div style="margin-top:3px;font-size:12.5px;color:#94a3d4;">${d.email}</div>`
  ].filter(Boolean).join('');

  /* ── Info extra cliente ── */
  const cliExtras = [
    d.cliTel && `
      <tr>
        <td style="padding:4px 0;font-size:13px;color:#71717a;
            font-family:Georgia,serif;width:90px;">Teléfono:</td>
        <td style="padding:4px 0;font-size:13px;font-weight:600;color:#1a2744;
            font-family:Georgia,serif;">${d.cliTel}</td>
      </tr>`,
    d.ciudad && `
      <tr>
        <td style="padding:4px 0;font-size:13px;color:#71717a;
            font-family:Georgia,serif;">Ciudad:</td>
        <td style="padding:4px 0;font-size:13px;font-weight:600;color:#1a2744;
            font-family:Georgia,serif;">${d.ciudad}</td>
      </tr>`
  ].filter(Boolean).join('');

  /* ── Filas de productos ── */
  const itemRows = d.items.length
    ? d.items.map((it, i) => {
        const rowBg = i % 2 === 0 ? '#ffffff' : '#f4f7ff';
        return `
        <tr style="background-color:${rowBg};">
          <td style="padding:10px 14px;text-align:center;font-size:13px;font-weight:700;
              color:#1a2744;font-family:Georgia,serif;border-bottom:1px solid #e8ecf4;">
            ${it.qty}
          </td>
          <td style="padding:10px 14px;font-size:13px;color:#27272a;
              font-family:Georgia,serif;border-bottom:1px solid #e8ecf4;">
            ${it.concepto}
          </td>
          <td style="padding:10px 14px;text-align:center;font-size:12px;color:#71717a;
              font-family:Georgia,serif;border-bottom:1px solid #e8ecf4;">
            ${it.unidad}
          </td>
          <td style="padding:10px 18px;text-align:right;font-size:13px;color:#27272a;
              font-family:Georgia,serif;border-bottom:1px solid #e8ecf4;">
            ${it.precio}
          </td>
          <td style="padding:10px 18px;text-align:right;font-size:13px;font-weight:700;
              color:#1a2744;font-family:Georgia,serif;border-bottom:1px solid #e8ecf4;">
            ${it.subtotal}
          </td>
        </tr>`;
      }).join('')
    : `<tr>
        <td colspan="5" style="padding:20px;text-align:center;font-size:13px;
            color:#a1a1aa;font-family:Georgia,serif;background-color:#fafafa;">
          Sin productos registrados
        </td>
      </tr>`;

  /* ── Notas ── */
  const notasBlock = d.notas ? `
    <div style="padding:16px 22px;
        background-color:#f0f4fb;border-left:5px solid #1a2744;
        border-radius:0 10px 10px 0;">
      <div style="font-size:9px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;
          color:#1a2744;margin-bottom:7px;font-family:Arial,sans-serif;">
        NOTAS / OBSERVACIONES
      </div>
      <div style="font-size:12px;color:#52525b;line-height:1.6;font-family:Georgia,serif;">
        ${d.notas}
      </div>
    </div>` : '';

  /* ════════════════════════════════════════════════════
     DOCUMENTO PRINCIPAL  —  A4 (794 × 1123 px)
  ════════════════════════════════════════════════════ */
  return `
<div style="
  width: 794px;
  max-height: 1120px;
  height: 1120px;
  margin: 0 auto;
  background-color: #ffffff;
  font-family: Georgia, serif;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
">

  <!-- ══════ HEADER NAVY ══════ -->
  <div style="background-color:#1a2744;padding:25px 45px 20px;">

    <!-- Fila: Logo | Empresa | Número -->
    <table style="width:100%;border-collapse:collapse;">
      <tr>

        <!-- Logo -->
        <td style="vertical-align:middle;width:240px;padding-right:28px;">
          ${logoBlock}
        </td>

        <!-- Nombre y datos empresa -->
        <td style="vertical-align:top;padding-right:20px;">
          <div style="font-size:24px;font-weight:900;color:#ffffff;
              font-family:Arial,sans-serif;letter-spacing:-.3px;margin-bottom:4px;">
            ${d.empresa}
          </div>
          ${empInfo}
        </td>

        <!-- Número de factura -->
        <td style="vertical-align:top;text-align:right;width:220px;">
          <div style="font-size:9px;letter-spacing:.22em;text-transform:uppercase;
              color:#94a3d4;font-family:Arial,sans-serif;margin-bottom:5px;">
            RECIBO N°
          </div>
          <div style="font-size:50px;font-weight:900;color:#ffffff;
              font-family:Arial,sans-serif;line-height:1;margin-bottom:8px;
              letter-spacing:-2px;">
            ${d.num}
          </div>
          <div style="font-size:13px;color:#c7d2ee;font-family:Arial,sans-serif;
              margin-bottom:12px;">
            ${fecha}
          </div>
          <!-- Badge EMITIDA -->
          <div style="display:inline-block;background-color:#065f46;color:#6ee7b7;
              font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;
              padding:6px 16px;border-radius:30px;font-family:Arial,sans-serif;">
            ✓  EMITIDA
          </div>
        </td>

      </tr>
    </table>
  </div><!-- /header -->

  <!-- Barra de acento tricolor -->
  <div style="height:6px;background:linear-gradient(to right,#1a2744 0%,#3b5299 50%,#94a3d4 100%);"></div>

  <!-- ══════ CUERPO ══════ -->
  <div style="padding:24px 45px 20px;flex:1;display:flex;flex-direction:column;">

    <!-- ─── Sección: Cliente y Datos de la Factura ─── -->
    <table style="width:100%;border-collapse:separate;border-spacing:12px 0;margin-bottom:20px;">
      <tr>

        <!-- Bloque CLIENTE -->
        <td style="vertical-align:top;background-color:#f4f7fb;border-radius:14px;
            padding:20px 24px;width:58%;">
          <div style="font-size:9px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;
              color:#94a3d4;font-family:Arial,sans-serif;
              border-bottom:1.5px solid #dde5f4;padding-bottom:9px;margin-bottom:12px;">
            RECIBIDO DE
          </div>
          <div style="font-size:20px;font-weight:700;color:#1a2744;
              font-family:Arial,sans-serif;margin-bottom:4px;line-height:1.2;">
            ${d.cliente}
          </div>
          ${d.empresaCli && d.empresaCli !== '—' ? `
          <div style="font-size:14px;font-weight:600;color:#3b5299;
              font-family:Arial,sans-serif;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px;">
            ${d.empresaCli}
          </div>` : '<div style="margin-bottom:10px;"></div>'}
          <table style="border-collapse:collapse;">
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#71717a;
                  font-family:Georgia,serif;width:90px;vertical-align:top;">NIT / C.I.:</td>
              <td style="padding:4px 0;font-size:13px;font-weight:600;color:#1a2744;
                  font-family:Georgia,serif;">${d.ci}</td>
            </tr>
            ${cliExtras}
          </table>
        </td>

        <!-- Bloque DATOS FACTURA -->
        <td style="vertical-align:top;background-color:#1a2744;border-radius:14px;
            padding:20px 24px;width:42%;">
          <div style="font-size:9px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;
              color:#94a3d4;font-family:Arial,sans-serif;
              border-bottom:1.5px solid rgba(255,255,255,.14);
              padding-bottom:9px;margin-bottom:12px;">
            DATOS DEL RECIBO
          </div>
          <table style="border-collapse:collapse;width:100%;">
            <tr>
              <td style="padding:6px 0;font-size:12px;color:#94a3d4;
                  font-family:Arial,sans-serif;width:46%;">Fecha de emisión</td>
              <td style="padding:6px 0;font-size:13px;font-weight:700;color:#ffffff;
                  font-family:Arial,sans-serif;">${fecha}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:12px;color:#94a3d4;
                  font-family:Arial,sans-serif;">Cond. de pago</td>
              <td style="padding:6px 0;font-size:13px;font-weight:700;color:#ffffff;
                  font-family:Arial,sans-serif;">${d.pago}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:12px;color:#94a3d4;
                  font-family:Arial,sans-serif;">Moneda</td>
              <td style="padding:6px 0;font-size:13px;font-weight:700;color:#ffffff;
                  font-family:Arial,sans-serif;">${d.moneda}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-size:12px;color:#94a3d4;
                  font-family:Arial,sans-serif;">Número</td>
              <td style="padding:6px 0;font-size:13px;font-weight:700;color:#ffffff;
                  font-family:Arial,sans-serif;">${d.num}</td>
            </tr>
          </table>
        </td>

      </tr>
    </table>

    <!-- ─── Etiqueta tabla ─── -->
    <div style="font-size:9px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;
        color:#1a2744;border-left:5px solid #1a2744;padding-left:10px;
        margin-bottom:12px;font-family:Arial,sans-serif;">
      DETALLE DE PRODUCTOS Y SERVICIOS
    </div>

    <!-- ─── Tabla de productos ─── -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:18px;
        border-radius:12px;overflow:hidden;">
      <thead>
        <tr style="background-color:#1a2744;">
          <th style="padding:13px 14px;font-size:10px;font-weight:800;letter-spacing:.14em;
              text-transform:uppercase;color:#ffffff;text-align:center;
              width:64px;font-family:Arial,sans-serif;">
            CANT.
          </th>
          <th style="padding:13px 14px;font-size:10px;font-weight:800;letter-spacing:.14em;
              text-transform:uppercase;color:#ffffff;text-align:left;
              font-family:Arial,sans-serif;">
            CONCEPTO / DESCRIPCIÓN
          </th>
          <th style="padding:13px 14px;font-size:10px;font-weight:800;letter-spacing:.14em;
              text-transform:uppercase;color:#ffffff;text-align:center;
              width:72px;font-family:Arial,sans-serif;">
            UNIDAD
          </th>
          <th style="padding:13px 18px;font-size:10px;font-weight:800;letter-spacing:.14em;
              text-transform:uppercase;color:#ffffff;text-align:right;
              width:120px;font-family:Arial,sans-serif;">
            P. UNIT.
          </th>
          <th style="padding:13px 18px;font-size:10px;font-weight:800;letter-spacing:.14em;
              text-transform:uppercase;color:#ffffff;text-align:right;
              width:120px;font-family:Arial,sans-serif;">
            SUBTOTAL
          </th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <!-- ─── Totales y Notas ─── -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:15px;">
      <tr>
        <!-- Columna Izquierda: Notas -->
        <td style="width:46%;vertical-align:top;padding-right:24px;">
          ${notasBlock}
        </td>
        <!-- Columna Derecha: Totales -->
        <td style="width:54%;vertical-align:top;">
          <table style="width:100%;border-collapse:collapse;">

            <!-- Subtotal -->
            <tr style="background-color:#f4f7fb;">
              <td style="padding:11px 18px;font-size:14px;color:#52525b;
                  font-family:Georgia,serif;border-bottom:1px solid #e8ecf4;">
                Subtotal
              </td>
              <td style="padding:11px 18px;font-size:14px;font-weight:700;color:#1a2744;
                  text-align:right;font-family:Georgia,serif;border-bottom:1px solid #e8ecf4;">
                ${d.subtotal}
              </td>
            </tr>

            <!-- Descuento -->
            <tr style="background-color:#fffbfb;">
              <td style="padding:11px 18px;font-size:14px;color:#52525b;
                  font-family:Georgia,serif;border-bottom:1.5px solid #e8e0e0;">
                Descuento ${d.pct > 0 && d.dscMon > 0 ? `(${d.pct}% + ${d.dscMon.toFixed(2)})` : (d.pct > 0 ? `(${d.pct}%)` : (d.dscMon > 0 ? `(${d.dscMon.toFixed(2)})` : '(0%)'))}
              </td>
              <td style="padding:11px 18px;font-size:14px;font-weight:700;color:#dc2626;
                  text-align:right;font-family:Georgia,serif;border-bottom:1.5px solid #e8e0e0;">
                &minus; ${d.descuento}
              </td>
            </tr>

          </table>

          <!-- TOTAL destacado -->
          <div style="background-color:#1a2744;padding:18px 22px;margin-top:2px;
              display:table;width:100%;table-layout:fixed;">
            <div style="display:table-row;">
              <div style="display:table-cell;font-size:18px;font-weight:900;color:#ffffff;
                  font-family:Arial,sans-serif;vertical-align:middle;">
                TOTAL A PAGAR
              </div>
              <div style="display:table-cell;font-size:20px;font-weight:900;color:#ffffff;
                  text-align:right;font-family:Arial,sans-serif;vertical-align:middle;">
                ${d.total}
              </div>
            </div>
          </div>

          <!-- A Cuenta (verde) -->
          <div style="background-color:#f0fdf4;border-left:5px solid #059669;
              padding:13px 18px;margin-top:6px;
              display:table;width:100%;table-layout:fixed;border-radius:0 8px 8px 0;">
            <div style="display:table-row;">
              <div style="display:table-cell;font-size:14px;font-weight:700;color:#059669;
                  font-family:Arial,sans-serif;vertical-align:middle;">
                &#10003; &nbsp;A Cuenta (pago inicial)
              </div>
              <div style="display:table-cell;font-size:15px;font-weight:800;color:#059669;
                  text-align:right;font-family:Arial,sans-serif;vertical-align:middle;">
                ${d.aCuenta}
              </div>
            </div>
          </div>

          <!-- Saldo Pendiente (ámbar) -->
          <div style="background-color:#fffbeb;border-left:5px solid #d97706;
              padding:15px 18px;margin-top:4px;
              display:table;width:100%;table-layout:fixed;border-radius:0 8px 8px 0;">
            <div style="display:table-row;">
              <div style="display:table-cell;font-size:15px;font-weight:700;color:#d97706;
                  font-family:Arial,sans-serif;vertical-align:middle;">
                &#9888; &nbsp;Saldo Pendiente
              </div>
              <div style="display:table-cell;font-size:18px;font-weight:900;color:#d97706;
                  text-align:right;font-family:Arial,sans-serif;vertical-align:middle;">
                ${d.saldo}
              </div>
            </div>
          </div>

        </td>
      </tr>
    </table>


    <!-- ─── Firmas ─── -->
    <div style="flex:1;"></div> <!-- Espaciador para empujar firmas hacia abajo -->
    <table style="width:100%;border-collapse:collapse;margin-top:20px;margin-bottom:25px;">
      <tr>
        <td style="width:48%;text-align:center;padding:0 30px 0 0;position:relative;">
          <!-- Firma superpuesta -->
          <div style="position:relative;height:0;">
             <img src="img/firma_vendedor.png" 
                  style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);
                  max-height:110px;pointer-events:none;mix-blend-mode:multiply;"/>
          </div>
          <div style="border-top:2px solid #94a3d4;padding-top:11px;">
            <div style="font-size:14px;font-weight:700;color:#1a2744;
                font-family:Arial,sans-serif;">
              ${d.empresa}
            </div>
            <div style="font-size:11.5px;color:#94a3d4;margin-top:3px;
                font-family:Arial,sans-serif;letter-spacing:.04em;">
              EMISOR / VENDEDOR
            </div>
          </div>
        </td>
        <td style="width:4%;"></td>
        <td style="width:48%;text-align:center;padding:0 0 0 30px;">
          <div style="border-top:2px solid #94a3d4;padding-top:11px;">
            <div style="font-size:14px;font-weight:700;color:#1a2744;
                font-family:Arial,sans-serif;">
              ${d.cliente}
              ${d.empresaCli && d.empresaCli !== '—' ? `<br/><span style="font-size:11px;font-weight:400;color:#71717a;">${d.empresaCli}</span>` : ''}
            </div>
            <div style="font-size:11.5px;color:#94a3d4;margin-top:3px;
                font-family:Arial,sans-serif;letter-spacing:.04em;">
              CLIENTE / RECEPTOR
            </div>
          </div>
        </td>
      </tr>
    </table>

  </div><!-- /cuerpo -->

  <!-- ══════ FOOTER ══════ -->
  <div style="background-color:#f4f7fb;padding:12px 45px;
      border-top:1.5px solid #e4e9f0;margin-top:auto;">
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="font-size:10.5px;color:#94a3d4;font-family:Arial,sans-serif;">
          Documento generado digitalmente &nbsp;|&nbsp;
          Recibo N°&nbsp;${d.num}&nbsp;&nbsp;·&nbsp;&nbsp;${fecha}
        </td>
        <td style="font-size:10.5px;font-weight:800;color:#1a2744;
            text-align:right;font-family:Arial,sans-serif;">
          ${d.empresa}
        </td>
      </tr>
    </table>
  </div>

</div>`;
}
