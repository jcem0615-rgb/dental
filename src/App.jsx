import React, { useState, useEffect } from 'react';
import {
  Activity,
  Calendar,
  Users,
  CreditCard,
  FileText,
  MessageSquare,
  ShieldAlert,
  Search,
  Plus,
  Lock,
  User,
  Key,
  Eye,
  EyeOff,
  LogOut,
  Send,
  AlertTriangle,
  QrCode,
  CheckCircle2,
  Clock,
  MapPin,
  X,
  Edit3
} from 'lucide-react';

export default function App() {
  // Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Password Reset State
  const [showForcePasswordModal, setShowForcePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  // Active View
  const [activeTab, setActiveTab] = useState('odontogram');

  // Database State (LocalStorage persisted)
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('denti_patients');
    return saved ? JSON.parse(saved) : [
      {
        id: 'P-101',
        name: 'Maria Santos',
        phone: '09171234567',
        email: 'maria@example.com',
        gender: 'Female',
        age: 28,
        password: 'password123',
        mustChangePassword: false,
        vitals: { systolic: 120, diastolic: 80, hr: 72, spo2: 98, temp: 36.6, weight: 55 },
        conditions: { 4: 'Caries', 14: 'Filled' },
        surfaces: { '4-O': true, '14-M': true }
      },
      {
        id: 'P-102',
        name: 'Juan Dela Cruz',
        phone: '09189876543',
        email: 'juan@example.com',
        gender: 'Male',
        age: 35,
        password: 'password123',
        mustChangePassword: false,
        vitals: { systolic: 145, diastolic: 92, hr: 85, spo2: 97, temp: 36.8, weight: 78 },
        conditions: { 19: 'Extracted' },
        surfaces: {}
      }
    ];
  });

  const [assistants, setAssistants] = useState(() => {
    const saved = localStorage.getItem('denti_assistants');
    return saved ? JSON.parse(saved) : [
      { id: 'A-01', name: 'Nurse Joy', phone: '09190001111', email: 'joy@denticlinic.ph', password: 'password123', mustChangePassword: false }
    ];
  });

  const [clinics, setClinics] = useState(() => {
    const saved = localStorage.getItem('denti_clinics');
    return saved ? JSON.parse(saved) : [
      { id: 'C-1', name: 'DentiClinic - Malasiqui Main', address: 'Canan Norte, Malasiqui, Pangasinan', schedule: 'Mon, Wed, Fri: 9:00 AM - 5:00 PM' },
      { id: 'C-2', name: 'DentiClinic - Dagupan Branch', address: 'Tapuac District, Dagupan City', schedule: 'Tue, Thu, Sat: 9:00 AM - 4:00 PM' }
    ];
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('denti_appointments');
    return saved ? JSON.parse(saved) : [
      { id: 'APT-1', patientId: 'P-101', patientName: 'Maria Santos', service: 'Tooth Extraction', clinicName: 'DentiClinic - Malasiqui Main', date: '2026-11-05', time: '10:00 AM', status: 'Confirmed', amount: 1500, paid: true },
      { id: 'APT-2', patientId: 'P-102', patientName: 'Juan Dela Cruz', service: 'Dental Cleaning', clinicName: 'DentiClinic - Dagupan Branch', date: '2026-11-06', time: '02:00 PM', status: 'Pending', amount: 1200, paid: false }
    ];
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('denti_messages');
    return saved ? JSON.parse(saved) : [
      { id: 1, fromId: 'DOC-1', fromName: 'Dr. Estrada', toId: 'P-101', text: 'Hi Maria, please remember to fast 2 hours before your appointment.', timestamp: '10:30 AM' },
      { id: 2, fromId: 'A-01', fromName: 'Nurse Joy', toId: 'DOC-1', text: 'Doctor, Mr. Juan Dela Cruz has elevated BP (145/92).', timestamp: '11:15 AM' }
    ];
  });

  // Active Selection State
  const [selectedPatientId, setSelectedPatientId] = useState('P-101');
  const [selectedTooth, setSelectedTooth] = useState(1);
  const [chatRecipientId, setChatRecipientId] = useState('P-101');
  const [chatInputText, setChatInputText] = useState('');

  // Modals & UI Controls
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditClinicModal, setShowEditClinicModal] = useState(false);
  const [activeClinic, setActiveClinic] = useState(null);
  const [activePaymentApt, setActivePaymentApt] = useState(null);

  // Form States
  const [newPatientData, setNewPatientData] = useState({
    name: '', phone: '', email: '', gender: 'Female', age: 30, password: 'password123',
    systolic: 120, diastolic: 80, hr: 72, spo2: 98, temp: 36.5, weight: 60
  });

  const [bookingData, setBookingData] = useState({
    service: 'Dental Cleaning', clinicName: 'DentiClinic - Malasiqui Main', date: '', time: '09:00 AM', amount: 1200
  });

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem('denti_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('denti_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('denti_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('denti_assistants', JSON.stringify(assistants)); }, [assistants]);
  useEffect(() => { localStorage.setItem('denti_clinics', JSON.stringify(clinics)); }, [clinics]);

  // Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    if ((loginIdentifier === 'doctor' || loginIdentifier === 'admin@denticlinic.ph' || loginIdentifier === '09170000000') && loginPassword === 'admin123') {
      setCurrentUser({ id: 'DOC-1', name: 'Dr. Estrada, DDM', role: 'dentist', phone: '09170000000', email: 'admin@denticlinic.ph', mustChangePassword: false });
      return;
    }

    const foundAssistant = assistants.find(a => (a.phone === loginIdentifier || a.email.toLowerCase() === loginIdentifier.toLowerCase()) && a.password === loginPassword);
    if (foundAssistant) {
      setCurrentUser({ ...foundAssistant, role: 'assistant' });
      if (foundAssistant.mustChangePassword) setShowForcePasswordModal(true);
      return;
    }

    const foundPatient = patients.find(p => (p.phone === loginIdentifier || p.email.toLowerCase() === loginIdentifier.toLowerCase()) && p.password === loginPassword);
    if (foundPatient) {
      setCurrentUser({ ...foundPatient, role: 'patient' });
      setSelectedPatientId(foundPatient.id);
      if (foundPatient.mustChangePassword) setShowForcePasswordModal(true);
      return;
    }

    setAuthError('Invalid credentials. Check your email/phone number or password.');
  };

  const handleForcePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    if (currentUser.role === 'patient') {
      setPatients(prev => prev.map(p => p.id === currentUser.id ? { ...p, password: newPassword, mustChangePassword: false } : p));
    } else if (currentUser.role === 'assistant') {
      setAssistants(prev => prev.map(a => a.id === currentUser.id ? { ...a, password: newPassword, mustChangePassword: false } : a));
    }

    setCurrentUser(prev => ({ ...prev, mustChangePassword: false }));
    setShowForcePasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const triggerPasswordReset = (targetId, type) => {
    if (type === 'patient') {
      setPatients(prev => prev.map(p => p.id === targetId ? { ...p, password: 'password123', mustChangePassword: true } : p));
      setResetSuccessMessage(`Password for patient ${targetId} reset to 'password123'.`);
    } else if (type === 'assistant') {
      setAssistants(prev => prev.map(a => a.id === targetId ? { ...a, password: 'password123', mustChangePassword: true } : a));
      setResetSuccessMessage(`Password for assistant ${targetId} reset to 'password123'.`);
    }
    setTimeout(() => setResetSuccessMessage(''), 4000);
  };

  const quickSwitch = (role) => {
    if (role === 'dentist') {
      setCurrentUser({ id: 'DOC-1', name: 'Dr. Estrada, DDM', role: 'dentist', email: 'admin@denticlinic.ph' });
    } else if (role === 'assistant') {
      setCurrentUser({ id: 'A-01', name: 'Nurse Joy', role: 'assistant', email: 'joy@denticlinic.ph' });
    } else if (role === 'patient') {
      setCurrentUser({ id: 'P-101', name: 'Maria Santos', role: 'patient', email: 'maria@example.com' });
      setSelectedPatientId('P-101');
    }
  };

  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];
  const isHypertensive = (sys, dia) => sys >= 140 || dia >= 90;

  const handleCreatePatient = (e) => {
    e.preventDefault();
    const newId = `P-${Math.floor(100 + Math.random() * 900)}`;
    const newP = {
      id: newId,
      name: newPatientData.name,
      phone: newPatientData.phone,
      email: newPatientData.email,
      gender: newPatientData.gender,
      age: parseInt(newPatientData.age),
      password: newPatientData.password || 'password123',
      mustChangePassword: false,
      vitals: {
        systolic: parseInt(newPatientData.systolic),
        diastolic: parseInt(newPatientData.diastolic),
        hr: parseInt(newPatientData.hr),
        spo2: parseInt(newPatientData.spo2),
        temp: parseFloat(newPatientData.temp),
        weight: parseFloat(newPatientData.weight)
      },
      conditions: {},
      surfaces: {}
    };

    setPatients([newP, ...patients]);
    setSelectedPatientId(newId);
    setShowNewPatientModal(false);
  };

  const updateToothCondition = (toothNum, cond) => {
    if (!currentPatient) return;
    setPatients(patients.map(p => {
      if (p.id === currentPatient.id) {
        return { ...p, conditions: { ...p.conditions, [toothNum]: cond } };
      }
      return p;
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInputText.trim() || !currentUser) return;
    const newMsg = {
      id: Date.now(),
      fromId: currentUser.id,
      fromName: currentUser.name,
      toId: chatRecipientId,
      text: chatInputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setChatInputText('');
  };

  const ToothIcon = ({ condition }) => {
    let fillColor = "#38bdf8";
    if (condition === 'Caries') fillColor = "#f43f5e";
    if (condition === 'Filled') fillColor = "#fbbf24";
    if (condition === 'Extracted') fillColor = "#475569";
    if (condition === 'Crown') fillColor = "#a855f7";
    if (condition === 'Root Canal') fillColor = "#ec4899";

    return (
      <svg className="w-6 h-7 mx-auto my-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7 3C4.5 3 3 5 3 7.5C3 11 5 13.5 7 16C8.2 17.5 8.5 19.5 9.5 21C10 21.8 11 22 12 22C13 22 14 21.8 14.5 21C15.5 19.5 15.8 17.5 17 16C19 13.5 21 11 21 7.5C21 5 19.5 3 17 3C14.5 3 13 5 12 7C11 5 9.5 3 7 3Z"
          fill={fillColor}
          fillOpacity={condition === 'Extracted' ? 0.3 : 0.85}
          stroke={fillColor}
          strokeWidth="1.5"
        />
      </svg>
    );
  };

  // LOGIN SCREEN
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-teal-500/10 text-teal-400 rounded-2xl mb-3 border border-teal-500/20">
              <Activity className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">DentiClinic PWA</h1>
            <p className="text-slate-400 text-sm mt-1">Dental Practice & Patient Portal</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Phone Number or Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="09171234567 or email@domain.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-10 py-3 text-sm text-white focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold py-3 rounded-xl transition duration-200 text-sm shadow-lg shadow-teal-500/10"
            >
              Sign In to Account
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400 text-center mb-3">Quick Demo Access (Select Role):</p>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => quickSwitch('dentist')} className="py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-teal-400">
                Dentist
              </button>
              <button onClick={() => quickSwitch('assistant')} className="py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-amber-400">
                Assistant
              </button>
              <button onClick={() => quickSwitch('patient')} className="py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-medium text-blue-400">
                Patient
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FORCE PASSWORD CHANGE MODAL
  if (showForcePasswordModal) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
          <div className="flex items-center gap-3 text-amber-400 mb-4">
            <Lock className="w-6 h-6" />
            <h2 className="text-lg font-bold text-white">Password Change Required</h2>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Your password was reset by administration. Please set a new secure password.
          </p>

          {passwordError && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-sm">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleForcePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold py-3 rounded-xl text-sm"
            >
              Update Password & Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD APP
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight">DentiClinic PWA</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 capitalize">{currentUser.role} Portal</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-white">{currentUser.name}</div>
            <div className="text-xs text-slate-400">{currentUser.email || currentUser.phone}</div>
          </div>
          <button
            onClick={() => setCurrentUser(null)}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Global Notice Banner */}
      {resetSuccessMessage && (
        <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-4 py-2.5 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{resetSuccessMessage}</span>
        </div>
      )}

      {/* Main Layout Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        <nav className="bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 w-full md:w-64 p-3 flex md:flex-col gap-1.5 overflow-x-auto shrink-0">
          {[
            { id: 'odontogram', label: 'Odontogram', icon: Activity, roles: ['dentist', 'assistant', 'patient'] },
            { id: 'clinics', label: 'Clinics & Schedule', icon: MapPin, roles: ['dentist', 'assistant', 'patient'] },
            { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['dentist', 'assistant', 'patient'] },
            { id: 'vitals', label: 'Vital Signs', icon: ShieldAlert, roles: ['dentist', 'assistant'] },
            { id: 'patients', label: 'Patients List', icon: Users, roles: ['dentist', 'assistant'] },
            { id: 'chat', label: 'Clinical Chat', icon: MessageSquare, roles: ['dentist', 'assistant', 'patient'] },
          ]
            .filter(tab => tab.roles.includes(currentUser.role))
            .map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition shrink-0 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
        </nav>

        {/* Dynamic Content Panel */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* TAB 1: ODONTOGRAM CHART */}
          {activeTab === 'odontogram' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">32-Tooth Universal Odontogram</h2>
                  <p className="text-xs text-slate-400">Click any tooth to examine or update its medical condition</p>
                </div>

                {currentUser.role !== 'patient' && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="text-xs text-slate-400 shrink-0">Patient:</label>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="w-full sm:w-auto bg-slate-800 border border-slate-700 text-white rounded-xl text-xs px-3 py-2 focus:outline-none focus:border-teal-500"
                    >
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Hypertensive Warning */}
              {currentPatient && isHypertensive(currentPatient.vitals.systolic, currentPatient.vitals.diastolic) && (
                <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-start sm:items-center gap-3 text-rose-400">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-rose-300">Pre-Anesthesia Hypertension Warning</h4>
                    <p className="text-xs text-rose-400/90 mt-0.5">
                      Patient BP is {currentPatient.vitals.systolic}/{currentPatient.vitals.diastolic} mmHg. Exercise caution with vasoconstrictor anesthetics.
                    </p>
                  </div>
                </div>
              )}

              {/* Tooth Grid */}
              <div className="bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-6">
                <div className="overflow-x-auto pb-2">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Upper Arch (Maxillary)</h3>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span>Healthy</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>Caries</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span>Filled</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500"></span>Extracted</span>
                    </div>
                  </div>
                  <div
                    className="grid gap-1.5 sm:gap-2 min-w-[750px]"
                    style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
                  >
                    {Array.from({ length: 16 }, (_, i) => i + 1).map(num => {
                      const cond = currentPatient?.conditions[num];
                      return (
                        <button
                          key={num}
                          onClick={() => setSelectedTooth(num)}
                          className={`p-1.5 rounded-xl border flex flex-col items-center justify-between text-xs transition h-20 ${
                            selectedTooth === num
                              ? 'border-teal-500 bg-teal-500/15 shadow-md shadow-teal-500/10'
                              : cond === 'Caries'
                              ? 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                              : cond === 'Extracted'
                              ? 'border-slate-700 bg-slate-950 text-slate-600 opacity-60'
                              : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <span className="text-[10px] font-mono text-slate-400">#{num}</span>
                          <ToothIcon condition={cond} />
                          <span className="text-[9px] font-bold truncate max-w-full text-slate-300">{cond || 'Healthy'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="overflow-x-auto pb-2 border-t border-slate-800 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Lower Arch (Mandibular)</h3>
                  <div
                    className="grid gap-1.5 sm:gap-2 min-w-[750px]"
                    style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}
                  >
                    {Array.from({ length: 16 }, (_, i) => 32 - i).map(num => {
                      const cond = currentPatient?.conditions[num];
                      return (
                        <button
                          key={num}
                          onClick={() => setSelectedTooth(num)}
                          className={`p-1.5 rounded-xl border flex flex-col items-center justify-between text-xs transition h-20 ${
                            selectedTooth === num
                              ? 'border-teal-500 bg-teal-500/15 shadow-md shadow-teal-500/10'
                              : cond === 'Caries'
                              ? 'border-rose-500/50 bg-rose-500/10 text-rose-400'
                              : cond === 'Extracted'
                              ? 'border-slate-700 bg-slate-950 text-slate-600 opacity-60'
                              : 'border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <span className="text-[10px] font-mono text-slate-400">#{num}</span>
                          <ToothIcon condition={cond} />
                          <span className="text-[9px] font-bold truncate max-w-full text-slate-300">{cond || 'Healthy'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {currentUser.role !== 'patient' && (
                  <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-teal-400">Selected Tooth: #{selectedTooth} ({currentPatient?.conditions[selectedTooth] || 'Healthy'})</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['Healthy', 'Caries', 'Filled', 'Extracted', 'Crown', 'Root Canal'].map(cond => (
                        <button
                          key={cond}
                          onClick={() => updateToothCondition(selectedTooth, cond === 'Healthy' ? undefined : cond)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition ${
                            (currentPatient?.conditions[selectedTooth] === cond || (!currentPatient?.conditions[selectedTooth] && cond === 'Healthy'))
                              ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold'
                              : 'bg-slate-800 border-slate-700 hover:border-teal-500 text-slate-300'
                          }`}
                        >
                          {cond}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CLINICS & SCHEDULE (WITH DOCTOR EDIT CAPABILITY) */}
          {activeTab === 'clinics' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex justify-between items-center bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Clinic Branches & Doctor Schedules</h2>
                  <p className="text-xs text-slate-400">View operating branches and doctor availability hours</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clinics.map(clinic => (
                  <div key={clinic.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20">
                          <MapPin className="w-5 h-5"
