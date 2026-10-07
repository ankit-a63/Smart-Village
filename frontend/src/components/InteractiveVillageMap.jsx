import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useLanguage } from '../context/LanguageContext';
import { resourceAPI, complaintAPI } from '../services/api';
import { MapPin, Droplets, Sun, GraduationCap, HeartPulse, Container, AlertCircle, Building2 } from 'lucide-react';

const createCustomIcon = (colorHex) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
      <path fill="${colorHex}" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="3.5" fill="#ffffff"/>
    </svg>
  `;
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svgString,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32]
  });
};

const icons = {
  complaint: createCustomIcon('#e11d48'),
  handpump: createCustomIcon('#0284c7'),
  streetlight: createCustomIcon('#f59e0b'),
  school: createCustomIcon('#7c3aed'),
  health: createCustomIcon('#10b981'),
  watertank: createCustomIcon('#06b6d4'),
  publicbldg: createCustomIcon('#475569')
};

export default function InteractiveVillageMap() {
  const { lang, t } = useLanguage();
  const [resources, setResources] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  const centerLat = 26.8465;
  const centerLng = 80.9463;

  useEffect(() => {
    async function loadMapData() {
      try {
        const [resData, compData] = await Promise.all([
          resourceAPI.getAll(),
          complaintAPI.getPublicAll()
        ]);
        if (resData.data.success) setResources(resData.data.resources);
        if (compData.data.success) setComplaints(compData.data.complaints);
      } catch (err) {
        console.error('Failed to load map data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMapData();
  }, []);

  const getMarkerIcon = (item, type) => {
    if (type === 'complaint') return icons.complaint;
    const typeId = item.resource_type_id;
    if (typeId === 1) return icons.handpump;
    if (typeId === 2) return icons.streetlight;
    if (typeId === 3) return icons.school;
    if (typeId === 4) return icons.health;
    if (typeId === 5) return icons.watertank;
    return icons.publicbldg;
  };

  return (
    <section id="interactive-map" className="py-20 bg-slate-100 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-gov-600/10 text-gov-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider">
              {t('nav.map')}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {t('map.title')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {t('map.subtitle')}
            </p>
          </div>

          {/* Map Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: t('map.allMarkers') },
              { id: 'complaints', label: t('map.complaints') },
              { id: 'handpump', label: t('map.handpumps') },
              { id: 'streetlight', label: t('map.streetlights') },
              { id: 'health', label: t('map.healthSchools') }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gov-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="w-full h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-900">
              <span className="text-sm text-slate-500 animate-pulse">{t('common.loading')}</span>
            </div>
          ) : (
            <MapContainer
              center={[centerLat, centerLng]}
              zoom={14}
              scrollWheelZoom={false}
              className="w-full h-full z-10"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Resource Markers */}
              {(activeTab === 'all' || activeTab !== 'complaints') &&
                resources.map(res => {
                  if (!res.latitude || !res.longitude) return null;
                  return (
                    <Marker
                      key={`res-${res.id}`}
                      position={[res.latitude, res.longitude]}
                      icon={getMarkerIcon(res, 'resource')}
                    >
                      <Popup>
                        <div className="p-1 min-w-[200px]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gov-600 block">
                            {res.resource_code} • {lang === 'hi' ? res.type_name_hi : res.type_name_en}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 mt-0.5">
                            {lang === 'hi' ? res.name_hi : res.name_en}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1">{res.location_address}</p>
                          <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              res.condition_status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {res.condition_status.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {lang === 'hi' ? res.area_name_hi : res.area_name_en}
                            </span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })
              }

              {/* Complaint Markers */}
              {(activeTab === 'all' || activeTab === 'complaints') &&
                complaints.map(comp => {
                  if (!comp.latitude || !comp.longitude) return null;
                  return (
                    <Marker
                      key={`comp-${comp.id}`}
                      position={[comp.latitude, comp.longitude]}
                      icon={icons.complaint}
                    >
                      <Popup>
                        <div className="p-1 min-w-[220px]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                            {comp.tracking_id} • {comp.priority.toUpperCase()}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 mt-0.5">
                            {comp.title}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{comp.description}</p>
                          <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                              {comp.status}
                            </span>
                            <span className="text-[10px] text-slate-400">{comp.location_address}</span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })
              }
            </MapContainer>
          )}
        </div>
      </div>
    </section>
  );
}
