import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { metaAPI, complaintAPI } from '../services/api';
import {
  Check, MapPin, Upload, ArrowRight, ArrowLeft, CheckCircle2,
  Truck, Droplets, Zap, Sun, Trash2, Filter, Building2, HelpCircle
} from 'lucide-react';

const iconMap = {
  Truck, Droplets, Zap, Sun, Trash2, Filter, Building2, HelpCircle
};

export default function MultiStepComplaintForm({ onSuccess }) {
  const { lang, t } = useLanguage();
  const { addToast } = useNotifications();

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Form State
  const [category_id, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [area_id, setAreaId] = useState('');
  const [location_address, setLocationAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [gettingGeo, setGettingGeo] = useState(false);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [catRes, areaRes] = await Promise.all([
          metaAPI.getCategories(),
          metaAPI.getAreas()
        ]);
        if (catRes.data.success) {
          setCategories(catRes.data.categories);
          if (catRes.data.categories.length > 0) setCategoryId(catRes.data.categories[0].id);
        }
        if (areaRes.data.success) {
          setAreas(areaRes.data.areas);
          if (areaRes.data.areas.length > 0) setAreaId(areaRes.data.areas[0].id);
        }
      } catch (err) {
        addToast(t('common.errorMsg'), 'error');
      } finally {
        setLoading(false);
      }
    }
    loadMeta();
  }, []);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by your browser', 'warning');
      return;
    }
    setGettingGeo(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocationAddress(`GPS: Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)}`);
        setGettingGeo(false);
        addToast('GPS location acquired!', 'success');
      },
      (err) => {
        setGettingGeo(false);
        addToast('Unable to fetch GPS. Please enter location manually.', 'warning');
      },
      { timeout: 10000 }
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      addToast(t('complaintForm.titleLabel') + ' & ' + t('complaintForm.descriptionLabel') + ' required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('category_id', category_id);
      formData.append('area_id', area_id);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('priority', priority);
      formData.append('location_address', location_address);
      if (latitude) formData.append('latitude', latitude);
      if (longitude) formData.append('longitude', longitude);
      if (photo) formData.append('photo', photo);

      const res = await complaintAPI.submit(formData);
      if (res.data.success) {
        setSubmittedData(res.data);
        addToast(t('complaintForm.successTitle'), 'success');
        if (onSuccess) onSuccess(res.data);
      }
    } catch (err) {
      addToast(err.response?.data?.message_en || t('common.errorMsg'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        {t('common.loading')}
      </div>
    );
  }

  // Success Screen After Submission
  if (submittedData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 sm:p-12 text-center max-w-xl mx-auto"
      >
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          {t('complaintForm.successTitle')}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          {t('complaintForm.successDesc')}
        </p>

        <div className="my-6 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            {t('complaintForm.trackingIdLabel')}
          </span>
          <span className="text-2xl font-black text-gov-600 dark:text-sky-400 tracking-wider block mt-1">
            {submittedData.tracking_id}
          </span>
        </div>

        <button
          onClick={() => window.location.href = `/track?id=${submittedData.tracking_id}`}
          className="w-full py-3.5 rounded-xl bg-gov-600 hover:bg-gov-700 text-white font-bold text-sm shadow-lg transition-all"
        >
          {t('complaintForm.trackNowBtn')}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="glass-card p-6 sm:p-10 max-w-3xl mx-auto">
      {/* Multi-step Header Stepper */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
              step === s
                ? 'bg-gov-600 text-white ring-4 ring-gov-500/20'
                : step > s
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
            }`}>
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 5 && (
              <div className={`hidden sm:block w-12 h-1 mx-2 rounded-full ${
                step > s ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
              }`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Category */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('complaintForm.step1Title')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const IconComponent = iconMap[cat.icon] || HelpCircle;
                const isSelected = String(category_id) === String(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-gov-600/10 border-gov-600 text-gov-600 dark:text-sky-400 ring-2 ring-gov-600/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <IconComponent className="w-7 h-7" />
                    <span className="text-xs font-semibold text-center leading-snug">
                      {lang === 'hi' ? cat.name_hi : cat.name_en}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 2: Problem Details */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('complaintForm.step2Title')}
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                {t('complaintForm.titleLabel')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('complaintForm.titlePlaceholder')}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-gov-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                {t('complaintForm.descriptionLabel')}
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('complaintForm.descriptionPlaceholder')}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-gov-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                {t('complaintForm.priorityLabel')}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['low', 'medium', 'high', 'critical'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                      priority === p
                        ? p === 'critical' ? 'bg-rose-600 text-white' :
                          p === 'high' ? 'bg-amber-600 text-white' :
                          'bg-gov-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('complaintForm.step3Title')}
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                {t('complaintForm.areaLabel')}
              </label>
              <select
                value={area_id}
                onChange={(e) => setAreaId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-gov-500"
              >
                {areas.map(a => (
                  <option key={a.id} value={a.id}>
                    {lang === 'hi' ? a.name_hi : a.name_en} ({a.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                {t('complaintForm.addressLabel')}
              </label>
              <input
                type="text"
                value={location_address}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder={t('complaintForm.addressPlaceholder')}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-gov-500"
              />
            </div>

            <button
              type="button"
              onClick={handleGeolocation}
              disabled={gettingGeo}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-all"
            >
              <MapPin className="w-4 h-4" />
              <span>{gettingGeo ? t('complaintForm.gettingLocation') : t('complaintForm.useLocationBtn')}</span>
            </button>
          </motion.div>
        )}

        {/* Step 4: Upload Photo */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 text-center"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white text-left">
              {t('complaintForm.step4Title')}
            </h3>

            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-8 hover:border-gov-500 transition-colors relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {photoPreview ? (
                <div className="space-y-2">
                  <img src={photoPreview} alt="Preview" className="max-h-48 mx-auto rounded-xl shadow-md object-cover" />
                  <span className="text-xs text-slate-500 block">{photo.name}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t('complaintForm.choosePhoto')}
                  </p>
                  <p className="text-xs text-slate-400">JPG, PNG, or WebP up to 5MB</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('complaintForm.step5Title')}
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 space-y-3 text-sm border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-semibold text-slate-500">Title:</span>
                <span className="font-bold text-slate-900 dark:text-white">{title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-semibold text-slate-500">Priority:</span>
                <span className="font-bold uppercase text-gov-600">{priority}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-semibold text-slate-500">Location:</span>
                <span className="font-bold text-slate-900 dark:text-white">{location_address || 'Area default'}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-500 block mb-1">Description:</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        ) : <div />}

        {step < 5 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gov-600 hover:bg-gov-700 text-white text-xs font-semibold shadow-md ml-auto"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-lg ml-auto disabled:opacity-50"
          >
            {submitting ? t('complaintForm.submitting') : t('complaintForm.submitBtn')}
          </button>
        )}
      </div>
    </div>
  );
}
