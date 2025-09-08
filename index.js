
import { useState } from 'react'

export default function Home() {
  const [lang,setLang] = useState('en')

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{lang==='en'?'M/S Shamim Trades':'এম/এস শামীম ট্রেডস'}</h1>
        <button onClick={()=>setLang(lang==='en'?'bn':'en')} className="bg-blue-500 text-white px-3 py-1 rounded">
          {lang==='en'?'বাংলা':'English'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">{lang==='en'?'Employee Sign Up':'কর্মচারী নিবন্ধন'}</h2>
          <form className="flex flex-col gap-2">
            <input placeholder={lang==='en'?'Name':'নাম'} className="border p-2 rounded"/>
            <input placeholder={lang==='en'?'Designation':'পদবী'} className="border p-2 rounded"/>
            <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">{lang==='en'?'Submit':'জমা দিন'}</button>
          </form>
        </div>
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">{lang==='en'?'Notice Board':'নোটিশ বোর্ড'}</h2>
          <ul>
            <li>{lang==='en'?'No notices yet':'কোনো নোটিশ নেই'}</li>
          </ul>
        </div>
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">{lang==='en'?'Post Section':'পোস্ট সেকশন'}</h2>
          <textarea placeholder={lang==='en'?'Write something':'কিছু লিখুন'} className="border p-2 rounded w-full"/>
          <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">{lang==='en'?'Post':'পোস্ট দিন'}</button>
        </div>
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold mb-2">{lang==='en'?'Location':'লোকেশন'}</h2>
          <iframe
            src="https://www.google.com/maps?q=23.8070373,90.4275679&hl=bn&z=14&output=embed"
            width="100%"
            height="200"
            style={{border:0}}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
