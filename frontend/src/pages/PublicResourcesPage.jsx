import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { resourceAPI, metaAPI } from '../services/api';
import { Wrench, Search, Filter, MapPin, Calendar } from 'lucide-react';

export default function PublicResourcesPage() {
  const { lang, t } = useLanguage();
  const [resources, setResources] = useState([]);
  const [types, setTypes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedType, setSelectedType] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [resData, typeData, areaData] = await Promise.all([
          resourceAPI.getAll(),
          resourceAPI.getTypes(),
          metaAPI.getAreas()
        ]);
        if (resData.data.success) setResources(resData.data.resources);
        if (typeData.data.success) setTypes(typeData.data.types);
        if (areaData.data.success) setAreas(areaData.data.areas);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = resources.filter(r => {
    if (selectedType && String(r.resource_type_id) !== String(selectedType)) return false;
    if (selectedArea && String(r.area_id) !== String(selectedArea)) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return r.name_en.toLowerCase().includes(term) || r.name_hi.includes(term) || r.resource_code.toLowerCase().includes(term);
    }
    return true;
  });

  return (
    <div className="min-h-screen pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-gov-600/10 text-gov-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
          {t('nav.resources')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          {t('resources.title')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('resources.subtitle')}
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
          >
            <option value="">{t('resources.allTypes')}</option>
            {types.map(tp => (
              <option key={tp.id} value={tp.id}>
                {lang === 'hi' ? tp.name_hi : tp.name_en}
              </option>
            ))}
          </select>

          <select
            value={selectedArea}
            onChange={e => setSelectedArea(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
          >
            <option value="">{t('resources.allWards')}</option>
            {areas.map(a => (
              <option key={a.id} value={a.id}>
                {lang === 'hi' ? a.name_hi : a.name_en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resource Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500">{t('common.loading')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(res => (
            <div key={res.id} className="glass-card p-6 space-y-4 hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-gov-600 dark:text-sky-400">
                  {res.resource_code}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  res.condition_status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                  res.condition_status === 'needs_maintenance' ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  {res.condition_status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {lang === 'hi' ? res.name_hi : res.name_en}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {res.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gov-600" />
                  <span>{res.location_address} ({lang === 'hi' ? res.area_name_hi : res.area_name_en})</span>
                </p>
                <p className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('resources.lastMaintenance')}: {res.last_maintenance_date || 'N/A'}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
