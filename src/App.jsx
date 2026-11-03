import React, { useState } from 'react';

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

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedSalesDate, setSelectedSalesDate] = useState(todayStr);

  const [notifications, setNotifications] = useState([
    { id: 1, targetRole: 'all', title: 'System Notice', text: 'Welcome to DentiClinic PWA enterprise platform.', time: 'Just now', read: false }
  ]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState('all');

  const [patients, setPatients] = useState([
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
        { id: 'H-2', date: '2026-09-01', procedure: 'Tooth Extraction', tooth: '#19', clinic: 'DentiClinic - Dagupan Branch', doctor: 'Dr. Estrada', notes: 'Extracted severely decayed molar under local anesthesia.' }
      ]
    }
  ]);

  const [assistants, setAssistants] = useState([
    { id: 'A-01', name: 'Nurse Joy', phone: '09190001111', email: 'joy@denticlinic.ph', password: 'password123', mustChangePassword: false }
  ]);

  const [clinics, setClinics] = useState([
    { id: 'C-1', name: 'DentiClinic - Malasiqui Main', address: 'Canan Norte, Malasiqui, Pangasinan', schedule: 'Mon, Wed, Fri: 9:00 AM - 5:00 PM', tin: '000-123-456-000' },
    { id: 'C-2', name: 'DentiClinic - Dagupan Branch', address: 'Tapuac District, Dagupan City', schedule: 'Tue, Thu, Sat: 9:00 AM - 4:00 PM', tin: '000-123-456-001' }
  ]);

  const [appointments, setAppointments] = useState([
    { id: 'APT-1', patientId: 'P-101', patientName: 'Maria Santos', service: 'Tooth Extraction', clinicName: 'DentiClinic - Malasiqui Main', date: new Date().toISOString().split('T')[0], time: '10:00 AM', status: 'Queued', amount: 1500, paid: true, paymentMethod: 'GCash' },
    { id: 'APT-2', patientId: 'P-102', patientName: 'Juan Dela Cruz', service: 'Dental Cleaning', clinicName: 'DentiClinic - Malasiqui Main', date: new Date().toISOString().split('T')[0], time: '02:00 PM', status: 'Waiting', amount: 1200, paid: true, paymentMethod: 'Cash' }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, senderId: 'DOC-1', receiverId: 'P-101', senderName: 'Dr. Estrada', text: 'Hi Maria, please remember to fast 2 hours before your appointment.', timestamp: '10:30 AM' }
  ]);

  const [selectedPatientId, setSelectedPatientId] = useState('P-101');
  const [selectedTooth, setSelectedTooth] = useState(1);
  const [chatRecipientId, setChatRecipientId] = useState('P-101');
  const [chatInputText, setChatInputText] = useState('');

  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
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

  const [walkInData, setWalkInData] = useState({
    name: '', phone: '', email: '', gender: 'Female', age: 30,
    service: 'Dental Consultation', customService: '', amount: 500,
    systolic: 120, diastolic: 80, hr: 72, spo2: 98, temp: 36.5, weight: 60
  });

  const [bookingData, setBookingData] = useState({
    service: 'Dental Cleaning', customService: '', clinicName: 'DentiClinic - Malasiqui Main', date: '', time: '09:00 AM'
  });

  const [newHistoryEntry, setNewHistoryEntry] = useState({
    procedure: 'Composite Filling', tooth: '#1', clinic: 'DentiClinic - Malasiqui Main', doctor: 'Dr. Estrada', notes: ''
  });

  const [consultationData, setConsultationData] = useState({
    service: 'Dental Consultation', customService: '', amount: 500, chiefComplaint: '', diagnosis: '', prescription: '', followUpDate: ''
  });

  const addNotification = (title, text, targetRole = 'all') => {
    const newN = { 
      id: Date.now(), 
      targetRole, 
      title, 
      text, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      read: false 
    };
    setNotifications(prev => [newN, ...prev]);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    if ((loginIdentifier === 'doctor' || loginIdentifier === 'admin@denticlinic.ph' || loginIdentifier === '09170000000') && loginPassword === 'admin123') {
      setCurrentUser({ id: 'DOC-1', name: 'Dr. Estrada, DDM', role: 'dentist', phone: '09170000000', email: 'admin@denticlinic.ph', mustChangePassword: false });
      setActiveTab('odontogram');
      setChatRecipientId('P-101');
      addNotification('Sign In', 'Logged in as Chief Dentist.', 'staff');
      return;
    }

    const foundAssistant = assistants.find(a => (a.phone === loginIdentifier || a.email.toLowerCase() === loginIdentifier.toLowerCase()) && a.password === loginPassword);
    if (foundAssistant) {
      setCurrentUser({ ...foundAssistant, role: 'assistant' });
      setActiveTab('odontogram');
      setChatRecipientId('DOC-1');
      addNotification('Sign In', `Logged in as Assistant ${foundAssistant.name}.`, 'staff');
      if (foundAssistant.mustChangePassword) setShowForcePasswordModal(true);
      return;
    }

    const foundPatient = patients.find(p => (p.phone === loginIdentifier || p.email.toLowerCase() === loginIdentifier.toLowerCase()) && p.password === loginPassword);
    if (foundPatient) {
      setCurrentUser({ ...foundPatient, role: 'patient' });
      setActiveTab('odontogram');
      setSelectedPatientId(foundPatient.id);
      setChatRecipientId('DOC-1');
      addNotification('Sign In', `Welcome back, ${foundPatient.name}.`, 'patient');
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

    if (currentUser?.role === 'patient') {
      setPatients(prev => prev.map(p => p.id === currentUser.id ? { ...p, password: newPassword, mustChangePassword: false } : p));
    } else if (currentUser?.role === 'assistant') {
      setAssistants(prev => prev.map(a => a.id === currentUser.id ? { ...a, password: newPassword, mustChangePassword: false } : a));
    }

    setCurrentUser(prev => ({ ...prev, mustChangePassword: false }));
    setShowForcePasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    addNotification('Security', 'Password updated successfully.', currentUser?.role === 'patient' ? 'patient' : 'staff');
  };

  const triggerPasswordReset = (targetId, type) => {
    if (type === 'patient') {
      setPatients(prev => prev.map(p => p.id === targetId ? { ...p, password: 'password123', mustChangePassword: true } : p));
      setResetSuccessMessage(`Password for patient ${targetId} reset to 'password123'.`);
      addNotification('Security Audit', `Admin triggered password reset for patient ${targetId}.`, 'staff');
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
    setActiveTab('odontogram');
    addNotification('Quick Switch', `Switched session role to ${role}.`, role === 'patient' ? 'patient' : 'staff');
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
    addNotification('Patient Registration', `Successfully registered patient ${newPatientData.name} (${newId}) with baseline vitals.`, 'staff');
  };

  const handleRegisterWalkIn = (e) => {
    e.preventDefault();
    const finalServiceName = walkInData.service === 'Custom Service' ? walkInData.customService : walkInData.service;
    const newId = `P-${Math.floor(100 + Math.random() * 900)}`;
    const newP = {
      id: newId,
      name: walkInData.name,
      phone: walkInData.phone,
      email: walkInData.email || `${newId.toLowerCase()}@walkin.ph`,
      gender: walkInData.gender,
      age: parseInt(walkInData.age, 10),
      password: 'password123',
      mustChangePassword: false,
      vitals: {
        systolic: parseInt(walkInData.systolic, 10),
        diastolic: parseInt(walkInData.diastolic, 10),
        hr: parseInt(walkInData.hr, 10),
        spo2: parseInt(walkInData.spo2, 10),
        temp: parseFloat(walkInData.temp),
        weight: parseFloat(walkInData.weight)
      },
      conditions: {},
      history: []
    };

    const newApt = {
      id: `APT-${Date.now()}`,
      patientId: newId,
      patientName: walkInData.name,
      service: finalServiceName,
      clinicName: 'DentiClinic - Malasiqui Main',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Queued',
      amount: parseFloat(walkInData.amount) || 0,
      paid: false,
      paymentMethod: 'Cash'
    };

    setPatients([newP, ...patients]);
    setAppointments([newApt, ...appointments]);
    setShowWalkInModal(false);
    addNotification('Walk-In Queued', `Created profile & queued walk-in patient ${walkInData.name}.`, 'staff');
  };

  const handleCallPatientInQueue = (apt) => {
    setAppointments(appointments.map(a => {
      if (a.id === apt.id) return { ...a, status: 'In-Chair' };
      if (a.status === 'In-Chair') return { ...a, status: 'Completed' };
      return a;
    }));
    setSelectedPatientId(apt.patientId);
    addNotification('Patient Called In', `Doctor called ${apt.patientName} into the chair.`, 'staff');
    addNotification('Chair Called', `Dr. Estrada called you into the chair! Please proceed.`, 'patient');
  };

  const handleSaveConsultation = (e) => {
    e.preventDefault();
    if (!currentPatient) return;
    const finalServiceName = consultationData.service === 'Custom Service' ? consultationData.customService : consultationData.service;
    
    const entry = {
      id: `C-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      procedure: `${finalServiceName}: ${consultationData.chiefComplaint}`,
      tooth: 'General',
      clinic: 'DentiClinic - Main',
      doctor: currentUser?.name || 'Dr. Estrada',
      notes: `Diagnosis: ${consultationData.diagnosis} | Rx: ${consultationData.prescription} | Follow-up: ${consultationData.followUpDate || 'None'}`
    };

    setPatients(patients.map(p => {
      if (p.id === currentPatient.id) {
        return { ...p, history: [entry, ...(p.history || [])] };
      }
      return p;
    }));

    const activeApt = appointments.find(a => a.patientId === currentPatient.id && a.status === 'In-Chair');
    if (activeApt) {
      setAppointments(appointments.map(a => a.id === activeApt.id ? { ...a, service: finalServiceName, amount: parseFloat(consultationData.amount) || 0, status: 'Completed' } : a));
    } else {
      const newApt = {
        id: `APT-${Date.now()}`,
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        service: finalServiceName,
        clinicName: 'DentiClinic - Malasiqui Main',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Completed',
        amount: parseFloat(consultationData.amount) || 0,
        paid: false,
        paymentMethod: 'Cash'
      };
      setAppointments(prev => [newApt, ...prev]);
    }

    if (consultationData.followUpDate) {
      const followUpApt = {
        id: `APT-${Date.now() + 1}`,
        patientId: currentPatient.id,
        patientName: currentPatient.name,
        service: 'Follow-up Consultation',
        clinicName: 'DentiClinic - Malasiqui Main',
        date: consultationData.followUpDate,
        time: '10:00 AM',
        status: 'Queued',
        amount: 0,
        paid: true,
        paymentMethod: 'Cash'
      };
      setAppointments(prev => [followUpApt, ...prev]);
    }

    setShowConsultationModal(false);
    setConsultationData({ service: 'Dental Consultation', customService: '', amount: 500, chiefComplaint: '', diagnosis: '', prescription: '', followUpDate: '' });
    addNotification('Encounter Saved', `Recorded clinical service and updated billing for ${currentPatient.name}.`, 'staff');
    addNotification('New Bill Available', `Your bill of ₱${consultationData.amount} for ${finalServiceName} has been posted.`, 'patient');
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
      doctor: currentUser?.name || 'Dr. Estrada',
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
    addNotification('History Record Added', `Added treatment record for ${currentPatient.name}.`, 'staff');
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
    addNotification('New Message', 'Message sent.', 'all');
  };

  const activeChatMessages = messages.filter(msg => 
    (msg.senderId === currentUser?.id && msg.receiverId === chatRecipientId) ||
    (msg.senderId === chatRecipientId && msg.receiverId === currentUser?.id)
  );

  const currentMonthStr = selectedSalesDate ? selectedSalesDate.substring(0, 7) : todayStr.substring(0, 7);

  const allPaidAppointments = appointments.filter(apt => apt.paid);
  
  const selectedDatePaidAppointments = allPaidAppointments.filter(apt => apt.date === selectedSalesDate);
  const totalSelectedDateSales = selectedDatePaidAppointments.reduce((sum, apt) => sum + (apt.amount || 0), 0);
  const cashSelectedDateSales = selectedDatePaidAppointments.filter(apt => (apt.paymentMethod || 'cash').toLowerCase() === 'cash').reduce((sum, apt) => sum + (apt.amount || 0), 0);
  const gcashSelectedDateSales = selectedDatePaidAppointments.filter(apt => (apt.paymentMethod || '').toLowerCase() === 'gcash').reduce((sum, apt) => sum + (apt.amount || 0), 0);

  const monthlyPaidAppointments = allPaidAppointments.filter(apt => apt.date && apt.date.startsWith(currentMonthStr));
  const totalMonthlySales = monthlyPaidAppointments.reduce((sum, apt) => sum + (apt.amount || 0), 0);
  const cashMonthlySales = monthlyPaidAppointments.filter(apt => (apt.paymentMethod || 'cash').toLowerCase() === 'cash').reduce((sum, apt) => sum + (apt.amount || 0), 0);
  const gcashMonthlySales = monthlyPaidAppointments.filter(apt => (apt.paymentMethod || '').toLowerCase() === 'gcash').reduce((sum, apt) => sum + (apt.amount || 0), 0);

  const activeChairPatient = appointments.find(a => a.status === 'In-Chair');

  const visibleNotifications = notifications.filter(n => {
    if (currentUser?.role === 'patient') {
      if (n.targetRole !== 'all' && n.targetRole !== 'patient') return false;
    } else {
      if (n.targetRole === 'patient') return false;
    }

    if (notificationFilter === 'unread') return !n.read;
    if (notificationFilter === 'read') return n.read;
    return true;
  });

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
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-white">DentiClinic PWA</h1>
            <p className="text-slate-400 text-sm mt-1">Dental Practice & Patient Portal</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Phone Number or Email</label>
              <div className="relative">
                <svg className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <input
                  type="text"
                  required
                  placeholder="09171234567 or email@domain.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Password</label>
              <div className="relative">
                <svg className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-10 py-3 text-sm text-white focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
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
              <button onClick={() => quickSwitch('dentist')} className="py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-teal-400">
                Dentist
              </button>
              <button onClick={() => quickSwitch('assistant')} className="py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-amber-400">
                Assistant
              </button>
              <button onClick={() => quickSwitch('patient')} className="py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-blue-400">
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
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl text-slate-100">
          <div className="flex items-center gap-3 text-amber-400 mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
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
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
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
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h1 className="font-bold text-white text-base leading-tight">DentiClinic PWA</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 capitalize">{currentUser?.role} Portal</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowNotificationCenter(!showNotificationCenter)}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition relative"
              title="Notifications"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              {notifications.some(n => !n.read && (currentUser?.role === 'patient' ? (n.targetRole === 'all' || n.targetRole === 'patient') : n.targetRole !== 'patient')) && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-400"></span>
              )}
            </button>

            {showNotificationCenter && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-slate-100">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
                  <h4 className="font-bold text-xs uppercase text-slate-300">System Notifications</h4>
                  <button
                    onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                    className="text-[10px] text-teal-400 hover:underline"
                  >
                    Mark read
                  </button>
                </div>

                <div className="flex items-center gap-1.5 mb-3 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {['all', 'unread', 'read'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setNotificationFilter(filter)}
                      className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition ${
                        notificationFilter === filter
                          ? 'bg-teal-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto">
                  {visibleNotifications.length > 0 ? (
                    visibleNotifications.map(n => (
                      <div key={n.id} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs">
                        <div className="flex justify-between font-semibold text-white mb-0.5">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-slate-300">{n.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      No notifications found for this filter.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-white">{currentUser?.name}</div>
            <div className="text-xs text-slate-400">{currentUser?.email || currentUser?.phone}</div>
          </div>
          <button
            onClick={() => setCurrentUser(null)}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition"
            title="Log Out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </header>

      {currentUser?.role === 'patient' && (
        (() => {
          const myActiveApt = appointments.find(a => a.patientId === currentUser.id && a.status === 'In-Chair');
          const myQueuedApt = appointments.find(a => a.patientId === currentUser.id && a.status === 'Queued');
          if (myActiveApt) {
            return (
              <div className="bg-teal-500 text-slate-950 px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" /></svg>
                  <span>Dr. Estrada is calling you into the chair! Please proceed to the dental room.</span>
                </div>
                <span className="bg-slate-950 text-teal-400 px-2 py-0.5 rounded-lg text-[10px]">IN-CHAIR</span>
              </div>
            );
          }
          if (myQueuedApt) {
            return (
              <div className="bg-slate-900 border-b border-teal-500/30 text-slate-200 px-4 py-2 text-xs flex items-center justify-between">
                <div>Queue Status: <span className="text-teal-400 font-bold">Queued for {myQueuedApt.service}</span> ({myQueuedApt.clinicName})</div>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold">WAITING</span>
              </div>
            );
          }
          return null;
        })()
      )}

      {resetSuccessMessage && (
        <div className="bg-emerald-500/20 border-b border-emerald-500/30 px-4 py-2.5 text-xs text-emerald-300 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          <span>{resetSuccessMessage}</span>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row bg-slate-950">
        <nav className="bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 w-full md:w-64 p-3 flex md:flex-col gap-1.5 overflow-x-auto shrink-0">
          {[
            { id: 'odontogram', label: 'Odontogram', roles: ['dentist', 'assistant', 'patient'] },
            { id: 'consultation', label: 'Consultation & Queue', roles: ['dentist', 'assistant'] },
            { id: 'history', label: 'Medical History', roles: ['dentist', 'assistant', 'patient'] },
            { id: 'clinics', label: 'Clinics & Branches', roles: ['dentist', 'assistant', 'patient'] },
            { id: 'appointments', label: 'Appointments & Billing', roles: ['dentist', 'assistant', 'patient'] },
            { id: 'sales', label: 'Daily History & Monitoring', roles: ['dentist', 'assistant'] },
            { id: 'patients', label: 'Patients List', roles: ['dentist', 'assistant'] },
            { id: 'chat', label: 'Clinical Chat', roles: ['dentist', 'assistant', 'patient'] },
          ]
            .filter(tab => tab.roles.includes(currentUser?.role))
            .map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition shrink-0 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
        </nav>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-950 text-slate-100">
          {activeTab === 'odontogram' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">32-Tooth Universal Odontogram</h2>
                  <p className="text-xs text-slate-400">Click any tooth to examine or update its medical condition</p>
                </div>

                {currentUser?.role !== 'patient' && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label className="text-xs text-slate-400 shrink-0">Patient:</label>
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="w-full sm:w-auto bg-slate-900 text-white border border-slate-800 rounded-xl text-xs px-3 py-2 focus:outline-none focus:border-teal-500 [color-scheme:dark]"
                    >
                      {patients.map(p => (
                        <option key={p.id} value={p.id} className="bg-slate-900 text-white">{p.name} ({p.id})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {currentPatient && isHypertensive(currentPatient.vitals.systolic, currentPatient.vitals.diastolic) && (
                <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-start sm:items-center gap-3 text-rose-400">
                  <svg className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <div>
                    <h4 className="font-semibold text-sm text-rose-300">Pre-Anesthesia Hypertension Warning</h4>
                    <p className="text-xs text-rose-400/90 mt-0.5">
                      Patient BP is {currentPatient.vitals.systolic}/{currentPatient.vitals.diastolic} mmHg. Exercise caution with vasoconstrictor anesthetics.
                    </p>
                  </div>
                </div>
              )}

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
                  <div className="grid gap-1.5 sm:gap-2 min-w-[750px]" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
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
                              ? 'border-slate-800 bg-slate-950 text-slate-600 opacity-60'
                              : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
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
                  <div className="grid gap-1.5 sm:gap-2 min-w-[750px]" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
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
                              ? 'border-slate-800 bg-slate-950 text-slate-600 opacity-60'
                              : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
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

                {currentUser?.role !== 'patient' && (
                  <div className="pt-4 border-t border-slate-800 flex justify-between items-center gap-3 flex-wrap">
                    <span className="text-xs font-semibold text-teal-400">Selected Tooth: #{selectedTooth} ({currentPatient?.conditions[selectedTooth] || 'Healthy'})</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['Healthy', 'Caries', 'Filled', 'Extracted', 'Crown', 'Root Canal'].map(cond => (
                        <button
                          key={cond}
                          onClick={() => updateToothCondition(selectedTooth, cond === 'Healthy' ? undefined : cond)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition ${
                            (currentPatient?.conditions[selectedTooth] === cond || (!currentPatient?.conditions[selectedTooth] && cond === 'Healthy'))
                              ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold'
                              : 'bg-slate-900 border-slate-800 hover:border-teal-500 text-slate-300'
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

          {activeTab === 'consultation' && currentUser?.role !== 'patient' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Consultation & Live Queue</h2>
                  <p className="text-xs text-slate-400">Manage waiting queue, call patients in, and record clinical notes & pricing</p>
                </div>
                {currentUser?.role === 'assistant' && (
                  <button
                    onClick={() => setShowWalkInModal(true)}
                    className="px-4 py-2.5 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <span>Register Walk-In</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:col-span-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-xs uppercase tracking-wider text-teal-400 mb-3">Current Chair Status</h3>
                    {activeChairPatient ? (
                      <div className="bg-teal-500/10 border border-teal-500/30 p-4 rounded-xl space-y-2">
                        <div className="text-xs text-teal-400 font-bold">IN CONSULTATION</div>
                        <div className="text-base font-bold text-white">{activeChairPatient.patientName}</div>
                        <div className="text-xs text-slate-300">Service: {activeChairPatient.service}</div>
                        <button
                          onClick={() => {
                            setSelectedPatientId(activeChairPatient.patientId);
                            setShowConsultationModal(true);
                          }}
                          className="w-full mt-2 py-2 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-teal-500/20"
                        >
                          Open Encounter & Set Price
                        </button>
                      </div>
                    ) : (
                      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center text-slate-400 text-xs">
                        Dental chair is currently vacant. Call a patient from the queue.
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:col-span-2 space-y-3">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider text-slate-400">Today's Patient Queue</h3>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {appointments.filter(a => a.date === todayStr && a.status !== 'Completed').length > 0 ? (
                      appointments.filter(a => a.date === todayStr && a.status !== 'Completed').map((apt, idx) => (
                        <div key={apt.id} className="flex justify-between items-center bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-teal-400 font-bold">#{idx + 1}</span>
                              <span className="font-bold text-white text-sm">{apt.patientName}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                apt.status === 'In-Chair' ? 'bg-teal-500 text-slate-950' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}>{apt.status}</span>
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">{apt.service} • {apt.time}</div>
                          </div>
                          
                          {currentUser?.role === 'dentist' && apt.status !== 'In-Chair' && (
                            <button
                              onClick={() => handleCallPatientInQueue(apt)}
                              className="px-3.5 py-1.5 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 hover:bg-teal-400 transition"
                            >
                              Come In
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-slate-500 text-xs">
                        No patients currently in queue for today.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Patient Clinical History</h2>
                  <p className="text-xs text-slate-400">
                    Showing treatment history for <span className="text-teal-400 font-semibold">{currentPatient?.name}</span> ({currentPatient?.id})
                  </p>
                </div>
                {currentUser?.role !== 'patient' && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={selectedPatientId}
                      onChange={(e) => setSelectedPatientId(e.target.value)}
                      className="bg-slate-900 text-white border border-slate-800 rounded-xl text-xs px-3 py-2.5 [color-scheme:dark]"
                    >
                      {patients.map(p => (
                        <option key={p.id} value={p.id} className="bg-slate-900 text-white">{p.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowAddHistoryModal(true)}
                      className="px-3.5 py-2.5 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0"
                    >
                      <span>Add Record</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
                {currentPatient?.history && currentPatient.history.length > 0 ? (
                  currentPatient.history.map(item => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-800">
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

          {activeTab === 'clinics' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex justify-between items-center bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Multi-Branch Clinic Administration</h2>
                  <p className="text-xs text-slate-400">View operating branches, BIR TIN, and doctor availability hours</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clinics.map(clinic => (
                  <div key={clinic.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl border border-teal-500/20 font-bold text-xs">
                          BRANCH ID: {clinic.id}
                        </div>
                        {currentUser?.role === 'dentist' && (
                          <button
                            onClick={() => { setActiveClinic(clinic); setShowEditClinicModal(true); }}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-teal-400 rounded-xl text-xs font-semibold"
                          >
                            Edit Settings
                          </button>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-base mb-1">{clinic.name}</h3>
                      <p className="text-xs text-slate-400 mb-2">{clinic.address}</p>
                      <p className="text-[11px] font-mono text-teal-300 mb-4">BIR TIN: {clinic.tin || '000-000-000-000'}</p>

                      <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">Doctor Operating Schedule</div>
                        <div className="text-sm font-bold text-white mt-0.5">{clinic.schedule}</div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online & Operational
                      </span>
                      {currentUser?.role === 'patient' && (
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

          {activeTab === 'appointments' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Appointments & Billing</h2>
                  <p className="text-xs text-slate-400">Manage clinic bookings and payment settlements</p>
                </div>
                {currentUser?.role === 'patient' && (
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full sm:w-auto px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <span>Book Appointment</span>
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
                        <th className="p-4 text-right">Payment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {appointments
                        .filter(apt => currentUser?.role === 'patient' ? apt.patientId === currentUser.id : true)
                        .map(apt => (
                        <tr key={apt.id} className="hover:bg-slate-900/50">
                          <td className="p-4 font-semibold text-white">{apt.patientName}</td>
                          <td className="p-4">{apt.service}</td>
                          <td className="p-4 text-xs text-teal-400 font-medium">{apt.clinicName}</td>
                          <td className="p-4">{apt.date} at {apt.time}</td>
                          <td className="p-4 font-bold text-white">₱{apt.amount}</td>
                          <td className="p-4 text-right">
                            {apt.paid ? (
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold ${
                                (apt.paymentMethod || '').toLowerCase() === 'cash' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                                  : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                              }`}>
                                <span>Paid via {apt.paymentMethod || 'GCash'}</span>
                              </span>
                            ) : (
                              currentUser?.role !== 'patient' ? (
                                <button
                                  onClick={() => { setActivePaymentApt(apt); setShowPaymentModal(true); }}
                                  className="px-3.5 py-1.5 bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500 hover:text-slate-950 rounded-xl text-xs font-semibold transition"
                                >
                                  Collect Payment
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-bold">
                                  Pending Payment
                                </span>
                              )
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

          {activeTab === 'sales' && currentUser?.role !== 'patient' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-base sm:text-lg font-bold text-white">Daily History & Monthly Sales Monitoring</h2>
                  </div>
                  <p className="text-xs text-slate-400">Select any calendar date to audit transactions and revenue analytics.</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
                  <span className="text-xs text-slate-300 font-medium">Audit Date:</span>
                  <input
                    type="date"
                    value={selectedSalesDate}
                    onChange={(e) => setSelectedSalesDate(e.target.value)}
                    className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">Sales for {selectedSalesDate}</h3>
                      <p className="text-[11px] text-slate-400">Total collected on selected day</p>
                    </div>
                    <div className="text-2xl font-extrabold text-white">₱{totalSelectedDateSales.toLocaleString()}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Cash Collections</div>
                      <div className="text-sm font-bold text-emerald-400">₱{cashSelectedDateSales.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">GCash Collections</div>
                      <div className="text-sm font-bold text-blue-400">₱{gcashSelectedDateSales.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">Monthly Monitoring ({currentMonthStr})</h3>
                      <p className="text-[11px] text-slate-400">Total revenue this month</p>
                    </div>
                    <div className="text-2xl font-extrabold text-white">₱{totalMonthlySales.toLocaleString()}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Monthly Cash</div>
                      <div className="text-sm font-bold text-emerald-400">₱{cashMonthlySales.toLocaleString()}</div>
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Monthly GCash</div>
                      <div className="text-sm font-bold text-blue-400">₱{gcashMonthlySales.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Transaction Log for {selectedSalesDate}</h3>
                  <button
                    onClick={() => setSelectedSalesDate(todayStr)}
                    className="text-[11px] text-teal-400 hover:underline"
                  >
                    Jump to Today
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[700px]">
                    <thead className="bg-slate-950 border-b border-slate-800 text-xs text-slate-400 uppercase">
                      <tr>
                        <th className="p-3">Patient Name</th>
                        <th className="p-3">Service</th>
                        <th className="p-3">Branch</th>
                        <th className="p-3">Time</th>
                        <th className="p-3">Method</th>
                        <th className="p-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300 text-xs">
                      {selectedDatePaidAppointments.length > 0 ? (
                        selectedDatePaidAppointments.map(apt => (
                          <tr key={apt.id} className="hover:bg-slate-900/50">
                            <td className="p-3 font-semibold text-white">{apt.patientName}</td>
                            <td className="p-3">{apt.service}</td>
                            <td className="p-3 text-teal-400">{apt.clinicName}</td>
                            <td className="p-3">{apt.time}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-md font-bold ${
                                (apt.paymentMethod || '').toLowerCase() === 'cash' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                              }`}>
                                {apt.paymentMethod || 'Cash'}
                              </span>
                            </td>
                            <td className="p-3 text-right font-bold text-white">₱{apt.amount}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-10 text-slate-500">
                            No paid transactions recorded for {selectedSalesDate}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'patients' && currentUser?.role !== 'patient' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Patient Database & Vitals</h2>
                  <p className="text-xs text-slate-400">Manage records, baseline vitals, and password resets</p>
                </div>
                <button
                  onClick={() => setShowNewPatientModal(true)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                >
                  <span>Register Patient</span>
                </button>
              </div>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm min-w-[750px]">
                    <thead className="bg-slate-950 border-b border-slate-800 text-xs text-slate-400 uppercase">
                      <tr>
                        <th className="p-4">ID & Name</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Age / Gender</th>
                        <th className="p-4">Baseline Vitals (BP / HR)</th>
                        <th className="p-4 text-right">Security</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {patients.map(p => (
                        <tr key={p.id} className="hover:bg-slate-900/50">
                          <td className="p-4">
                            <div className="font-bold text-white">{p.name}</div>
                            <div className="text-xs text-slate-500">{p.id}</div>
                          </td>
                          <td className="p-4">
                            <div>{p.phone}</div>
                            <div className="text-xs text-slate-400">{p.email}</div>
                          </td>
                          <td className="p-4">{p.age} y/o ({p.gender})</td>
                          <td className="p-4 font-mono text-xs">
                            <span className={isHypertensive(p.vitals.systolic, p.vitals.diastolic) ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                              {p.vitals.systolic}/{p.vitals.diastolic} mmHg
                            </span> • {p.vitals.hr} bpm
                          </td>
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

          {activeTab === 'chat' && (
            <div className="max-w-4xl mx-auto h-[550px] sm:h-[600px] bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-bold text-white text-base">Messenger Inbox</h3>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400">Chat with:</label>
                  <select
                    value={chatRecipientId}
                    onChange={(e) => setChatRecipientId(e.target.value)}
                    className="bg-slate-900 text-white border border-slate-800 rounded-xl text-xs px-3 py-1.5 focus:outline-none [color-scheme:dark]"
                  >
                    {currentUser?.role === 'patient' ? (
                      <option value="DOC-1" className="bg-slate-900 text-white">Dr. Estrada, DDM (Dentist)</option>
                    ) : (
                      <>
                        <optgroup label="Patients" className="bg-slate-900 text-white">
                          {patients.map(p => (
                            <option key={p.id} value={p.id} className="bg-slate-900 text-white">{p.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Assistants" className="bg-slate-900 text-white">
                          {assistants.filter(a => a.id !== currentUser?.id).map(a => (
                            <option key={a.id} value={a.id} className="bg-slate-900 text-white">{a.name}</option>
                          ))}
                        </optgroup>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {activeChatMessages.length > 0 ? (
                  activeChatMessages.map(msg => {
                    const isMe = msg.senderId === currentUser?.id;
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="text-[10px] text-slate-400 mb-1">{msg.senderName} • {msg.timestamp}</div>
                        <div className={`p-3 rounded-2xl max-w-xs sm:max-w-sm text-sm ${
                          isMe ? 'bg-teal-500 text-slate-950 font-medium' : 'bg-slate-900 text-white border border-slate-800'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-20 text-slate-500 text-xs">
                    No messages in this thread yet. Send a message to start the conversation!
                  </div>
                )}
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
                />
                <button type="submit" className="px-4 py-2.5 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1">
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {showConsultationModal && currentUser?.role !== 'patient' && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg text-slate-100">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Service Encounter & Billing Form</h3>
              <button onClick={() => setShowConsultationModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSaveConsultation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Service Performed</label>
                <select
                  value={consultationData.service}
                  onChange={(e) => setConsultationData({ ...consultationData, service: e.target.value })}
                  className="w-full bg-slate-900 text-white border border-slate-800 rounded-xl px-3 py-2 text-sm [color-scheme:dark]"
                >
                  <option value="Dental Consultation" className="bg-slate-900 text-white">Dental Consultation</option>
                  <option value="Dental Cleaning" className="bg-slate-900 text-white">Dental Cleaning</option>
                  <option value="Tooth Extraction" className="bg-slate-900 text-white">Tooth Extraction</option>
                  <option value="Root Canal" className="bg-slate-900 text-white">Root Canal Treatment</option>
                  <option value="Custom Service" className="bg-slate-900 text-white">Custom Service...</option>
                </select>
              </div>

              {consultationData.service === 'Custom Service' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Custom Service Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter custom procedure name..."
                    value={consultationData.customService}
                    onChange={(e) => setConsultationData({ ...consultationData, customService: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Service Price (₱)</label>
                <input
                  type="number"
                  required
                  value={consultationData.amount}
                  onChange={(e) => setConsultationData({ ...consultationData, amount: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm font-bold text-teal-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Chief Complaint</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toothache on lower right molar"
                  value={consultationData.chiefComplaint}
                  onChange={(e) => setConsultationData({ ...consultationData, chiefComplaint: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Clinical Diagnosis & Notes</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Diagnosis notes..."
                  value={consultationData.diagnosis}
                  onChange={(e) => setConsultationData({ ...consultationData, diagnosis: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm"
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Prescription (Rx)</label>
                <input
                  type="text"
                  placeholder="e.g. Mefenamic Acid 500mg every 8 hours"
                  value={consultationData.prescription}
                  onChange={(e) => setConsultationData({ ...consultationData, prescription: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Schedule Follow-Up Date (Optional)</label>
                <input
                  type="date"
                  value={consultationData.followUpDate}
                  onChange={(e) => setConsultationData({ ...consultationData, followUpDate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm [color-scheme:dark]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowConsultationModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-teal-500 text-slate-950 font-bold rounded-xl text-xs">
                  Complete Service & Publish Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddHistoryModal && currentUser?.role !== 'patient' && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md text-slate-100">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Add Treatment Record</h3>
              <button onClick={() => setShowAddHistoryModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddHistoryRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Procedure</label>
                <input
                  type="text"
                  required
                  value={newHistoryEntry.procedure}
                  onChange={(e) => setNewHistoryEntry({ ...newHistoryEntry, procedure: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Tooth (e.g. #14, All)</label>
                <input
                  type="text"
                  required
                  value={newHistoryEntry.tooth}
                  onChange={(e) => setNewHistoryEntry({ ...newHistoryEntry, tooth: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Clinical Notes & Observations</label>
                <textarea
                  rows="3"
                  required
                  value={newHistoryEntry.notes}
                  onChange={(e) => setNewHistoryEntry({ ...newHistoryEntry, notes: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm"
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

      {showEditClinicModal && activeClinic && currentUser?.role !== 'patient' && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md text-slate-100">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Edit Branch Settings</h3>
              <button onClick={() => setShowEditClinicModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setClinics(clinics.map(c => c.id === activeClinic.id ? activeClinic : c));
                setShowEditClinicModal(false);
                addNotification('Branch Updated', `Settings for ${activeClinic.name} saved.`, 'staff');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Branch Name</label>
                <input
                  type="text"
                  value={activeClinic.name}
                  onChange={(e) => setActiveClinic({ ...activeClinic, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Address / Location</label>
                <input
                  type="text"
                  value={activeClinic.address}
                  onChange={(e) => setActiveClinic({ ...activeClinic, address: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">BIR Tax ID Number (TIN)</label>
                <input
                  type="text"
                  value={activeClinic.tin || ''}
                  onChange={(e) => setActiveClinic({ ...activeClinic, tin: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Operating Schedule</label>
                <input
                  type="text"
                  value={activeClinic.schedule}
                  onChange={(e) => setActiveClinic({ ...activeClinic, schedule: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm"
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

      {showNewPatientModal && currentUser?.role !== 'patient' && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 w-full max-w-xl my-8 text-slate-100">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base sm:text-lg">Register Patient & Initial Vitals</h3>
              <button onClick={() => setShowNewPatientModal(false)} className="text-slate-400 hover:text-white">✕</button>
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
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newPatientData.phone}
                    onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newPatientData.email}
                    onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={newPatientData.age}
                    onChange={(e) => setNewPatientData({ ...newPatientData, age: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase text-teal-400 mb-3">Pre-Anesthesia Vitals Baseline (Required)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Systolic BP</label>
                    <input
                      type="number"
                      required
                      value={newPatientData.systolic}
                      onChange={(e) => setNewPatientData({ ...newPatientData, systolic: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Diastolic BP</label>
                    <input
                      type="number"
                      required
                      value={newPatientData.diastolic}
                      onChange={(e) => setNewPatientData({ ...newPatientData, diastolic: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Heart Rate</label>
                    <input
                      type="number"
                      required
                      value={newPatientData.hr}
                      onChange={(e) => setNewPatientData({ ...newPatientData, hr: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
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

      {showWalkInModal && currentUser?.role !== 'patient' && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 w-full max-w-xl my-8 text-slate-100">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base sm:text-lg">Walk-In Profile & Queue Registration</h3>
              <button onClick={() => setShowWalkInModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleRegisterWalkIn} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={walkInData.name}
                    onChange={(e) => setWalkInData({ ...walkInData, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={walkInData.phone}
                    onChange={(e) => setWalkInData({ ...walkInData, phone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={walkInData.age}
                    onChange={(e) => setWalkInData({ ...walkInData, age: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Service</label>
                  <select
                    value={walkInData.service}
                    onChange={(e) => setWalkInData({ ...walkInData, service: e.target.value })}
                    className="w-full bg-slate-900 text-white border border-slate-800 rounded-xl px-3 py-2 text-sm [color-scheme:dark]"
                  >
                    <option value="Dental Consultation" className="bg-slate-900 text-white">Dental Consultation</option>
                    <option value="Dental Cleaning" className="bg-slate-900 text-white">Dental Cleaning</option>
                    <option value="Tooth Extraction" className="bg-slate-900 text-white">Tooth Extraction</option>
                    <option value="Root Canal" className="bg-slate-900 text-white">Root Canal Treatment</option>
                    <option value="Custom Service" className="bg-slate-900 text-white">Custom Service...</option>
                  </select>
                </div>
              </div>

              {walkInData.service === 'Custom Service' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Custom Service Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter custom procedure..."
                    value={walkInData.customService}
                    onChange={(e) => setWalkInData({ ...walkInData, customService: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Initial Price / Amount (₱)</label>
                <input
                  type="number"
                  required
                  value={walkInData.amount}
                  onChange={(e) => setWalkInData({ ...walkInData, amount: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm font-bold text-teal-400"
                />
              </div>

              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase text-teal-400 mb-3">Pre-Anesthesia Vitals Intake</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Systolic BP</label>
                    <input
                      type="number"
                      required
                      value={walkInData.systolic}
                      onChange={(e) => setWalkInData({ ...walkInData, systolic: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Diastolic BP</label>
                    <input
                      type="number"
                      required
                      value={walkInData.diastolic}
                      onChange={(e) => setWalkInData({ ...walkInData, diastolic: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Heart Rate</label>
                    <input
                      type="number"
                      required
                      value={walkInData.hr}
                      onChange={(e) => setWalkInData({ ...walkInData, hr: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-teal-500 text-slate-950 rounded-xl text-xs font-bold"
                >
                  Register & Queue Walk-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBookingModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md text-slate-100">
            <h3 className="font-bold text-white text-lg mb-4">Book Dental Appointment</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const finalServiceName = bookingData.service === 'Custom Service' ? bookingData.customService : bookingData.service;
                const newApt = {
                  id: `APT-${Date.now()}`,
                  patientId: currentUser.id,
                  patientName: currentUser.name,
                  service: finalServiceName,
                  clinicName: bookingData.clinicName,
                  date: bookingData.date || new Date().toISOString().split('T')[0],
                  time: bookingData.time,
                  status: 'Queued',
                  amount: 0,
                  paid: false,
                  paymentMethod: 'Cash'
                };
                setAppointments([newApt, ...appointments]);
                setShowBookingModal(false);
                addNotification('Appointment Booked', `Successfully requested booking for ${finalServiceName}.`, 'staff');
                addNotification('Appointment Confirmed', `Your booking for ${finalServiceName} has been queued.`, 'patient');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Select Clinic Branch</label>
                <select
                  value={bookingData.clinicName}
                  onChange={(e) => setBookingData({ ...bookingData, clinicName: e.target.value })}
                  className="w-full bg-slate-900 text-white border border-slate-800 rounded-xl px-3 py-2.5 text-sm [color-scheme:dark]"
                >
                  {clinics.map(c => (
                    <option key={c.id} value={c.name} className="bg-slate-900 text-white">{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Service</label>
                <select
                  value={bookingData.service}
                  onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })}
                  className="w-full bg-slate-900 text-white border border-slate-800 rounded-xl px-3 py-2.5 text-sm [color-scheme:dark]"
                >
                  <option value="Dental Cleaning" className="bg-slate-900 text-white">Dental Cleaning</option>
                  <option value="Tooth Extraction" className="bg-slate-900 text-white">Tooth Extraction</option>
                  <option value="Root Canal" className="bg-slate-900 text-white">Root Canal Treatment</option>
                  <option value="Custom Service" className="bg-slate-900 text-white">Custom Service...</option>
                </select>
              </div>

              {bookingData.service === 'Custom Service' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Custom Service Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter custom procedure..."
                    value={bookingData.customService}
                    onChange={(e) => setBookingData({ ...bookingData, customService: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-sm [color-scheme:dark]"
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

      {showPaymentModal && activePaymentApt && currentUser?.role !== 'patient' && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm text-center space-y-4 text-slate-100">
            <h3 className="font-bold text-white text-lg">Select Payment Method</h3>
            <p className="text-xs text-slate-400">{activePaymentApt.service} - <span className="text-white font-bold">₱{activePaymentApt.amount}</span></p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  setAppointments(appointments.map(a => a.id === activePaymentApt.id ? { ...a, paid: true, status: 'Confirmed', paymentMethod: 'Cash' } : a));
                  setShowPaymentModal(false);
                  addNotification('Payment Confirmed', `Cash payment of ₱{activePaymentApt.amount} processed.`, 'staff');
                  addNotification('Payment Received', `Your payment of ₱{activePaymentApt.amount} via Cash was confirmed.`, 'patient');
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <span>Paid by Cash</span>
              </button>

              <button
                onClick={() => {
                  setAppointments(appointments.map(a => a.id === activePaymentApt.id ? { ...a, paid: true, status: 'Confirmed', paymentMethod: 'GCash' } : a));
                  setShowPaymentModal(false);
                  addNotification('Payment Confirmed', `GCash payment of ₱{activePaymentApt.amount} processed.`, 'staff');
                  addNotification('Payment Received', `Your payment of ₱{activePaymentApt.amount} via GCash was confirmed.`, 'patient');
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                <span>Paid by GCash</span>
              </button>
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full py-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
