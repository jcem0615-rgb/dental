import React, { useState } from 'react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    if ((loginIdentifier === 'doctor' || loginIdentifier === 'admin@denticlinic.ph') && loginPassword === 'admin123') {
      setCurrentUser({ id: 'DOC-1', name: 'Dr. Estrada, DDM', role: 'dentist' });
      return;
    }
    setAuthError('Invalid credentials. Use doctor / admin123 for demo login.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">DentiClinic PWA</h1>
          <p className="text-slate-400 text-sm mt-1">Dental Practice & Patient Portal</p>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-sm">
            {authError}
          </div>
        )}

        {!currentUser ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Username / Email</label>
              <input
                type="text"
                required
                placeholder="doctor or admin@denticlinic.ph"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="admin123"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold py-3 rounded-xl transition text-sm"
            >
              Sign In
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setCurrentUser({ id: 'DOC-1', name: 'Dr. Estrada, DDM', role: 'dentist' })}
                className="text-xs text-teal-400 hover:underline"
              >
                Quick Demo Login as Dentist
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl">
              <h2 className="font-bold text-lg text-white">Welcome, {currentUser.name}</h2>
              <p className="text-xs text-teal-400 capitalize mt-1">Role: {currentUser.role}</p>
            </div>
            <button
              onClick={() => setCurrentUser(null)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
