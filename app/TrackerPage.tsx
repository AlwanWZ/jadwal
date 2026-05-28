'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './tracker.module.css';

// ═════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════

interface Card {
  id: string;
  num: string;
  title: string;
  desc: string;
  tag: string;
  tagLabel: string;
  cls: string;
  hours: string;
}

interface ScheduleRow {
  id: string;
  time: string;
  task: string;
  sub: string;
  badge: string;
  badgeLabel: string;
}

interface Day {
  id: string;
  date: string;
  label: string;
  dot: string;
  status: string;
  statusLabel: string;
  rows: ScheduleRow[];
}

// ═════════════════════════════════════════════════════════════
// DATA
// ═════════════════════════════════════════════════════════════

const CARDS: Card[] = [
  { id: 'c1', num: 'TASK 04', title: '400 Artikel', desc: 'Deadline 31 Mei — paling kritis! Harus dikebut sebelum kemungkinan cabut 30–31 Mei.', tag: styles.tagUrgent, tagLabel: '🔥 URGENT – 31 MEI', cls: 'urgent', hours: '~10–15 jam' },
  { id: 'c2', num: 'TASK 01a', title: 'Jurnal EAP', desc: 'Belum observasi ke desa. Harus jadwalkan kunjungan + tulis jurnal penelitian.', tag: styles.tagUrgent, tagLabel: '🔥 URGENT', cls: 'urgent', hours: '~8–10 jam' },
  { id: 'c3', num: 'TASK 01b', title: 'Jurnal SCM', desc: 'Belum ngobrol kelompok + belum mulai rancang jurnal. Koordinasi dulu baru eksekusi.', tag: styles.tagHigh, tagLabel: '⚡ HIGH', cls: 'high', hours: '~8–10 jam' },
  { id: 'c4', num: 'TASK 02', title: 'Website Bisnis + Laporan', desc: 'Buat website 1 bisnis KKN + laporan pendampingnya. Butuh waktu fokus.', tag: styles.tagHigh, tagLabel: '⚡ HIGH', cls: 'high', hours: '~10–12 jam' },
  { id: 'c5', num: 'TASK 03', title: 'Feed IG KKN', desc: 'Draf feed, reels, report, progress, konten dll. Bisa dicicil di sela task berat.', tag: styles.tagMedium, tagLabel: '📱 MEDIUM', cls: 'medium', hours: '~6–8 jam' },
  { id: 'c6', num: 'TASK 05+06', title: 'Rev SPK + ERP Task 3', desc: 'Revisi SPK dan ngerjain Task 3 ERP. Bisa dijadikan 1 sesi fokus berturutan.', tag: styles.tagMedium, tagLabel: '💻 MEDIUM', cls: 'medium', hours: '~4–6 jam' },
];

