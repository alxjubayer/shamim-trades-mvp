import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [lang, setLang] = useState('en');

  return (
    <>
      <Head>
        <title>M/S Shamim Trades</title>
        {/* এই লাইনটি আপনার অ্যাপে রং এবং ডিজাইন নিয়ে আসবে */}
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div className="min-h-screen bg-gray-50 p-6 font-sans">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              {lang === 'en' ? 'M/S Shamim Trades' : 'এম/এস শামীম ট্রেডস'}
            </h1>
            <button 
              onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} 
              className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              {lang === 'en' ? 'বাংলা' : 'English'}
            </button>
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
                <li>{lang === 'en' ? 'Welcome to the new system!' : 'নতুন সিস্টেমে স্বাগতম!'}</li>
                <li>{lang === 'en' ? 'Meeting at 4 PM' : 'বিকাল ৪টায় মিটিং'}</li>
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
                  src="https://www.google.com/maps?q=23.7937,90.4066&hl=es;z=14&output=embed"
                  width="100%"
                  height="200"
                  style={{border:0}}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>

          </div>
          
          <div className="bg-gray-100 p-4 text-center text-gray-500 text-sm">
            © 2025 M/S Shamim Trades
          </div>
        </div>
      </div>
    </>
  )
}

