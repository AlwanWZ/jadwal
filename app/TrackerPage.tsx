'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

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

const CARDS_DATA: Card[] = [
  { id: 'c1', num: 'TASK 04', title: '400 Artikel', desc: 'Deadline 31 Mei — paling kritis!', tag: 'tag-urgent', tagLabel: '🔥 URGENT – 31 MEI', cls: 'urgent', hours: '~10–15 jam' },
  { id: 'c2', num: 'TASK 01a', title: 'Jurnal EAP', desc: 'Belum observasi ke desa.', tag: 'tag-urgent', tagLabel: '🔥 URGENT', cls: 'urgent', hours: '~8–10 jam' },
  { id: 'c3', num: 'TASK 01b', title: 'Jurnal SCM', desc: 'Belum ngobrol kelompok.', tag: 'tag-high', tagLabel: '⚡ HIGH', cls: 'high', hours: '~8–10 jam' },
  { id: 'c4', num: 'TASK 02', title: 'Website Bisnis + Laporan', desc: 'Buat website 1 bisnis KKN.', tag: 'tag-high', tagLabel: '⚡ HIGH', cls: 'high', hours: '~10–12 jam' },
  { id: 'c5', num: 'TASK 03', title: 'Feed IG KKN', desc: 'Draf feed, reels, report, progress.', tag: 'tag-medium', tagLabel: '📱 MEDIUM', cls: 'medium', hours: '~6–8 jam' },
  { id: 'c6', num: 'TASK 05+06', title: 'Rev SPK + ERP Task 3', desc: 'Revisi SPK dan ngerjain Task 3 ERP.', tag: 'tag-medium', tagLabel: '💻 MEDIUM', cls: 'medium', hours: '~4–6 jam' },
];

