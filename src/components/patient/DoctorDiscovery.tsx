import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DoctorProfile } from '../../types';
import {
  Search,
  MapPin,
  Clock,
  Star,
  CheckCircle2,
  AlertCircle,
  Navigation,
  SlidersHorizontal,
  Calendar,
  X,
  Stethoscope,
  GraduationCap,
  Award,
} from 'lucide-react';

interface Props {
  onBookAppointment: (doctor: DoctorProfile) => void;
}

export const DoctorDiscovery: React.FC<Props> = ({ onBookAppointment }) => {
  const { doctors } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<DoctorProfile | null>(null);
  const [maxDistanceMiles, setMaxDistanceMiles] = useState<number>(25);

  // Extract unique specialties
  const specialties = ['All', ...Array.from(new Set(doctors.map(d => d.specialty)))];

  // Request user location only when user clicks "Use My Location"
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('requesting');
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationStatus('granted');
      },
      error => {
        setLocationStatus('denied');
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('Location permission was denied. You can still search by city or clinic address.');
        } else {
          setLocationError('Unable to retrieve location. Please check your device location settings.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Haversine distance formula (in miles)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3958.8; // Earth radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  // Filter doctors
  const filteredDoctors = doctors
    .map(doc => {
      let distance: number | null = null;
      if (userLocation && doc.coordinates) {
        distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          doc.coordinates.latitude,
          doc.coordinates.longitude
        );
      }
      return { ...doc, distance };
    })
    .filter(doc => {
      // Specialty filter
      if (selectedSpecialty !== 'All' && doc.specialty !== selectedSpecialty) {
        return false;
      }
      // Verified only
      if (onlyVerified && !doc.isVerified) {
        return false;
      }
      // Search query filter (name, clinic, city, specialty)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(query);
        const matchesClinic = doc.clinicName.toLowerCase().includes(query);
        const matchesCity = doc.city.toLowerCase().includes(query);
        const matchesSpecialty = doc.specialty.toLowerCase().includes(query);
        if (!matchesName && !matchesClinic && !matchesCity && !matchesSpecialty) {
          return false;
        }
      }
      // Distance filter if user location is active
      if (userLocation && doc.distance !== null && doc.distance > maxDistanceMiles) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      // If distance available, sort by closest; otherwise by rating
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      return b.rating - a.rating;
    });

  return (
    <div className="space-y-6 pb-16">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Find Nearby Doctors & Specialists
          </h1>
          <p className="text-sm text-slate-600">
            Search licensed physicians, view administrator-verified credentials, and schedule consultations.
          </p>
        </div>

        {/* Location Action Button */}
        <div>
          {locationStatus === 'granted' ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
              <Navigation className="w-3.5 h-3.5 text-teal-600 fill-teal-600" />
              <span>Location active (Sorting by closest distance)</span>
            </div>
          ) : (
            <button
              onClick={requestLocation}
              disabled={locationStatus === 'requesting'}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{locationStatus === 'requesting' ? 'Locating...' : 'Use My Current Location'}</span>
            </button>
          )}
        </div>
      </div>

      {locationError && (
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Text Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by doctor name, medical specialty, clinic, or city..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Specialty Dropdown */}
          <div>
            <select
              value={selectedSpecialty}
              onChange={e => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition cursor-pointer"
            >
              {specialties.map(spec => (
                <option key={spec} value={spec}>
                  {spec === 'All' ? 'All Medical Specialties' : spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Filters row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-medium select-none">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={e => setOnlyVerified(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
              />
              <span className="flex items-center gap-1 text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                Verified Doctors Only
              </span>
            </label>

            {userLocation && (
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>Radius: <strong>{maxDistanceMiles} miles</strong></span>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={maxDistanceMiles}
                  onChange={e => setMaxDistanceMiles(Number(e.target.value))}
                  className="w-24 accent-teal-600 cursor-pointer"
                />
              </div>
            )}
          </div>

          <div className="text-slate-500">
            Showing <strong>{filteredDoctors.length}</strong> available physicians
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doctor => (
          <div
            key={doctor.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Doctor Avatar & Verified Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={doctor.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=160'}
                    alt={doctor.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:scale-105 transition"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">
                      {doctor.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700 flex items-center gap-1 mt-0.5">
                      <Stethoscope className="w-3 h-3" />
                      {doctor.specialty}
                    </p>
                  </div>
                </div>

                {/* Verification Status Badge */}
                {doctor.isVerified ? (
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0"
                    title="Verified by MediLink Administrator"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                ) : (
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold shrink-0"
                    title="Credentials submitted; awaiting administrator verification"
                  >
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    Pending Review
                  </span>
                )}
              </div>

              {/* Clinic details and Distance */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="font-medium text-slate-800">{doctor.clinicName}</div>
                <div className="flex items-start gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{doctor.clinicAddress}, {doctor.city}</span>
                </div>
                {doctor.distance !== null && (
                  <div className="text-teal-700 font-semibold flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    <span>{doctor.distance} miles from your location</span>
                  </div>
                )}
              </div>

              {/* Rating and Consultation Hours */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1 text-amber-600 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{doctor.rating}</span>
                  <span className="text-slate-400 text-[11px]">({doctor.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[140px]">{doctor.consultationHours}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">Consultation Fee:</span>
                <span className="font-bold text-slate-900">${doctor.fee}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setSelectedDoctorForModal(doctor)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                Profile & License
              </button>
              <button
                onClick={() => onBookAppointment(doctor)}
                className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Visit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Search className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Doctors Match Your Filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing the verified-only checkbox, or expanding the distance radius.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSpecialty('All');
              setOnlyVerified(false);
              setMaxDistanceMiles(50);
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Doctor Detailed Credentials & Profile Modal */}
      {selectedDoctorForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDoctorForModal.avatarUrl}
                  alt={selectedDoctorForModal.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {selectedDoctorForModal.name}
                  </h3>
                  <p className="text-xs font-semibold text-teal-700">{selectedDoctorForModal.specialty}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDoctorForModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification Banner */}
            {selectedDoctorForModal.isVerified ? (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Administrator-Verified Physician: </span>
                  MediLink administration has verified this provider's medical license ({selectedDoctorForModal.licenseNumber}) with the {selectedDoctorForModal.medicalBoard}.
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Credential Verification In Progress: </span>
                  This doctor has submitted credentials ({selectedDoctorForModal.licenseNumber}) for administrator compliance review.
                </div>
              </div>
            )}

            {/* Bio & Education */}
            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Biography</h4>
                <p className="leading-relaxed text-slate-600">{selectedDoctorForModal.bio}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
                    <span>Education & Training</span>
                  </div>
                  <div className="font-medium text-slate-900">{selectedDoctorForModal.education}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-teal-600" />
                    <span>Experience & Board</span>
                  </div>
                  <div className="font-medium text-slate-900">
                    {selectedDoctorForModal.yearsExperience} Years Practice
                  </div>
                  <div className="text-[10px] text-slate-500">{selectedDoctorForModal.medicalBoard}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="text-[11px] font-semibold text-slate-500">Clinic Address & Phone</div>
                <div className="font-medium text-slate-900">{selectedDoctorForModal.clinicName}</div>
                <div className="text-slate-600">{selectedDoctorForModal.clinicAddress}, {selectedDoctorForModal.city}</div>
                <div className="text-teal-700 font-semibold">{selectedDoctorForModal.phone}</div>
              </div>
            </div>

            {/* Modal CTA */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setSelectedDoctorForModal(null)}
                className="w-1/3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const doc = selectedDoctorForModal;
                  setSelectedDoctorForModal(null);
                  onBookAppointment(doc);
                }}
                className="w-2/3 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Consultation with {selectedDoctorForModal.name.split(',')[0]}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
