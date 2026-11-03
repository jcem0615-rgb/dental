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
  X,
  Bell,
  Building2,
  Stethoscope
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [showForcePasswordModal, setShowForcePasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  const [activeTab, setActiveTab] = useState('odontogram');

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'System Notice', text: 'Welcome to DentiClinic PWA enterprise platform.', time: 'Just now', read: false }
  ]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  const [patients, setPatients] = useState(() => {
    try {
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
            { id: 'H-1', date: '2026-08-14', procedure: 'Composite Filling', tooth: '#14', clinic: 'DentiClinic - Malasiqui Main', doctor: 'Dr. Estrada', notes: 'Restored occlusal caries with light-cured composite.' }
          ]
        }
      ];
    } catch {
      return [];
    }
  });

  const [assistants, setAssistants] = useState(() => {
    try {
      const saved = localStorage.getItem('denti_assistants');
      return saved ? JSON.parse(saved) : [
        { id: 'A-01', name: 'Nurse Joy', phone: '09190001111', email: 'joy@denticlinic.ph', password: 'password123', mustChangePassword: false }
      ];
    } catch {
      return [];
    }
  });

  const [clinics, setClinics] = useState(() => {
    try {
      const saved = localStorage.getItem('denti_clinics');
      return saved ? JSON.parse(saved) : [
        { id: 'C-1', name: 'DentiClinic - Malasiqui Main', address: 'Canan Norte, Malasiqui, Pangasinan', schedule: 'Mon, Wed, Fri: 9:00 AM - 5:00 PM', tin: '000-123-456-000' },
        { id: 'C-2', name: 'DentiClinic - Dagupan Branch', address: 'Tapuac District, Dagupan City', schedule: 'Tue, Thu, Sat: 9:00 AM - 4:00 PM', tin: '000-123-456-001' }
      ];
    } catch {
      return [];
    }
  });

  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem('denti_appointments');
      return saved ? JSON.parse(saved) : [
        { id: 'APT-1', patientId: 'P-101', patientName: 'Maria Santos', service: 'Tooth Extraction', clinicName: 'DentiClinic - Malasiqui Main', date: '2026-11-05', time: '10:00 AM', status: 'Confirmed', amount: 1500, paid: true }
      ];
    } catch {
      return [];
    }
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('denti_messages');
      return saved ? JSON.parse(saved) : [
        { id: 1, senderId: 'DOC-1', receiverId: 'P-101', senderName: 'Dr. Estrada', text: 'Hi Maria, please remember to fast 2 hours before your appointment.', timestamp: '10:30 AM' }
      ];
    } catch {
      return [];
    }
  });

  const [selectedPatientId, setSelectedPatientId] = useState('P-101');
  const [selectedTooth, setSelectedTooth] = useState(1);
  const [chatRecipientId, setChatRecipientId] = useState('P-101');
  const [chatInputText, setChatInputText] = useState('');

  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditClinicModal, setShowEditClinicModal] = useState(false);
  const [showAddHistoryModal, setShowAddHistoryModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [activeClinic, setActiveClinic] = useState(null);
  const [activePaymentApt, setActivePaymentApt] = useState(null);

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

  const [consultationData, setConsultationData] = useState({
    chiefComplaint: '', diagnosis: '', prescription: '', followUpDate: ''
  });

  useEffect(() => { localStorage.setItem('denti_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('denti_appointments', JSON.stringify(appointments)); }, [appointments]);
  useEffect(() => { localStorage.setItem('denti_messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('denti_assistants', JSON.stringify(assistants)); }, [assistants]);
  useEffect(() => { localStorage.setItem('denti_clinics', JSON.stringify(clinics)); }, [clinics]);

  const addNotification = (title, text) => {
    const newN = { id: Date.now(), title, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false };
    setNotifications(prev => [newN, ...prev]);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    if ((loginIdentifier === 'doctor' || loginIdentifier === 'admin@denticlinic.ph' || loginIdentifier === '09170000000') && loginPassword === 'admin123') {
      setCurrentUser({ id: 'DOC-1', name: 'Dr. Estrada, DDM', role: 'dentist', phone: '09170000000', email: 'admin@denticlinic.ph', mustChangePassword: false });
      setChatRecipientId('P-101');
      addNotification('Sign In', 'Logged in as Chief Dentist.');
      return;
    }

    const foundAssistant = assistants.find(a => (a.phone === loginIdentifier || a.email.toLowerCase() === loginIdentifier.toLowerCase()) && a.password === loginPassword);
    if (foundAssistant) {
      setCurrentUser({ ...foundAssistant, role: 'assistant' });
      setChatRecipientId('DOC-1');
      addNotification('Sign In', `Logged in as Assistant ${foundAssistant.name}.`);
      if (foundAssistant.mustChangePassword) setShowForcePasswordModal(true);
      return;
    }

    const foundPatient = patients.find(p => (p.phone === loginIdentifier || p.email.toLowerCase() === loginIdentifier.toLowerCase()) && p.password === loginPassword);
    if (foundPatient) {
      setCurrentUser({ ...foundPatient, role: 'patient' });
      setSelectedPatientId(foundPatient.id);
      setChatRecipientId('DOC-1');
      addNotification('Sign In', `Welcome back, ${foundPatient.name}.`);
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
    addNotification('Security', 'Password updated successfully.');
  };

  const triggerPasswordReset = (targetId, type) => {
    if (type === 'patient') {
      setPatients(prev => prev.map(p => p.id === targetId ? { ...p, password: 'password123', mustChangePassword: true } : p));
      setResetSuccessMessage(`Password for patient ${targetId} reset to 'password123'.`);
      addNotification('Security Audit', `Admin triggered password reset for patient ${targetId}.`);
    } else if (type === 'assistant') {
      setAssistants(prev => prev.map(a => a.id === targetId ? { ...a, password: 'password123', mustChangePassword: true } : a));
      setResetSuccessMessage(`Password for assistant ${targetId} reset to 'password123'.`);
    }
    setTimeout(() => setResetSuccessMessage(''), 4000);
  };

  const quickSwitch = (role) => {
    if (role === 'dentist') {
      setCurrentUser({ id: 'DOC-1', name: 'Dr. Estrada, DDM', role: 'dentist', email: 'admin@denticlinic.ph' });
      setChatRecipientId('P-101');
    } else if (role === 'assistant') {
      setCurrentUser({ id: 'A-01', name: 'Nurse Joy', role: 'assistant', email: 'joy@denticlinic.ph' });
      setChatRecipientId('DOC-1');
    } else if (role === 'patient') {
      setCurrentUser({ id: 'P-101', name: 'Maria Santos', role: 'patient', email: 'maria@example.com' });
      setSelectedPatientId('P-101');
      setChatRecipientId('DOC-1');
    }
    addNotification('Quick Switch', `Switched session role to ${role}.`);
  };

  const currentPatient = currentUser?.role === 'patient' 
    ? patients.find(p => p.id === currentUser.id) || patients[0] 
    : patients.find(p => p.id === selectedPatientId) || patients[0];

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
      age: parseInt(newPatientData.age, 10),
      password: newPatientData.password || 'password123',
      mustChangePassword: false,
      vitals: {
        systolic: parseInt(newPatientData.systolic, 10),
        diastolic: parseInt(newPatientData.diastolic, 10),
        hr: parseInt(newPatientData.hr, 10),
        spo2: parseInt(newPatientData.spo2, 10),
        temp: parseFloat(newPatientData.temp),
        weight: parseFloat(newPatientData.weight)
      },
      conditions: {},
      history: []
    };

    setPatients([newP, ...patients]);
    setSelectedPatientId(newId);
    setShowNewPatientModal(false);
    addNotification('Patient Registration', `Successfully registered patient ${newPatientData.name} (${newId}).`);
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
    addNotification('Clinical Charting', `Added procedure record for ${currentPatient.name}`);
  };

  const handleSaveConsultation = (e) => {
    e.preventDefault();
    if (!currentPatient) return;
    const entry = {
      id: `C-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      procedure: `Consultation: ${consultationData.chiefComplaint}`,
      tooth: 'General',
      clinic: 'DentiClinic - Main',
      doctor: currentUser.name,
      notes: `Diagnosis: ${consultationData.diagnosis} | Rx: ${consultationData.prescription} | Follow-up: ${consultationData.followUpDate || 'None'}`
    };

    setPatients(patients.map(p => {
      if (p.id === currentPatient.id) {
        return { ...p, history: [entry, ...(p.history || [])] };
      }
      return p;
    }));

    if (consultationData.followUpDate) {
      const followUpApt = {
        id: `APT-${Date.now()}`,
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        service: 'Follow-up Consultation',
        clinicName: 'DentiClinic - Malasiqui Main',
        date: consultationData.followUpDate,
        time: '10:00 AM',
        status: 'Scheduled',
        amount: 0,
        paid: true
      };
      setAppointments(prev => [followUpApt, ...prev]);
    }

    setShowConsultationModal(false);
    setConsultationData({ chiefComplaint: '', diagnosis: '', prescription: '', followUpDate: '' });
    addNotification('Consultation Saved', `Recorded consultation & follow-up for ${currentPatient.name}.`);
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
      senderId: currentUser.id,
      receiverId: chatRecipientId,
      senderName: currentUser.name,
      text: chatInputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setChatInputText('');
    addNotification('New Message', 'Message sent.');
  };

  const activeChatMessages = messages.filter(msg => 
    (msg.senderId === currentUser?.id && msg.receiverId === chatRecipientId) ||
    (msg.senderId === chatRecipientId && msg.receiverId === currentUser?.id)
  );

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
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
          <div className="relative">
            <button
              onClick={() => setShowNotificationCenter(!showNotificationCenter)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-400"></span>
              )}
            </button>

            {showNotificationCenter && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
                  <h4 className="font-bold text-xs uppercase text-slate-300">System Notifications</h4>
                  <button
                    onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                    className="text-[10px] text-teal-400 hover:underline"
                  >
                    Mark read
                  </button>
                </div>
                <div className="space-y-2.5 max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50 text-xs">
                      <div className="flex justify-between font-semibold text-white mb-0.5">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-slate-300">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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

      {resetSuccessMessage && (
        <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-4 py-2.5 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{resetSuccessMessage}</span>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row">
        <nav className="bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 w-full md:w-64 p-3 flex md:flex-col gap-1.5 overflow-x-auto shrink-0">
          {[
            { id: 'odontogram', label: 'Odontogram', icon: Activity, roles: ['dentist', 'assistant', 'patient'] },
            { id: 'consultation', label: 'Consultations & Follow-up', icon: Stethoscope, roles: ['dentist', 'assistant'] },
            { id: 'history', label: 'Medical History', icon: FileText, roles: ['dentist', 'assistant', 'patient'] },
            { id: 'clinics', label: 'Clinics & Branches', icon: Building2, roles: ['dentist', 'assistant', 'patient'] },
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

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
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
                        <option key={p.id} value={p.id}>{p.name} ({p.