const DAYS_DATA: Day[] = [
  {
    id: 'd0', date: '28 Mei · Kam', label: 'Hari ini → Start langsung!', dot: 'dot-normal', status: 'status-normal', statusLabel: 'FULL',
    rows: [
      { id: 'r0_0', time: '15:00–18:00', task: 'Mulai 400 Artikel — Batch 1 (~50–60 artikel)', sub: 'Bikin template dulu, gas sebanyak mungkin', badge: 'badge-artikel', badgeLabel: 'ARTIKEL' },
      { id: 'r0_1', time: '19:00–21:00', task: 'Artikel Batch 2 (~40 artikel)', sub: 'Tetap gas, manfaatkan momentum hari pertama', badge: 'badge-artikel', badgeLabel: 'ARTIKEL' },
      { id: 'r0_2', time: '21:00–22:00', task: 'Hubungi kelompok SCM', sub: 'Koordinasi jadwal diskusi & bagi tugas rancangan jurnal', badge: 'badge-jurnal', badgeLabel: 'SCM' },
    ]
  },
  {
    id: 'd1', date: '29 Mei · Jum', label: 'Full day — kebut artikel!', dot: 'dot-normal', status: 'status-normal', statusLabel: 'FULL',
    rows: [
      { id: 'r1_0', time: '08:00–12:00', task: '400 Artikel — Batch 3 (~80 artikel)', sub: 'Sesi pagi paling produktif, push keras', badge: 'badge-artikel', badgeLabel: 'ARTIKEL' },
      { id: 'r1_1', time: '13:00–16:00', task: '400 Artikel — Batch 4 (~60 artikel)', sub: 'Target ~230 artikel sudah selesai hari ini', badge: 'badge-artikel', badgeLabel: 'ARTIKEL' },
      { id: 'r1_2', time: '16:00–18:00', task: 'Diskusi kelompok SCM', sub: 'Rancang struktur jurnal, bagi bagian penulisan', badge: 'badge-jurnal', badgeLabel: 'SCM' },
      { id: 'r1_3', time: '19:00–21:00', task: 'Rev SPK + Task 3 ERP', sub: 'Beresin yang tinggal finishing, biar kepala lebih lega', badge: 'badge-spk', badgeLabel: 'SPK/ERP' },
    ]
  },
  {
    id: 'd2', date: '30 Mei · Sab', label: '⚠️ Kemungkinan cabut, no signal', dot: 'dot-offline', status: 'status-offline', statusLabel: 'MUNGKIN OFF',
    rows: [
      { id: 'r2_0', time: 'Pagi (jika ada)', task: 'Last push Artikel sebelum cabut', sub: 'Target tambah 50–70 artikel. Jika ~280+ artikel, lumayan aman', badge: 'badge-artikel', badgeLabel: 'ARTIKEL' },
      { id: 'r2_1', time: 'Jika offline', task: 'Tulis draf offline: Jurnal EAP & SCM', sub: 'Manfaatkan waktu tanpa distraksi, tulis di dokumen lokal', badge: 'badge-jurnal', badgeLabel: 'JURNAL' },
    ]
  },
  {
    id: 'd3', date: '31 Mei · Ming', label: '⚠️ DEADLINE 400 Artikel!', dot: 'dot-offline', status: 'status-offline', statusLabel: 'DEADLINE ARTIKEL',
    rows: [
      { id: 'r3_0', time: 'Sebelum cabut', task: '🎯 SUBMIT 400 Artikel!', sub: 'Prioritas nomor 1. Pastikan sudah submit sebelum pergi / deadline', badge: 'badge-artikel', badgeLabel: 'DEADLINE!' },
      { id: 'r3_1', time: 'Sisa waktu', task: 'Tulis draf offline (jurnal, feed IG)', sub: 'Jika beneran no signal, tulis draf kasar yang bisa di-upload nanti', badge: 'badge-rest', badgeLabel: 'OFFLINE' },
    ]
  },
  {
    id: 'd4', date: '1 Jun · Sen', label: 'Kepotong — sore ke malam saja', dot: 'dot-cut', status: 'status-cut', statusLabel: 'SORE–MALAM',
    rows: [
      { id: 'r4_0', time: '17:00–19:00', task: 'Observasi ke Desa — Jurnal EAP', sub: 'Jadwalkan kunjungan/wawancara desa, catat semua data mentah', badge: 'badge-jurnal', badgeLabel: 'EAP' },
      { id: 'r4_1', time: '19:30–22:00', task: 'Tulis Jurnal EAP — Bagian 1', sub: 'Langsung tulis setelah observasi, sementara data masih segar', badge: 'badge-jurnal', badgeLabel: 'EAP' },
    ]
  },
  {
    id: 'd5', date: '2 Jun · Sel', label: 'Kepotong — sore ke malam saja', dot: 'dot-cut', status: 'status-cut', statusLabel: 'SORE–MALAM',
    rows: [
      { id: 'r5_0', time: '17:00–19:30', task: 'Lanjut + Finalisasi Jurnal EAP', sub: 'Tulis bagian analisis & kesimpulan, review draft', badge: 'badge-jurnal', badgeLabel: 'EAP' },
      { id: 'r5_1', time: '19:30–22:00', task: 'Jurnal SCM — Tulis bagian sendiri', sub: 'Kerjain bagian yang sudah dibagi saat diskusi kelompok', badge: 'badge-jurnal', badgeLabel: 'SCM' },
    ]
  },
  {
    id: 'd6', date: '3 Jun · Rab', label: 'Kepotong — sore ke malam saja', dot: 'dot-cut', status: 'status-cut', statusLabel: 'SORE–MALAM',
    rows: [
      { id: 'r6_0', time: '17:00–19:30', task: 'Jurnal SCM — Gabung + Review Kelompok', sub: 'Konsolidasi tulisan kelompok, revisi bersama', badge: 'badge-jurnal', badgeLabel: 'SCM' },
      { id: 'r6_1', time: '19:30–22:00', task: 'Mulai Feed IG KKN — Draf konten', sub: 'Buat calendar konten: feed, reels, report, progress', badge: 'badge-ig', badgeLabel: 'IG KKN' },
    ]
  },
  {
    id: 'd7', date: '4 Jun · Kam', label: 'FREE — Website day!', dot: 'dot-normal', status: 'status-normal', statusLabel: 'FULL',
    rows: [
      { id: 'r7_0', time: '08:00–13:00', task: 'Bangun Website Bisnis — Struktur + Desain', sub: 'Setup domain/hosting, buat halaman utama, tentukan layout', badge: 'badge-web', badgeLabel: 'WEBSITE' },
      { id: 'r7_1', time: '14:00–18:00', task: 'Website — Konten + Fitur Lengkap', sub: 'Isi konten bisnis, produk/jasa, kontak, dll', badge: 'badge-web', badgeLabel: 'WEBSITE' },
      { id: 'r7_2', time: '19:00–22:00', task: 'Mulai Laporan Website', sub: 'Tulis latar belakang, tujuan, deskripsi bisnis', badge: 'badge-web', badgeLabel: 'LAPORAN' },
    ]
  },
  {
    id: 'd8', date: '5 Jun · Jum', label: 'FREE — Finalisasi website + IG', dot: 'dot-normal', status: 'status-normal', statusLabel: 'FULL',
    rows: [
      { id: 'r8_0', time: '08:00–11:00', task: 'Finalisasi Website + Testing', sub: 'Cek semua halaman, mobile responsive, live URL', badge: 'badge-web', badgeLabel: 'WEBSITE' },
      { id: 'r8_1', time: '11:00–14:00', task: 'Selesaikan Laporan Website', sub: 'Lengkapi lampiran, screenshot, evaluasi', badge: 'badge-web', badgeLabel: 'LAPORAN' },
      { id: 'r8_2', time: '14:00–18:00', task: 'Feed IG KKN — Desain visual + caption', sub: 'Buat konten visual (Canva/dll), tulis caption semua post', badge: 'badge-ig', badgeLabel: 'IG KKN' },
      { id: 'r8_3', time: '19:00–21:00', task: 'Finalisasi Jurnal EAP & SCM', sub: 'Review akhir, format, cek referensi', badge: 'badge-jurnal', badgeLabel: 'JURNAL' },
    ]
  },
  {
    id: 'd9', date: '6 Jun · Sab', label: 'FREE — Review semua + IG final', dot: 'dot-normal', status: 'status-normal', statusLabel: 'FULL',
    rows: [
      { id: 'r9_0', time: '09:00–12:00', task: 'Finalisasi Feed IG KKN', sub: 'Susun jadwal posting, final approval semua konten', badge: 'badge-ig', badgeLabel: 'IG KKN' },
      { id: 'r9_1', time: '13:00–16:00', task: 'Review & Kompilasi Semua Task', sub: 'Cek checklist: jurnal, website, laporan, artikel, IG', badge: 'badge-rest', badgeLabel: 'REVIEW' },
      { id: 'r9_2', time: '16:00–19:00', task: 'BUFFER — Perbaikan & Pelengkapan', sub: 'Kejar task yang masih kurang, jangan kebut di hari-H', badge: 'badge-rest', badgeLabel: 'BUFFER' },
    ]
  },
  {
    id: 'd10', date: '7 Jun · Ming', label: 'FREE — Final check, siap submit', dot: 'dot-normal', status: 'status-normal', statusLabel: 'FULL',
    rows: [
      { id: 'r10_0', time: '09:00–13:00', task: 'Final Proofread & Format Semua Dokumen', sub: 'Jurnal EAP, SCM, laporan website — format & nama file benar', badge: 'badge-rest', badgeLabel: 'FINAL' },
      { id: 'r10_1', time: '13:00–16:00', task: 'Kompilasi file, ZIP, siap submit besok', sub: 'Susun semua file dalam folder, double check semua lengkap', badge: 'badge-rest', badgeLabel: 'SUBMIT PREP' },
      { id: 'r10_2', time: '16:00+', task: '🎉 Rest — Kamu udah kerja keras!', sub: 'Istirahat, jangan begadang malam H-1 deadline', badge: 'badge-rest', badgeLabel: 'REST' },
    ]
  },
  {
    id: 'd11', date: '8 Jun · Sen', label: '🎯 DEADLINE KKN + UAS SPK', dot: 'dot-deadline', status: 'status-deadline', statusLabel: 'DEADLINE',
    rows: [
      { id: 'r11_0', time: 'Pagi', task: '✅ Submit semua task KKN', sub: 'Jurnal EAP, Jurnal SCM, Website + Laporan, Feed IG, Rev SPK, ERP Task 3', badge: 'badge-rest', badgeLabel: 'SUBMIT KKN' },
      { id: 'r11_1', time: 'Siang', task: '📚 UAS SPK — Kumpul tugas akhir', sub: 'Finalisasi semua deliverable SPK, siap untuk presentasi/ujian', badge: 'badge-spk', badgeLabel: 'SPK UAS' },
    ]
  },
  {
    id: 'd12', date: '9 Jun · Sel', label: 'UAS SCM', dot: 'dot-normal', status: 'status-normal', statusLabel: 'EXAM',
    rows: [
      { id: 'r12_0', time: 'Pagi-Siang', task: '📚 UAS SCM — Kumpul & ujian', sub: 'Submit project SCM (jurnal, laporan, analisis). Review materi sebelumnya', badge: 'badge-jurnal', badgeLabel: 'SCM UAS' },
      { id: 'r12_1', time: 'Sore', task: 'Persiapan eBusiness', sub: 'Review project & materi untuk ujian esok', badge: 'badge-rest', badgeLabel: 'PREP' },
    ]
  },
  {
    id: 'd13', date: '10 Jun · Rab', label: 'UAS eBusiness', dot: 'dot-normal', status: 'status-normal', statusLabel: 'EXAM',
    rows: [
      { id: 'r13_0', time: 'Pagi-Siang', task: '📚 UAS eBusiness — Kumpul & ujian', sub: 'Submit project eBusiness (website/sistem). Presentasi & jawab pertanyaan', badge: 'badge-web', badgeLabel: 'EBIZ UAS' },
      { id: 'r13_1', time: 'Sore', task: 'Persiapan Metopen', sub: 'Siapkan materi & catatan untuk ujian metodologi', badge: 'badge-rest', badgeLabel: 'PREP' },
    ]
  },
  {
    id: 'd14', date: '11 Jun · Kam', label: 'UAS Metopen', dot: 'dot-normal', status: 'status-normal', statusLabel: 'EXAM',
    rows: [
      { id: 'r14_0', time: 'Pagi-Siang', task: '📚 UAS Metopen — Ujian', sub: 'Ujian metodologi penelitian. Persiapkan jawaban essay & analisis kasus', badge: 'badge-rest', badgeLabel: 'METOPEN' },
      { id: 'r14_1', time: 'Sore', task: 'Persiapan KPAM & ERP', sub: 'Review project KPAM & ERP task 3 untuk ujian besok', badge: 'badge-rest', badgeLabel: 'PREP' },
    ]
  },
  {
    id: 'd15', date: '12 Jun · Jum', label: 'UAS KPAM & ERP', dot: 'dot-normal', status: 'status-normal', statusLabel: 'EXAM',
    rows: [
      { id: 'r15_0', time: 'Pagi', task: '📚 UAS KPAM — Kumpul & ujian', sub: 'Submit project KPAM. Quiz & diskusi tentang aspek kuantitatif', badge: 'badge-rest', badgeLabel: 'KPAM UAS' },
      { id: 'r15_1', time: 'Siang-Sore', task: '📚 UAS ERP — Kumpul & ujian', sub: 'Submit ERP Task 3. Presentasi implementasi sistem ERP', badge: 'badge-erp', badgeLabel: 'ERP UAS' },
      { id: 'r15_2', time: 'Malam', task: 'Rest & persiapan EAP', sub: 'Istirahat, review materi EAP untuk 3 hari ke depan', badge: 'badge-rest', badgeLabel: 'REST' },
    ]
  },
  {
    id: 'd16', date: '15 Jun · Sen', label: 'UAS EAP', dot: 'dot-normal', status: 'status-normal', statusLabel: 'EXAM',
    rows: [
      { id: 'r16_0', time: 'Pagi-Siang', task: '📚 UAS EAP — Kumpul & ujian', sub: 'Submit jurnal EAP lengkap. Presentasi hasil penelitian & analisis data', badge: 'badge-jurnal', badgeLabel: 'EAP UAS' },
      { id: 'r16_1', time: 'Sore', task: 'Persiapan Data Mining', sub: 'Review project data mining & algoritma yang digunakan', badge: 'badge-rest', badgeLabel: 'PREP' },
    ]
  },
  {
    id: 'd17', date: '17 Jun · Rab', label: 'UAS Data Mining', dot: 'dot-deadline', status: 'status-deadline', statusLabel: 'FINAL EXAM',
    rows: [
      { id: 'r17_0', time: 'Pagi-Siang', task: '📚 UAS Data Mining — Kumpul & ujian', sub: 'Submit project data mining (code, dataset, hasil analisis). Presentasi & Q&A', badge: 'badge-web', badgeLabel: 'DM UAS' },
      { id: 'r17_1', time: 'Sore', task: '🎉 Semua UAS selesai!', sub: 'Istirahat, semester berakhir. Good job! 💪', badge: 'badge-rest', badgeLabel: 'DONE' },
    ]
  },
];

