// ---- channel mapping -------------------------------------------------------
const channelMap = {
  pagina_web: 'Web',
  web: 'Web',
  whatsapp: 'WhatsApp',
  facebook: 'Facebook',
  instagram: 'Instagram',
  referido: 'Referido',
};

// ---- status mapping --------------------------------------------------------
const statusMap = {
  nuevo: 'nuevo',
  asignado: 'asignado',
  assigned: 'asignado',
  aceptado: 'aceptado',
  accepted: 'aceptado',
  contactado: 'contactado',
  contacted: 'contactado',
};

// ---- SLA computation -------------------------------------------------------
function computeSla(apiLead) {
  if (apiLead.should_reassign) return 'vencido';
  if (!apiLead.assigned_at) return 'ok';

  const minutesSinceAssignment =
    (Date.now() - new Date(apiLead.assigned_at).getTime()) / 60000;

  if (!apiLead.is_accepted_by_vendor) {
    if (minutesSinceAssignment > 60) return 'vencido';
    if (minutesSinceAssignment > 30) return 'atencion';
  }
  return 'ok';
}

// ---- timeline builder ------------------------------------------------------
function buildTimeline(apiLead) {
  const events = [];
  if (apiLead.created_at)
    events.push({ event: 'Lead creado', time: apiLead.created_at, icon: 'created' });
  if (apiLead.assigned_at) {
    events.push({ event: 'Lead asignado', time: apiLead.assigned_at, icon: 'assigned' });
    if (apiLead.alert_sent && apiLead.alert_sent_at)
      events.push({ event: 'Notificacion enviada', time: apiLead.alert_sent_at, icon: 'notified' });
  }
  if (apiLead.accepted_by_vendor_at)
    events.push({ event: 'Lead aceptado', time: apiLead.accepted_by_vendor_at, icon: 'accepted' });
  if (apiLead.first_contact_at)
    events.push({ event: 'Lead contactado', time: apiLead.first_contact_at, icon: 'contacted' });
  return events;
}

// ---- public normalizers ----------------------------------------------------
export function normalizeLead(apiLead) {
  return {
    id: String(apiLead.id),
    name: apiLead.full_name,
    email: apiLead.email,
    phone: apiLead.phone,
    city: apiLead.city,
    region: apiLead.region,
    channel:
      channelMap[(apiLead.source_channel ?? '').toLowerCase()] ??
      apiLead.source_channel ??
      'Web',
    product:
      apiLead.product_selection ??
      apiLead.product_interest ??
      apiLead.product_family ??
      '—',
    // sellerId matches vendor.id which is set to vendor.email
    sellerId: apiLead.assigned_vendor_email ?? null,
    status: statusMap[apiLead.status] ?? 'nuevo',
    sla: computeSla(apiLead),
    reassignments: apiLead.reassignment_count ?? 0,
    createdAt: apiLead.created_at,
    assignedAt: apiLead.assigned_at,
    reassignmentHistory: [],
    assignmentReason: null,
    timeline: buildTimeline(apiLead),
    notes: apiLead.notes ?? '',
    description: apiLead.description,
    state: apiLead.state,
    salesUpLink: apiLead.sales_up_link,
  };
}

export function normalizeVendor(apiVendor) {
  return {
    // Use email as id so leads can match via assigned_vendor_email
    id: apiVendor.email,
    name: apiVendor.full_name,
    email: apiVendor.email,
    region: apiVendor.region ?? '',
    maxLeads: apiVendor.max_active_leads ?? 8,
    activeLeadsCount: Number(apiVendor.active_leads_count ?? 0),
    status: apiVendor.is_active ? 'activo' : 'inactivo',
    avatar: null,
  };
}
