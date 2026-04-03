/* ═══════════════════════════════════════════════════════════════
   FACTURA DIGITAL PRO — app.js
═══════════════════════════════════════════════════════════════ */

const $   = id => document.getElementById(id);
const val = id => ($( id) ? $(id).value.trim() : '');
const cur = ()  => val('fMoneda') || 'Bs.';

/* ══════════════════════════════════════════
   LOGO
══════════════════════════════════════════ */
let logoDataURL = null;

$('logoInput').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    logoDataURL = e.target.result;
    $('logoPreview').src = logoDataURL;
    $('logoPreview').style.display = 'block';
    $('logoPh').style.display = 'none';
  };
  reader.readAsDataURL(file);
});

/* ══════════════════════════════════════════
   TABLA DINÁMICA
══════════════════════════════════════════ */
let rowCount = 0;

function addRow() {
  rowCount++;
  const id = rowCount;
  const tr = document.createElement('tr');
  tr.id = 'R' + id;
  tr.innerHTML = `
    <td><input type="number" id="q${id}" min="0" step="1"    placeholder="1"    oninput="calcRow(${id})"></td>
    <td><input type="text"   id="c${id}"                     placeholder="Descripción del producto o servicio"></td>
    <td><input type="text"   id="u${id}"                     placeholder="pza"></td>
    <td><input type="number" id="p${id}" min="0" step="0.01" placeholder="0.00" oninput="calcRow(${id})"></td>
    <td class="sub-c" id="s${id}" data-raw="0">${cur()} 0.00</td>
    <td class="act-c">
      <button class="btn-del" onclick="delRow(${id})" title="Eliminar fila">
        <i class="bi bi-trash3"></i>
      </button>
    </td>`;
  $('tBody').appendChild(tr);
  recalcTotal();
  $('q' + id).focus();
}

function delRow(id) {
  const row = $('R' + id);
  if (!row) return;
  row.style.cssText += 'opacity:0;transform:translateX(12px);transition:all .2s';
  setTimeout(() => { row.remove(); recalcTotal(); }, 210);
}

function calcRow(id) {
  const qty  = parseFloat($('q' + id)?.value) || 0;
  const prc  = parseFloat($('p' + id)?.value) || 0;
  const sub  = qty * prc;
  const cell = $('s' + id);
  if (cell) { cell.textContent = cur() + ' ' + sub.toFixed(2); cell.dataset.raw = sub; }
  recalcTotal();
}

function recalcTotal() {
  const m = cur();
  let sub = 0;
  document.querySelectorAll('.sub-c').forEach(c => {
    sub += parseFloat(c.dataset.raw) || 0;
    c.textContent = m + ' ' + (parseFloat(c.dataset.raw) || 0).toFixed(2);
  });
  const pct    = parseFloat(val('fDesc')) || 0;
  const dsc    = sub * (pct / 100);
  const tot    = sub - dsc;
  const aCuenta= parseFloat($('fACuenta')?.value) || 0;
  const saldo  = Math.max(0, tot - aCuenta);

  $('dispSub').textContent       = m + ' ' + sub.toFixed(2);
  $('dispDesc').textContent      = '- ' + m + ' ' + dsc.toFixed(2);
  $('dispDescLabel').textContent = 'Descuento (' + pct + '%)';
  $('dispTot').textContent       = m + ' ' + tot.toFixed(2);
  $('dispACuenta').textContent   = m + ' ' + aCuenta.toFixed(2);
  $('dispSaldoBox').textContent  = m + ' ' + saldo.toFixed(2);
  if($('dispSaldo')) $('dispSaldo').textContent = m + ' ' + saldo.toFixed(2);
  // Sync moneda prefix on A cuenta
  if($('aCuentaPrefix')) $('aCuentaPrefix').textContent = m;
}

/* ══════════════════════════════════════════
   LIMPIAR
══════════════════════════════════════════ */
function clearAll() {
  if (!confirm('¿Limpiar todos los campos?')) return;

  /* Solo limpiar campos del cliente y opciones */
  ['fCliente','fEmpresaCli','fCI','fCliTel','fCiudad','fNotas','fDesc','fACuenta']
    .forEach(id => { const e = $(id); if (e) e.value = ''; });

  $('fMes').value    = '';
  $('fPago').value   = 'Contado';
  $('fMoneda').value = 'Bs.';

  const now = new Date();
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  $('fDia').value  = now.getDate();
  $('fAnio').value = now.getFullYear();
  $('fNum').value  = '0001';
  $('fMes').value  = meses[now.getMonth()];

  /* Restaurar empresa */
  $('fEmpresa').value = 'Akashi Sport';
  $('fDir').value     = 'Calle General Ácha entre 12 de Octubre y America No. 28 A (Zona/Barrio Sud) Oruro - Bolivia';
  $('fTel').value     = '75414864';
  $('fEmail').value   = 'gael69579197@gmail.com';

  $('tBody').innerHTML = '';
  rowCount = 0;
  recalcTotal();
  logoDataURL = null;
  $('logoPreview').style.display = 'none';
  $('logoPh').style.display = 'flex';
  addRow(); addRow();
  showToast('Formulario limpiado');
}