const STORAGE_KEY = 'kkn_checklist_v2';

export default function TrackerPage() {
  const [state, setState] = useState<{ [key: string]: boolean }>({});
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set(['d0', 'd1']));
  const [toastMsg, setToastMsg] = useState<string>('');
  const [toastShow, setToastShow] = useState(false);
  const [countdownData, setCountdownData] = useState<{ daysLeft: number; hoursLeft: number; pct: number }>({ daysLeft: 0, hoursLeft: 0, pct: 0 });
  const [progress, setProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setState(JSON.parse(saved));
    } catch {}
  }, []);

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

  useEffect(() => {
    const allIds = [...CARDS_DATA.map(c => c.id), ...DAYS_DATA.flatMap(d => d.rows.map(r => r.id))];
    const total = allIds.length;
    const done = allIds.filter(id => isChecked(id)).length;
    setProgress({ done, total });
  }, [state, isChecked]);

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
    if (val) showToast('Task ditandai selesai ✓');
  };

  const toggleRow = (rowId: string) => {
    const val = !isChecked(rowId);
    setChecked(rowId, val);
    if (val) showToast('Sesi selesai! Keep going 💪');
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
        
        :root {
          --bg: #0a0a0f;
          --surface: #12121a;
          --surface2: #1a1a26;
          --border: #2a2a3a;
          --accent: #6c63ff;
          --accent2: #ff6584;
          --accent3: #43e97b;
          --accent4: #f9ca24;
          --accent5: #fd79a8;
          --text: #e8e8f0;
          --muted: #7878a0;
          --danger: #ff4d6d;
          --warning: #ffd60a;
          --done-bg: rgba(67,233,123,0.06);
          --done-border: rgba(67,233,123,0.2);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; overflow-x: hidden; font-size: 14px; }

        .tracker-container { max-width: 860px; margin: 0 auto; padding: 32px 16px 100px; }
        .header { margin-bottom: 32px; animation: fadeUp .6s ease both; }
        .headerBadge { display: inline-flex; align-items: center; gap: 7px; background: rgba(108,99,255,.12); border: 1px solid rgba(108,99,255,.3); border-radius: 100px; padding: 5px 14px; font-family: 'DM Mono', monospace; font-size: 10px; color: var(--accent); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 14px; }
        .headerBadge::before { content: ''; width: 5px; height: 5px; background: var(--accent); border-radius: 50%; animation: pulse 1.5s infinite; }
        .header h1 { font-family: 'Syne', sans-serif; font-size: clamp(24px, 7vw, 48px); font-weight: 800; line-height: 1.1; letter-spacing: -1px; }
        .headerSpan { background: linear-gradient(135deg, #6c63ff, #fd79a8, #43e97b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .headerMeta { margin-top: 12px; display: flex; flex-wrap: wrap; gap: 12px; font-family: 'DM Mono', monospace; font-size: 11px; color: var(--muted); }
        .headerMetaSpan { display: flex; align-items: center; gap: 5px; }
        .globalProgress { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 18px 20px; margin-bottom: 24px; animation: fadeUp .6s .05s ease both; }
        .gpTop { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 8px; }
        .gpTitle { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
        .gpCount { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: var(--accent3); }
        .gpCountSpan { font-size: 13px; color: var(--muted); font-weight: 400; }
        .gpTrack { background: var(--surface2); height: 8px; border-radius: 100px; overflow: hidden; }
        .gpFill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, var(--accent), var(--accent3)); transition: width .5s cubic-bezier(.4,0,.2,1); }
        .countdownBar { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 16px 20px; margin-bottom: 24px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; animation: fadeUp .6s .1s ease both; }
        .countdownLabel { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
        .countdownDays { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800; color: var(--accent2); line-height: 1; }
        .progressOuter { flex: 1; min-width: 160px; }
        .progressTrack { background: var(--surface2); height: 5px; border-radius: 100px; overflow: hidden; margin-top: 6px; }
        .progressFill { height: 100%; border-radius: 100px; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width .5s ease; }
        .warningBlock { background: rgba(255,77,109,.07); border: 1px solid rgba(255,77,109,.22); border-radius: 12px; padding: 12px 16px; margin-bottom: 28px; display: flex; align-items: flex-start; gap: 10px; font-size: 12px; color: #ff8fa3; line-height: 1.5; animation: fadeUp .6s .15s ease both; }
        .warningIcon { font-size: 15px; flex-shrink: 0; margin-top: 1px; }
        .sectionTitle { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
        .sectionTitle::after { content: ''; flex: 1; height: 1px; background: var(--border); }
        .tasksGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; margin-bottom: 36px; animation: fadeUp .6s .2s ease both; }
        .taskCard { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 16px; position: relative; overflow: hidden; transition: transform .2s, border-color .2s, background .3s; cursor: pointer; }
        .taskCard:hover { transform: translateY(-1px); border-color: rgba(255,255,255,.12); }
        .taskCardDone { background: var(--done-bg); border-color: var(--done-border); opacity: .7; }
        .taskCardDone .taskTitle { text-decoration: line-through; color: var(--muted); }
        .taskCard::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
        .taskCard.urgent::before { background: linear-gradient(90deg, #ff4d6d, #ff6584); }
        .taskCard.high::before { background: linear-gradient(90deg, #f9ca24, #ffd60a); }
        .taskCard.medium::before { background: linear-gradient(90deg, #6c63ff, #a29bfe); }
        .taskCardTop { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 6px; }
        .taskNumber { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--muted); letter-spacing: 1px; }
        .cardCheck { width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--border); background: var(--surface2); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all .2s; font-size: 11px; }
        .cardCheck:hover { border-color: var(--accent3); }
        .cardCheckChecked { background: var(--accent3); border-color: var(--accent3); }
        .taskTitle { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; margin-bottom: 5px; line-height: 1.3; }
        .taskDesc { font-size: 11px; color: var(--muted); line-height: 1.5; margin-bottom: 10px; }
        .taskTag { display: inline-flex; align-items: center; gap: 3px; padding: 2px 9px; border-radius: 100px; font-size: 9px; font-family: 'DM Mono', monospace; letter-spacing: .5px; }
        .tagUrgent { background: rgba(255,77,109,.15); color: #ff6b81; border: 1px solid rgba(255,77,109,.3); }
        .tagHigh { background: rgba(249,202,36,.12); color: #ffd32a; border: 1px solid rgba(249,202,36,.3); }
        .tagMedium { background: rgba(108,99,255,.12); color: #a29bfe; border: 1px solid rgba(108,99,255,.3); }
        .taskHours { position: absolute; bottom: 12px; right: 14px; font-family: 'DM Mono', monospace; font-size: 9px; color: var(--muted); }
        .timeline { animation: fadeUp .6s .3s ease both; margin-bottom: 36px; }
        .dayBlock { margin-bottom: 6px; }
        .dayHeader { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; cursor: pointer; transition: background .2s, border-color .2s; user-select: none; min-height: 52px; }
        .dayHeader:active { background: var(--surface2); }
        .dayHeaderExpanded { border-radius: 12px 12px 0 0; border-bottom-color: transparent; background: var(--surface2); }
        .dayHeaderAllDone { border-color: var(--done-border); background: var(--done-bg); }
        .dayDot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .dotNormal { background: var(--accent); }
        .dotCut { background: var(--warning); }
        .dotOffline { background: var(--danger); }
        .dotDeadline { background: var(--accent2); box-shadow: 0 0 6px var(--accent2); animation: pulse 1.5s infinite; }
        .dayDate { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; min-width: 72px; flex-shrink: 0; }
        .dayLabel { font-size: 11px; color: var(--muted); flex: 1; line-height: 1.3; }
        .dayRight { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .dayStatus { font-family: 'DM Mono', monospace; font-size: 9px; padding: 2px 8px; border-radius: 100px; white-space: nowrap; }
        .statusNormal { background: rgba(108,99,255,.12); color: var(--accent); border: 1px solid rgba(108,99,255,.25); }
        .statusCut { background: rgba(255,214,10,.1); color: var(--warning); border: 1px solid rgba(255,214,10,.25); }
        .statusOffline { background: rgba(255,77,109,.1); color: var(--danger); border: 1px solid rgba(255,77,109,.25); }
        .statusDeadline { background: rgba(255,101,132,.15); color: var(--accent2); border: 1px solid rgba(255,101,132,.3); }
        .dayCheckSummary { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--muted); white-space: nowrap; flex-shrink: 0; }
        .dayCheckSummaryDone { color: var(--accent3); }
        .dayChevron { color: var(--muted); font-size: 10px; transition: transform .25s; flex-shrink: 0; }
        .dayHeaderExpanded .dayChevron { transform: rotate(180deg); }
        .dayBody { display: none; background: var(--surface2); border: 1px solid var(--border); border-top: none; border-radius: 0 0 12px 12px; overflow: hidden; }
        .dayBodyOpen { display: block; }
        .scheduleRow { display: flex; align-items: flex-start; gap: 10px; padding: 11px 16px; border-bottom: 1px solid rgba(255,255,255,.04); }
        .scheduleRowLast { border-bottom: none; }
        .scheduleRowDone { background: rgba(67,233,123,.04); }
        .scheduleRowDone .schedTask strong, .scheduleRowDone .schedTime { opacity: .45; text-decoration: line-through; }
        .rowCheck { width: 20px; height: 20px; min-width: 20px; border-radius: 6px; border: 2px solid var(--border); background: var(--surface); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 11px; margin-top: 1px; transition: all .2s; flex-shrink: 0; }
        .rowCheck:hover { border-color: var(--accent3); }
        .rowCheckChecked { background: var(--accent3); border-color: var(--accent3); color: #000; }
        .schedTime { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); min-width: 80px; padding-top: 2px; flex-shrink: 0; line-height: 1.4; }
        .schedTask { font-size: 12px; line-height: 1.5; flex: 1; }
        .schedTask strong { color: var(--text); font-weight: 500; }
        .schedTask .sub { display: block; font-size: 10px; color: var(--muted); margin-top: 2px; }
        .schedBadge { font-family: 'DM Mono', monospace; font-size: 9px; padding: 2px 7px; border-radius: 100px; flex-shrink: 0; align-self: flex-start; margin-top: 2px; white-space: nowrap; }
        .badgeJurnal { background: rgba(108,99,255,.15); color: #a29bfe; border: 1px solid rgba(108,99,255,.3); }
        .badgeArtikel { background: rgba(249,202,36,.12); color: #ffd32a; border: 1px solid rgba(249,202,36,.3); }
        .badgeIg { background: rgba(253,121,168,.12); color: #fd79a8; border: 1px solid rgba(253,121,168,.3); }
        .badgeWeb { background: rgba(67,233,123,.1); color: #55efc4; border: 1px solid rgba(67,233,123,.3); }
        .badgeErp { background: rgba(255,118,117,.12); color: #ff7675; border: 1px solid rgba(255,118,117,.3); }
        .badgeSpk { background: rgba(99,205,218,.12); color: #74b9ff; border: 1px solid rgba(99,205,218,.3); }
        .badgeRest { background: rgba(255,255,255,.05); color: var(--muted); border: 1px solid var(--border); }
        .recSection { animation: fadeUp .6s .4s ease both; margin-bottom: 32px; }
        .recCard { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px; }
        .recList { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .recListLi { display: flex; gap: 10px; font-size: 12px; line-height: 1.6; color: #c8c8e0; }
        .recListLi::before { content: '→'; color: var(--accent); flex-shrink: 0; font-weight: 700; margin-top: 1px; }
        .recListLi strong { color: var(--text); }
        .summaryPills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; animation: fadeUp .6s .5s ease both; }
        .pill { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 10px 14px; font-size: 11px; display: flex; flex-direction: column; gap: 3px; min-width: 80px; }
        .pillValue { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; line-height: 1; }
        .pillLabel { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; }
        .recSection { animation: fadeUp .6s .4s ease both; margin-bottom: 32px; }
        .recCard { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px; }
        .recList { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .recListLi { display: flex; gap: 10px; font-size: 12px; line-height: 1.6; color: #c8c8e0; }
        .recListLi::before { content: '→'; color: var(--accent); flex-shrink: 0; font-weight: 700; margin-top: 1px; }
        .recListLi strong { color: var(--text); }
        .summaryPills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; animation: fadeUp .6s .5s ease both; }
        .pill { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 10px 14px; font-size: 11px; display: flex; flex-direction: column; gap: 3px; min-width: 80px; }
        .pillValue { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; line-height: 1; }
        .pillLabel { font-family: 'DM Mono', monospace; font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; }
        .resetWrap { margin-top: 28px; text-align: center; }
        .resetBtn { background: rgba(255,77,109,.08); border: 1px solid rgba(255,77,109,.25); color: #ff8fa3; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 1px; padding: 8px 20px; border-radius: 100px; cursor: pointer; transition: all .2s; }
        .resetBtn:hover { background: rgba(255,77,109,.15); }
        .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%) translateY(80px); background: #1a1a2e; border: 1px solid var(--border); border-radius: 12px; padding: 10px 20px; font-size: 12px; font-family: 'DM Mono', monospace; color: var(--accent3); z-index: 100; opacity: 0; transition: all .3s cubic-bezier(.4,0,.2,1); }
        .toastShow { opacity: 1; transform: translateX(-50%) translateY(0); }
        .footer { text-align: center; font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted); margin-top: 48px; opacity: .4; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
        @keyframes checkPop { 0% { transform: scale(1); } 40% { transform: scale(1.3); } 100% { transform: scale(1); } }
        .checkPop { animation: checkPop .25s ease; }

        @media (max-width: 480px) {
          .tracker-container { padding: 20px 12px 80px; }
          .dayDate { min-width: 60px; font-size: 12px; }
          .dayLabel { font-size: 10px; }
          .dayStatus { display: none; }
          .schedTime { min-width: 68px; font-size: 9px; }
          .scheduleRow { padding: 10px 12px; gap: 8px; }
          .schedBadge { display: none; }
          .countdownBar { padding: 14px 16px; gap: 14px; }
          .tasksGrid { gap: 10px; }
          .header h1 { font-size: clamp(22px, 8vw, 36px); }
          .recCard { padding: 16px; }
          .globalProgress { padding: 14px 16px; }
        }
      `}</style>

      <div className="tracker-container">
        <div className="header">
          <div className="headerBadge">KKN Task Tracker</div>
          <h1>Deadline Tracker<br/><span className="headerSpan">8 Juni 2026</span></h1>
          <div className="headerMeta">
            <span className="headerMetaSpan">📅 Mulai: 28 Mei 2026</span>
            <span className="headerMetaSpan">⏰ <strong style={{ color: '#ff6584' }}>{countdownData.daysLeft} hari {countdownData.hoursLeft} jam lagi</strong></span>
            <span className="headerMetaSpan">🎯 6 Task Utama</span>
          </div>
        </div>

        <div className="globalProgress">
          <div className="gpTop">
            <div>
              <div className="gpTitle">Progress Checklist</div>
              <div className="gpCount"><span>{progress.done}</span> / <span>{progress.total}</span> <span className="gpCountSpan">task selesai</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="gpTitle">Waktu tersisa</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '20px', fontWeight: '800', color: 'var(--accent2)' }}>{countdownData.daysLeft}h {countdownData.hoursLeft}j</div>
            </div>
          </div>
          <div className="gpTrack"><div className="gpFill" style={{ width: `${pct.toFixed(1)}%` }}></div></div>
        </div>

        <div className="countdownBar">
          <div>
            <div className="countdownLabel">Hari sisa</div>
            <div className="countdownDays">{countdownData.daysLeft}</div>
          </div>
          <div className="progressOuter">
            <div className="countdownLabel">Waktu berjalan (28 Mei → 8 Juni)</div>
            <div className="progressTrack"><div className="progressFill" style={{ width: `${countdownData.pct.toFixed(1)}%` }}></div></div>
          </div>
        </div>

        <div className="warningBlock">
          <span className="warningIcon">⚠️</span>
          <div><strong>Perhatian!</strong> Tgl 1–3 Juni hanya sore–malam. Tgl 30–31 Mei kemungkinan cabut + no signal. <strong>400 Artikel deadline 31 Mei</strong> — harus dikebut hari ini & besok!</div>
        </div>

        <div className="sectionTitle">Task Overview</div>
        <div className="tasksGrid">
          {CARDS_DATA.map(c => {
            const done = isChecked(c.id);
            return (
              <div key={c.id} className={`taskCard ${c.cls}${done ? ' taskCardDone' : ''}`}>
                <div className="taskCardTop">
                  <div className="taskNumber">{c.num}</div>
                  <div className={`cardCheck${done ? ' cardCheckChecked' : ''}`} onClick={() => toggleCard(c.id)} style={{ cursor: 'pointer' }}>{done ? '✓' : ''}</div>
                </div>
                <div className="taskTitle">{c.title}</div>
                <div className="taskDesc">{c.desc}</div>
                <span className={`taskTag ${c.tag}`}>{c.tagLabel}</span>
                <div className="taskHours">{c.hours}</div>
              </div>
            );
          })}
        </div>

        <div className="timeline">
          <div className="sectionTitle">Daily Timeline</div>
          {DAYS_DATA.map(day => {
            const isOpen = expandedDays.has(day.id);
            const totalRows = day.rows.length;
            const doneRows = day.rows.filter(r => isChecked(r.id)).length;
            const allDone = totalRows > 0 && doneRows === totalRows;
            return (
              <div key={day.id} className="dayBlock">
                <div className={`dayHeader${isOpen ? ' dayHeaderExpanded' : ''}${allDone ? ' dayHeaderAllDone' : ''}`} onClick={() => toggleDay(day.id)} style={{ cursor: 'pointer' }}>
                  <div className={`dayDot ${day.dot}`}></div>
                  <div className="dayDate">{day.date}</div>
                  <div className="dayLabel">{day.label}</div>
                  <div className="dayRight">
                    <div className={`dayCheckSummary${allDone ? ' dayCheckSummaryDone' : ''}`}>{allDone ? '✓ Done' : `${doneRows}/${totalRows}`}</div>
                    <div className={`dayStatus ${day.status}`}>{day.statusLabel}</div>
                    <div className="dayChevron">▼</div>
                  </div>
                </div>
                <div className={`dayBody${isOpen ? ' dayBodyOpen' : ''}`}>
                  {day.rows.map((r, ri) => {
                    const done = isChecked(r.id);
                    return (
                      <div key={r.id} className={`scheduleRow${ri === day.rows.length - 1 ? ' scheduleRowLast' : ''}${done ? ' scheduleRowDone' : ''}`}>
                        <div className={`rowCheck${done ? ' rowCheckChecked' : ''}`} onClick={() => toggleRow(r.id)} style={{ cursor: 'pointer' }}>{done ? '✓' : ''}</div>
                        <div className="schedTime">{r.time}</div>
                        <div className="schedTask"><strong>{r.task}</strong><span className="sub">{r.sub}</span></div>
                        <div className={`schedBadge ${r.badge}`}>{r.badgeLabel}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="recSection">
          <div className="sectionTitle">Rekomendasi Strategi</div>
          <div className="recCard">
            <ul className="recList">
              <li className="recListLi"><strong>400 Artikel adalah prioritas mutlak 28–29 Mei.</strong> Risiko no signal 30–31 Mei = idealnya 350+ sudah selesai sebelum pergi. Pakai template & batch writing.</li>
              <li className="recListLi"><strong>Hubungi kelompok SCM malam ini juga.</strong> Diskusi bisa via WA/online. Makin cepat rancangan jurnal dibagi, makin enteng beban kamu.</li>
              <li className="recListLi"><strong>Observasi EAP dijadwalkan 1 Juni sore</strong> — pas banget karena baru bisa sore-malam. Tulis langsung setelah pulang, sementara data masih segar.</li>
              <li className="recListLi"><strong>Website + Laporan di-blok full 4–5 Juni</strong> karena butuh fokus panjang. Jangan dicicil nanggung.</li>
              <li className="recListLi"><strong>Feed IG KKN paling fleksibel</strong> — kerjain 3–5 Juni setelah jurnal mulai jelas. Konten IG butuh data progress KKN yang lain.</li>
              <li className="recListLi"><strong>Rev SPK + ERP Task 3 satukan 1 sesi</strong> di 29 Mei malam. Relatif cepat kalau memang tinggal revisi/finalisasi.</li>
              <li className="recListLi"><strong>Jangan skip buffer 6–7 Juni.</strong> Ini penyelamat kalau ada yang molor. Fokus nambal lubang, bukan task baru.</li>
            </ul>
          </div>
        </div>

        <div className="sectionTitle">Ringkasan</div>
        <div className="summaryPills">
          <div className="pill"><div className="pillValue" style={{ color: '#ff6584' }}>{countdownData.daysLeft}</div><div className="pillLabel">Hari sisa</div></div>
          <div className="pill"><div className="pillValue" style={{ color: '#ffd32a' }}>6</div><div className="pillLabel">Task utama</div></div>
          <div className="pill"><div className="pillValue" style={{ color: '#a29bfe' }}>3</div><div className="pillLabel">Hari potong</div></div>
          <div className="pill"><div className="pillValue" style={{ color: '#ff4d6d' }}>2</div><div className="pillLabel">Hari offline</div></div>
          <div className="pill"><div className="pillValue" style={{ color: '#55efc4' }}>2</div><div className="pillLabel">Hari buffer</div></div>
          <div className="pill"><div className="pillValue" style={{ color: '#fd79a8' }}>400</div><div className="pillLabel">Artikel 31 Mei</div></div>
        </div>

        <div className="resetWrap">
          <button className="resetBtn" onClick={resetAll}>🗑 RESET SEMUA CHECKLIST</button>
        </div>

        <div className="footer">Made for KKN · Deadline 8 Juni 2026 · Semangat! 💪<br/>Checklist tersimpan otomatis di browser kamu</div>
      </div>

      <div className={`toast${toastShow ? ' toastShow' : ''}`}>{toastMsg}</div>
    </>
  );
}
