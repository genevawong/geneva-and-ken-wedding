'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { saveCloudWeddingData } from '@/lib/cloud-wedding-data';
import { type WeddingData, defaultWeddingData } from '@/lib/wedding-data';

export default function AdminDashboard() {
  const [session, setSession] = useState<unknown>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState<WeddingData>(defaultWeddingData);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: result }) => setSession(result.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session || !supabase) return;
    supabase.from('wedding_settings').select('data').eq('id', 'main').maybeSingle().then(({ data: result }) => {
      if (result?.data) setData({ ...defaultWeddingData, ...result.data } as WeddingData);
    });
  }, [session]);

  async function login() {
    if (!supabase) return setMessage('未設定 Supabase。');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? `登入失敗：${error.message}` : '登入成功');
  }

  async function save() {
    try {
      await saveCloudWeddingData(data);
      setMessage('已儲存到 Supabase。');
    } catch (error) {
      setMessage(`儲存失敗：${error instanceof Error ? error.message : '請稍後再試'}`);
    }
  }

  function updateTimeline(index: number, field: string, value: string) {
    setData((current) => {
      const timeline = [...current.timeline];
      timeline[index] = { ...timeline[index], [field]: value };
      return { ...current, timeline };
    });
  }

  function updateGuest(id: string, field: 'nameZh' | 'nameEn' | 'tableNumber', value: string | number) {
    setData((current) => ({ ...current, guests: current.guests.map((guest) => guest.id === id ? { ...guest, [field]: value } : guest) }));
  }

  if (!session) return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f1ed] px-4">
      <div className="w-full max-w-md rounded-[28px] border border-[#1d1a19]/10 bg-white/75 p-8 shadow-soft">
        <div className="eyebrow">Admin</div>
        <h1 className="mt-4 text-3xl font-light">Geneva & Ken</h1>
        <p className="mt-3 text-sm text-[#5d514c]">請使用 Supabase admin account 登入</p>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mt-6 w-full rounded-full border border-[#1d1a19]/10 bg-[#f8f5f2] px-4 py-3" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="mt-3 w-full rounded-full border border-[#1d1a19]/10 bg-[#f8f5f2] px-4 py-3" />
        <button onClick={login} className="primary-button mt-5 w-full">登入 Login</button>
        {message && <p className="mt-4 text-sm text-[#8b554f]">{message}</p>}
      </div>
    </main>
  );

  return (
    <main className="section-wrap py-10">
      <div className="mb-8 flex items-center justify-between gap-3">
        <div><div className="eyebrow">Admin</div><h1 className="mt-2 text-4xl font-light">Dashboard</h1></div>
        <div className="flex gap-2"><button onClick={save} className="primary-button">儲存 Save</button><button onClick={() => supabase?.auth.signOut()} className="soft-button">登出</button></div>
      </div>
      {message && <div className="mb-6 rounded-xl bg-white p-4 text-sm">{message}</div>}
      <div className="space-y-8">
        <section className="panel p-6"><h2 className="text-xl font-medium">Wedding details</h2><div className="mt-4 grid gap-4 md:grid-cols-2">
          {([['coupleNameEn','Couple name (EN)'],['coupleNameZh','Couple name (中文)'],['date','Date'],['venueName','Venue'],['venueAddress','Address (EN)'],['venueAddressZh','地址（中文）'],['venueMapUrl','Map URL'],['parkingInfoEn','Parking (EN)'],['parkingInfoZh','泊車（中文）']] as const).map(([field,label]) => <label key={field} className="text-sm">{label}<input value={String(data[field])} onChange={(e) => setData((current) => ({ ...current, [field]: e.target.value }))} className="mt-2 w-full rounded-xl border border-[#1d1a19]/10 bg-[#f8f5f2] px-3 py-2" /></label>)}
        </div></section>
        <section className="panel p-6"><h2 className="text-xl font-medium">Timeline</h2><div className="mt-5 space-y-4">{data.timeline.map((item,index) => <div key={`${item.time}-${index}`} className="grid gap-3 rounded-2xl bg-[#f8f5f2] p-4 md:grid-cols-3"><label className="text-sm">Time<input value={item.time} onChange={(e) => updateTimeline(index,'time',e.target.value)} className="mt-2 w-full rounded-xl border bg-white px-3 py-2" /></label><label className="text-sm">Title 中文<input value={item.titleZh} onChange={(e) => updateTimeline(index,'titleZh',e.target.value)} className="mt-2 w-full rounded-xl border bg-white px-3 py-2" /></label><label className="text-sm">Title English<input value={item.titleEn} onChange={(e) => updateTimeline(index,'titleEn',e.target.value)} className="mt-2 w-full rounded-xl border bg-white px-3 py-2" /></label></div>)}</div></section>
        <section className="panel p-6"><h2 className="text-xl font-medium">Guests / 賓客</h2><div className="mt-5 space-y-3">{data.guests.map((guest) => <div key={guest.id} className="grid gap-3 rounded-2xl bg-[#f8f5f2] p-4 md:grid-cols-3"><input value={guest.nameZh} onChange={(e) => updateGuest(guest.id,'nameZh',e.target.value)} placeholder="中文名" className="rounded-xl border bg-white px-3 py-2" /><input value={guest.nameEn} onChange={(e) => updateGuest(guest.id,'nameEn',e.target.value)} placeholder="English name" className="rounded-xl border bg-white px-3 py-2" /><input type="number" min="1" max="25" value={guest.tableNumber} onChange={(e) => updateGuest(guest.id,'tableNumber',Number(e.target.value))} placeholder="Table" className="rounded-xl border bg-white px-3 py-2" /></div>)}</div></section>
      </div>
    </main>
  );
}
