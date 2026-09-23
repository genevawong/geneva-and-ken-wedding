'use client';

import { useEffect, useMemo, useState } from 'react';
import { ADMIN_PASSWORD, STORAGE_KEY, type Language, type WeddingData, defaultWeddingData } from '@/lib/wedding-data';

const CN = { title: 'Geneva & Ken', heroText: '我們的婚禮', dateLabel: '日期', venueLabel: '場地', locationLabel: '地點', scheduleLabel: '流程', itineraryLabel: '婚禮安排', venueTitle: '場地與交通', parkingTitle: '泊車資料', seatingTitle: '座位圖', searchTitle: '查找座位', searchPlaceholder: '輸入賓客姓名', tableHeader: '枱號', seeAllTables: '查看全部枱位', tableCardLabel: '枱', guestsLabel: '人', noResult: '未找到相關賓客', adminLabel: '後台', openAdmin: '開啟管理', mapAction: '開啟地圖', searchButton: '搜索', languageLabel: 'EN', footerText: 'with love' };

const EN = { title: 'Geneva & Ken', heroText: 'Our Wedding', dateLabel: 'Date', venueLabel: 'Venue', locationLabel: 'Location', scheduleLabel: 'Schedule', itineraryLabel: 'Wedding Timeline', venueTitle: 'Venue & Travel', parkingTitle: 'Parking', seatingTitle: 'Seating Plan', searchTitle: 'Find Your Table', searchPlaceholder: 'Enter guest name', tableHeader: 'Table', seeAllTables: 'View all tables', tableCardLabel: 'Table', guestsLabel: 'Guests', noResult: 'No matching guest found', adminLabel: 'Admin', openAdmin: 'Open admin', mapAction: 'Open map', searchButton: 'Search', languageLabel: '中文', footerText: 'with love' };

