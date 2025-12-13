import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  // --- STATE CONFIGURATION ---
  const [view, setView] = useState('auth'); 
  const [authMode, setAuthMode] = useState('login'); 
  const [currentUser, setCurrentUser] = useState(null); 
  
  // Auth Inputs
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [regForm, setRegForm] = useState({ name: '', phone: '', designation: '', role: 'employee' });

  // Dashboard State
  const [activeTab, setActiveTab] = useState('home'); // home, reports, demands, wall, users, hierarchy, office, notices
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

    // Ensure Super Admin Exists (YOU)
    if (!savedUsers.find(u => u.role === 'superadmin')) {
      savedUsers.push({ 
        id: 1, 
        name: 'Al Jubayer (Niloy)', 
        phone: '01749534641', 
        email: 'niloy9999f@gmail.com', 
        designation: 'Chairman & Owner', 
        role: 'superadmin', 
        active: true, 
        comments: [] 
      });
    }
    // Default Hierarchy
    if (savedChain.length === 0) {
       savedChain.push({ id: 1, name: 'Al Jubayer (Niloy)', designation: 'Chairman', phone: '01749534641', type: 'top' });
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

  // --- AUTH & PERMISSIONS ---
  const sendOtp = () => {
    if (authMode === 'login') {
      const user = users.find(u => u.phone === phone);
      if (!user) return alert("User not found!");
      if (!user.active) return alert("Account deactivated!");
    } else {
      if (users.find(u => u.phone === regForm.phone)) return alert("User already exists!");
    }
    setIsOtpSent(true);
    alert("OTP: 1234");
  };

  const verifyOtp = () => {
    if (otp !== '1234') return alert("Invalid OTP"); 
    if (authMode === 'login') {
      setCurrentUser(users.find(u => u.phone === phone));
    } else {
      const newUser = { id: Date.now(), ...regForm, active: true, comments: [] };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
    }
    setView('dashboard');
    setIsOtpSent(false); setOtp(''); setPhone('');
  };

  const canManageUsers = (role) => ['superadmin', 'admin', 'manager'].includes(role);
  const canApprove = (role) => ['superadmin', 'admin', 'manager'].includes(role);
  const canPublish = (role) => ['superadmin', 'admin', 'manager'].includes(role);

  // --- FEATURE LOGIC ---
  // (HR, Reports, Demands, Posts logic kept same but UI updated below)
  const changeUserRole = (targetId, newRole) => {
    const targetUser = users.find(u => u.id === targetId);
    if (targetUser.role === 'superadmin') return alert("Restricted Action!");
    if (currentUser.role === 'admin' && newRole === 'superadmin') return alert("Restricted!");
    if (currentUser.role === 'manager' && ['admin', 'superadmin', 'manager'].includes(newRole)) return alert("Restricted!");
    setUsers(users.map(u => u.id === targetId ? { ...u, role: newRole } : u));
  };
  const deleteUser = (targetId) => {
    const targetUser = users.find(u => u.id === targetId);
    if (targetUser.role === 'superadmin') return alert("Cannot delete Super Admin!");
    if (currentUser.role === 'manager' && ['admin', 'superadmin', 'manager'].includes(targetUser.role)) return alert("Restricted!");
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

  // --- HELPERS ---
  const getRoleColor = (role) => {
    switch(role) {
      case 'superadmin': return 'bg-yellow-500';
      case 'admin': return 'bg-red-600';
      case 'manager': return 'bg-purple-600';
      case 'engineer': return 'bg-blue-600';
      default: return 'bg-emerald-600';
    }
  };

  // --- UI SCREENS ---
  
  // 1. AUTH SCREEN (Clean & Corporate)
  if (view === 'auth') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 font-sans p-6">
        <Head><title>M/S Shamim Traders</title><script src="https://cdn.tailwindcss.com"></script></Head>
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 w-full max-w-sm border-t-8 border-blue-600">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">SHAMIM TRADERS</h1>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mt-1">Engineering Excellence</p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
            <button onClick={() => {setAuthMode('login'); setIsOtpSent(false)}} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${authMode==='login' ? 'bg-white shadow text-blue-800' : 'text-slate-400'}`}>LOGIN</button>
            <button onClick={() => {setAuthMode('signup'); setIsOtpSent(false)}} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${authMode==='signup' ? 'bg-white shadow text-blue-800' : 'text-slate-400'}`}>REGISTER</button>
          </div>

          {!isOtpSent ? (
            <div className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <input placeholder="Full Name" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" onChange={e => setRegForm({...regForm, name: e.target.value})} />
                  <input placeholder="Designation" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" onChange={e => setRegForm({...regForm, designation: e.target.value})} />
                </>
              )}
              <input type="number" placeholder="Mobile Number" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-lg tracking-wide" 
                value={authMode==='login' ? phone : regForm.phone} onChange={e => authMode==='login' ? setPhone(e.target.value) : setRegForm({...regForm, phone: e.target.value})} />
              <button onClick={sendOtp} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition transform active:scale-95">CONTINUE</button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-slate-500 text-sm">Enter OTP sent to mobile</p>
              <input placeholder="••••" className="w-full border-2 border-blue-100 p-3 rounded-xl text-center text-3xl tracking-[0.5em] font-bold focus:border-blue-500 outline-none" onChange={e => setOtp(e.target.value)} />
              <button onClick={verifyOtp} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-500/30 transition transform active:scale-95">VERIFY ACCESS</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. DASHBOARD (Banking App Style)
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      <Head><title>Dashboard</title><script src="https://cdn.tailwindcss.com"></script></Head>

      {/* Top Header (Glassmorphism) */}
      <div className="bg-slate-900 text-white pt-6 pb-12 px-6 rounded-b-[2.5rem] shadow-xl sticky top-0 z-50">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Welcome back,</p>
            <h1 className="text-2xl font-bold">{currentUser.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getRoleColor(currentUser.role)} text-white shadow-sm`}>
                {currentUser.role}
              </span>
              <span className="text-xs text-slate-400 border-l border-slate-700 pl-2">{currentUser.designation}</span>
            </div>
          </div>
          <button onClick={() => setView('auth')} className="bg-slate-800 hover:bg-red-600 p-2 rounded-full transition text-xs font-bold text-white">LOGOUT</button>
        </div>
      </div>

      <div className="px-4 -mt-6">
        
        {/* Notices Carousel */}
        {notices.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-yellow-500 p-4 mb-6 animate-fade-in-up">
            <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-2">📢 Latest Updates</h3>
            <div className="space-y-2">
              {notices.slice(0, 2).map(n => (
                <div key={n.id} className="border-b border-slate-100 last:border-0 pb-1 last:pb-0">
                  <p className="font-bold text-slate-800 text-sm">{n.title}</p>
                  <p className="text-xs text-slate-500 truncate">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- MAIN MENU (Banking Grid Style) --- */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
            <button onClick={() => setActiveTab('reports')} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition active:scale-95 flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">📝</div>
              <span className="font-bold text-slate-700">Daily Reports</span>
            </button>
            
            <button onClick={() => setActiveTab('demands')} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition active:scale-95 flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-2xl">📦</div>
              <span className="font-bold text-slate-700">Material Demand</span>
            </button>
            
            <button onClick={() => setActiveTab('wall')} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition active:scale-95 flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-2xl">📣</div>
              <span className="font-bold text-slate-700">Site News Feed</span>
            </button>
            
            <button onClick={() => setActiveTab('hierarchy')} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition active:scale-95 flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-2xl">🌳</div>
              <span className="font-bold text-slate-700">Chain of Command</span>
            </button>
            
            <button onClick={() => setActiveTab('office')} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition active:scale-95 flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-2xl">📍</div>
              <span className="font-bold text-slate-700">Head Office</span>
            </button>

            {canManageUsers(currentUser.role) && (
              <button onClick={() => setActiveTab('users')} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition active:scale-95 flex flex-col items-center gap-3 border-2 border-slate-100">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-2xl">👥</div>
                <span className="font-bold text-slate-700">HR Panel</span>
              </button>
            )}

            {canPublish(currentUser.role) && (
              <button onClick={() => setActiveTab('notices')} className="col-span-2 bg-yellow-50 p-4 rounded-2xl shadow-sm border border-yellow-200 flex items-center justify-center gap-2">
                <span className="font-bold text-yellow-800">Publish New Notice</span>
              </button>
            )}
          </div>
        )}

        {/* --- MODULE VIEWS (Cards) --- */}
        
        {/* Reports View */}
        {activeTab === 'reports' && (
          <div className="space-y-4 animate-fade-in-up">
            <h2 className="text-xl font-bold text-slate-800 border-l-4 border-blue-600 pl-3">Daily Reports</h2>
            
            <div className="bg-white p-5 rounded-2xl shadow-lg">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input placeholder="Site Name" className="bg-slate-50 p-3 rounded-xl text-sm outline-none border focus:border-blue-500" value={newReport.site} onChange={e => setNewReport({...newReport, site: e.target.value})} />
                <input type="number" placeholder="Expense (Tk)" className="bg-slate-50 p-3 rounded-xl text-sm outline-none border focus:border-blue-500" value={newReport.expense} onChange={e => setNewReport({...newReport, expense: e.target.value})} />
              </div>
              <textarea placeholder="Work description..." className="w-full bg-slate-50 p-3 rounded-xl text-sm h-20 outline-none border focus:border-blue-500" value={newReport.desc} onChange={e => setNewReport({...newReport, desc: e.target.value})} />
              <button onClick={submitReport} className="mt-3 w-full bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg">SUBMIT REPORT</button>
            </div>

            {reports.map(r => (
              <div key={r.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between mb-2">
                  <h4 className="font-bold text-slate-800">{r.site}</h4>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${r.status==='Approved'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{r.status}</span>
                </div>
                <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl mb-2">{r.desc}</p>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>By {r.submittedBy} • {r.date}</span>
                  <span className="font-bold text-slate-700">Tk {r.expense}</span>
                </div>
                {canApprove(currentUser.role) && (
                  <div className="mt-3 flex gap-2 pt-3 border-t border-slate-100">
                    <button onClick={() => updateReportStatus(r.id, 'Approved', '')} className="flex-1 bg-green-50 text-green-600 py-1 rounded-lg text-xs font-bold">Approve</button>
                    <button onClick={() => updateReportStatus(r.id, 'Rejected', 'issue')} className="flex-1 bg-red-50 text-red-600 py-1 rounded-lg text-xs font-bold">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Demands View */}
        {activeTab === 'demands' && (
           <div className="space-y-4 animate-fade-in-up">
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-purple-600 pl-3">Material Demands</h2>
              <div className="bg-white p-5 rounded-2xl shadow-lg">
                 <div className="flex gap-2 mb-3">
                   <input placeholder="Item (e.g. Cement)" className="flex-[2] bg-slate-50 p-3 rounded-xl text-sm outline-none border focus:border-purple-500" value={newDemand.item} onChange={e => setNewDemand({...newDemand, item: e.target.value})} />
                   <input placeholder="Qty" className="flex-1 bg-slate-50 p-3 rounded-xl text-sm outline-none border focus:border-purple-500" value={newDemand.qty} onChange={e => setNewDemand({...newDemand, qty: e.target.value})} />
                 </div>
                 <button onClick={submitDemand} className="w-full bg-purple-700 text-white font-bold py-3 rounded-xl shadow-lg">SEND REQUEST</button>
              </div>
              {demands.map(d => (
                <div key={d.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800">{d.item}</h4>
                    <p className="text-xs text-slate-500">{d.qty} • Requested by {d.requestedBy}</p>
                  </div>
                  {canApprove(currentUser.role) ? (
                    <button onClick={() => toggleDemandStatus(d.id)} className={`px-3 py-1 rounded-lg text-xs font-bold ${d.status==='Fulfilled'?'bg-green-600 text-white':'bg-slate-200 text-slate-600'}`}>{d.status==='Fulfilled'?'✓ DONE':'PENDING'}</button>
                  ) : (
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${d.status==='Fulfilled'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{d.status}</span>
                  )}
                </div>
              ))}
           </div>
        )}

        {/* Wall View */}
        {activeTab === 'wall' && (
           <div className="space-y-4 animate-fade-in-up">
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-green-600 pl-3">Site News Feed</h2>
              <div className="bg-white p-5 rounded-2xl shadow-lg">
                <input placeholder="Title" className="w-full font-bold border-b p-2 mb-2 outline-none" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
                <textarea placeholder="What's happening?" className="w-full bg-slate-50 p-3 rounded-xl text-sm h-20 outline-none" value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} />
                <button onClick={createPost} className="mt-2 bg-green-600 text-white px-6 py-2 rounded-xl font-bold text-sm float-right">POST</button>
                <div className="clear-both"></div>
              </div>
              {posts.map(p => (
                <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm">
                   <div className="flex justify-between">
                     <div className="flex gap-3">
                       <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">{p.author.charAt(0)}</div>
                       <div><h4 className="font-bold text-slate-800">{p.title}</h4><p className="text-xs text-slate-400">{p.author} • {p.date}</p></div>
                     </div>
                     {(currentUser.role === 'superadmin' || currentUser.id === p.userId) && <button onClick={() => deletePost(p.id, p.userId)} className="text-slate-300 hover:text-red-500">🗑</button>}
                   </div>
                   <p className="text-slate-700 mt-3 text-sm leading-relaxed">{p.content}</p>
                </div>
              ))}
           </div>
        )}

        {/* HR Panel View */}
        {activeTab === 'users' && canManageUsers(currentUser.role) && (
           <div className="animate-fade-in-up">
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-slate-800 pl-3 mb-4">HR Management</h2>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {users.map((u, i) => (
                   <div key={u.id} className={`p-4 flex justify-between items-center ${i!==users.length-1 ? 'border-b border-slate-100':''}`}>
                      <div>
                        <p className="font-bold text-slate-800">{u.name}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold text-white ${getRoleColor(u.role)}`}>{u.role}</span>
                      </div>
                      <div className="flex gap-2">
                         {u.role !== 'superadmin' && (
                           <>
                             <select className="bg-slate-50 border rounded text-xs p-1" value={u.role} onChange={(e) => changeUserRole(u.id, e.target.value)} disabled={currentUser.role === 'manager' && ['admin', 'superadmin'].includes(u.role)}>
                               <option value="employee">Emp</option><option value="engineer">Eng</option><option value="manager">Mgr</option>
                               {currentUser.role === 'superadmin' && <option value="admin">Adm</option>}
                             </select>
                             <button onClick={() => deleteUser(u.id)} className="bg-red-50 text-red-500 w-8 h-8 rounded flex items-center justify-center">✕</button>
                           </>
                         )}
                      </div>
                   </div>
                ))}
              </div>
           </div>
        )}

        {/* Hierarchy View */}
        {activeTab === 'hierarchy' && (
           <div className="animate-fade-in-up space-y-4">
              <h2 className="text-xl font-bold text-slate-800 border-l-4 border-orange-500 pl-3">Chain of Command</h2>
              {canPublish(currentUser.role) && (
                 <div className="bg-white p-4 rounded-2xl shadow-lg">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                       <input placeholder="Name" className="border p-2 rounded-lg text-sm" value={newChain.name} onChange={e => setNewChain({...newChain, name: e.target.value})} />
                       <input placeholder="Role" className="border p-2 rounded-lg text-sm" value={newChain.designation} onChange={e => setNewChain({...newChain, designation: e.target.value})} />
                    </div>
                    <div className="flex gap-2">
                       <input placeholder="Phone" className="flex-1 border p-2 rounded-lg text-sm" value={newChain.phone} onChange={e => setNewChain({...newChain, phone: e.target.value})} />
                       <select className="border p-2 rounded-lg text-sm" value={newChain.type} onChange={e => setNewChain({...newChain, type: e.target.value})}><option value="sub">Sub</option><option value="top">Top</option></select>
                       <button onClick={addChainMember} className="bg-slate-800 text-white px-4 rounded-lg text-xs font-bold">ADD</button>
                    </div>
                 </div>
              )}
              {chain.filter(c => c.type === 'top').map(c => (
                 <div key={c.id} className="bg-blue-900 text-white p-6 rounded-2xl text-center shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                    <div className="w-16 h-16 bg-white text-blue-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-2 shadow-lg">{c.name.charAt(0)}</div>
                    <h2 className="text-xl font-bold">{c.name}</h2>
                    <p className="text-blue-200 text-sm font-medium">{c.designation}</p>
                    <p className="text-xs opacity-75 mt-2">📞 {c.phone}</p>
                 </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                 {chain.filter(c => c.type !== 'top').map(c => (
                    <div key={c.id} className="bg-white p-4 rounded-xl shadow-sm text-center border-t-4 border-slate-400">
                       <h4 className="font-bold text-slate-800 text-sm">{c.name}</h4>
                       <p className="text-xs text-blue-600 font-semibold">{c.designation}</p>
                       <p className="text-[10px] text-slate-400 mt-1">{c.phone}</p>
                       {canPublish(currentUser.role) && <button onClick={() => deleteChainMember(c.id)} className="text-red-400 text-xs mt-1">Remove</button>}
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* Office & Notices View */}
        {(activeTab === 'office' || activeTab === 'notices') && (
           <div className="animate-fade-in-up bg-white p-6 rounded-2xl shadow-lg text-center">
              {activeTab === 'office' ? (
                 <>
                   <h2 className="text-xl font-bold text-slate-800 mb-2">HEAD OFFICE</h2>
                   <p className="text-slate-500 text-sm mb-4">Moti Mahal, Abdus Sobhan Dhali Road,<br/>Near Evercare Hospital, Dhaka</p>
                   <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden mb-2"><iframe src="https://maps.google.com/maps?q=23.8070373,90.4275679&z=15&output=embed" width="100%" height="100%" style={{border:0}}></iframe></div>
                   <p className="text-xs text-blue-600 font-bold">niloy9999f@gmail.com</p>
                 </>
              ) : (
                 <>
                   <h2 className="text-xl font-bold text-slate-800 mb-4">PUBLISH NOTICE</h2>
                   <input placeholder="Title" className="w-full border p-3 rounded-xl mb-3" value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} />
                   <textarea placeholder="Details..." className="w-full border p-3 rounded-xl h-24 mb-3" value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} />
                   <button onClick={createNotice} className="w-full bg-yellow-500 text-white font-bold py-3 rounded-xl shadow-lg">PUBLISH NOW</button>
                 </>
              )}
           </div>
        )}

      </div>

      {/* --- BOTTOM FLOATING NAVIGATION (Banking Style) --- */}
      {activeTab !== 'home' && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 z-50">
          <button onClick={() => setActiveTab('home')} className="text-2xl hover:scale-110 transition">🏠</button>
          <div className="w-px h-6 bg-slate-700"></div>
          <button onClick={() => setActiveTab('reports')} className="text-xl hover:text-blue-400 transition">📝</button>
          <button onClick={() => setActiveTab('demands')} className="text-xl hover:text-purple-400 transition">📦</button>
          <button onClick={() => setActiveTab('wall')} className="text-xl hover:text-green-400 transition">📣</button>
        </div>
      )}
    </div>
  );
}

