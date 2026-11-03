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
  Printer,
  X
} from 'lucide-react';

export default function App() {
  // Auth State
  const [currentUser, setCurrentUser] = useState(null); // { id, name, role: 'dentist'|'assistant'|'patient', phone, email, mustChangePassword }
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Password Reset / Change State
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

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('denti_appointments');
    return saved ? JSON.parse(saved) : [
      { id: 'APT-1', patientId: 'P-101', patientName: 'Maria Santos', service: 'Tooth Extraction', date: '2026-11-05', time: '10:00 AM', status: 'Confirmed', amount: 1500, paid: true },
      { id: 'APT-2', patientId: 'P-102', patientName: 'Juan Dela Cruz', service: 'Dental Cleaning', date: '2026-11-06', time: '02:00 PM', status: 'Pending', amount: 1200, paid: false }
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
  const [selectedCondition, setSelectedCondition] = useState('Caries');
  const [chatRecipientId, setChatRecipientId] = useState('P-101');
  const [chatInputText, setChatInputText] = useState('');

  // Modals & UI Controls
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRxModal, setShowRxModal] = useState(false);
  const [activePaymentApt, setActivePaymentApt] = useState(null);

  // Form States
  const [newPatientData, setNewPatientData] = useState({
    name: '', phone: '', email: '', gender: 'Female', age: 30, password: 'password123',
    systolic: 120, diastolic: 80, hr: 72, spo2: 98, temp: 36.5, weight: 60
  });

  const [bookingData, setBookingData] = useState({
    service: 'Dental Cleaning', date: '', time: '09:00 AM', amount: 1200
  });

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem('denti_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('denti_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('denti_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('denti_assistants', JSON.stringify(assistants)); }, [assistants]);

  // Login Handler
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    // Doctor Hardcoded Check
    if ((loginIdentifier === 'doctor' || loginIdentifier === 'admin@denticlinic.ph' || loginIdentifier === '09170000000') && loginPassword === 'admin123') {
      const docUser = { id: 'DOC-1', name: 'Dr. Estrada, DDM', role: 'dentist', phone: '09170000000', email: 'admin@denticlinic.ph', mustChangePassword: false };
      setCurrentUser(docUser);
      return;
    }

    // Assistant Check
    const foundAssistant = assistants.find(a => (a.phone === loginIdentifier || a.email.toLowerCase() === loginIdentifier.toLowerCase()) && a.password === loginPassword);
    if (foundAssistant) {
      const userObj = { ...foundAssistant, role: 'assistant' };
      setCurrentUser(userObj);
      if (foundAssistant.mustChangePassword) setShowForcePasswordModal(true);
      return;
    }

    // Patient Check
    const foundPatient = patients.find(p => (p.phone === loginIdentifier || p.email.toLowerCase() === loginIdentifier.toLowerCase()) && p.password === loginPassword);
    if (foundPatient) {
      const userObj = { ...foundPatient, role: 'patient' };
      setCurrentUser(userObj);
      setSelectedPatientId(foundPatient.id);
      if (foundPatient.mustChangePassword) setShowForcePasswordModal(true);
      return;
    }

    setAuthError('Invalid credentials. Check your email/phone number or password.');
  };

  // Force Password Change Handler
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

  // Reset Password (Admin / Staff Trigger)
  const triggerPasswordReset = (targetId, type) => {
    if (type === 'patient') {
      setPatients(prev => prev.map(p => p.id === targetId ? { ...p, password: 'password123', mustChangePassword: true } : p));
      setResetSuccessMessage(`Password for patient ${targetId} reset to 'password123'. Next login requires change.`);
    } else if (type === 'assistant') {
      setAssistants(prev => prev.map(a => a.id === targetId ? { ...a, password: 'password123', mustChangePassword: true } : a));
      setResetSuccessMessage(`Password for assistant ${targetId} reset to 'password123'. Next login requires change.`);
    }
    setTimeout(() => setResetSuccessMessage(''), 4000);
  };

  // Quick Demo Login Switcher
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

  // Current Selected Patient Data
  const currentPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Pre-Anesthesia BP Evaluation
  const isHypertensive = (sys, dia) => sys >= 140 || dia >= 90;

  // Add Patient Handler
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

  // Toggle Tooth Condition
  const updateToothCondition = (toothNum, cond) => {
    if (!currentPatient) return;
    setPatients(patients.map(p => {
      if (p.id === currentPatient.id) {
        const nextConds = { ...p.conditions, [toothNum]: cond };
        return { ...p, conditions: nextConds };
      }
      return p;
    }));
  };

  // Send Chat Message
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
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Phone Number or Email</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="09171234567 or email@domain.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold py-2.5 rounded-xl transition duration-200"
            >
              Sign In to Account
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400 text-center mb-3">Quick Demo Access (Click to Test Role):</p>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => quickSwitch('dentist')} className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-teal-400">
                Dentist
              </button>
              <button onClick={() => quickSwitch('assistant')} className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-amber-400">
                Assistant
              </button>
              <button onClick={() => quickSwitch('patient')} className="py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-blue-400">
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
            Your account password was reset by clinic administration. Please set a new password before continuing.
          </p>

          {passwordError && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-sm">
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
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold py-2.5 rounded-xl text-sm"
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

      {/* Global Admin Reset Banner Notice */}
      {resetSuccessMessage && (
        <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-4 py-2 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{resetSuccessMessage}</span>
        </div>
      )}

      {/* Main Layout Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Mobile / Sidebar Navigation Tabs */}
        <nav className="bg-slate-900 border-r border-slate-800 w-full md:w-64 p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
          {[
            { id: 'odontogram', label: 'Odontogram', icon: Activity, roles: ['dentist', 'assistant', 'patient'] },
            { id: 'vitals', label: 'Vital Signs', icon: ShieldAlert, roles: ['dentist', 'assistant'] },
            { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['dentist', 'assistant', 'patient'] },
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition shrink-0 ${
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

        {/* Content Panel */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* TAB 1: ODONTOGRAM CHART & DENTAL MAP */}
          {activeTab === 'odontogram' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">32-Tooth Universal Odontogram</h2>
                  <p className="text-xs text-slate-400">Select patient and map dental conditions & surfaces</p>
                </div>

                {currentUser.role !== 'patient' && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400">Patient:</label>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-white rounded-xl text-xs px-3 py-2 focus:outline-none focus:border-teal-500"
                    >
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Hypertensive Alert Indicator */}
              {currentPatient && isHypertensive(currentPatient.vitals.systolic, currentPatient.vitals.diastolic) && (
                <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-center gap-3 text-rose-400">
                  <AlertTriangle className="w-6 h-6 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-sm text-rose-300">Pre-Anesthesia Hypertension Warning</h4>
                    <p className="text-xs text-rose-400/90 mt-0.5">
                      Patient BP is {currentPatient.vitals.systolic}/{currentPatient.vitals.diastolic} mmHg. Exercise extreme caution prior to administering vasoconstrictor local anesthesia.
                    </p>
                  </div>
                </div>
              )}

              {/* Tooth Map Grid */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-8">
                {/* Upper Arch */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">Upper Arch (Maxillary)</h3>
                  <div className="grid grid-cols-8 sm:grid-cols-16 gap-2">
                    {Array.from({ length: 16 }, (_, i) => i + 1).map(num => {
                      const cond = currentPatient?.conditions[num];
                      return (
                        <button
                          key={num}
                          onClick={() => setSelectedTooth(num)}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-between text-xs transition min-h-[64px] ${
                            selectedTooth === num
                              ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                              : cond === 'Caries'
                              ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                              : cond === 'Extracted'
                              ? 'border-slate-700 bg-slate-950 text-slate-600 line-through'
                              : 'border-slate-800 bg-slate-800/50 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400">#{num}</span>
                          <span className="font-bold text-xs my-1">{cond ? cond[0] : '✓'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lower Arch */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">Lower Arch (Mandibular)</h3>
                  <div className="grid grid-cols-8 sm:grid-cols-16 gap-2">
                    {Array.from({ length: 16 }, (_, i) => 32 - i).map(num => {
                      const cond = currentPatient?.conditions[num];
                      return (
                        <button
                          key={num}
                          onClick={() => setSelectedTooth(num)}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-between text-xs transition min-h-[64px] ${
                            selectedTooth === num
                              ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                              : cond === 'Caries'
                              ? 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                              : cond === 'Extracted'
                              ? 'border-slate-700 bg-slate-950 text-slate-600 line-through'
                              : 'border-slate-800 bg-slate-800/50 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400">#{num}</span>
                          <span className="font-bold text-xs my-1">{cond ? cond[0] : '✓'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tooth Editor Controls */}
                {currentUser.role !== 'patient' && (
                  <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">Selected Tooth: #{selectedTooth}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {['Healthy', 'Caries', 'Filled', 'Extracted', 'Crown', 'Root Canal'].map(cond => (
                        <button
                          key={cond}
                          onClick={() => updateToothCondition(selectedTooth, cond)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 hover:border-teal-500 text-slate-300"
                        >
                          Mark {cond}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: VITAL SIGNS LOGGING & SAFETY INTAKE */}
          {activeTab === 'vitals' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Pre-Anesthesia Vital Signs Intake</h2>
                  <p className="text-xs text-slate-400">Log patient blood pressure and cardiovascular indicators</p>
                </div>
              </div>

              {currentPatient && (
                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="font-bold text-white text-base">{currentPatient.name}</h3>
                      <p className="text-xs text-slate-400">ID: {currentPatient.id} | Age: {currentPatient.age} | Gender: {currentPatient.gender}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isHypertensive(currentPatient.vitals.systolic, currentPatient.vitals.diastolic)
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {isHypertensive(currentPatient.vitals.systolic, currentPatient.vitals.diastolic) ? 'Hypertensive Warning' : 'Normal Anesthesia Risk'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="text-xs text-slate-400 mb-1">Blood Pressure</div>
                      <div className="text-xl font-bold text-white">{currentPatient.vitals.systolic} / {currentPatient.vitals.diastolic} <span className="text-xs text-slate-400">mmHg</span></div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="text-xs text-slate-400 mb-1">Heart Rate</div>
                      <div className="text-xl font-bold text-white">{currentPatient.vitals.hr} <span className="text-xs text-slate-400">bpm</span></div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="text-xs text-slate-400 mb-1">Oxygen Saturation</div>
                      <div className="text-xl font-bold text-white">{currentPatient.vitals.spo2}%</div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="text-xs text-slate-400 mb-1">Temperature</div>
                      <div className="text-xl font-bold text-white">{currentPatient.vitals.temp} °C</div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="text-xs text-slate-400 mb-1">Body Weight</div>
                      <div className="text-xl font-bold text-white">{currentPatient.vitals.weight} kg</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: APPOINTMENTS & GCASH PAYMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Clinic Appointments & Billing</h2>
                  <p className="text-xs text-slate-400">Schedule bookings and manage GCash payment invoices</p>
                </div>
                {currentUser.role === 'patient' && (
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Book Appointment
                  </button>
                )}
              </div>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 border-b border-slate-800 text-xs text-slate-400 uppercase">
                    <tr>
                      <th className="p-4">Patient</th>
                      <th className="p-4">Service</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {appointments.map(apt => (
                      <tr key={apt.id} className="hover:bg-slate-800/50">
                        <td className="p-4 font-semibold text-white">{apt.patientName}</td>
                        <td className="p-4">{apt.service}</td>
                        <td className="p-4">{apt.date} at {apt.time}</td>
                        <td className="p-4 font-bold text-white">₱{apt.amount}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            apt.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {apt.paid ? (
                            <span className="text-xs text-emerald-400 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Paid via GCash
                            </span>
                          ) : (
                            <button
                              onClick={() => { setActivePaymentApt(apt); setShowPaymentModal(true); }}
                              className="px-3 py-1 bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500 hover:text-slate-950 rounded-lg text-xs font-semibold"
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
          )}

          {/* TAB 4: PATIENTS LIST & STAFF PASSWORD RESET */}
          {activeTab === 'patients' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white">Patient Database & Credentials</h2>
                  <p className="text-xs text-slate-400">Register new records and manage login password resets</p>
                </div>
                <button
                  onClick={() => setShowNewPatientModal(true)}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Register Patient
                </button>
              </div>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 border-b border-slate-800 text-xs text-slate-400 uppercase">
                    <tr>
                      <th className="p-4">ID & Name</th>
                      <th className="p-4">Contact Details</th>
                      <th className="p-4">Age / Gender</th>
                      <th className="p-4">Vitals BP</th>
                      <th className="p-4 text-right">Password Control</th>
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
                            className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-slate-950 rounded-lg text-xs font-semibold"
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
          )}

          {/* TAB 5: CLINICAL MESSAGING CHAT */}
          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto h-[600px] bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-white text-base">Clinical Messaging</h3>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400">Recipient:</label>
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

              {/* Chat Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map(msg => {
                  const isMe = msg.fromId === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="text-[10px] text-slate-400 mb-1">{msg.fromName} • {msg.timestamp}</div>
                      <div className={`p-3 rounded-2xl max-w-sm text-sm ${
                        isMe ? 'bg-teal-500 text-slate-950 font-medium' : 'bg-slate-800 text-white border border-slate-700'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Type clinical message..."
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
                />
                <button type="submit" className="px-4 py-2 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1">
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* NEW PATIENT MODAL WITH INTEGRATED VITALS INTAKE */}
      {showNewPatientModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl my-8">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-lg">Register Patient & Initial Vitals</h3>
              <button onClick={() => setShowNewPatientModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* Vitals Fillup Section */}
              <div className="pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase text-teal-400 mb-3">Pre-Anesthesia Baseline Vitals</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Systolic BP (mmHg)</label>
                    <input
                      type="number"
                      required
                      value={newPatientData.systolic}
                      onChange={(e) => setNewPatientData({ ...newPatientData, systolic: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Diastolic BP (mmHg)</label>
                    <input
                      type="number"
                      required
                      value={newPatientData.diastolic}
                      onChange={(e) => setNewPatientData({ ...newPatientData, diastolic: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      required
                      value={newPatientData.hr}
                      onChange={(e) => setNewPatientData({ ...newPatientData, hr: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-sm text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-slate-950 rounded-xl text-xs font-bold"
                >
                  Save Patient Record
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
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Dental Procedure</label>
                <select
                  value={bookingData.service}
                  onChange={(e) => {
                    const price = e.target.value === 'Tooth Extraction' ? 1500 : e.target.value === 'Root Canal' ? 4500 : 1200;
                    setBookingData({ ...bookingData, service: e.target.value, amount: price });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                >
                  <option value="Dental Cleaning">Dental Cleaning (₱1,200)</option>
                  <option value="Tooth Extraction">Tooth Extraction (₱1,500)</option>
                  <option value="Root Canal">Root Canal Treatment (₱4,500)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Appointment Date</label>
                <input
                  type="date"
                  required
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowBookingModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs">
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
              <QrCode className="w-36 h-36 text-slate-900 mx-auto" />
              <div className="text-[10px] text-slate-500 mt-2 font-mono">Merchant: DentiClinic Inc.</div>
            </div>

            <button
              onClick={() => {
                setAppointments(appointments.map(a => a.id === activePaymentApt.id ? { ...a, paid: true, status: 'Confirmed' } : a));
                setShowPaymentModal(false);
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition"
            >
              Simulate GCash Paid Confirmation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
