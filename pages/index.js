import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState('auth'); // auth, dashboard, forgot
  const [authMode, setAuthMode] = useState('login'); // login, signup
  const [currentUser, setCurrentUser] = useState(null);
  
  // Auth Inputs
  const [loginInput, setLoginInput] = useState(''); // Phone or Email
  const [password, setPassword] = useState('');
  
  // Registration Form
  const [regForm, setRegForm] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    designation: '', 
    password: '', 
    role: 'employee' 
  });

  // Dashboard Navigation
  const [activeTab, setActiveTab] = useState('home'); 

  // DATA STORAGE
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [demands, setDemands] = useState([]);
  const [posts, setPosts] = useState([]);
  const [notices, setNotices] = useState([]);
  const [chain, setChain] = useState([]);

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    // Load data from LocalStorage safely
    if (typeof window !== 'undefined') {
      const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const savedReports = JSON.parse(localStorage.getItem('reports')) || [];
      const savedDemands = JSON.parse(localStorage.getItem('demands')) || [];
      const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];
      const savedNotices = JSON.parse(localStorage.getItem('notices')) || [];
      const savedChain = JSON.parse(localStorage.getItem('chain')) || [];

      // Create Super Admin if not exists (YOU)
      if (!savedUsers.find(u => u.role === 'superadmin')) {
        savedUsers.push({ 
          id: 1, 
          name: 'Al Jubayer (Niloy)', 
          phone: '01749534641', 
          email: 'niloy9999f@gmail.com', 
          password: '123456', // YOUR DEFAULT PASSWORD
          designation: 'Chairman & Owner', 
          role: 'superadmin', 
          active: true, 
          comments: [] 
        });
      }

      // Default Chain
      if (savedChain.length === 0) {
         savedChain.push({ id: 1, name: 'Al Jubayer (Niloy)', designation: 'Chairman', phone: '01749534641', type: 'top' });
      }

      setUsers(savedUsers);
      setReports(savedReports);
      setDemands(savedDemands);
      setPosts(savedPosts);
      setNotices(savedNotices);
      setChain(savedChain);
    }
  }, []);

  // --- AUTO SAVE ---
  useEffect(() => { if(typeof window !== 'undefined') localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { if(typeof window !== 'undefined') localStorage.setItem('reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { if(typeof window !== 'undefined') localStorage.setItem('demands', JSON.stringify(demands)); }, [demands]);
  useEffect(() => { if(typeof window !== 'undefined') localStorage.setItem('posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { if(typeof window !== 'undefined') localStorage.setItem('notices', JSON.stringify(notices)); }, [notices]);
  useEffect(() => { if(typeof window !== 'undefined') localStorage.setItem('chain', JSON.stringify(chain)); }, [chain]);

  // --- PERMISSION HELPERS ---
  const canManageUsers = (role) => ['superadmin', 'admin', 'manager'].includes(role);
  const canApprove = (role) => ['superadmin', 'admin', 'manager'].includes(role);
  const canPublish = (role) => ['superadmin', 'admin', 'manager'].includes(role);

  // --- AUTH FUNCTIONS (NO OTP) ---
  const handleLogin = () => {
    // Search by Phone OR Email
    const user = users.find(u => u.phone === loginInput || u.email === loginInput);
    
    if (!user) return alert("User not found! Please Register.");
    if (!user.active) return alert("Account is deactivated.");
    
    if (user.password === password) {
      setCurrentUser(user);
      setView('dashboard');
      setActiveTab('home');
      setLoginInput('');
      setPassword('');
    } else {
      alert("Incorrect Password!");
    }
  };

  const handleRegister = () => {
    if(!regForm.name || !regForm.phone || !regForm.password) return alert("Name, Phone & Password required!");
    
    if(users.find(u => u.phone === regForm.phone)) return alert("Phone number already exists!");
    
    const newUser = { 
      id: Date.now(), 
      ...regForm, 
      active: true, 
      comments: [] 
    };
    
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setView('dashboard');
    setActiveTab('home');
    alert("Welcome to Shamim Traders!");
  };

  const handleForgot = () => {
    // Simulation
    if(!loginInput) return alert("Enter Phone or Email first.");
    const user = users.find(u => u.phone === loginInput || u.email === loginInput);
    if(user) {
      alert(`Password reset link sent to ${loginInput} (Demo)`);
      setView('auth');
    } else {
      alert("User not found.");
    }
  };

  // --- FEATURES ---
  const [newReport, setNewReport] = useState({ site: '', desc: '', expense: '' });
  const submitReport = () => {
    if (!newReport.site) return alert("Site Name required");
    setReports([{ id: Date.now(), userId: currentUser.id, submittedBy: currentUser.name, date: new Date().toLocaleDateString(), ...newReport, status: 'Pending' }, ...reports]);
    setNewReport({ site: '', desc: '', expense: '' });
    alert("Report Sent!");
  };

  const [newDemand, setNewDemand] = useState({ item: '', qty: '' });
  const submitDemand = () => {
    if (!newDemand.item) return alert("Item required");
    setDemands([{ id: Date.now(), userId: currentUser.id, requestedBy: currentUser.name, date: new Date().toLocaleDateString(), ...newDemand, status: 'Pending' }, ...demands]);
    setNewDemand({ item: '', qty: '' });
    alert("Demand Sent!");
  };

  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const createPost = () => {
    if(!newPost.title) return alert("Title required");
    setPosts([{ id: Date.now(), userId: currentUser.id, author: currentUser.name, role: currentUser.role, ...newPost, date: new Date().toLocaleString() }, ...posts]);
    setNewPost({ title: '', content: '' });
  };

  const changeUserRole = (id, role) => {
    if(id === 1) return alert("Cannot change Super Admin");
    setUsers(users.map(u => u.id === id ? {...u, role} : u));
  };
  
  const deleteUser = (id) => {
    if(id === 1) return alert("Cannot delete Super Admin");
    if(confirm("Delete User?")) setUsers(users.filter(u => u.id !== id));
  };

  // --- RENDER ---
  
  // 1. LOGIN / REGISTER SCREEN (Apple Water Theme)
  if (view === 'auth' || view === 'forgot') {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#e0f7fa] font-sans">
        <Head>
           <title>M/S Shamim Traders</title>
           <script src="https://cdn.tailwindcss.com"></script>
           <style>{`
             @keyframes blob {
               0% { transform: translate(0px, 0px) scale(1); }
               33% { transform: translate(30px, -50px) scale(1.1); }
               66% { transform: translate(-20px, 20px) scale(0.9); }
               100% { transform: translate(0px, 0px) scale(1); }
             }
             .animate-blob { animation: blob 7s infinite; }
             .animation-delay-2000 { animation-delay: 2s; }
             .animation-delay-4000 { animation-delay: 4s; }
             .glass { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.6); }
           `}</style>
        </Head>

        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        {/* Glass Card */}
        <div className="glass relative z-10 p-8 rounded-3xl shadow-xl w-full max-w-sm m-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 drop-shadow-sm">Shamim Traders</h1>
            <p className="text-xs font-semibold tracking-widest text-blue-600 mt-2 uppercase">Engineering Excellence</p>
          </div>

          {view === 'forgot' ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-700 text-center">Reset Password</h2>
              <input 
                placeholder="Mobile or Email" 
                className="w-full p-4 rounded-xl bg-white/60 border-none outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
                value={loginInput} onChange={e => setLoginInput(e.target.value)}
              />
              <button onClick={handleForgot} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition transform active:scale-95">Send Reset Link</button>
              <button onClick={() => setView('auth')} className="w-full text-center text-gray-500 text-sm mt-2">Back to Login</button>
            </div>
          ) : (
            <>
              {/* Toggle Switch */}
              <div className="flex bg-gray-200/50 rounded-xl p-1 mb-6">
                <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${authMode==='login' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Login</button>
                <button onClick={() => setAuthMode('signup')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${authMode==='signup' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Register</button>
              </div>

              <div className="space-y-4">
                {authMode === 'signup' && (
                  <>
                    <input placeholder="Full Name" className="w-full p-4 rounded-xl bg-white/60 outline-none shadow-sm" onChange={e => setRegForm({...regForm, name: e.target.value})} />
                    <input placeholder="Designation" className="w-full p-4 rounded-xl bg-white/60 outline-none shadow-sm" onChange={e => setRegForm({...regForm, designation: e.target.value})} />
                    <input placeholder="Email (Optional)" className="w-full p-4 rounded-xl bg-white/60 outline-none shadow-sm" onChange={e => setRegForm({...regForm, email: e.target.value})} />
                  </>
                )}

                <input 
                  placeholder={authMode === 'login' ? "Mobile or Email" : "Mobile Number"} 
                  className="w-full p-4 rounded-xl bg-white/60 outline-none shadow-sm focus:ring-2 focus:ring-blue-400"
                  value={authMode === 'login' ? loginInput : regForm.phone} 
                  onChange={e => authMode === 'login' ? setLoginInput(e.target.value) : setRegForm({...regForm, phone: e.target.value})} 
                />

                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full p-4 rounded-xl bg-white/60 outline-none shadow-sm focus:ring-2 focus:ring-blue-400"
                  value={authMode === 'login' ? password : regForm.password} 
                  onChange={e => authMode === 'login' ? setPassword(e.target.value) : setRegForm({...regForm, password: e.target.value})} 
                />

                {authMode === 'login' && (
                  <div className="text-right">
                    <button onClick={() => setView('forgot')} className="text-sm text-blue-500 font-semibold hover:underline">Forgot Password?</button>
                  </div>
                )}

                <button 
                  onClick={authMode === 'login' ? handleLogin : handleRegister} 
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg transition transform active:scale-95"
                >
                  {authMode === 'login' ? 'Login' : 'Create Account'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // 2. DASHBOARD SCREEN
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-28">
      <Head><title>Dashboard</title><script src="https://cdn.tailwindcss.com"></script></Head>

      {/* Glass Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 border-b border-gray-200 shadow-sm flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase">Welcome,</p>
          <h1 className="text-xl font-bold text-gray-800">{currentUser.name}</h1>
        </div>
        <div className="h-10 w-10 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
          {currentUser.name.charAt(0)}
        </div>
      </div>

      <div className="p-6">
        
        {/* Main Menu Grid (Apple Style) */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-2 gap-4">
             {[
               { id: 'reports', icon: '📝', label: 'Reports', color: 'bg-blue-100 text-blue-600' },
               { id: 'demands', icon: '📦', label: 'Demands', color: 'bg-purple-100 text-purple-600' },
               { id: 'wall', icon: '📣', label: 'News', color: 'bg-green-100 text-green-600' },
               { id: 'office', icon: '📍', label: 'Office', color: 'bg-red-100 text-red-600' },
             ].map(item => (
               <button key={item.id} onClick={() => setActiveTab(item.id)} className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition active:scale-95 flex flex-col items-center gap-3">
                 <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-2xl`}>{item.icon}</div>
                 <span className="font-bold text-gray-600 text-sm">{item.label}</span>
               </button>
             ))}
             
             {canManageUsers(currentUser.role) && (
               <button onClick={() => setActiveTab('users')} className="col-span-2 bg-slate-800 p-5 rounded-3xl shadow-lg flex items-center justify-center gap-3 text-white active:scale-95 transition">
                 <span className="text-2xl">👥</span> <span className="font-bold">HR Management Panel</span>
               </button>
             )}
          </div>
        )}

        {/* Reports View */}
        {activeTab === 'reports' && (
           <div className="space-y-4 animate-fade-in">
             <h2 className="text-2xl font-bold text-gray-800">Daily Reports</h2>
             <div className="bg-white p-5 rounded-3xl shadow-lg">
               <input placeholder="Site Name" className="w-full bg-slate-50 p-3 rounded-xl mb-2 outline-none" value={newReport.site} onChange={e => setNewReport({...newReport, site: e.target.value})} />
               <input placeholder="Expense (Tk)" type="number" className="w-full bg-slate-50 p-3 rounded-xl mb-2 outline-none" value={newReport.expense} onChange={e => setNewReport({...newReport, expense: e.target.value})} />
               <textarea placeholder="Work details..." className="w-full bg-slate-50 p-3 rounded-xl mb-2 h-20 outline-none" value={newReport.desc} onChange={e => setNewReport({...newReport, desc: e.target.value})} />
               <button onClick={submitReport} className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl shadow-md">Submit</button>
             </div>
             {reports.map(r => (
               <div key={r.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                 <div className="flex justify-between font-bold text-gray-800"><span>{r.site}</span><span className="text-blue-500">Tk {r.expense}</span></div>
                 <p className="text-gray-500 text-sm my-2">{r.desc}</p>
                 <div className="text-xs text-gray-400 flex justify-between"><span>{r.date}</span><span>{r.status}</span></div>
               </div>
             ))}
           </div>
        )}

        {/* Demands View */}
        {activeTab === 'demands' && (
           <div className="space-y-4 animate-fade-in">
             <h2 className="text-2xl font-bold text-gray-800">Material Demand</h2>
             <div className="bg-white p-5 rounded-3xl shadow-lg">
               <div className="flex gap-2 mb-2">
                 <input placeholder="Item" className="flex-[2] bg-slate-50 p-3 rounded-xl outline-none" value={newDemand.item} onChange={e => setNewDemand({...newDemand, item: e.target.value})} />
                 <input placeholder="Qty" className="flex-1 bg-slate-50 p-3 rounded-xl outline-none" value={newDemand.qty} onChange={e => setNewDemand({...newDemand, qty: e.target.value})} />
               </div>
               <button onClick={submitDemand} className="w-full bg-purple-500 text-white font-bold py-3 rounded-xl shadow-md">Request</button>
             </div>
             {demands.map(d => (
               <div key={d.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
                 <div><p className="font-bold text-gray-800">{d.item}</p><p className="text-xs text-gray-400">{d.qty} • {d.requestedBy}</p></div>
                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${d.status==='Pending'?'bg-yellow-100 text-yellow-600':'bg-green-100 text-green-600'}`}>{d.status}</span>
               </div>
             ))}
           </div>
        )}

        {/* HR Panel View */}
        {activeTab === 'users' && canManageUsers(currentUser.role) && (
           <div className="space-y-4 animate-fade-in">
             <h2 className="text-2xl font-bold text-gray-800">Team Members</h2>
             <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
               {users.map((u, i) => (
                 <div key={u.id} className={`p-4 flex justify-between items-center ${i!==users.length-1?'border-b border-gray-100':''}`}>
                   <div><p className="font-bold text-gray-800">{u.name}</p><p className="text-xs text-gray-400">{u.role}</p></div>
                   {u.role !== 'superadmin' && (
                     <div className="flex gap-2">
                       <select className="bg-slate-100 text-xs p-1 rounded" value={u.role} onChange={e => changeUserRole(u.id, e.target.value)}>
                         <option value="employee">Emp</option><option value="engineer">Eng</option><option value="manager">Mgr</option>
                       </select>
                       <button onClick={() => deleteUser(u.id)} className="text-red-500 font-bold px-2">✕</button>
                     </div>
                   )}
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* Office View */}
        {activeTab === 'office' && (
           <div className="bg-white p-6 rounded-3xl shadow-lg text-center">
             <h2 className="text-xl font-bold mb-2">HEAD OFFICE</h2>
             <p className="text-gray-500 text-sm mb-4">Moti Mahal, Abdus Sobhan Dhali Road,<br/>Near Evercare Hospital, Dhaka</p>
             <div className="h-48 bg-gray-100 rounded-2xl overflow-hidden mb-2">
                <iframe src="https://maps.google.com/maps?q=23.8070373,90.4275679&z=15&output=embed" width="100%" height="100%" style={{border:0}}></iframe>
             </div>
             <p className="text-xs text-blue-500 font-bold">niloy9999f@gmail.com</p>
           </div>
        )}
        
        {/* Wall & Notices (Simplified for brevity) */}
        {activeTab === 'wall' && (
            <div className="space-y-4">
               <h2 className="text-2xl font-bold">News Feed</h2>
               <div className="bg-white p-4 rounded-3xl shadow"><input placeholder="Title" className="w-full font-bold mb-2 outline-none" value={newPost.title} onChange={e=>setNewPost({...newPost,title:e.target.value})}/><textarea placeholder="Update..." className="w-full outline-none text-sm" value={newPost.content} onChange={e=>setNewPost({...newPost,content:e.target.value})}/><button onClick={createPost} className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold mt-2">Post</button></div>
               {posts.map(p => <div key={p.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100"><h4 className="font-bold">{p.title}</h4><p className="text-gray-600 text-sm">{p.content}</p></div>)}
            </div>
        )}

      </div>

      {/* Floating Bottom Nav */}
      {activeTab !== 'home' && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex bg-white/80 backdrop-blur-xl p-2 rounded-full shadow-2xl border border-white z-50">
          <button onClick={() => setActiveTab('home')} className="p-3 bg-slate-800 text-white rounded-full shadow-lg hover:scale-110 transition">🏠</button>
          <div className="w-px h-8 bg-gray-300 mx-2 self-center"></div>
          <button onClick={() => setView('auth')} className="p-3 bg-red-100 text-red-500 rounded-full hover:scale-110 transition">🚪</button>
        </div>
      )}
    </div>
  );
}

