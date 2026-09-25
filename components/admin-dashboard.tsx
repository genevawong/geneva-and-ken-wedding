'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  saveWeddingData,
  loadWeddingData,
  defaultWeddingData,
  type WeddingData
} from '@/lib/wedding-data';

export default function AdminDashboard() {
  const [session, setSession] = useState<unknown>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState<WeddingData>(defaultWeddingData);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!supabase) {
      setMessage('Supabase is not configured yet.');
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) return;

    async function hydrate() {
      const loaded = await loadWeddingData();
      setData(loaded);
    }

    hydrate();
  }, [session]);

  async function login() {
    if (!supabase) return setMessage('Supabase is not configured.');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setMessage(error ? `Login failed: ${error.message}` : 'Login successful.');
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage('Signed out.');
  }

  async function saveAndReload() {
    try {
      await saveWeddingData(data);
      setMessage('Saved to Supabase successfully.');
    } catch (error) {
      setMessage(`Save failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  function updateTimeline(index: number, field: string, value: string) {
    setData((current) => {
      const timeline = [...current.timeline];
      timeline[index] = { ...timeline[index], [field]: value };
      return { ...current, timeline };
    });
  }

  function updateGuest(
    id: string,
    field: 'nameZh' | 'nameEn' | 'tableNumber',
    value: string | number
  ) {
    setData((current) => ({
      ...current,
      guests: current.guests.map((guest) =>
        guest.id === id ? { ...guest, [field]: value } : guest
      )
    }));
  }

  function addGuest() {
    setData((current) => ({
      ...current,
      guests: [
        ...current.guests,
        {
          id: `guest-${Date.now()}`,
          nameZh: '新增賓客',
          nameEn: 'New Guest',
          tableNumber: 1
        }
      ]
    }));
  }

  function deleteGuest(id: string) {
    setData((current) => ({
      ...current,
      guests: current.guests.filter((guest) => guest.id !== id)
    }));
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f1ed] px-4">
        <div className="w-full max-w-md rounded-[28px] border border-[#1d1a19]/10 bg-white/75 p-8 shadow-soft">
          <div className="eyebrow">Admin</div>
          <h1 className="mt-4 text-3xl font-light tracking-[0.08em]">Login</h1>
          <p className="mt-2 text-sm text-[#5d514c]">Use your Supabase admin account</p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mt-6 w-full rounded-full border border-[#1d1a19]/10 bg-[#f8f5f2] px-4 py-3 outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mt-3 w-full rounded-full border border-[#1d1a19]/10 bg-[#f8f5f2] px-4 py-3 outline-none"
          />

          <button onClick={login} className="primary-button mt-6 w-full">
            Login
          </button>

          {message && <p className="mt-4 text-sm text-[#8a5b54]">{message}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="section-wrap py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="eyebrow">Admin</div>
          <h1 className="mt-2 text-4xl font-light tracking-[0.08em]">Dashboard</h1>
        </div>

        <div className="flex gap-2">
          <button onClick={saveAndReload} className="primary-button">
            Save
          </button>
          <button onClick={signOut} className="soft-button">
            Logout
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-2xl border border-[#1d1a19]/10 bg-white p-4 text-sm">
          {message}
        </div>
      )}

      <div className="space-y-8">
        <section className="panel p-6">
          <h2 className="text-xl font-medium">Wedding details</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              Couple name (EN)
              <input
                value={data.coupleNameEn}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, coupleNameEn: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-[#1d1a19]/10 bg-[#f8f5f2] px-3 py-2"
              />
            </label>

            <label className="text-sm">
              Couple name (ZH)
              <input
                value={data.coupleNameZh}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, coupleNameZh: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-[#1d1a19]/10 bg-[#f8f5f2] px-3 py-2"
              />
            </label>

            <label className="text-sm">
              Date
              <input
                value={data.date}
                onChange={(e) => setData((prev) => ({ ...prev, date: e.target.value }))}
                className="mt-2 w-full rounded-xl border border-[#1d1a19]/10 bg-[#f8f5f2] px-3 py-2"
              />
            </label>

            <label className="text-sm">
              Venue Name
              <input
                value={data.venueName}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, venueName: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-[#1d1a19]/10 bg-[#f8f5f2] px-3 py-2"
              />
            </label>

            <label className="text-sm md:col-span-2">
              Venue address (EN)
              <input
                value={data.venueAddress}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, venueAddress: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-[#1d1a19]/10 bg-[#f8f5f2] px-3 py-2"
              />
            </label>

            <label className="text-sm md:col-span-2">
              Venue address (ZH)
              <input
                value={data.venueAddressZh}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, venueAddressZh: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-[#1d1a19]/10 bg-[#f8f5f2] px-3 py-2"
              />
            </label>

            <label className="text-sm md:col-span-2">
              Map URL
              <input
                value={data.venueMapUrl}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, venueMapUrl: e.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-[#1d1a19]/10 bg-[#f8f5f2] px-3 py-2"
              />
            </label>
          </div>
        </section>

        <section className="panel p-6">
          <h2 className="text-xl font-medium">Timeline</h2>
          <div className="mt-5 space-y-4">
            {data.timeline.map((item, index) => (
              <div
                key={`${item.time}-${index}`}
                className="grid gap-3 rounded-2xl border border-[#1d1a19]/10 bg-[#f8f5f2] p-4 md:grid-cols-4"
              >
                <label className="text-sm">
                  Time
                  <input
                    value={item.time}
                    onChange={(e) => updateTimeline(index, 'time', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#1d1a19]/10 bg-white px-3 py-2"
                  />
                </label>

                <label className="text-sm">
                  Title (ZH)
                  <input
                    value={item.titleZh}
                    onChange={(e) => updateTimeline(index, 'titleZh', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#1d1a19]/10 bg-white px-3 py-2"
                  />
                </label>

                <label className="text-sm">
                  Title (EN)
                  <input
                    value={item.titleEn}
                    onChange={(e) => updateTimeline(index, 'titleEn', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#1d1a19]/10 bg-white px-3 py-2"
                  />
                </label>

                <label className="text-sm md:col-span-4">
                  Description
                  <input
                    value={item.descriptionZh}
                    onChange={(e) => updateTimeline(index, 'descriptionZh', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#1d1a19]/10 bg-white px-3 py-2"
                  />
                </label>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">Guest list</h2>
            <button onClick={addGuest} className="soft-button">
              Add guest
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {data.guests.map((guest) => (
              <div
                key={guest.id}
                className="grid gap-3 rounded-2xl border border-[#1d1a19]/10 bg-[#f8f5f2] p-4 md:grid-cols-[1fr_1fr_100px_50px]"
              >
                <label className="text-sm">
                  Chinese name
                  <input
                    value={guest.nameZh}
                    onChange={(e) => updateGuest(guest.id, 'nameZh', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#1d1a19]/10 bg-white px-3 py-2"
                  />
                </label>

                <label className="text-sm">
                  English name
                  <input
                    value={guest.nameEn}
                    onChange={(e) => updateGuest(guest.id, 'nameEn', e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#1d1a19]/10 bg-white px-3 py-2"
                  />
                </label>

                <label className="text-sm">
                  Table
                  <input
                    type="number"
                    value={guest.tableNumber}
                    onChange={(e) =>
                      updateGuest(guest.id, 'tableNumber', Number(e.target.value))
                    }
                    className="mt-2 w-full rounded-xl border border-[#1d1a19]/10 bg-white px-3 py-2"
                  />
                </label>

                <button
                  onClick={() => deleteGuest(guest.id)}
                  className="self-end rounded-xl bg-[#1d1a19] px-3 py-2 text-sm text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