const DAYS: Day[] = [
  {
    id: 'd0', date: '28 Mei · Kam', label: 'Hari ini → Start langsung!', dot: styles.dotNormal, status: styles.statusNormal, statusLabel: 'FULL',
    rows: [
      { id: 'r0_0', time: '15:00–18:00', task: 'Mulai 400 Artikel — Batch 1 (~50–60 artikel)', sub: 'Bikin template dulu, gas sebanyak mungkin', badge: styles.badgeArtikel, badgeLabel: 'ARTIKEL' },
      { id: 'r0_1', time: '19:00–21:00', task: 'Artikel Batch 2 (~40 artikel)', sub: 'Tetap gas, manfaatkan momentum hari pertama', badge: styles.badgeArtikel, badgeLabel: 'ARTIKEL' },
      { id: 'r0_2', time: '21:00–22:00', task: 'Hubungi kelompok SCM', sub: 'Koordinasi jadwal diskusi & bagi tugas rancangan jurnal', badge: styles.badgeJurnal, badgeLabel: 'SCM' },
    ]
  },
  {
    id: 'd1', date: '29 Mei · Jum', label: 'Full day — kebut artikel!', dot: styles.dotNormal, status: styles.statusNormal, statusLabel: 'FULL',
    rows: [
      { id: 'r1_0', time: '08:00–12:00', task: '400 Artikel — Batch 3 (~80 artikel)', sub: 'Sesi pagi paling produktif, push keras', badge: styles.badgeArtikel, badgeLabel: 'ARTIKEL' },
      { id: 'r1_1', time: '13:00–16:00', task: '400 Artikel — Batch 4 (~60 artikel)', sub: 'Target ~230 artikel sudah selesai hari ini', badge: styles.badgeArtikel, badgeLabel: 'ARTIKEL' },
      { id: 'r1_2', time: '16:00–18:00', task: 'Diskusi kelompok SCM', sub: 'Rancang struktur jurnal, bagi bagian penulisan', badge: styles.badgeJurnal, badgeLabel: 'SCM' },
      { id: 'r1_3', time: '19:00–21:00', task: 'Rev SPK + Task 3 ERP', sub: 'Beresin yang tinggal finishing, biar kepala lebih lega', badge: styles.badgeSpk, badgeLabel: 'SPK/ERP' },
    ]
  },
  {
    id: 'd2', date: '30 Mei · Sab', label: '⚠️ Kemungkinan cabut, no signal', dot: styles.dotOffline, status: styles.statusOffline, statusLabel: 'MUNGKIN OFF',
    rows: [
      { id: 'r2_0', time: 'Pagi (jika ada)', task: 'Last push Artikel sebelum cabut', sub: 'Target tambah 50–70 artikel. Jika ~280+ artikel, lumayan aman', badge: styles.badgeArtikel, badgeLabel: 'ARTIKEL' },
      { id: 'r2_1', time: 'Jika offline', task: 'Tulis draf offline: Jurnal EAP & SCM', sub: 'Manfaatkan waktu tanpa distraksi, tulis di dokumen lokal', badge: styles.badgeJurnal, badgeLabel: 'JURNAL' },
    ]
  },
  {
    id: 'd3', date: '31 Mei · Ming', label: '⚠️ DEADLINE 400 Artikel!', dot: styles.dotOffline, status: styles.statusOffline, statusLabel: 'DEADLINE ARTIKEL',
    rows: [
      { id: 'r3_0', time: 'Sebelum cabut', task: '🎯 SUBMIT 400 Artikel!', sub: 'Prioritas nomor 1. Pastikan sudah submit sebelum pergi / deadline', badge: styles.badgeRest, badgeLabel: 'DEADLINE!' },
      { id: 'r3_1', time: 'Sisa waktu', task: 'Tulis draf offline (jurnal, feed IG)', sub: 'Jika beneran no signal, tulis draf kasar yang bisa di-upload nanti', badge: styles.badgeRest, badgeLabel: 'OFFLINE' },
    ]
  },
  {
    id: 'd4', date: '1 Jun · Sen', label: 'Kepotong — sore ke malam saja', dot: styles.dotCut, status: styles.statusCut, statusLabel: 'SORE–MALAM',
    rows: [
      { id: 'r4_0', time: '17:00–19:00', task: 'Observasi ke Desa — Jurnal EAP', sub: 'Jadwalkan kunjungan/wawancara desa, catat semua data mentah', badge: styles.badgeJurnal, badgeLabel: 'EAP' },
      { id: 'r4_1', time: '19:30–22:00', task: 'Tulis Jurnal EAP — Bagian 1', sub: 'Langsung tulis setelah observasi, sementara data masih segar', badge: styles.badgeJurnal, badgeLabel: 'EAP' },
    ]
  },
  {
    id: 'd5', date: '2 Jun · Sel', label: 'Kepotong — sore ke malam saja', dot: styles.dotCut, status: styles.statusCut, statusLabel: 'SORE–MALAM',
    rows: [
      { id: 'r5_0', time: '17:00–19:30', task: 'Lanjut + Finalisasi Jurnal EAP', sub: 'Tulis bagian analisis & kesimpulan, review draft', badge: styles.badgeJurnal, badgeLabel: 'EAP' },
      { id: 'r5_1', time: '19:30–22:00', task: 'Jurnal SCM — Tulis bagian sendiri', sub: 'Kerjain bagian yang sudah dibagi saat diskusi kelompok', badge: styles.badgeJurnal, badgeLabel: 'SCM' },
    ]
  },
  {
    id: 'd6', date: '3 Jun · Rab', label: 'Kepotong — sore ke malam saja', dot: styles.dotCut, status: styles.statusCut, statusLabel: 'SORE–MALAM',
    rows: [
      { id: 'r6_0', time: '17:00–19:30', task: 'Jurnal SCM — Gabung + Review Kelompok', sub: 'Konsolidasi tulisan kelompok, revisi bersama', badge: styles.badgeJurnal, badgeLabel: 'SCM' },
      { id: 'r6_1', time: '19:30–22:00', task: 'Mulai Feed IG KKN — Draf konten', sub: 'Buat calendar konten: feed, reels, report, progress', badge: styles.badgeIg, badgeLabel: 'IG KKN' },
    ]
  },
  {
    id: 'd7', date: '4 Jun · Kam', label: 'FREE — Website day!', dot: styles.dotNormal, status: styles.statusNormal, statusLabel: 'FULL',
    rows: [
      { id: 'r7_0', time: '08:00–13:00', task: 'Bangun Website Bisnis — Struktur + Desain', sub: 'Setup domain/hosting, buat halaman utama, tentukan layout', badge: styles.badgeWeb, badgeLabel: 'WEBSITE' },
      { id: 'r7_1', time: '14:00–18:00', task: 'Website — Konten + Fitur Lengkap', sub: 'Isi konten bisnis, produk/jasa, kontak, dll', badge: styles.badgeWeb, badgeLabel: 'WEBSITE' },
      { id: 'r7_2', time: '19:00–22:00', task: 'Mulai Laporan Website', sub: 'Tulis latar belakang, tujuan, deskripsi bisnis', badge: styles.badgeWeb, badgeLabel: 'LAPORAN' },
    ]
  },
  {
    id: 'd8', date: '5 Jun · Jum', label: 'FREE — Finalisasi website + IG', dot: styles.dotNormal, status: styles.statusNormal, statusLabel: 'FULL',
    rows: [
      { id: 'r8_0', time: '08:00–11:00', task: 'Finalisasi Website + Testing', sub: 'Cek semua halaman, mobile responsive, live URL', badge: styles.badgeWeb, badgeLabel: 'WEBSITE' },
      { id: 'r8_1', time: '11:00–14:00', task: 'Selesaikan Laporan Website', sub: 'Lengkapi lampiran, screenshot, evaluasi', badge: styles.badgeWeb, badgeLabel: 'LAPORAN' },
      { id: 'r8_2', time: '14:00–18:00', task: 'Feed IG KKN — Desain visual + caption', sub: 'Buat konten visual (Canva/dll), tulis caption semua post', badge: styles.badgeIg, badgeLabel: 'IG KKN' },
      { id: 'r8_3', time: '19:00–21:00', task: 'Finalisasi Jurnal EAP & SCM', sub: 'Review akhir, format, cek referensi', badge: styles.badgeJurnal, badgeLabel: 'JURNAL' },
    ]
  },
  {
    id: 'd9', date: '6 Jun · Sab', label: 'FREE — Review semua + IG final', dot: styles.dotNormal, status: styles.statusNormal, statusLabel: 'FULL',
    rows: [
      { id: 'r9_0', time: '09:00–12:00', task: 'Finalisasi Feed IG KKN', sub: 'Susun jadwal posting, final approval semua konten', badge: styles.badgeIg, badgeLabel: 'IG KKN' },
      { id: 'r9_1', time: '13:00–16:00', task: 'Review & Kompilasi Semua Task', sub: 'Cek checklist: jurnal, website, laporan, artikel, IG', badge: styles.badgeRest, badgeLabel: 'REVIEW' },
      { id: 'r9_2', time: '16:00–19:00', task: 'BUFFER — Perbaikan & Pelengkapan', sub: 'Kejar task yang masih kurang, jangan kebut di hari-H', badge: styles.badgeRest, badgeLabel: 'BUFFER' },
    ]
  },
  {
    id: 'd10', date: '7 Jun · Ming', label: 'FREE — Final check, siap submit', dot: styles.dotNormal, status: styles.statusNormal, statusLabel: 'FULL',
    rows: [
      { id: 'r10_0', time: '09:00–13:00', task: 'Final Proofread & Format Semua Dokumen', sub: 'Jurnal EAP, SCM, laporan website — format & nama file benar', badge: styles.badgeRest, badgeLabel: 'FINAL' },
      { id: 'r10_1', time: '13:00–16:00', task: 'Kompilasi file, ZIP, siap submit besok', sub: 'Susun semua file dalam folder, double check semua lengkap', badge: styles.badgeRest, badgeLabel: 'SUBMIT PREP' },
      { id: 'r10_2', time: '16:00+', task: '🎉 Rest — Kamu udah kerja keras!', sub: 'Istirahat, jangan begadang malam H-1 deadline', badge: styles.badgeRest, badgeLabel: 'REST' },
    ]
  },
  {
    id: 'd11', date: '8 Jun · Sen', label: '🎯 DEADLINE — Submit semua!', dot: styles.dotDeadline, status: styles.statusDeadline, statusLabel: 'DEADLINE',
    rows: [
      { id: 'r11_0', time: 'Pagi', task: '✅ Submit semua task sesuai ketentuan', sub: 'Jurnal EAP, Jurnal SCM, Website + Laporan, Feed IG, Rev SPK, ERP Task 3', badge: styles.badgeRest, badgeLabel: 'SUBMIT ALL' },
    ]
  },
];

