import React, { useState, useEffect } from 'react';
import { 
  Users, ShoppingCart, MessageCircle, Mail, Phone, Globe, 
  Search, Filter, ChevronRight, CheckCircle2, Clock, AlertCircle, 
  Send, ExternalLink, Download, Edit3, Trash2, ShieldCheck, ArrowRight
} from 'lucide-react';
import { fetchRfqLeads, updateLeadStatus } from '../services/analyticsService';

const STATUS_CONFIG = {
  'New Lead': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: Clock },
  'In Discussion': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', icon: MessageCircle },
  'Quoted': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', icon: Send },
  'Order Placed': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle2 },
  'Archived': { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', icon: AlertCircle }
};

export default function RfqLeadsManager() {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    const list = await fetchRfqLeads();
    setLeads(list);
    if (list.length > 0 && !selectedLead) {
      setSelectedLead(list[0]);
      setEditedNotes(list[0].notes || '');
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    const updated = await updateLeadStatus(leadId, newStatus);
    setLeads(updated);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    const updated = await updateLeadStatus(selectedLead.id, selectedLead.status, editedNotes);
    setLeads(updated);
    setSelectedLead(prev => ({ ...prev, notes: editedNotes }));
    setIsEditingNotes(false);
  };

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
    setEditedNotes(lead.notes || '');
    setIsEditingNotes(false);
  };

  // 1-Click WhatsApp Reply
  const handleWhatsAppReply = (lead) => {
    const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello ${lead.name || 'valued partner'} from ${lead.company || 'your company'}, greetings from Medihub Pharma Labs Exports Division! Regarding your recent commercial inquiry for pharmaceutical formulations, we have prepared your CIF quotation.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  // 1-Click Email Reply
  const handleEmailReply = (lead) => {
    const subject = encodeURIComponent(`Medihub Pharma Labs - Official Quotation for ${lead.company || lead.name}`);
    const body = encodeURIComponent(
      `Dear ${lead.name},\n\nThank you for reaching out to Medihub Pharma Labs (WHO-GMP Certified Exporter).\n\nWe have reviewed your request for:\n` +
      (lead.items || []).map(i => `- ${i.name} (Qty: ${i.quantity})`).join('\n') +
      `\n\nPlease find our commercial terms and Certificate of Analysis (COA) attached.\n\nBest Regards,\nMedihub Pharma Labs Export Team\nPhone: +91 9244200415\nEmail: support@medihubpharmalabs.com`
    );
    window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`, '_blank');
  };

  // Export Leads to CSV
  const handleExportLeads = () => {
    const headers = "ID,Date,Name,Company,Email,Phone,Country,Status,Items Count,Estimated Value,Notes\n";
    const rows = leads.map(l => 
      `"${l.id}","${l.created_at}","${l.name}","${l.company}","${l.email}","${l.phone}","${l.country}","${l.status}",${l.items?.length || 0},"${l.estimatedValue || 'N/A'}","${(l.notes || '').replace(/"/g, '""')}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Medihub_RFQ_Leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLeads = leads.filter(l => {
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.company && l.company.toLowerCase().includes(q)) ||
      (l.country && l.country.toLowerCase().includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Commercial CRM & Pipeline</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            RFQ Leads & Inquiries Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Directly review incoming quotation requests, track commercial deal statuses, and reply via 1-click WhatsApp or Email.
          </p>
        </div>

        <button
          onClick={handleExportLeads}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors self-start lg:self-auto"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export All Leads to CSV</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by company, buyer name, country, or email..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">All Lead Statuses ({leads.length})</option>
            {Object.keys(STATUS_CONFIG).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split View: Leads Table on Left, Lead Profile Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Leads List (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg flex flex-col">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Incoming Leads ({filteredLeads.length})</span>
            <span>Commercial Value</span>
          </div>

          <div className="divide-y divide-slate-800/80 max-h-[650px] overflow-y-auto">
            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs">
                No matching leads found for current filter.
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const isSelected = selectedLead?.id === lead.id;
                const statusMeta = STATUS_CONFIG[lead.status] || STATUS_CONFIG['New Lead'];
                const StatusIcon = statusMeta.icon;

                return (
                  <div
                    key={lead.id}
                    onClick={() => handleSelectLead(lead)}
                    className={`p-4 cursor-pointer transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-slate-800/80 border-l-4 border-cyan-400 pl-3'
                        : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white truncate">{lead.company}</span>
                        <span className="text-xs">{lead.countryCode ? `(${lead.countryCode})` : ''}</span>
                      </div>
                      <div className="text-xs text-slate-300 truncate">
                        {lead.name} • <span className="text-slate-500">{lead.country}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}>
                          <StatusIcon className="w-3 h-3" />
                          {lead.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {lead.items?.length || 1} Formulations
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-emerald-400 font-mono">
                        {lead.estimatedValue || 'RFQ Generated'}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Lead Detail Card (5 cols) */}
        <div className="lg:col-span-5">
          {selectedLead ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 sticky top-20">
              {/* Top Banner */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-5">
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedLead.company}</h2>
                  <p className="text-xs text-slate-400">{selectedLead.name} ({selectedLead.country})</p>
                </div>
                <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-lg font-mono font-bold">
                  {selectedLead.id}
                </span>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Update Lead Pipeline Status:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(STATUS_CONFIG).map((st) => {
                    const isActive = selectedLead.status === st;
                    const meta = STATUS_CONFIG[st];
                    return (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(selectedLead.id, st)}
                        className={`p-2 rounded-xl text-xs font-bold text-left border transition-all ${
                          isActive
                            ? `${meta.bg} ${meta.text} ${meta.border} shadow-sm ring-1 ring-cyan-400`
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email:</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-cyan-400 hover:underline font-mono truncate max-w-[200px]">
                    {selectedLead.email}
                  </a>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone / WA:</span>
                  <a href={`tel:${selectedLead.phone}`} className="text-white font-mono">
                    {selectedLead.phone}
                  </a>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500 flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Territory:</span>
                  <span className="text-white font-medium">{selectedLead.country}</span>
                </div>
              </div>

              {/* Inquired Drug Products */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Inquired Formulations & Quantities:
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {(selectedLead.items || []).map((item, idx) => (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-[10px] text-slate-500">{item.category}</div>
                      </div>
                      <span className="font-mono text-cyan-400 font-bold bg-slate-900 px-2 py-1 rounded-md text-[11px]">
                        {item.quantity?.toLocaleString() || '100'} Units
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Internal Export Notes:</span>
                  {isEditingNotes ? (
                    <button onClick={handleSaveNotes} className="text-xs text-emerald-400 font-bold hover:underline">
                      Save Note
                    </button>
                  ) : (
                    <button onClick={() => setIsEditingNotes(true)} className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                  )}
                </div>
                {isEditingNotes ? (
                  <textarea
                    rows={3}
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                ) : (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 italic">
                    {selectedLead.notes || 'No internal notes added yet.'}
                  </div>
                )}
              </div>

              {/* Direct Communications CTA Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleWhatsAppReply(selectedLead)}
                  className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Reply</span>
                </button>

                <button
                  onClick={() => handleEmailReply(selectedLead)}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Quotation</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-xs">
              Select a lead from the list to review details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
