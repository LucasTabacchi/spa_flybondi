export function formatCurrency(n){
  return new Intl.NumberFormat('es-AR',{ style:'currency', currency:'USD', maximumFractionDigits:0 }).format(n);
}
export function formatDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString('es-AR',{ weekday:'short', day:'2-digit', month:'short' });
}
export function parseISODate(s){ return new Date(s); }
export function addDays(iso, days){
  const d = new Date(iso);
  d.setDate(d.getDate()+days);
  // normalizar a medianoche ISO (tomamos solo fecha)
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth()+1).padStart(2,'0');
  const dd = String(d.getUTCDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}
export function sameMonth(iso, ym){
  // ym: 'YYYY-MM'
  return iso.slice(0,7) === ym;
}
export function daysBetween(a,b){
  const A = new Date(a); const B = new Date(b);
  return Math.max(0, Math.round((B - A) / (1000*60*60*24)));
}