/* ══════════════════════════════════════════
   RECOLECTAR DATOS
══════════════════════════════════════════ */
function collectData() {
  const m   = cur();
  const pct = parseFloat(val('fDesc')) || 0;
  let subRaw = 0;
  const items = [];

  document.querySelectorAll('#tBody tr').forEach(tr => {
    const id  = tr.id.replace('R', '');
    const qty = ($('q' + id)?.value || '').trim();
    const con = ($('c' + id)?.value || '').trim();
    const uni = ($('u' + id)?.value || '').trim();
    const pre = ($('p' + id)?.value || '').trim();
    const raw = parseFloat($('s' + id)?.dataset.raw) || 0;
    if (!qty && !con && !pre) return;
    subRaw += raw;
    items.push({
      qty      : qty  || '0',
      concepto : con  || '—',
      unidad   : uni  || '—',
      precio   : m + ' ' + parseFloat(pre || 0).toFixed(2),
      subtotal : m + ' ' + raw.toFixed(2)
    });
  });

  const dscAmt  = subRaw * (pct / 100);
  const totAmt  = subRaw - dscAmt;
  const aCuenta = parseFloat($('fACuenta')?.value) || 0;
  const saldo   = Math.max(0, totAmt - aCuenta);

  return {
    empresa  : val('fEmpresa') || 'Mi Empresa',
    dir      : val('fDir'),
    tel      : val('fTel'),
    email    : val('fEmail'),
    num      : val('fNum')  || '0001',
    pago     : val('fPago') || 'Contado',
    dia      : val('fDia'),
    mes      : val('fMes'),
    anio     : val('fAnio'),
    cliente  : val('fCliente') || '—',
    empresaCli: val('fEmpresaCli') || '—',
    ci       : val('fCI')      || '—',
    cliTel   : val('fCliTel'),
    ciudad   : val('fCiudad'),
    notas    : val('fNotas'),
    moneda   : m,
    pct,
    subtotal  : m + ' ' + subRaw.toFixed(2),
    descuento : m + ' ' + dscAmt.toFixed(2),
    total     : m + ' ' + totAmt.toFixed(2),
    aCuenta   : m + ' ' + aCuenta.toFixed(2),
    saldo     : m + ' ' + saldo.toFixed(2),
    logo      : logoDataURL,
    items
  };
}

/* ══════════════════════════════════════════
   GENERAR / IMPRIMIR PDF
  Estrategia:
  1. Construir el HTML del recibo con todos los datos
  2. Inyectarlo en #print-area (que está oculto en pantalla)
  3. Llamar window.print()  → el CSS @media print oculta
     todo excepto #print-area
  4. En el diálogo, el usuario elige "Guardar como PDF"
     (Chrome/Edge lo hacen con Ctrl+P → Destino: Guardar como PDF)
══════════════════════════════════════════ */
function generatePDF() {
  /* Validaciones */
  if (!val('fEmpresa')) { alert('Por favor ingresa el nombre de tu empresa.'); $('fEmpresa').focus(); return; }
  if (!val('fCliente')) { alert('Por favor ingresa el nombre del cliente.');   $('fCliente').focus(); return; }

  /* 1. Recolectar todos los datos ahora mismo */
  const data = collectData();

  /* 2. Construir HTML completo del recibo */
  const html = buildReceiptHTML(data);   // función en pdf-template.js

  /* 3. Inyectar en el área de impresión */
  $('print-area').innerHTML = html;

  /* 4. Esperar un tick para que el DOM pinte y lanzar impresión */
  requestAnimationFrame(() => {
    setTimeout(() => {
      window.print();
      showToast('Selecciona "Guardar como PDF" en el cuadro de impresión');
    }, 200);
  });
}

/* ══════════════════════════════════════════
   TOAST
══════════════════════════════════════════ */
function showToast(msg) {
  $('toastMsg').textContent = msg;
  $('toast').classList.add('show');
  setTimeout(() => $('toast').classList.remove('show'), 4000);
}

/* ══════════════════════════════════════════
   INICIALIZAR
══════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  $('fDia').value  = now.getDate();
  $('fAnio').value = now.getFullYear();
  $('fNum').value  = '0001';
  $('fMes').value  = meses[now.getMonth()];

  /* ── Datos permanentes de la empresa ── */
  $('fEmpresa').value = 'Akashi Sport';
  $('fDir').value     = 'Calle General Ácha entre 12 de Octubre y America No. 28 A (Zona/Barrio Sud) Oruro - Bolivia';
  $('fTel').value     = '75414864';
  $('fEmail').value   = 'gael69579197@gmail.com';

  addRow();
  addRow();
});

