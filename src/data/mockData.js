const regions = ['GDL', 'CDMX', 'MTY'];
const channels = ['WhatsApp', 'Facebook', 'Instagram', 'Web', 'Referido'];
const products = ['FiberBlade X0', 'Creator1309', 'ShopPro'];

const cities = {
  GDL: ['Guadalajara', 'Zapopan', 'Tlaquepaque'],
  CDMX: ['Ciudad de Mexico', 'Naucalpan', 'Tlalnepantla'],
  MTY: ['Monterrey', 'San Pedro', 'Apodaca']
};

export const sellers = [
  { id: 's1', name: 'Roberto Vega', email: 'roberto@leadflow.com', region: 'GDL', maxLeads: 8, status: 'activo', avatar: null },
  { id: 's2', name: 'Patricia Morales', email: 'patricia@leadflow.com', region: 'CDMX', maxLeads: 8, status: 'activo', avatar: null },
  { id: 's3', name: 'Enrique Saldana', email: 'enrique@leadflow.com', region: 'MTY', maxLeads: 8, status: 'activo', avatar: null },
  { id: 's4', name: 'Claudia Rios', email: 'claudia@leadflow.com', region: 'GDL', maxLeads: 8, status: 'activo', avatar: null },
  { id: 's5', name: 'Martin Esquivel', email: 'martin@leadflow.com', region: 'CDMX', maxLeads: 8, status: 'activo', avatar: null },
];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateTimeline(status, createdAt) {
  const events = [{ event: 'Lead creado', time: createdAt, icon: 'created' }];
  if (status !== 'nuevo') {
    const assignedAt = new Date(createdAt.getTime() + 1000 * 60 * randomInt(1, 10));
    events.push({ event: 'Lead asignado', time: assignedAt, icon: 'assigned' });
    events.push({ event: 'Notificacion enviada', time: new Date(assignedAt.getTime() + 1000 * 30), icon: 'notified' });
    if (status === 'aceptado' || status === 'contactado') {
      const acceptedAt = new Date(assignedAt.getTime() + 1000 * 60 * randomInt(5, 45));
      events.push({ event: 'Lead aceptado', time: acceptedAt, icon: 'accepted' });
      if (status === 'contactado') {
        events.push({ event: 'Lead contactado', time: new Date(acceptedAt.getTime() + 1000 * 60 * randomInt(10, 60)), icon: 'contacted' });
      }
    }
  }
  return events;
}

const firstNames = ['Carlos','Maria','Jose','Ana','Luis','Laura','Miguel','Sofia','Fernando','Valentina','Ricardo','Daniela','Jorge','Camila','Andres','Isabella','Diego','Mariana','Alejandro','Paula','Roberto','Gabriela','Eduardo','Natalia','Santiago','Elena'];
const lastNames = ['Garcia','Rodriguez','Martinez','Lopez','Hernandez','Gonzalez','Perez','Sanchez','Ramirez','Torres','Flores','Rivera','Gomez','Diaz','Reyes','Morales','Cruz','Ortiz','Gutierrez','Chavez','Vargas','Mendoza','Rojas','Silva'];

