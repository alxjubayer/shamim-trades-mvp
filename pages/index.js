import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [lang, setLang] = useState('en');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // লগইন চেক করার জন্য
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // লগইন ফাংশন
  const handleLogin = (e) => {
    e.preventDefault();
    // আপাতত যেকোনো নাম বা পাসওয়ার্ড দিলেই লগইন হবে (পরে আমরা আসল পাসওয়ার্ড সেট করব)
    if (username && password) {
      setIsLoggedIn(true);
    } else {
      alert(lang === 'en' ? 'Please enter username and password' : 'দয়া করে নাম এবং পাসওয়ার্ড দিন');
    }
  };

  // যদি লগইন না করা থাকে, তবে লগইন পেজ দেখাবে
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-4">
        <Head>
          <title>Login - M/S Shamim Traders</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </Head>
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
            {lang === 'en' ? 'M/S Shamim Traders' : 'এম/এস শামীম ট্রেডার্স'}
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {lang === 'en' ? 'Username' : 'ইউজারনেম'}
              </label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {lang === 'en' ? 'Password' : 'পাসওয়ার্ড'}
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="******"
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition">
              {lang === 'en' ? 'Login' : 'লগইন করুন'}
            </button>
          </form>
          <div className="mt-4 text-center">
             <button onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} className="text-sm text-gray-500 hover:text-blue-500">
               {lang === 'en' ? 'বাংলায় দেখুন' : 'Switch to English'}
             </button>
          </div>
        </div>
      </div>
    );
  }

  // লগইন সফল হলে ড্যাশবোর্ড দেখাবে
  return (
    <>
      <Head>
        <title>M/S Shamim Traders</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div className="min-h-screen bg-gray-50 p-4 font-sans">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {lang === 'en' ? 'M/S Shamim Traders' : 'এম/এস শামীম ট্রেডার্স'}
              </h1>
              <p className="text-sm opacity-80">{lang === 'en' ? 'Authorized Dashboard' : 'অনুমোদিত ড্যাশবোর্ড'}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} 
                className="bg-white/20 text-white px-3 py-1 rounded-full text-sm hover:bg-white/30 transition"
              >
                {lang === 'en' ? 'বাংলা' : 'ENG'}
              </button>
              <button 
                onClick={() => setIsLoggedIn(false)} 
                className="bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition"
              >
                {lang === 'en' ? 'Logout' : 'লগ আউট'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            
            {/* Employee Sign Up */}
            <div className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white">
              <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">
                {lang === 'en' ? 'Employee Sign Up' : 'কর্মচারী নিবন্ধন'}
              </h2>
              <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                <label className="text-sm font-medium text-gray-600">{lang === 'en' ? 'Name' : 'নাম'}</label>
                <input placeholder="..." className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                
                <label className="text-sm font-medium text-gray-600">{lang === 'en' ? 'Designation' : 'পদবী'}</label>
                <input placeholder="..." className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" />
                
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded mt-2 transition">
                  {lang === 'en' ? 'Submit' : 'জমা দিন'}
                </button>
              </form>
            </div>

            {/* Notice Board */}
            <div className="border border-yellow-200 rounded-xl p-6 shadow-sm bg-yellow-50">
              <h2 className="text-xl font-bold mb-4 text-yellow-800 border-b border-yellow-200 pb-2">
                {lang === 'en' ? 'Notice Board' : 'নোটিশ বোর্ড'}
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>{lang === 'en' ? 'Welcome to Shamim Traders!' : 'শামীম ট্রেডার্সে স্বাগতম!'}</li>
                <li>{lang === 'en' ? 'System Updated Successfully' : 'সিস্টেম সফলভাবে আপডেট হয়েছে'}</li>
              </ul>
            </div>

            {/* Post Section */}
            <div className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white">
              <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">
                {lang === 'en' ? 'Post Section' : 'পোস্ট সেকশন'}
              </h2>
              <textarea 
                placeholder={lang === 'en' ? 'Write something...' : 'কিছু লিখুন...'} 
                className="border p-3 rounded w-full h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              ></textarea>
              <button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-2 rounded transition">
                {lang === 'en' ? 'Post' : 'পোস্ট দিন'}
              </button>
            </div>

            {/* Location */}
            <div className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white">
              <h2 className="text-xl font-bold mb-4 text-gray-700 border-b pb-2">
                {lang === 'en' ? 'Location' : 'লোকেশন'}
              </h2>
              <div className="rounded-lg overflow-hidden border">
                <iframe