const STORAGE_KEY = 'kkn_checklist_v2';

// ═════════════════════════════════════════════════════════════
// TRACKER COMPONENT
// ═════════════════════════════════════════════════════════════

export default function TrackerPage() {
  const [state, setState] = useState<{ [key: string]: boolean }>({});
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set(['d0', 'd1']));
  const [toastMsg, setToastMsg] = useState<string>('');
  const [toastShow, setToastShow] = useState(false);
  const [countdownData, setCountdownData] = useState<{ daysLeft: number; hoursLeft: number; pct: number }>({ daysLeft: 0, hoursLeft: 0, pct: 0 });
  const [progress, setProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  // Load state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setState(JSON.parse(saved));
    } catch {}
  }, []);

  // Save state to localStorage
  const saveState = useCallback((newState: { [key: string]: boolean }) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch {}
  }, []);

  const isChecked = useCallback((id: string) => !!state[id], [state]);

  const setChecked = useCallback(
    (id: string, val: boolean) => {
      const newState = { ...state };
      if (val) newState[id] = true;
      else delete newState[id];
      setState(newState);
      saveState(newState);
    },
    [state, saveState]
  );

  // Update progress
  useEffect(() => {
    const allIds = [
      ...CARDS.map(c => c.id),
      ...DAYS.flatMap(d => d.rows.map(r => r.id))
    ];
    const total = allIds.length;
    const done = allIds.filter(id => isChecked(id)).length;
    setProgress({ done, total });
  }, [state, isChecked]);

  // Update countdown
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const deadline = new Date('2026-06-08T23:59:59+07:00');
      const start = new Date('2026-05-28T14:55:00+07:00');
      const totalMs = deadline.getTime() - start.getTime();
      const leftMs = Math.max(0, deadline.getTime() - now.getTime());
      const daysLeft = Math.ceil(leftMs / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((leftMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const pct = Math.max(0, Math.min(100, ((totalMs - leftMs) / totalMs) * 100));
      setCountdownData({ daysLeft, hoursLeft, pct });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastShow(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastShow(false), 2000);
  }, []);

  const toggleCard = (id: string) => {
    const val = !isChecked(id);
    setChecked(id, val);
    if (val) {
      showToast('Task ditandai selesai ✓');
    }
  };

  const toggleRow = (rowId: string) => {
    const val = !isChecked(rowId);
    setChecked(rowId, val);
    if (val) {
      showToast('Sesi selesai! Keep going 💪');
    }
  };

  const toggleDay = (dayId: string) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dayId)) newSet.delete(dayId);
      else newSet.add(dayId);
      return newSet;
    });
  };

  const resetAll = () => {
    if (!confirm('Reset semua checklist? Progress akan hilang.')) return;
    setState({});
    saveState({});
    showToast('Semua checklist di-reset 🔄');
  };

  const pct = progress.total > 0 ? (progress.done / progress.total * 100) : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');
      `}</style>

      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.headerBadge}>KKN Task Tracker</div>
          <h1>
            Deadline Tracker<br />
            <span className={styles.headerSpan}>8 Juni 2026</span>
          </h1>
          <div className={styles.headerMeta}>
            <span className={styles.headerMetaSpan}>📅 Mulai: 28 Mei 2026</span>
            <span className={styles.headerMetaSpan}>
              ⏰ <strong style={{ color: '#ff6584' }}>{countdownData.daysLeft} hari {countdownData.hoursLeft} jam lagi</strong>
            </span>
            <span className={styles.headerMetaSpan}>🎯 6 Task Utama</span>
          </div>
        </div>

        {/* GLOBAL PROGRESS */}
        <div className={styles.globalProgress}>
          <div className={styles.gpTop}>
            <div>
              <div className={styles.gpTitle}>Progress Checklist</div>
              <div className={styles.gpCount}>
                <span>{progress.done}</span> / <span>{progress.total}</span>{' '}
                <span className={styles.gpCountSpan}>task selesai</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className={styles.gpTitle}>Waktu tersisa</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '20px', fontWeight: '800', color: 'var(--accent2)' }}>
                {countdownData.daysLeft}h {countdownData.hoursLeft}j
              </div>
            </div>
          </div>
          <div className={styles.gpTrack}>
            <div className={styles.gpFill} style={{ width: `${pct.toFixed(1)}%` }}></div>
          </div>
        </div>

        {/* COUNTDOWN */}
        <div className={styles.countdownBar}>
          <div>
            <div className={styles.countdownLabel}>Hari sisa</div>
            <div className={styles.countdownDays}>{countdownData.daysLeft}</div>
          </div>
          <div className={styles.progressOuter}>
            <div className={styles.countdownLabel}>Waktu berjalan (28 Mei → 8 Juni)</div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${countdownData.pct.toFixed(1)}%` }}></div>
            </div>
          </div>
        </div>

        {/* WARNING */}
        <div className={styles.warningBlock}>
          <span className={styles.warningIcon}>⚠️</span>
          <div>
            <strong>Perhatian!</strong> Tgl 1–3 Juni hanya sore–malam. Tgl 30–31 Mei kemungkinan cabut + no signal.{' '}
            <strong>400 Artikel deadline 31 Mei</strong> — harus dikebut hari ini & besok!
          </div>
        </div>

        {/* TASK CARDS */}
        <div className={styles.sectionTitle}>Task Overview</div>
        <div className={styles.tasksGrid}>
          {CARDS.map(c => {
            const done = isChecked(c.id);
            return (
              <div
                key={c.id}
                className={`${styles.taskCard} ${styles[c.cls]}${done ? ` ${styles.taskCardDone}` : ''}`}
              >
                <div className={styles.taskCardTop}>
                  <div className={styles.taskNumber}>{c.num}</div>
                  <div
                    className={`${styles.cardCheck}${done ? ` ${styles.cardCheckChecked}` : ''}`}
                    onClick={() => toggleCard(c.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {done ? '✓' : ''}
                  </div>
                </div>
                <div className={styles.taskTitle}>{c.title}</div>
                <div className={styles.taskDesc}>{c.desc}</div>
                <span className={`${styles.taskTag} ${c.tag}`}>{c.tagLabel}</span>
                <div className={styles.taskHours}>{c.hours}</div>
              </div>
            );
          })}
        </div>

        {/* TIMELINE */}
        <div className={styles.timeline}>
          <div className={styles.sectionTitle}>Daily Timeline</div>
          {DAYS.map((day, di) => {
            const isOpen = expandedDays.has(day.id);
            const totalRows = day.rows.length;
            const doneRows = day.rows.filter(r => isChecked(r.id)).length;
            const allDone = totalRows > 0 && doneRows === totalRows;
            const summaryText = allDone ? '✓ Done' : `${doneRows}/${totalRows}`;

            return (
              <div key={day.id} className={styles.dayBlock}>
                <div
                  className={`${styles.dayHeader}${isOpen ? ` ${styles.dayHeaderExpanded}` : ''}${allDone ? ` ${styles.dayHeaderAllDone}` : ''}`}
                  onClick={() => toggleDay(day.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={`${styles.dayDot} ${styles[day.dot]}`}></div>
                  <div className={styles.dayDate}>{day.date}</div>
                  <div className={styles.dayLabel}>{day.label}</div>
                  <div className={styles.dayRight}>
                    <div className={`${styles.dayCheckSummary}${allDone ? ` ${styles.dayCheckSummaryDone}` : ''}`}>
                      {summaryText}
                    </div>
                    <div className={`${styles.dayStatus} ${styles[day.status]}`}>{day.statusLabel}</div>
                    <div className={styles.dayChevron}>▼</div>
                  </div>
                </div>
                <div className={`${styles.dayBody}${isOpen ? ` ${styles.dayBodyOpen}` : ''}`}>
                  {day.rows.map((r, ri) => {
                    const done = isChecked(r.id);
                    return (
                      <div
                        key={r.id}
                        className={`${styles.scheduleRow}${ri === day.rows.length - 1 ? ` ${styles.scheduleRowLast}` : ''}${done ? ` ${styles.scheduleRowDone}` : ''}`}
                      >
                        <div
                          className={`${styles.rowCheck}${done ? ` ${styles.rowCheckChecked}` : ''}`}
                          onClick={() => toggleRow(r.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          {done ? '✓' : ''}
                        </div>
                        <div className={styles.schedTime}>{r.time}</div>
                        <div className={styles.schedTask}>
                          <strong>{r.task}</strong>
                          <span className="sub">{r.sub}</span>
                        </div>
                        <div className={`${styles.schedBadge} ${styles[r.badge]}`}>{r.badgeLabel}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* REKOMENDASI */}
        <div className={styles.recSection}>
          <div className={styles.sectionTitle}>Rekomendasi Strategi</div>
          <div className={styles.recCard}>
            <ul className={styles.recList}>
              <li>
                <strong>400 Artikel adalah prioritas mutlak 28–29 Mei.</strong> Risiko no signal 30–31 Mei = idealnya 350+ sudah selesai sebelum pergi. Pakai template & batch writing.
              </li>
              <li>
                <strong>Hubungi kelompok SCM malam ini juga.</strong> Diskusi bisa via WA/online. Makin cepat rancangan jurnal dibagi, makin enteng beban kamu.
              </li>
              <li>
                <strong>Observasi EAP dijadwalkan 1 Juni sore</strong> — pas banget karena baru bisa sore-malam. Tulis langsung setelah pulang, sementara data masih segar.
              </li>
              <li>
                <strong>Website + Laporan di-blok full 4–5 Juni</strong> karena butuh fokus panjang. Jangan dicicil nanggung.
              </li>
              <li>
                <strong>Feed IG KKN paling fleksibel</strong> — kerjain 3–5 Juni setelah jurnal mulai jelas. Konten IG butuh data progress KKN yang lain.
              </li>
              <li>
                <strong>Rev SPK + ERP Task 3 satukan 1 sesi</strong> di 29 Mei malam. Relatif cepat kalau memang tinggal revisi/finalisasi.
              </li>
              <li>
                <strong>Jangan skip buffer 6–7 Juni.</strong> Ini penyelamat kalau ada yang molor. Fokus nambal lubang, bukan task baru.
              </li>
            </ul>
          </div>
        </div>

        {/* SUMMARY PILLS */}
        <div className={styles.sectionTitle}>Ringkasan</div>
        <div className={styles.summaryPills}>
          <div className={styles.pill}>
            <div className={styles.pillValue} style={{ color: '#ff6584' }}>
              {countdownData.daysLeft}
            </div>
            <div className={styles.pillLabel}>Hari sisa</div>
          </div>
          <div className={styles.pill}>
            <div className={styles.pillValue} style={{ color: '#ffd32a' }}>
              6
            </div>
            <div className={styles.pillLabel}>Task utama</div>
          </div>
          <div className={styles.pill}>
            <div className={styles.pillValue} style={{ color: '#a29bfe' }}>
              3
            </div>
            <div className={styles.pillLabel}>Hari potong</div>
          </div>
          <div className={styles.pill}>
            <div className={styles.pillValue} style={{ color: '#ff4d6d' }}>
              2
            </div>
            <div className={styles.pillLabel}>Hari offline</div>
          </div>
          <div className={styles.pill}>
            <div className={styles.pillValue} style={{ color: '#55efc4' }}>
              2
            </div>
            <div className={styles.pillLabel}>Hari buffer</div>
          </div>
          <div className={styles.pill}>
            <div className={styles.pillValue} style={{ color: '#fd79a8' }}>
              400
            </div>
            <div className={styles.pillLabel}>Artikel 31 Mei</div>
          </div>
        </div>

        {/* RESET BUTTON */}
        <div className={styles.resetWrap}>
          <button className={styles.resetBtn} onClick={resetAll}>
            🗑 RESET SEMUA CHECKLIST
          </button>
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          Made for KKN · Deadline 8 Juni 2026 · Semangat! 💪<br />
          Checklist tersimpan otomatis di browser kamu
        </div>
      </div>

      {/* TOAST */}
      <div className={`${styles.toast}${toastShow ? ` ${styles.toastShow}` : ''}`}>{toastMsg}</div>
    </>
  );
}
