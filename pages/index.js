import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  // --- STATE CONFIGURATION ---
  const [view, setView] = useState('auth'); // auth, dashboard, forgot
  const [authMode, setAuthMode] = useState('login'); 
  const [currentUser, setCurrentUser] = useState(null); 
  
  // Auth Inputs
  const [loginInput, setLoginInput] = useState(''); // Can be Phone or Email
  const [password, setPassword] = useState('');
  
  // Registration Form
  const [regForm, setRegForm] = useState({ name: '', phone: '', email: '', designation: '', password: '', role: 'employee' });

  // Dashboard State
  const [activeTab, setActiveTab] = useState('home'); 
  const [searchTerm, setSearchTerm] = useState(''); 
  
  // DATA STORAGE
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [demands, setDemands] = useState([]);
  const [posts, setPosts] = useState([]);
  const [notices, setNotices] = useState([]);
  const [chain, setChain] = useState([]); 

  // --- INITIAL LOAD ---
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const savedReports = JSON.parse(localStorage.getItem('reports')) || [];
    const savedDemands = JSON.parse(localStorage.getItem('demands')) || [];
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    const savedNotices = JSON.parse(localStorage.getItem('notices')) || [];
    const savedChain = JSON.parse(localStorage.getItem('chain')) || [];

    // Ensure Super Admin Exists with Password
    if (!savedUsers.find(u => u.role === 'superadmin')) {
      savedUsers.push({ 
        id: 1, 
        name: 'Al Jubayer (Niloy)', 
        phone: '01749534641', 
        email: 'niloy9999f@gmail.com', 
        password: '123456', // Default Password for You
        designation: 'Chairman & Owner', 
        role: 'superadmin', 
        active: true, 
        comments: [] 
      });
    }

    setUsers(savedUsers);
    setReports(savedReports);
    setDemands(savedDemands);
    setPosts(savedPosts);
    setNotices(savedNotices);
    setChain(savedChain);
  }, []);

  // --- AUTO SAVE ---
  useEffect(() => localStorage.setItem('users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('reports', JSON.stringify(reports)), [reports]);
  useEffect(() => localStorage.setItem('demands', JSON.stringify(demands)), [demands]);
  useEffect(() => localStorage.setItem('posts', JSON.stringify(posts)), [posts]);
  useEffect(() => localStorage.setItem('notices', JSON.stringify(notices)), [notices]);
  useEffect(() => localStorage.setItem('chain', JSON.stringify(chain)), [chain]);

  // --- AUTH FUNCTIONS (PASSWORD BASED) ---
  const handleLogin = () => {
    // Check by Phone OR Email
    const user = users.find(u => u.phone === loginInput || u.email === loginInput);
    
    if (!user) return alert("Account not found! Please Register.");
    if (!user.active) return alert("Account deactivated by Admin.");
    
    if (user.password === password) {
        setCurrentUser(user);
        setView('dashboard');
        setLoginInput('');
        setPassword('');
    } else {
        alert("Wrong Password!");
    }
  };

  const handleRegister = () => {
      if(!regForm.name || !regForm.phone || !regForm.password) return alert("Please fill all details!");
      if(users.find(u => u.phone === regForm.phone)) return alert("Phone number already registered!");
      
      const newUser = { 
          id: Date.now(), 
          ...regForm, 
          active: true, 
          comments: [] 
      };
      
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setView('dashboard');
      alert("Registration Successful! Welcome.");
  };

  const handleForgotPass = () => {
      // Simulation of Reset
      const user = users.find(u => u.phone === loginInput || u.email === loginInput);
      if(user) {
          alert(`Simulated Email sent to ${user.email || user.phone}. Your mock code is 9999.`);
          // In real app, this sends email. Here we just show alert.
          setView('auth');
      } else {
          alert("User not found.");
      }
  };

  // --- PERMISSION HELPERS ---
  const canManageUsers = (role) => ['superadmin', 'admin', 'manager'].includes(role);
  const canApprove = (role) => ['superadmin', 'admin', 'manager'].includes(role);
  const canPublish = (role) => ['superadmin', 'admin', 'manager'].includes(role);

  // --- FEATURE LOGIC (Keep existing logic) ---
  const changeUserRole = (targetId, newRole) => {
    const targetUser = users.find(u => u.id === targetId);
    if (targetUser.role === 'superadmin') return alert("Restricted Action!");
    setUsers(users.map(u => u.id === targetId ? { ...u, role: newRole } : u));
  };
  const deleteUser = (targetId) => {
    const targetUser = users.find(u => u.id === targetId);
    if (targetUser.role === 'superadmin') return alert("Cannot delete Super Admin!");
    if(confirm("Delete user?")) setUsers(users.filter(u => u.id !== targetId));
  };

  const [newReport, setNewReport] = useState({ site: '', desc: '', expense: '' });
  const submitReport = () => {
    if (!newReport.site || !newReport.desc) return alert("Missing details!");
    const report = { id: Date.now(), userId: currentUser.id, submittedBy: currentUser.name, designation: currentUser.designation, date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString(), ...newReport, status: 'Pending', remark: '' };
    setReports([report, ...reports]);
    setNewReport({ site: '', desc: '', expense: '' });
    alert("Report Submitted ✅");
  };
  const updateReportStatus = (id, status, remark) => {
      if(!canApprove(currentUser.role)) return;
      setReports(reports.map(r => r.id === id ? { ...r, status, remark: remark || r.remark } : r));
  };

  const [newDemand, setNewDemand] = useState({ item: '', qty: '', note: '' });
  const submitDemand = () => {
    if (!newDemand.item) return alert("Item required!");
    setDemands([{ id: Date.now(), userId: currentUser.id, requestedBy: currentUser.name, date: new Date().toLocaleDateString(), ...newDemand, status: 'Pending' }, ...demands]);
    setNewDemand({ item: '', qty: '', note: '' });
    alert("Demand Sent 📦");
  };
  const toggleDemandStatus = (id) => {
      if(!canApprove(currentUser.role)) return;
      setDemands(demands.map(d => d.id === id ? { ...d, status: d.status === 'Pending' ? 'Fulfilled' : 'Pending' } : d));
  };

  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const createPost = () => {
    if(!newPost.title) return alert("Title required");
    setPosts([{ id: Date.now(), userId: currentUser.id, author: currentUser.name, role: currentUser.role, ...newPost, date: new Date().toLocaleString() }, ...posts]);
    setNewPost({ title: '', content: '' });
  };
  const deletePost = (id, userId) => {
    if (currentUser.role === 'superadmin' || currentUser.role === 'admin' || currentUser.id === userId) {
       if(confirm("Delete post?")) setPosts(posts.filter(p => p.id !== id));
    }
  };

  const [newChain, setNewChain] = useState({ name: '', designation: '', phone: '', type: 'sub' });
  const addChainMember = () => {
      if(!newChain.name) return;
      setChain([...chain, { id: Date.now(), ...newChain }]);
      setNewChain({ name: '', designation: '', phone: '', type: 'sub' });
  };
  const deleteChainMember = (id) => { if(canPublish(currentUser.role)) setChain(chain.filter(c => c.id !== id)); };

  const [newNotice, setNewNotice] = useState({ title: '', content: '' });
  const createNotice = () => setNotices([{ id: Date.now(), ...newNotice, date: new Date().toLocaleDateString() }, ...notices]);
  const deleteNotice = (id) => setNotices(notices.filter(n => n.id !== id));

  // --- UI SCREENS (APPLE WATER THEME) ---
  
  // 1. AUTH SCREEN
  if (view === 'auth' || view === 'forgot') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F8FF] relative overflow-hidden font-sans p-6">
        <Head><title>M/S Shamim Traders</title><script src="https://cdn.tailwindcss.com"></script></Head>
        
        {/* Apple Water Background Blobs */}
        <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="bg-white/60 backdrop-blur-xl rounded-[40px] shadow-2xl p-8 w-full max-w-sm border border-white/50 relative z-10">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Shamim Traders</h1>
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-[0.2em] mt-2">Water & Engineering</p>
          </div>

          {view === 'forgot' ? (
             <div className="space-y-4">
                 <h2 className="text-xl font-bold text-slate-700 text-center">Reset Password</h2>
                 <input placeholder="Enter Mobile or Email" className="w-full bg-white/70 border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none text-slate-700" value={loginInput} onChange={e => setLoginInput(e.target.value)} />
                 <button onClick={handleForgotPass} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95">Send Reset Link</button>
                 <button onClick={() => setView('auth')} className="w-full text-slate-400 text-sm py-2">Back to Login</button>
             </div>
          ) : (
            <>
              {/* Toggle Login/Register */}
              <div className="flex bg-slate-200/50 p-1 rounded-2xl mb-6">
                <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${authMode==='login' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}>Login</button>
                <button onClick={() => setAuthMode('signup')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${authMode==='signup' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}>Sign Up</button>
              </div>

              <div className="space-y-4">
                {authMode === 'signup' && (
                  <>
                    <input placeholder="Full Name" className="w-full bg-white/70 border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none" onChange={e => setRegForm({...regForm, name: e.target.value})} />
                    <input placeholder="Designation" className="w-full bg-white/70 border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none" onChange={e => setRegForm({...regForm, designation: e.target.value})} />
                    <input placeholder="Email (Optional)" className="w-full bg-white/70 border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none" onChange={e => setRegForm({...regForm, email: e.target.value})} />
                  </>
                )}
                
                <input 
                  placeholder={authMode === 'login' ? "Mobile or Email" : "Mobile Number"} 
                  className="w-full bg-white/70 border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none text-lg" 
                  value={authMode === 'login' ? loginInput : regForm.phone} 
                  onChange={e => authMode === 'login' ? setLoginInput(e.target.value) : setRegForm({...regForm, phone: e.target.value})} 
                />
                
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full bg-white/70 border-none p-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none text-lg" 
                  value={authMode === 'login' ? password : regForm.password} 
                  onChange={e => authMode === 'login' ? setPassword(e.target.value) : setRegForm({...regForm, password: e.target.value})} 
                />

                {authMode === 'login' && (
                  <div className="text-right">
                    <button onClick={() => setView('forgot')} className="text-sm text-blue-500 font-semibold">Forgot Password?</button>
                  </div>
                )}

                {authMode === 'login' ? (
                   <button onClick={handleLogin} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-95">Login</button>
                ) : (
                   <button onClick={handleRegister} className="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all active:scale-95">Create Account</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // 2. DASHBOARD (Glass & Grid)
  return (
    <div className="min-h-screen bg-[#F2F6FF] font-sans pb-28">
      <Head><title>Dashboard</title><script src="https://cdn.tailwindcss.com"></script></Head>

      {/* Header */}
      <div className="pt-10 pb-6 px-6 bg-white/50 backdrop-blur-md sticky top-0 z-50 border-b border-white/20">
        <div className="flex justify-between items-center">
          <div>
             <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Hello,</p>
             <h1 className="text-2xl font-bold text-slate-800">{currentUser.name}</h1>
          </div>
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-400 to-cyan-300 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
             {currentUser.name.charAt(0)}
          </div>
        </div>
      </div>

      <div className="p-6">
        
        {/* Notices Slider */}
        {notices.length > 0 && (
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-4 rounded-[2rem] shadow-lg mb-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
            <h3 className="text-xs font-bold opacity-80 uppercase mb-1">📢 Announcement</h3>
            <p className="font-bold text-lg">{notices[0].title}</p>
            <p className="text-sm opacity-90 truncate">{notices[0].content}</p>
          </div>
        )}

        {/* --- MAIN MENU (Apple Grid) --- */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-2 gap-5">
            {[
              { id: 'reports', icon: '📝', label: 'Reports', color: 'bg-blue-100 text-blue-600' },
              { id: 'demands', icon: '📦', label: 'Demands', color: 'bg-purple-100 text-purple-600' },
              { id: 'wall', icon: '📣', label: 'News Feed', color: 'bg-green-100 text-green-600' },
              { id: 'hierarchy', icon: '🌳', label: 'Command', color: 'bg-orange-100 text-orange-600' },
              { id: 'office', icon: '📍', label: 'Office', color: 'bg-red-100 text-red-600' },
            ].map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className="bg-white p-6 rounded-[2rem] shadow-sm border border-white hover:shadow-xl transition-all active:scale-95 flex flex-col items-center gap-4">
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-2xl`}>{item.icon}</div>
                <span className="font-bold text-slate-600 text-sm">{item.label}</span>
              </button>
            ))}

            {canManageUsers(currentUser.role) && (
              <button onClick={() => setActiveTab('users')} className="bg-slate-800 p-6 rounded-[2rem] shadow-lg shadow-slate-300 hover:shadow-xl transition-all active:scale-95 flex flex-col items-center gap-4 text-white">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">👥</div>
                <span className="font-bold text-sm">HR Panel</span>
              </button>
            )}
          </div>
        )}

        {/* --- VIEWS --- */}
        
        {/* Reports View */}
        {activeTab === 'reports' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800">Daily Reports</h2>
            <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-white">
              <input placeholder="Site Name" className="w-full bg-slate-50 p-4 rounded-2xl mb-3 outline-none" value={newReport.site} onChange={e => setNewReport({...newReport, site: e.target.value})} />
              <input type="number" placeholder="Expense (Tk)" className="w-full bg-slate-50 p-4 rounded-2xl mb-3 outline-none" value={newReport.expense} onChange={e => setNewReport({...newReport, expense: e.target.value})} />
              <textarea placeholder="Work details..." className="w-full bg-slate-50 p-4 rounded-2xl mb-3 h-24 outline-none" value={newReport.desc} onChange={e => setNewReport({...newReport, desc: e.target.value})} />
              <button onClick={submitReport} className="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition">Submit Report</button>
            </div>
            {reports.map(r => (
              <div key={r.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-white">
                <div className="flex justify-between mb-2">
                   <h4 className="font-bold text-slate-800">{r.site}</h4>
                   <span className={`px-2 py-1 rounded-lg text-xs font-bold ${r.status==='Approved'?'bg-green-100 text-green-600':'bg-yellow-100 text-yellow-600'}`}>{r.status}</span>
                </div>
                <p className="text-slate-500 text-sm mb-2">{r.desc}</p>
                <div className="flex justify-between text-xs text-slate-400 font-bold">
                   <span>Tk {r.expense}</span>
                   <span>{r.date}</span>
                </div>
                {canApprove(currentUser.role) && (
                   <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                      <button onClick={() => updateReportStatus(r.id, 'Approved', '')} className="flex-1 bg-green-500 text-white py-2 rounded-xl text-xs font-bold">Accept</button>
                      <button onClick={() => updateReportStatus(r.id, 'Rejected', '')} className="flex-1 bg-red-100 text-red-500 py-2 rounded-xl text-xs font-bold">Reject</button>
                   </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Demands View */}
        {activeTab === 'demands' && (
           <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800">Material Demand</h2>
              <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-white">
                 <div className="flex gap-3 mb-3">
                   <input placeholder="Item Name" className="flex-[2] bg-slate-50 p-4 rounded-2xl outline-none" value={newDemand.item} onChange={e => setNewDemand({...newDemand, item: e.target.value})} />
                   <input placeholder="Qty" className="flex-1 bg-slate-50 p-4 rounded-2xl outline-none" value={newDemand.qty} onChange={e => setNewDemand({...newDemand, qty: e.target.value})} />
                 </div>
                 <button onClick={submitDemand} className="w-full bg-purple-500 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition">Request</button>
              </div>
              {demands.map(d => (
                <div key={d.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-white flex justify-between items-center">
                  <div><h4 className="font-bold text-slate-800">{d.item}</h4><p className="text-xs text-slate-400">{d.qty} • {d.requestedBy}</p></div>
                  {canApprove(currentUser.role) ? (
                    <button onClick={() => toggleDemandStatus(d.id)} className={`px-4 py-2 rounded-xl text-xs font-bold ${d.status==='Fulfilled'?'bg-green-500 text-white':'bg-slate-100 text-

