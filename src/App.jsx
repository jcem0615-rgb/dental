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
  X
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
        history: [
          { id: 'H-1', date: '2026-08-14', procedure: 'Composite Filling', tooth: '#14', clinic: 'DentiClinic - Malasiqui Main', doctor: 'Dr. Estrada', notes: 'Restored occlusal caries with light-cured composite.' },
          { id: 'H-2', date: '2026-03-10', procedure: 'Prophylaxis (Cleaning)', tooth: 'All', clinic: 'DentiClinic - Malasiqui Main', doctor: 'Dr. Estrada', notes: 'Routine scaling and polishing. Mild gingivitis noted.' }
        ]
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
        history: [
          { id: 'H-3', date: '2026-09-01', procedure: 'Tooth Extraction', tooth: '#19', clinic: 'DentiClinic - Dagupan Branch', doctor: 'Dr. Estrada', notes: 'Extracted severely decayed molar under local anesthesia.' }
        ]
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
      { id: 1, fromId: 'DOC-1', fromName: 'Dr. Estrada', toId: 'P-101', text: 'Hi Maria, please remember to fast 2 hours before your appointment.', timestamp: '10:30 AM' }
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
  const [showAddHistoryModal, setShowAddHistoryModal] = useState(false);
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

  const [newHistoryEntry, setNewHistoryEntry] = useState({
    procedure: 'Composite Filling', tooth: '#1', clinic: 'DentiClinic - Malasiqui Main', doctor: 'Dr. Estrada', notes: ''
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
      history: []
    };

    setPatients([newP, ...patients]);
    setSelectedPatientId(newId);
    setShowNewPatientModal(false);
  };

  const handleAddHistoryRecord = (e) => {
    e.preventDefault();
    if (!currentPatient) return;
    const entry = {
      id: `H-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      procedure: newHistoryEntry.procedure,
      tooth: newHistoryEntry.tooth,
      clinic: newHistoryEntry.clinic,
      doctor: newHistoryEntry.doctor,
      notes: newHistoryEntry.notes
    };

    setPatients(patients.map(p => {
      if (p.id === currentPatient.id) {
        return { ...p, history: [entry, ...(p.history || [])] };
      }
      return p;
    }));
    setShowAddHistoryModal(false);
    setNewHistoryEntry({ procedure: 'Composite Filling', tooth: '#1', clinic: 'DentiClinic - Malasiqui Main', doctor: 'Dr. Estrada', notes: '' });
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
            { id: 'history', label: 'Medical History', icon: FileText, roles: ['dentist', 'assistant', 'patient'] },
            { id: 'clinics', label: 'Clinics & Schedule', icon: Search, roles: ['dentist', 'assistant', 'patient'] },
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

          {/* TAB 2: MEDICAL RECORD & CLINICAL HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Patient Clinical History</h2>
                  <p className="text-xs text-slate-400">
                    Showing treatment history for <span className="text-teal-400 font-semibold">{currentPatient?.name}</span> ({currentPatient?.id})
                  </p>
                </div>
                {currentUser.role !== 'patient' ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-white rounded-xl text-xs px-3 py-2.5"
                    >
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowAddHistoryModal(true)}
                      className="px-3.5 py-2.5 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Add Record
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
                {currentPatient?.history && currentPatient.history.length > 0 ? (
                  currentPatient.history.map(item => (
                    <div key={item.id} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-700/50">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold text-xs rounded-lg">
                            {item.procedure}
                          </span>
                          <span className="text-xs font-mono text-slate-400">Tooth {item.tooth}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                      </div>
                      <p className="text-sm text-slate-200">{item.notes}</p>
                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                        <span>Clinic: {item.clinic}</span>
                        <span>Doctor: {item.doctor}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No clinical procedure records found for this patient.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CLINICS & SCHEDULE */}
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
                        <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20 font-bold text-xs">
                          BRANCH
                        </div>
                        {currentUser.role === 'dentist' && (
                          <button
                            onClick={() => { setActiveClinic(clinic); setShowEditClinicModal(true); }}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-teal-400 rounded-xl text-xs font-semibold"
                          >
                            Edit Schedule
                          </button>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-base mb-1">{clinic.name}</h3>
                      <p className="text-xs text-slate-400 mb-4">{clinic.address}</p>

                      <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">Doctor Operating Schedule</div>
                        <div className="text-sm font-bold text-white mt-0.5">{clinic.schedule}</div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Accepting Bookings
                      </span>
                      {currentUser.role === 'patient' && (
                        <button
                          onClick={() => {
                            setBookingData(prev => ({ ...prev, clinicName: clinic.name }));
                            setActiveTab('appointments');
                            setShowBookingModal(true);
                          }}
                          className="px-3 py-1.5 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs"
                        >
                          Book Here
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: APPOINTMENTS & GCASH */}
          {activeTab === 'appointments' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Appointments & Billing</h2>
                  <p className="text-xs text-slate-400">Manage clinic bookings and GCash payments</p>
                </div>
                {currentUser.role === 'patient' && (
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Book Appointment
                  </button>
                )}
              </div>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[750px]">
                    <thead className="bg-slate-950 border-b border-slate-800 text-xs text-slate-400 uppercase">
                      <tr>
                        <th className="p-4">Patient</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Clinic Branch</th>
                        <th className="p-4">Date & Time</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4 text-right">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {appointments.map(apt => (
                        <tr key={apt.id} className="hover:bg-slate-800/50">
                          <td className="p-4 font-semibold text-white">{apt.patientName}</td>
                          <td className="p-4">{apt.service}</td>
                          <td className="p-4 text-xs text-teal-400 font-medium">{apt.clinicName}</td>
                          <td className="p-4">{apt.date} at {apt.time}</td>
                          <td className="p-4 font-bold text-white">₱{apt.amount}</td>
                          <td className="p-4 text-right">
                            {apt.paid ? (
                              <span className="text-xs text-emerald-400 font-bold flex items-center justify-end gap-1">
                                <CheckCircle2 className="w-4 h-4" /> Paid via GCash
                              </span>
                            ) : (
                              <button
                                onClick={() => { setActivePaymentApt(apt); setShowPaymentModal(true); }}
                                className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500 hover:text-slate-950 rounded-xl text-xs font-semibold"
                              >
                                Pay GCash
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VITALS INTAKE */}
          {activeTab === 'vitals' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <h2 className="text-base sm:text-lg font-bold text-white">Pre-Anesthesia Vital Signs Intake</h2>
                <p className="text-xs text-slate-400">Review patient cardiovascular screening</p>
              </div>

              {currentPatient && (
                <div className="bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                    <div>
                      <h3 className="font-bold text-white text-base">{currentPatient.name}</h3>
                      <p className="text-xs text-slate-400">ID: {currentPatient.id} | Age: {currentPatient.age} | Gender: {currentPatient.gender}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                      isHypertensive(currentPatient.vitals.systolic, currentPatient.vitals.diastolic)
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {isHypertensive(currentPatient.vitals.systolic, currentPatient.vitals.diastolic) ? 'Hypertensive' : 'Normal Risk'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="text-xs text-slate-400 mb-1">Blood Pressure</div>
                      <div className="text-lg sm:text-xl font-bold text-white">{currentPatient.vitals.systolic} / {currentPatient.vitals.diastolic} <span className="text-xs text-slate-400">mmHg</span></div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="text-xs text-slate-400 mb-1">Heart Rate</div>
                      <div className="text-lg sm:text-xl font-bold text-white">{currentPatient.vitals.hr} <span className="text-xs text-slate-400">bpm</span></div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="text-xs text-slate-400 mb-1">Oxygen SpO2</div>
                      <div className="text-lg sm:text-xl font-bold text-white">{currentPatient.vitals.spo2}%</div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="text-xs text-slate-400 mb-1">Temperature</div>
                      <div className="text-lg sm:text-xl font-bold text-white">{currentPatient.vitals.temp} °C</div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="text-xs text-slate-400 mb-1">Body Weight</div>
                      <div className="text-lg sm:text-xl font-bold text-white">{currentPatient.vitals.weight} kg</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: PATIENTS LIST & RESETS */}
          {activeTab === 'patients' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Patient Database</h2>
                  <p className="text-xs text-slate-400">Manage records and reset passwords</p>
                </div>
                <button
                  onClick={() => setShowNewPatientModal(true)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Register Patient
                </button>
              </div>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[650px]">
                    <thead className="bg-slate-950 border-b border-slate-800 text-xs text-slate-400 uppercase">
                      <tr>
                        <th className="p-4">ID & Name</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Age / Gender</th>
                        <th className="p-4">Vitals BP</th>
                        <th className="p-4 text-right">Security</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {patients.map(p => (
                        <tr key={p.id} className="hover:bg-slate-800/50">
                          <td className="p-4">
                            <div className="font-bold text-white">{p.name}</div>
                            <div className="text-xs text-slate-500">{p.id}</div>
                          </td>
                          <td className="p-4">
                            <div>{p.phone}</div>
                            <div className="text-xs text-slate-400">{p.email}</div>
                          </td>
                          <td className="p-4">{p.age} y/o ({p.gender})</td>
                          <td className="p-4 font-mono text-xs">{p.vitals.systolic}/{p.vitals.diastolic} mmHg</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => triggerPasswordReset(p.id, 'patient')}
                              className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-slate-950 rounded-xl text-xs font-semibold"
                            >
                              Reset Password
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CLINICAL CHAT */}
          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto h-[550px] sm:h-[600px] bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-bold text-white text-base">Clinical Messaging</h3>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400">To:</label>
                  <select
                    value={chatRecipientId}
                    onChange={(e) => setChatRecipientId(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-white rounded-xl text-xs px-3 py-1.5 focus:outline-none"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Patient)</option>
                    ))}
                    {assistants.map(a => (
                      <option key={a.id} value={a.id}>{a.name} (Assistant)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map(msg => {
                  const isMe = msg.fromId === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="text-[10px] text-slate-400 mb-1">{msg.fromName} • {msg.timestamp}</div>
                      <div className={`p-3 rounded-2xl max-w-xs sm:max-w-sm text-sm ${
                        isMe ? 'bg-teal-500 text-slate-950 font-medium' : 'bg-slate-800 text-white border border-slate-700'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Type clinical message..."
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                />
                <button type="submit" className="px-4 py-2.5 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1">
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* ADD CLINICAL HISTORY MODAL */}
      {showAddHistoryModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Add Treatment Record</h3>
              <button onClick={() => setShowAddHistoryModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddHistoryRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Procedure</label>
                <input
                  type="text"
                  required
                  value={newHistoryEntry.procedure}
                  onChange={(e) => setNewHistoryEntry({ ...newHistoryEntry, procedure: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Tooth (e.g. #14, All)</label>
                <input
                  type="text"
                  required
                  value={newHistoryEntry.tooth}
                  onChange={(e) => setNewHistoryEntry({ ...newHistoryEntry, tooth: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Clinical Notes & Observations</label>
                <textarea
                  rows="3"
                  required
                  value={newHistoryEntry.notes}
                  onChange={(e) => setNewHistoryEntry({ ...newHistoryEntry, notes: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddHistoryModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs">
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CLINIC SCHEDULE MODAL */}
      {showEditClinicModal && activeClinic && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Edit Branch Schedule</h3>
              <button onClick={() => setShowEditClinicModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setClinics(clinics.map(c => c.id === activeClinic.id ? activeClinic : c));
                setShowEditClinicModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Branch Name</label>
                <input
                  type="text"
                  value={activeClinic.name}
                  onChange={(e) => setActiveClinic({ ...activeClinic, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Address / Location</label>
                <input
                  type="text"
                  value={activeClinic.address}
                  onChange={(e) => setActiveClinic({ ...activeClinic, address: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Operating Schedule</label>
                <input
                  type="text"
                  value={activeClinic.schedule}
                  onChange={(e) => setActiveClinic({ ...activeClinic, schedule: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowEditClinicModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW PATIENT MODAL */}
      {showNewPatientModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 w-full max-w-xl my-8">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base sm:text-lg">Register Patient & Initial Vitals</h3>
              <button onClick={() => setShowNewPatientModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newPatientData.name}
                    onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newPatientData.phone}
                    onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newPatientData.email}
                    onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={newPatientData.age}
                    onChange={(e) => setNewPatientData({ ...newPatientData, age: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase text-teal-400 mb-3">Pre-Anesthesia Vitals Baseline</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Systolic BP</label>
                    <input
                      type="number"
                      required
                      value={newPatientData.systolic}
                      onChange={(e) => setNewPatientData({ ...newPatientData, systolic: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Diastolic BP</label>
                    <input
                      type="number"
                      required
                      value={newPatientData.diastolic}
                      onChange={(e) => setNewPatientData({ ...newPatientData, diastolic: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Heart Rate</label>
                    <input
                      type="number"
                      required
                      value={newPatientData.hr}
                      onChange={(e) => setNewPatientData({ ...newPatientData, hr: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-teal-500 text-slate-950 rounded-xl text-xs font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="font-bold text-white text-lg mb-4">Book Dental Appointment</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newApt = {
                  id: `APT-${Date.now()}`,
                  patientId: currentUser.id,
                  patientName: currentUser.name,
                  service: bookingData.service,
                  clinicName: bookingData.clinicName,
                  date: bookingData.date || '2026-11-10',
                  time: bookingData.time,
                  status: 'Pending',
                  amount: bookingData.amount,
                  paid: false
                };
                setAppointments([...appointments, newApt]);
                setShowBookingModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Select Clinic Branch</label>
                <select
                  value={bookingData.clinicName}
                  onChange={(e) => setBookingData({ ...bookingData, clinicName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm"
                >
                  {clinics.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Service</label>
                <select
                  value={bookingData.service}
                  onChange={(e) => {
                    const price = e.target.value === 'Tooth Extraction' ? 1500 : e.target.value === 'Root Canal' ? 4500 : 1200;
                    setBookingData({ ...bookingData, service: e.target.value, amount: price });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm"
                >
                  <option value="Dental Cleaning">Dental Cleaning (₱1,200)</option>
                  <option value="Tooth Extraction">Tooth Extraction (₱1,500)</option>
                  <option value="Root Canal">Root Canal Treatment (₱4,500)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowBookingModal(false)} className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2.5 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GCASH PAYMENT MODAL */}
      {showPaymentModal && activePaymentApt && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm text-center">
            <h3 className="font-bold text-white text-lg mb-1">GCash Express Payment</h3>
            <p className="text-xs text-slate-400 mb-4">{activePaymentApt.service} - ₱{activePaymentApt.amount}</p>

            <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-lg">
              <QrCode className="w-32 h-32 sm:w-36 sm:h-36 text-slate-900 mx-auto" />
              <div className="text-[10px] text-slate-500 mt-2 font-mono">Merchant: DentiClinic Inc.</div>
            </div>

            <button
              onClick={() => {
                setAppointments(appointments.map(a => a.id === activePaymentApt.id ? { ...a, paid: true, status: 'Confirmed' } : a));
                setShowPaymentModal(false);
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-blue-600/20"
            >
              Simulate GCash Paid Confirmation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