export function generateLeads(count = 28) {
  const now = new Date();
  const leads = [];
  const configs = [
    { status: 'asignado', minAgo: 95, region: 'GDL', channel: 'WhatsApp', product: 'FiberBlade X0', reassignments: 2 },
    { status: 'asignado', minAgo: 120, region: 'CDMX', channel: 'Facebook', product: 'Creator1309', reassignments: 1 },
    { status: 'asignado', minAgo: 80, region: 'MTY', channel: 'Web', product: 'ShopPro', reassignments: 3 },
    { status: 'asignado', minAgo: 70, region: 'GDL', channel: 'Instagram', product: 'FiberBlade X0', reassignments: 0 },
    { status: 'asignado', minAgo: 65, region: 'CDMX', channel: 'WhatsApp', product: 'ShopPro', reassignments: 0 },
    { status: 'asignado', minAgo: 45, region: 'MTY', channel: 'Referido', product: 'Creator1309', reassignments: 1 },
    { status: 'asignado', minAgo: 40, region: 'GDL', channel: 'Facebook', product: 'Creator1309', reassignments: 0 },
    { status: 'asignado', minAgo: 35, region: 'CDMX', channel: 'Web', product: 'FiberBlade X0', reassignments: 0 },
    { status: 'aceptado', minAgo: 50, region: 'GDL', channel: 'WhatsApp', product: 'ShopPro', reassignments: 0 },
    { status: 'aceptado', minAgo: 30, region: 'CDMX', channel: 'Instagram', product: 'FiberBlade X0', reassignments: 0 },
    { status: 'aceptado', minAgo: 25, region: 'MTY', channel: 'WhatsApp', product: 'Creator1309', reassignments: 1 },
    { status: 'aceptado', minAgo: 20, region: 'GDL', channel: 'Facebook', product: 'FiberBlade X0', reassignments: 0 },
    { status: 'contactado', minAgo: 180, region: 'MTY', channel: 'Web', product: 'ShopPro', reassignments: 2 },
    { status: 'contactado', minAgo: 150, region: 'CDMX', channel: 'WhatsApp', product: 'FiberBlade X0', reassignments: 0 },
    { status: 'contactado', minAgo: 90, region: 'GDL', channel: 'Instagram', product: 'Creator1309', reassignments: 1 },
    { status: 'contactado', minAgo: 60, region: 'MTY', channel: 'Referido', product: 'FiberBlade X0', reassignments: 0 },
    { status: 'nuevo', minAgo: 5, region: 'GDL', channel: 'WhatsApp', product: 'ShopPro', reassignments: 0 },
    { status: 'nuevo', minAgo: 8, region: 'CDMX', channel: 'Facebook', product: 'FiberBlade X0', reassignments: 0 },
    { status: 'nuevo', minAgo: 12, region: 'MTY', channel: 'Instagram', product: 'Creator1309', reassignments: 0 },
    { status: 'nuevo', minAgo: 3, region: 'GDL', channel: 'Web', product: 'FiberBlade X0', reassignments: 0 },
    { status: 'asignado', minAgo: 110, region: 'MTY', channel: 'WhatsApp', product: 'ShopPro', reassignments: 2 },
    { status: 'asignado', minAgo: 55, region: 'GDL', channel: 'Referido', product: 'Creator1309', reassignments: 0 },
    { status: 'aceptado', minAgo: 15, region: 'CDMX', channel: 'WhatsApp', product: 'ShopPro', reassignments: 0 },
    { status: 'nuevo', minAgo: 2, region: 'MTY', channel: 'Facebook', product: 'FiberBlade X0', reassignments: 0 },
    { status: 'asignado', minAgo: 75, region: 'CDMX', channel: 'Instagram', product: 'Creator1309', reassignments: 1 },
    { status: 'contactado', minAgo: 200, region: 'GDL', channel: 'WhatsApp', product: 'FiberBlade X0', reassignments: 0 },
    { status: 'aceptado', minAgo: 10, region: 'MTY', channel: 'Web', product: 'ShopPro', reassignments: 0 },
    { status: 'asignado', minAgo: 42, region: 'GDL', channel: 'Facebook', product: 'ShopPro', reassignments: 0 },
  ];

  for (let i = 0; i < Math.min(count, configs.length); i++) {
    const c = configs[i];
    const createdAt = new Date(now.getTime() - 1000 * 60 * c.minAgo);
    const minutesSince = c.minAgo;
    const sla = minutesSince > 60 ? 'vencido' : minutesSince > 30 ? 'atencion' : 'ok';
    const name = firstNames[i % firstNames.length] + ' ' + lastNames[i % lastNames.length];

    const timeline = generateTimeline(c.status, createdAt);
    if (c.reassignments > 0) {
      const sellerNames = ['Roberto Vega', 'Patricia Morales', 'Enrique Saldana', 'Claudia Rios', 'Martin Esquivel'];
      for (let r = 0; r < c.reassignments; r++) {
        const rTime = new Date(createdAt.getTime() + 1000 * 60 * (15 + r * 20));
        timeline.push({ event: 'Reasignado a ' + sellerNames[r % sellerNames.length], time: rTime, icon: 'reassigned' });
        timeline.push({ event: 'Notificacion enviada', time: new Date(rTime.getTime() + 1000 * 30), icon: 'notified' });
      }
      if (sla === 'vencido') {
        timeline.push({ event: 'SLA vencido - reasignacion automatica', time: new Date(createdAt.getTime() + 1000 * 60 * 62), icon: 'sla_warning' });
      }
    }
    if (sla === 'atencion' && c.status === 'asignado') {
      timeline.push({ event: 'SLA en riesgo - 30 min sin aceptar', time: new Date(createdAt.getTime() + 1000 * 60 * 30), icon: 'sla_warning' });
    }

    leads.push({
      id: 'lead-' + (i + 1),
      name,
      email: 'lead' + (i + 1) + '@ejemplo.com',
      phone: '+52 ' + randomInt(33, 81) + randomInt(1000, 9999) + randomInt(1000, 9999),
      channel: c.channel,
      city: randomFrom(cities[c.region]),
      region: c.region,
      product: c.product,
      status: c.status,
      sellerId: null,
      createdAt,
      assignedAt: c.status !== 'nuevo' ? new Date(createdAt.getTime() + 1000 * 60 * randomInt(1, 5)) : null,
      acceptedAt: (c.status === 'aceptado' || c.status === 'contactado') ? new Date(createdAt.getTime() + 1000 * 60 * randomInt(10, 30)) : null,
      sla,
      reassignments: c.reassignments,
      reassignmentHistory: [],
      assignmentReason: null,
      timeline,
      notes: '',
    });
  }
  return leads;
}