export default function WeddingWebsite() {
  const [language, setLanguage] = useState<Language>('zh');
  const [data, setData] = useState<WeddingData>(defaultWeddingData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as WeddingData;
        setData(parsed);
      } catch {
        setData(defaultWeddingData);
      }
    }
  }, []);

  const copy = language === 'zh' ? CN : EN;

  const guestMatches = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return [];

    return data.guests.filter((guest) => {
      const fullName = `${guest.nameZh} ${guest.nameEn}`.toLowerCase();
      return fullName.includes(query);
    });
  }, [data.guests, searchTerm]);

  const selectedGuests = selectedTable
    ? data.guests.filter((guest) => guest.tableNumber === selectedTable)
    : [];

  const tableSummary = useMemo(
    () =>
      data.tables.map((table) => ({
        ...table,
        guests: data.guests.filter((guest) => guest.tableNumber === table.number).length
      })),
    [data.guests, data.tables]
  );

  const cardText = (stringZh: string, stringEn: string) => (language === 'zh' ? stringZh : stringEn);

  return (
    <main className="min-h-screen bg-[#f4f1ed] text-[#1d1a19]">
      <header className="relative overflow-hidden border-b border-[#1d1a19]/10 bg-[#f6f3ef]">
        <div className="section-wrap flex items-center justify-between py-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#8d7a66]">{copy.title}</div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin" className="soft-button text-xs">{copy.openAdmin}</a>
            <button
              className="soft-button text-xs"
              onClick={() => setLanguage((prev) => (prev === 'zh' ? 'en' : 'zh'))}
            >
              {copy.languageLabel}
            </button>
          </div>
        </div>
      </header>

      <section className="section-wrap py-10 sm:py-16">
        <div className="panel overflow-hidden">
          <div className="grid gap-8 px-6 py-8 sm:px-10 lg:grid-cols-[1.5fr_1fr] lg:px-12 lg:py-12">
            <div className="flex flex-col justify-between">
              <div>
                <div className="eyebrow">{copy.heroText}</div>
                <h1 className="mt-4 text-4xl font-light tracking-[0.18em] sm:text-5xl lg:text-6xl">
                  {data.coupleNameEn}
                </h1>
                <h2 className="mt-2 text-xl tracking-[0.2em] text-[#4a443d]">{data.coupleNameZh}</h2>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 text-sm text-[#3d3937]">
                <div className="rounded-full border border-[#1d1a19]/10 bg-white/70 px-4 py-2">
                  <span className="font-medium">{copy.dateLabel}:</span> {data.date}
                </div>
                <div className="rounded-full border border-[#1d1a19]/10 bg-white/70 px-4 py-2">
                  <span className="font-medium">{copy.venueLabel}:</span> {data.venueName}
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#1d1a19]/10 bg-[#f7f1ee] p-6 sm:p-8">
              <div className="eyebrow text-[#7a665d]">{copy.locationLabel}</div>
              <div className="mt-4 text-xl font-medium">{data.venueName}</div>
              <div className="mt-2 text-sm leading-6 text-[#4d4542]">
                {language === 'zh' ? data.venueAddressZh : data.venueAddress}
              </div>
              <a href={data.venueMapUrl} target="_blank" rel="noreferrer" className="primary-button mt-6 w-full">
                {copy.mapAction}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="schedule" className="section-wrap py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="eyebrow">{copy.scheduleLabel}</div>
            <h3 className="mt-2 text-3xl font-light tracking-[0.05em]">{copy.itineraryLabel}</h3>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {data.timeline.map((item) => (
            <div key={item.time} className="panel p-6">
              <div className="text-xs uppercase tracking-[0.3em] text-[#8b7665]">{item.time}</div>
              <h4 className="mt-4 text-2xl font-light">
                {cardText(item.titleZh, item.titleEn)}
              </h4>
              <p className="mt-3 text-sm leading-6 text-[#4b4542]">
                {cardText(item.descriptionZh, item.descriptionEn)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="venue" className="section-wrap py-10">
        <div className="panel p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="eyebrow">{copy.venueTitle}</div>
              <h3 className="mt-3 text-3xl font-light tracking-[0.06em]">{data.venueName}</h3>
              <p className="mt-4 text-base leading-7 text-[#4f4844]">
                {language === 'zh' ? data.venueAddressZh : data.venueAddress}
              </p>
              <a href={data.venueMapUrl} target="_blank" rel="noreferrer" className="soft-button mt-6">
                {copy.mapAction}
              </a>
            </div>

            <div className="rounded-[24px] border border-[#1d1a19]/10 bg-[#f8f4f1] p-5">
              <div className="eyebrow text-[#7a665d]">{copy.parkingTitle}</div>
              <p className="mt-4 text-sm leading-7 text-[#4a443d]">
                {language === 'zh' ? data.parkingInfoZh : data.parkingInfoEn}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="seating" className="section-wrap py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="eyebrow">{copy.seatingTitle}</div>
            <h3 className="mt-2 text-3xl font-light tracking-[0.08em]">{copy.seatingTitle}</h3>
          </div>
          <button className="soft-button text-xs" onClick={() => setSelectedTable(null)}>
            {copy.seeAllTables}
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="panel p-5 sm:p-6">
            <div className="grid grid-cols-5 gap-3">
              {data.tables.map((table) => {
                const guestsForTable = data.guests.filter((guest) => guest.tableNumber === table.number).length;
                const selected = selectedTable === table.number;

                return (
                  <button
                    key={table.number}
                    onClick={() => setSelectedTable(table.number)}
                    className={`rounded-[18px] border p-3 text-left transition ${
                      selected
                        ? 'border-[#1d1a19] bg-[#1d1a19] text-white'
                        : 'border-[#1d1a19]/10 bg-[#faf8f6] text-[#1d1a19] hover:bg-[#f3ece8]'
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-[0.18em] opacity-70">
                      {language === 'zh' ? table.labelZh : table.labelEn}
                    </div>
                    <div className="mt-3 text-xl font-medium">{table.number}</div>
                    <div className="mt-1 text-[11px] opacity-75">
                      {guestsForTable} {copy.guestsLabel}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="panel p-5 sm:p-6">
            {selectedTable ? (
              <>
                <div className="eyebrow">{copy.tableHeader}</div>
                <h4 className="mt-2 text-2xl font-light">{selectedTable}</h4>
                <div className="mt-5 space-y-2">
                  {selectedGuests.length > 0 ? (
                    selectedGuests.map((guest) => (
                      <div key={guest.id} className="rounded-xl border border-[#1d1a19]/10 bg-[#f8f5f2] px-3 py-2 text-sm">
                        <div>{guest.nameZh}</div>
                        <div className="text-[#5b4f49]">{guest.nameEn}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-[#5d514c]">{copy.noResult}</div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="eyebrow">{copy.seatingTitle}</div>
                <h4 className="mt-2 text-2xl font-light">{copy.tableHeader}</h4>
                <div className="mt-5 space-y-2">
                  {tableSummary.slice(0, 8).map((table) => (
                    <button
                      key={table.number}
                      onClick={() => setSelectedTable(table.number)}
                      className="flex w-full items-center justify-between rounded-xl border border-[#1d1a19]/10 bg-[#f8f5f2] px-3 py-2 text-left text-sm"
                    >
                      <span>
                        {language === 'zh' ? table.labelZh : table.labelEn}
                      </span>
                      <span className="text-[#5d514c]">{table.guests} {copy.guestsLabel}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </aside>
        </div>
      </section>

      <section id="search" className="section-wrap py-10">
        <div className="panel p-6 sm:p-8">
          <div className="mb-6">
            <div className="eyebrow">{copy.searchTitle}</div>
            <h3 className="mt-2 text-3xl font-light tracking-[0.08em]">{copy.searchTitle}</h3>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="w-full rounded-full border border-[#1d1a19]/10 bg-white px-5 py-3 text-sm outline-none focus:border-[#1d1a19]/30"
            />
            <button className="primary-button sm:w-auto" onClick={() => setSearchTerm(searchTerm)}>
              {copy.searchButton}
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {searchTerm.trim() ? (
              guestMatches.length ? (
                guestMatches.slice(0, 10).map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between rounded-2xl border border-[#1d1a19]/10 bg-[#f8f5f2] px-4 py-3">
                    <div>
                      <div>{guest.nameZh}</div>
                      <div className="text-sm text-[#5e534e]">{guest.nameEn}</div>
                    </div>
                    <div className="rounded-full bg-[#1d1a19] px-3 py-1 text-xs text-white">
                      {copy.tableHeader} {guest.tableNumber}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#1d1a19]/20 px-4 py-8 text-center text-sm text-[#5b4f49]">
                  {copy.noResult}
                </div>
              )
            ) : (
              <div className="rounded-2xl border border-dashed border-[#1d1a19]/20 px-4 py-8 text-center text-sm text-[#5b4f49]">
                {copy.searchPlaceholder}
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="section-wrap pb-12 pt-8 text-center text-sm text-[#5d514d]">
        {copy.footerText}
      </footer>
    </main>
  );
}
