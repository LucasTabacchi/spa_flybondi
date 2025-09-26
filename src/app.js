import { loadDataset, findOptions } from './logic';
import { formatCurrency, formatDate, daysBetween } from './utils';

function getSelectedDurations(select) {
  return Array.from(select.selectedOptions).map(o => parseInt(o.value,10));
}

export function initApp(){
  const originEl = document.getElementById('origin');
  const budgetEl = document.getElementById('budget');
  const paxEl = document.getElementById('pax');
  const durationsEl = document.getElementById('durations');
  const monthEl = document.getElementById('month');
  const resultsEl = document.getElementById('results');
  const statusEl = document.getElementById('status');

  const setStatus = (msg)=>{ if(statusEl) statusEl.textContent = msg; };

  document.getElementById('btn-reset').addEventListener('click', () => {
    originEl.value=''; budgetEl.value=800; paxEl.value='1'; monthEl.value='';
    for (const opt of durationsEl.options) opt.selected = (['3','5','7'].includes(opt.value));
    resultsEl.innerHTML = '';
    setStatus('Formulario reiniciado.');
  });

  const render = (list)=>{
    if(!list || list.length===0){
      resultsEl.innerHTML = '<div class="empty">No encontramos opciones con ese presupuesto. Probá con menos noches, menos personas o aumentá un poquito el monto.</div>';
      return;
    }
    resultsEl.innerHTML = '';
    for(const opt of list){
      const div = document.createElement('div');
      div.className = 'result';

      const title = document.createElement('h3');
      title.textContent = `${opt.destination} · ${formatCurrency(opt.total)} total (${opt.groupSize} ${opt.groupSize>1?'personas':'persona'})`;

      const sub = document.createElement('div');
      sub.className = 'muted';
      sub.textContent = `Ida ${formatDate(opt.depart)} · Vuelta ${formatDate(opt.return)} · ${daysBetween(opt.depart,opt.return)} noches · ${formatCurrency(opt.pricePerPerson)} por persona (RT) · Asientos: ${opt.seats} · ${formatCurrency(opt.value)} / noche`;

      const actions = document.createElement('div');
      const btn = document.createElement('button');
      btn.className = 'primary';
      btn.textContent = 'Elegir';
      btn.addEventListener('click', () => alert(`Elegiste ${opt.destination} del ${formatDate(opt.depart)} al ${formatDate(opt.return)}. Total: ${formatCurrency(opt.total)}.`));

      actions.appendChild(btn);
      div.appendChild(title);
      div.appendChild(actions);
      div.appendChild(sub);
      resultsEl.appendChild(div);
    }
  };

  let current = [];
  let byPrice = [];
  let byValue = [];

  document.getElementById('btn-suggest').addEventListener('click', async () => {
    const origin = originEl.value.trim().toUpperCase();
    const budget = Number(budgetEl.value || 800);
    const groupSize = Number(paxEl.value || 1);
    const durations = getSelectedDurations(durationsEl);
    const month = monthEl.value; // YYYY-MM

    if(!origin){
      alert('Decime desde dónde salís (ej: COR, AEP, EZE, EPA).');
      return;
    }

    setStatus('Cargando dataset…');
    const flights = await loadDataset();
    setStatus('Buscando las mejores combinaciones…');

    current = findOptions({ flights, origin, budget, groupSize, durations, month });


    byPrice = [...current].sort((a,b)=>
      (a.total - b.total) ||
      (a.duration - b.duration) ||
      (new Date(a.depart) - new Date(b.depart))
    );

    byValue = [...current].sort((a,b)=>
      (a.value - b.value) ||            // precio por noche
      (a.total - b.total) ||
      (new Date(a.depart) - new Date(b.depart))
    );

    render(byPrice); // default: por precio
    setStatus(`Encontramos ${current.length} opciones.`);
  });

  document.getElementById('sort-price').addEventListener('click', () => {
    if(!byPrice.length) return;
    render(byPrice);
  });

  document.getElementById('sort-value').addEventListener('click', () => {
    if(!byValue.length) return;
    render(byValue);
  });
}