export function computeAssignmentReason(lead, seller, sellerLoad, allSellers) {
  const regionMatch = lead.region === seller.region;
  const currentLoad = sellerLoad[seller.id] || 0;
  const maxLoad = seller.maxLeads;
  const loadPercent = Math.round((currentLoad / maxLoad) * 100);
  const regionPriority = regionMatch ? 'alta' : 'baja';

  let score = 50;
  if (regionMatch) score += 30;
  score += Math.max(0, 20 - currentLoad * 3);
  const productMatch = true;
  if (productMatch) score += 12;
  score = Math.min(100, Math.max(0, score));

  return {
    sellerId: seller.id,
    sellerName: seller.name,
    regionMatch,
    productMatch,
    currentLoad,
    maxLoad,
    loadPercent,
    regionPriority,
    score,
    method: lead.reassignments > 0 ? 'reasignacion_auto' : 'asignacion_auto',
  };
}

export function assignLeadsToSellers(leads, sellersList) {
  const sellerLoad = {};
  sellersList.forEach(s => { sellerLoad[s.id] = 0; });

  const assigned = leads.map(lead => {
    if (lead.status === 'nuevo') {
      const regionSellers = sellersList.filter(s => s.region === lead.region && s.status === 'activo');
      const allActive = sellersList.filter(s => s.status === 'activo');
      const candidates = regionSellers.length > 0 ? regionSellers : allActive;

      let bestSeller = candidates[0];
      let minLoad = sellerLoad[bestSeller.id];
      for (const s of candidates) {
        if (sellerLoad[s.id] < minLoad) { bestSeller = s; minLoad = sellerLoad[s.id]; }
      }

      sellerLoad[bestSeller.id]++;
      const now = new Date();
      const reason = computeAssignmentReason(lead, bestSeller, sellerLoad, sellersList);

      return {
        ...lead,
        status: 'asignado',
        sellerId: bestSeller.id,
        assignedAt: now,
        assignmentReason: reason,
        timeline: [
          ...lead.timeline,
          { event: 'Lead asignado a ' + bestSeller.name, time: now, icon: 'assigned' },
          { event: 'Notificacion enviada', time: new Date(now.getTime() + 1000 * 30), icon: 'notified' },
        ],
      };
    }

    if (lead.sellerId === null && lead.status !== 'nuevo') {
      const regionSellers = sellersList.filter(s => s.region === lead.region && s.status === 'activo');
      const allActive = sellersList.filter(s => s.status === 'activo');
      const candidates = regionSellers.length > 0 ? regionSellers : allActive;

      let bestSeller = candidates[0];
      let minLoad = sellerLoad[bestSeller.id];
      for (const s of candidates) {
        if (sellerLoad[s.id] < minLoad) { bestSeller = s; minLoad = sellerLoad[s.id]; }
      }
      sellerLoad[bestSeller.id]++;
      const reason = computeAssignmentReason(lead, bestSeller, sellerLoad, sellersList);

      const history = [];
      if (lead.reassignments > 0) {
        const sellerNames = ['Roberto Vega', 'Patricia Morales', 'Enrique Saldana', 'Claudia Rios', 'Martin Esquivel'];
        for (let r = 0; r < lead.reassignments; r++) {
          history.push({ sellerName: sellerNames[r % sellerNames.length], sellerId: sellersList[r % sellersList.length].id });
        }
      }
      history.push({ sellerName: bestSeller.name, sellerId: bestSeller.id });

      return { ...lead, sellerId: bestSeller.id, assignmentReason: reason, reassignmentHistory: history };
    }

    if (lead.sellerId) { sellerLoad[lead.sellerId]++; }
    return lead;
  });

  const updatedSellers = sellersList.map(s => ({
    ...s,
    status: sellerLoad[s.id] >= s.maxLeads ? 'saturado' : sellerLoad[s.id] >= s.maxLeads - 2 ? 'activo' : 'activo',
  }));

  return { leads: assigned, sellers: updatedSellers, sellerLoad };
}
