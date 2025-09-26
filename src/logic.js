import { parseISODate, addDays, sameMonth } from './utils';

export async function loadDataset(){
  const res = await fetch('dataset.json',{ cache: 'no-store' });
  if(!res.ok) throw new Error('No se pudo cargar dataset.json');
  const data = await res.json();
  return data.filter(r => r.origin && r.destination && r.price>0 && r.availability>=0 && r.date);
}

export function findOptions({ flights, origin, budget=800, groupSize=1, durations=[3,5,7], month }){
  const O = origin.toUpperCase();
  const byKey = new Map(); // key: origin|dest|date -> flight[]
  for (const f of flights){
    const key = `${f.origin}|${f.destination}|${f.date.slice(0,10)}`;
    if (month && !sameMonth(f.date, month)) continue;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(f);
  }

  const outbounds = flights.filter(f =>
    f.origin===O && f.availability>=groupSize &&
    (!month || sameMonth(f.date, month))
  );

  const results = [];

  for (const ob of outbounds){
    for (const d of durations){
      const retDate = addDays(ob.date, d).slice(0,10);
      const rkey = `${ob.destination}|${O}|${retDate}`;
      const returns = byKey.get(rkey) || [];
      for (const rb of returns){
        if (rb.availability < groupSize) continue;
        const pricePerPerson = ob.price + rb.price;
        const total = pricePerPerson * groupSize;
        if (total <= budget){
          const option = {
            destination: ob.destination,
            depart: ob.date,
            return: rb.date,
            duration: d,
            pricePerPerson: Number(pricePerPerson.toFixed(2)),
            total: Number(total.toFixed(2)),
            seats: Math.min(ob.availability, rb.availability),
            groupSize
          };
          option.value = Number((option.total / option.duration).toFixed(2)); // 👈 precio/noche
          results.push(option);
        }
      }
    }
  }

  // Deduplicar por (dest, depart YYYY-MM-DD, return YYYY-MM-DD, total)
  const seen = new Set();
  const dedup = [];
  for (const r of results){
    const key = `${r.destination}|${r.depart.slice(0,10)}|${r.return.slice(0,10)}|${r.total}`;
    if (!seen.has(key)){ dedup.push(r); seen.add(key); }
  }

  // Mantener top 5 por destino (orden local por precio, OK)
  const buckets = new Map();
  for (const r of dedup){
    const list = buckets.get(r.destination) || [];
    list.push(r);
    buckets.set(r.destination, list);
  }

  const final = [];
  for (const [dest, list] of buckets){
    list.sort((a,b)=>
      (a.total - b.total) ||
      (a.duration - b.duration) ||
      (new Date(a.depart) - new Date(b.depart))
    );
    final.push(...list.slice(0,5));
  }


  return final;
}

