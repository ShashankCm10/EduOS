'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import {

  Search,

  Upload,

  Star,

  FileText,

  Sparkles,

  Send,

  Bot,

  User,

  ZoomIn,

  ZoomOut,

  ChevronLeft,

  ChevronRight,

  Bookmark,

  Highlighter,

  Download,

  Quote as QuoteIcon,

  Layers,

  Database,

  Clock,

  CircleCheck,

  Filter,

  X,

  ExternalLink,

} from 'lucide-react';

import PageHeader from '@/components/app/PageHeader';

import Reveal from '@/components/fx/Reveal';

import { ProgressBar, ProgressRing } from '@/components/ui/core';

import { cn, toneGrad, toneHex } from '@/lib/utils';

import { fetchPdfBlob, apiFetch } from '@/lib/api';

type LibrarySubject = { id: string; title: string; code: string; tone: 'violet' | 'cyan' | 'emerald' | 'amber'; };

type LibraryMaterial = { id: number | string; title: string; kind: string; pages: number; size: string; read: number; starred: boolean; subjectId: string; };
type MaterialStats = { documents: number; pages_searchable: number; chunks: number; embedded_chunks: number; };

type Msg = {

  role: 'user' | 'ai';

  text: string;

  points?: string[];

  cites?: { doc: string; page: number }[];

  highlight?: string;

};

const SUGGESTIONS = [

  'Summarise this document in 5 bullets',

  'What is most likely to appear in the exam?',

  'Explain page 31 like I am five',

  'Give me 6 flashcards from this chapter',

  'Where did I stop understanding?',

];

export default function MaterialsPage() {

  const [libraryMaterials, setLibraryMaterials] = useState<LibraryMaterial[]>([]);

  const [librarySubjects, setLibrarySubjects] = useState<LibrarySubject[]>([]);

  const [active, setActive] = useState<LibraryMaterial | null>(null);

  const [materialsLoading, setMaterialsLoading] = useState(true);

  const [materialsError, setMaterialsError] = useState<string | null>(null);
  const [materialStats, setMaterialStats] = useState<MaterialStats>({ documents: 0, pages_searchable: 0, chunks: 0, embedded_chunks: 0 });
  const [reindexing, setReindexing] = useState(false);

  const [q, setQ] = useState('');

  const [filter, setFilter] = useState<'all' | 'starred' | 'unread'>('all');

  const [search, setSearch] = useState('');

  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'ai', text: 'Ask anything about your study material. Answers will be grounded in your uploaded documents.' }]);

  const [streaming, setStreaming] = useState<string | null>(null);

  const [cite, setCite] = useState<{ doc: string; page: number } | null>(null);

  const [page, setPage] = useState(1);

  const [zoom, setZoom] = useState(100);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [pdfLoading, setPdfLoading] = useState(false);

  const [pdfError, setPdfError] = useState<string | null>(null);

  const [uploadOpen, setUploadOpen] = useState(false);

  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [uploadSubjectId, setUploadSubjectId] = useState('');

  const [uploading, setUploading] = useState(false);

  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const subject = librarySubjects.find((s) => s.id === String(active?.subjectId));

  const [c1, c2] = subject ? toneHex(subject.tone) : ['#8b5cf6', '#06b6d4'];

  const list = useMemo(() => libraryMaterials.filter((m) => {

    const hit = `${m.title} ${m.kind}`.toLowerCase().includes(search.toLowerCase());

    if (!hit) return false;

    if (filter === 'starred') return m.starred;

    if (filter === 'unread') return m.read < 60;

    return true;

  }), [libraryMaterials, filter, search]);

  useEffect(() => {

    let cancelled = false;

    async function loadLibrary() {

      setMaterialsLoading(true);

      setMaterialsError(null);

      try {

        const [subjectData, materialData, statsData] = await Promise.all([

          apiFetch('/students/me/subjects'),

          apiFetch('/students/me/materials'),

          apiFetch('/students/me/material-stats'),

        ]);

        if (cancelled) return;

        const mappedSubjects: LibrarySubject[] = (Array.isArray(subjectData) ? subjectData : []).map((item: any, index: number) => ({

          id: String(item.id),

          title: item.title ?? item.name ?? 'Untitled subject',

          code: item.code ?? '',

          tone: (['violet', 'cyan', 'emerald', 'amber'] as const)[index % 4],

        }));

        const mappedMaterials: LibraryMaterial[] = (Array.isArray(materialData) ? materialData : []).map((item: any) => ({

          id: item.id,

          title: item.title || item.original_filename || 'Untitled material',

          kind: item.original_filename?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'Material',

          pages: item.pages ?? 0,

          size: item.size ?? '',

          read: item.read ?? 0,

          starred: item.starred ?? false,

          subjectId: String(item.subject?.id ?? ''),

        }));

        setLibrarySubjects(mappedSubjects);

        setLibraryMaterials(mappedMaterials);

        setMaterialStats({
          documents: Number(statsData?.documents ?? 0),
          pages_searchable: Number(statsData?.pages_searchable ?? 0),
          chunks: Number(statsData?.chunks ?? 0),
          embedded_chunks: Number(statsData?.embedded_chunks ?? 0),
        });

        setActive((current) => mappedMaterials.find((m) => String(m.id) === String(current?.id)) ?? mappedMaterials[0] ?? null);

      } catch (error) {

        if (!cancelled) setMaterialsError(error instanceof Error ? error.message : 'Unable to load your materials.');

      } finally {

        if (!cancelled) setMaterialsLoading(false);

      }

    }

    loadLibrary();

    return () => { cancelled = true; };

  }, []);

// Load the authenticated PDF whenever the selected material changes.

  useEffect(() => {

    if (!active) return;

    const currentActive = active;
    let cancelled = false;

    let objectUrl: string | null = null;

    async function loadPdf() {

      setPdfLoading(true);

      setPdfError(null);

      setPdfUrl(null);

      try {

        const blob = await fetchPdfBlob(currentActive.id);

        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);

        setPdfUrl(objectUrl);

      } catch (error) {

        if (cancelled) return;

        setPdfError(

          error instanceof Error

            ? error.message

            : 'Unable to load this PDF.'

        );

      } finally {

        if (!cancelled) {

          setPdfLoading(false);

        }

      }

    }

    loadPdf();

    return () => {

      cancelled = true;

      if (objectUrl) {

        URL.revokeObjectURL(objectUrl);

      }

    };

  }, [active?.id]);

  const refreshMaterialStats = async () => {
    const statsData = await apiFetch('/students/me/material-stats');
    setMaterialStats({
      documents: Number(statsData?.documents ?? 0),
      pages_searchable: Number(statsData?.pages_searchable ?? 0),
      chunks: Number(statsData?.chunks ?? 0),
      embedded_chunks: Number(statsData?.embedded_chunks ?? 0),
    });
  };

  const reindexLibrary = async () => {
    if (reindexing) return;
    setReindexing(true);
    try {
      for (const material of libraryMaterials) {
        await apiFetch(`/study-materials/${material.id}/chunks`, { method: 'POST' });
      }
      await refreshMaterialStats();
      setMaterialsError(null);
    } catch (error) {
      setMaterialsError(error instanceof Error ? error.message : 'Unable to re-index the library.');
    } finally {
      setReindexing(false);
    }
  };

  const uploadMaterial = async () => {
    if (uploading) return;
    if (!uploadFile) {
      setUploadMessage('Please select a PDF.');
      return;
    }
    if (!uploadSubjectId) {
      setUploadMessage('Please select a subject.');
      return;
    }
    const isPdf = uploadFile.type === 'application/pdf' || /\.pdf$/i.test(uploadFile.name);
    if (!isPdf) {
      setUploadMessage('Only PDF files are supported.');
      return;
    }

    const token =
      sessionStorage.getItem('eduos_token') ||
      localStorage.getItem('eduos_token');
    if (!token) {
      setUploadMessage('Please log in again before uploading.');
      return;
    }

    setUploading(true);
    setUploadMessage('Uploading PDF...');

    try {
      const formData = new FormData();
      const title = uploadFile.name.replace(/\.pdf$/i, '').trim() || 'Study Material';
      formData.append('title', title);
      formData.append('description', '');
      formData.append('subject_id', uploadSubjectId);
      formData.append('file', uploadFile, uploadFile.name);

      const response = await fetch('http://127.0.0.1:8001/study-materials/', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const detail = data?.detail;
        throw new Error(
          Array.isArray(detail)
            ? detail.map((item: any) => item?.msg || String(item)).join(', ')
            : typeof detail === 'string'
              ? detail
              : `Upload failed (${response.status}).`
        );
      }

      const materialId = data?.material_id;
      if (!materialId) {
        throw new Error('Upload succeeded but no material ID was returned.');
      }

      setUploadMessage('PDF uploaded. Creating chunks…');
      await apiFetch(`/study-materials/${materialId}/chunks`, { method: 'POST' });
      setUploadMessage('Material uploaded and indexed successfully.');

      const materialData = await apiFetch('/students/me/materials');
      await refreshMaterialStats();
      const mappedMaterials: LibraryMaterial[] = (Array.isArray(materialData) ? materialData : []).map((item: any) => ({
        id: item.id,
        title: item.title || item.original_filename || 'Untitled material',
        kind: item.original_filename?.toLowerCase().endsWith('.pdf') ? 'PDF' : 'Material',
        pages: item.pages ?? 0,
        size: item.size ?? '',
        read: item.read ?? 0,
        starred: item.starred ?? false,
        subjectId: String(item.subject?.id ?? ''),
      }));

      setLibraryMaterials(mappedMaterials);
      setActive(mappedMaterials[0] ?? null);
      setUploadFile(null);
      setUploadSubjectId('');

      setTimeout(() => {
        setUploadOpen(false);
        setUploadMessage(null);
      }, 1000);
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : 'Unable to upload material.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {

    scrollRef.current?.scrollTo({

      top: scrollRef.current.scrollHeight,

      behavior: 'smooth',

    });

  }, [msgs, streaming]);

   // Temporary demo AI response.

   // We will replace this next with:

  // POST /students/me/materials/{material_id}/ask

  const ask = async (question: string) => {
  if (!question.trim() || streaming || !active) return;

  const currentActive = active;
  const userQuestion = question.trim();

  setQ('');

  setMsgs((m) => [
    ...m,
    {
      role: 'user',
      text: userQuestion,
    },
  ]);

  setStreaming('Thinking...');

  try {
    const result = await apiFetch(
      `/students/me/materials/${currentActive.id}/ask`,
      {
        method: 'POST',
        body: JSON.stringify({
          question: userQuestion,
          limit: 5,
        }),
      }
    );

    const sources = Array.isArray(result?.sources)
      ? result.sources
      : [];

    const cites = sources
      .map((source: any) => ({
        doc:
          source.document ||
          source.doc ||
          source.title ||
          currentActive.title,
        page: Number(source.page ?? source.page_number ?? 1),
      }))
      .filter((source: { doc: string; page: number }) => source.page > 0);

    const answerText =
      result?.answer ||
      'I could not generate an answer from this material.';

    setStreaming(null);

    setMsgs((m) => [
      ...m,
      {
        role: 'ai',
        text: answerText,
        cites,
      },
    ]);

    if (cites.length > 0) {
      setCite(cites[0]);
      setPage(cites[0].page);
    }
  } catch (error) {
    setStreaming(null);

    setMsgs((m) => [
      ...m,
      {
        role: 'ai',
        text:
          error instanceof Error
            ? `Unable to answer: ${error.message}`
            : 'Unable to answer this question.',
      },
    ]);
  }
};

   //Retry PDF loading.

  const retryPdf = async () => {

    if (!active) return;

    setPdfLoading(true);

    setPdfError(null);

    try {

      const blob = await fetchPdfBlob(active.id);

      const url = URL.createObjectURL(blob);

      setPdfUrl((oldUrl) => {

        if (oldUrl) {

          URL.revokeObjectURL(oldUrl);

        }

        return url;

      });

    } catch (error) {

      setPdfError(

        error instanceof Error

          ? error.message

          : 'Unable to load this PDF.'

      );

    } finally {

      setPdfLoading(false);

    }

  };

  //Download the currently loaded PDF.

  const downloadPdf = () => {

    if (!pdfUrl || !active) return;

    const link = document.createElement('a');

    link.href = pdfUrl;

    link.download = (active?.title ?? 'study-material.pdf').toLowerCase().endsWith('.pdf')

      ? active.title

      : `${active?.title ?? 'Study material'}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();

  };

  if (materialsLoading) {

    return <div className="grid min-h-[70vh] place-items-center"><div className="text-center"><div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" /><p className="text-sm text-slate-400">Loading your study materials…</p></div></div>;

  }

  if (!active) {

    return (

      <div className="space-y-6">

        <PageHeader eyebrow={<><Database className="h-3.5 w-3.5" /> RAG knowledge base</>} title={<>Study <span className="grad-text">Materials</span></>} sub="Upload your study materials to build your personal knowledge base." actions={<button onClick={() => setUploadOpen(true)} className="btn btn-md btn-primary shine"><Upload className="h-4 w-4" />Upload material</button>} />

        <div className="panel mx-auto max-w-xl p-8 text-center">

          <FileText className="mx-auto mb-3 h-10 w-10 text-slate-500" />

          <p className="text-sm font-semibold text-white">No study materials yet</p>

          <p className="mt-1 text-xs text-slate-500">Upload a PDF to get started.</p>

          {materialsError && <p className="mt-3 text-xs text-red-300">{materialsError}</p>}

        </div>

      </div>

    );

  }

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <PageHeader

        eyebrow={

          <>

            <Database className="h-3.5 w-3.5" />

            RAG knowledge base

          </>

        }

        title={

          <>

            Study <span className="grad-text">Materials</span>

          </>

        }

        sub="Every PDF, slide deck and past paper you upload is chunked, embedded and made askable. Answers always cite the exact page they came from."

        actions={

          <>

            <button
              type="button"
              onClick={() => void reindexLibrary()}
              disabled={reindexing || libraryMaterials.length === 0}
              className="btn btn-md btn-ghost disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Layers className="h-4 w-4" />
              {reindexing ? 'Indexing…' : 'Re-index library'}
            </button>

            <button

              onClick={() => setUploadOpen(true)}

              className="btn btn-md btn-primary shine"

            >

              <Upload className="h-4 w-4" />

              Upload material

            </button>

          </>

        }

      />

      {/* INDEX STATS */}

      <Reveal>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {[
            { l: 'Documents', v: materialStats.documents.toLocaleString(), s: 'uploaded to your library', i: FileText, tone: 'violet' as const },
            { l: 'Pages searchable', v: materialStats.pages_searchable.toLocaleString(), s: 'pages with extracted chunks', i: Database, tone: 'cyan' as const },
            { l: 'Chunks stored', v: materialStats.chunks.toLocaleString(), s: '1000-char chunks · 200 overlap', i: Layers, tone: 'emerald' as const },
            { l: 'Chunks embedded', v: materialStats.embedded_chunks.toLocaleString(), s: 'with vector embeddings', i: QuoteIcon, tone: 'amber' as const },
          ].map((x) => (

            <div

              key={x.l}

              className="panel flex items-center gap-4 p-4"

            >

              <span

                className={cn(

                  'grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white',

                  {

                    violet:

                      'from-violet-500 to-indigo-600',

                    cyan:

                      'from-cyan-400 to-sky-600',

                    emerald:

                      'from-emerald-400 to-teal-600',

                    amber:

                      'from-amber-400 to-orange-600',

                  }[x.tone]

                )}

              >

                <x.i className="h-5 w-5" />

              </span>

              <div>

                <div className="font-display text-xl font-extrabold text-white">

                  {x.v}

                </div>

                <div className="text-[10.5px] uppercase tracking-wider text-slate-500">

                  {x.l}

                </div>

                <div className="text-[10.5px] text-slate-500">

                  {x.s}

                </div>

              </div>

            </div>

          ))}

        </div>

      </Reveal>

      {/* =========================================================

          MAIN GRID

      ========================================================= */}

      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]">

        {/* =======================================================

            LIBRARY

        ======================================================= */}

        <Reveal>

          <div className="panel flex h-full flex-col p-4">

            <div className="relative">

              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <input

                value={search}

                onChange={(e) => setSearch(e.target.value)}

                placeholder="Search your library…"

                className="h-10 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] pl-10 pr-3 text-[13px] text-white focus:border-violet-400/60"

              />

            </div>

            <div className="mt-3 flex gap-1.5">

              {(

                ['all', 'starred', 'unread'] as const

              ).map((f) => (

                <button

                  key={f}

                  onClick={() => setFilter(f)}

                  className={cn(

                    'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold capitalize transition',

                    filter === f

                      ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white'

                      : 'border border-white/[0.08] text-slate-400 hover:text-white'

                  )}

                >

                  {f === 'starred' && (

                    <Star className="h-3 w-3" />

                  )}

                  {f}

                </button>

              ))}

            </div>

            <div

              className="thin-scroll mt-3 flex-1 space-y-2 overflow-y-auto pr-1"

              style={{ maxHeight: '38rem' }}

            >

              {list.map((m) => {

                const on = m.id === active?.id;

                const s = librarySubjects.find(

                  (x) => x.id === m.subjectId

                );

                return (

                  <button

                    key={m.id}

                    onClick={() => {

                      setActive(m);

                      setCite(null);

                      setPage(1);

                      setZoom(100);

                    }}

                    className={cn(

                      'group w-full rounded-xl border p-3 text-left transition-all duration-300',

                      on

                        ? 'border-violet-400/40 bg-gradient-to-br from-violet-600/[0.15] to-cyan-500/[0.06]'

                        : 'border-white/[0.07] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]'

                    )}

                  >

                    <div className="flex items-start gap-2.5">

                      <span

                        className={cn(

                          'grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-white',

                          s ? toneGrad(s.tone) : ''

                        )}

                      >

                        <FileText className="h-4 w-4" />

                      </span>

                      <span className="min-w-0 flex-1">

                        <span

                          className={cn(

                            'block text-[12.5px] font-semibold leading-snug',

                            on

                              ? 'text-white'

                              : 'text-slate-300'

                          )}

                        >

                          {m.title}

                        </span>

                        <span className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">

                          <span

                            className={cn(

                              'rounded-full border px-1.5 py-0.5',

                              on

                                ? 'border-violet-400/40 text-violet-200'

                                : 'border-white/[0.09]'

                            )}

                          >

                            {m.kind}

                          </span>

                          <span>{m.pages}p</span>

                          <span>{m.size}</span>

                        </span>

                      </span>

                      {m.starred && (

                        <Star className="h-3.5 w-3.5 shrink-0 fill-current text-amber-400" />

                      )}

                    </div>

                    <div className="mt-2.5 flex items-center gap-2">

                      <ProgressBar

                        value={m.read}

                        height={4}

                        from={c1}

                        to={c2}

                        className="flex-1"

                      />

                      <span className="shrink-0 text-[10px] font-bold text-slate-500">

                        {m.read}%

                      </span>

                    </div>

                  </button>

                );

              })}

              {list.length === 0 && (

                <div className="rounded-xl border border-dashed border-white/12 p-6 text-center">

                  <Filter className="mx-auto mb-2 h-5 w-5 text-slate-600" />

                  <p className="text-[12px] text-slate-500">

                    Nothing matches that filter.

                  </p>

                </div>

              )}

            </div>

            <div className="mt-3 rounded-xl border border-dashed border-white/15 p-3.5 text-center">

              <Upload className="mx-auto mb-1.5 h-4 w-4 text-slate-500" />

              <p className="text-[11px] text-slate-500">

                Drop a PDF here — indexed in{' '}

                <span className="font-semibold text-slate-300">

                  ~40 seconds

                </span>

              </p>

            </div>

          </div>

        </Reveal>

        {/* =======================================================

            LARGE PDF VIEWER

        ======================================================= */}

        <Reveal delay={60}>

          <div className="panel flex min-h-[58rem] h-full flex-col overflow-hidden">

            {/***** Document header *****/}

            <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.07] p-4">

              <span

                className={cn(

                  'grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white',

                  subject

                    ? toneGrad(subject.tone)

                    : 'from-violet-600 to-cyan-500'

                )}

              >

                <FileText className="h-4 w-4" />

              </span>

              <div className="min-w-0 flex-1">

                <h3 className="truncate text-[13.5px] font-bold text-white">

                  {active?.title ?? 'Study material'}

                </h3>

                <div className="flex flex-wrap items-center gap-2 text-[10.5px] text-slate-500">

                  {subject && (

                    <>

                      <span className="font-mono">

                        {subject.code}

                      </span>

                      <span>·</span>

                    </>

                  )}

                  <span>

                    {active?.pages ?? 0} pages

                  </span>

                  <span>·</span>

                  <span className="flex items-center gap-1 text-emerald-300">

                    <CircleCheck className="h-3 w-3" />

                    Indexed

                  </span>

                </div>

              </div>

              <div className="flex items-center gap-1.5">

                <button

                  className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.09] text-slate-400 transition hover:border-white/25 hover:text-white"

                  title="Bookmark"

                >

                  <Bookmark className="h-3.5 w-3.5" />

                </button>

                <button

                  className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.09] text-slate-400 transition hover:border-white/25 hover:text-white"

                  title="Highlight"

                >

                  <Highlighter className="h-3.5 w-3.5" />

                </button>

                <button

                  onClick={downloadPdf}

                  disabled={!pdfUrl}

                  className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.09] text-slate-400 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"

                  title="Download PDF"

                >

                  <Download className="h-3.5 w-3.5" />

                </button>

              </div>

            </div>

            {/***** PDF toolbar *****/}

            <div className="flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.02] px-4 py-2.5">

              <div className="flex items-center gap-1.5">

                <button

                  onClick={() =>

                    setPage((p) => Math.max(1, p - 1))

                  }

                  disabled={page <= 1}

                  className="grid h-7 w-7 place-items-center rounded-lg border border-white/[0.09] text-slate-400 hover:text-white disabled:opacity-30"

                >

                  <ChevronLeft className="h-3.5 w-3.5" />

                </button>

                <span className="font-mono text-[11px] text-slate-400">

                  page{' '}

                  <span className="font-bold text-white">

                    {page}

                  </span>{' '}

                  / {active?.pages ?? 0}

                </span>

                <button

                  onClick={() =>

                    setPage((p) =>

                      Math.min(active?.pages ?? 1, p + 1)

                    )

                  }

                  disabled={page >= (active?.pages ?? 1)}

                  className="grid h-7 w-7 place-items-center rounded-lg border border-white/[0.09] text-slate-400 hover:text-white disabled:opacity-30"

                >

                  <ChevronRight className="h-3.5 w-3.5" />

                </button>

              </div>

              <div className="ml-auto flex items-center gap-2">

                <button

                  onClick={() =>

                    setZoom((z) => Math.max(70, z - 10))

                  }

                  className="grid h-7 w-7 place-items-center rounded-lg border border-white/[0.09] text-slate-400 hover:text-white"

                >

                  <ZoomOut className="h-3.5 w-3.5" />

                </button>

                <span className="w-10 text-center font-mono text-[11px] text-slate-400">

                  {zoom}%

                </span>

                <button

                  onClick={() =>

                    setZoom((z) => Math.min(140, z + 10))

                  }

                  className="grid h-7 w-7 place-items-center rounded-lg border border-white/[0.09] text-slate-400 hover:text-white"

                >

                  <ZoomIn className="h-3.5 w-3.5" />

                </button>

              </div>

            </div>

            {/* =====================================================

                LARGE PDF AREA

            ===================================================== */}

            <div className="thin-scroll relative flex-1 overflow-auto bg-ink-950/50 p-5">

              <div className="relative mx-auto min-h-[48rem] w-full overflow-hidden rounded-xl border border-white/[0.08] bg-black/30">

                {/***** Loading *****/}

                {pdfLoading && (

                  <div className="absolute inset-0 z-10 grid place-items-center bg-ink-950/90">

                    <div className="text-center">

                      <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />

                      <p className="text-xs text-slate-400">

                        Loading PDF…

                      </p>

                    </div>

                  </div>

                )}

                {/***** Error *****/}

                {pdfError && (

                  <div className="absolute inset-0 z-10 grid place-items-center bg-ink-950/90 p-6">

                    <div className="max-w-sm text-center">

                      <FileText className="mx-auto mb-3 h-8 w-8 text-red-400" />

                      <p className="text-sm font-semibold text-white">

                        Unable to load PDF

                      </p>

                      <p className="mt-2 text-xs leading-relaxed text-slate-400">

                        {pdfError}

                      </p>

                      <button

                        onClick={retryPdf}

                        className="mt-4 rounded-lg border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white hover:bg-white/[0.09]"

                      >

                        Retry

                      </button>

                    </div>

                  </div>

                )}

                {/***** PDF iframe *****/}

                {pdfUrl && !pdfError && (

                  <iframe

                    src={pdfUrl}

                    title={active?.title ?? 'Study material'}

                    className="h-full min-h-[48rem] w-full border-0"

                    style={{

                      transform: `scale(${zoom / 100})`,

                      transformOrigin: 'top left',

                      width: `${10000 / zoom}%`,

                      height: `${10000 / zoom}%`,

                    }}

                  />

                )}

              </div>

            </div>

            {/***** Ask about document *****/}

            <div className="border-t border-white/[0.07] p-3">

              <div className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-3 py-2 transition focus-within:border-violet-400/60">

                <Sparkles className="h-4 w-4 shrink-0 text-violet-300" />

                <input

                  value={q}

                  onChange={(e) => setQ(e.target.value)}

                  onKeyDown={(e) =>

                    e.key === 'Enter' && ask(q)

                  }

                  placeholder={`Ask "${(active?.title ?? 'this document').slice(

                    0,

                    34

                  )}…" anything`}

                  className="h-8 flex-1 bg-transparent text-[12.5px] text-white"

                />

                <button

                  onClick={() => ask(q)}

                  disabled={!!streaming}

                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white disabled:opacity-50"

                >

                  <Send className="h-3.5 w-3.5" />

                </button>

              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">

                {SUGGESTIONS.slice(0, 3).map((s) => (

                  <button

                    key={s}

                    onClick={() => ask(s)}

                    className="rounded-full border border-white/[0.09] bg-white/[0.03] px-2.5 py-1 text-[10.5px] text-slate-400 transition hover:border-violet-400/50 hover:text-white"

                  >

                    {s}

                  </button>

                ))}

              </div>

            </div>

          </div>

        </Reveal>

        {/* =======================================================

            AI ASSISTANT

        ======================================================= */}

        <Reveal delay={120}>

          <div className="panel flex min-h-[58rem] h-full flex-col overflow-hidden">

            <div className="flex items-center gap-3 border-b border-white/[0.07] p-4">

              <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">

                <Bot className="h-4 w-4 text-white" />

                <span className="absolute inset-0 rounded-xl bg-violet-500/40 animate-pulse-ring" />

              </span>

              <div className="min-w-0 flex-1">

                <h3 className="font-display text-[14px] font-bold text-white">

                  Document assistant

                </h3>

                <p className="text-[10.5px] text-emerald-300">

                  Grounded · page-accurate · no hallucination mode

                </p>

              </div>

              <ProgressRing

                value={92}

                size={40}

                stroke={4}

                from="#10B981"

                to="#84CC16"

                label={

                  <span className="text-[9px]">

                    92

                  </span>

                }

              />

            </div>

            {/***** Chat *****/}

            <div

              ref={scrollRef}

              className="thin-scroll flex-1 space-y-3.5 overflow-y-auto p-4"

            >

              {msgs.map((m, i) => (

                <div

                  key={i}

                  className={cn(

                    'flex gap-2.5',

                    m.role === 'user'

                      ? 'justify-end'

                      : ''

                  )}

                >

                  {m.role === 'ai' && (

                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500">

                      <Bot className="h-3.5 w-3.5 text-white" />

                    </span>

                  )}

                  <div

                    className={cn(

                      'min-w-0 max-w-[88%]',

                      m.role === 'user' &&

                        'order-first'

                    )}

                  >

                    <div

                      className={cn(

                        'rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed',

                        m.role === 'user'

                          ? 'rounded-br-sm border border-white/12 bg-white/[0.07] text-slate-100'

                          : 'rounded-bl-sm border border-violet-400/22 bg-gradient-to-br from-violet-600/[0.14] to-cyan-500/[0.07] text-slate-100'

                      )}

                    >

                      <p>{m.text}</p>

                      {m.points && (

                        <ul className="mt-2.5 space-y-1.5">

                          {m.points.map((p, k) => (

                            <li

                              key={k}

                              className="flex gap-2 text-[12px] text-slate-300"

                            >

                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />

                              {p}

                            </li>

                          ))}

                        </ul>

                      )}

                      {m.highlight && (

                        <div className="mt-2.5 rounded-xl border border-amber-400/25 bg-amber-500/[0.09] px-2.5 py-2 text-[11px] leading-relaxed text-amber-100">

                          <span className="font-bold uppercase tracking-wider">

                            Exam-ready ·

                          </span>{' '}

                          {m.highlight}

                        </div>

                      )}

                      {m.cites && (

                        <div className="mt-2.5 space-y-1.5">

                          {m.cites.map((c, k) => (

                            <button

                              key={k}

                              onClick={() => {

                                setCite(c);

                                setPage(c.page);

                              }}

                              className={cn(

                                'flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-[10.5px] font-semibold transition',

                                cite?.page === c.page

                                  ? 'border-cyan-400/60 bg-cyan-500/[0.14] text-cyan-100'

                                  : 'border-cyan-400/25 bg-cyan-500/[0.07] text-cyan-200 hover:border-cyan-400/50'

                              )}

                            >

                              <FileText className="h-3 w-3 shrink-0" />

                              <span className="min-w-0 flex-1 truncate">

                                {c.doc}

                              </span>

                              <span className="shrink-0">

                                p.{c.page}

                              </span>

                              <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-60" />

                            </button>

                          ))}

                        </div>

                      )}

                    </div>

                  </div>

                  {m.role === 'user' && (

                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.05]">

                      <User className="h-3.5 w-3.5 text-slate-400" />

                    </span>

                  )}

                </div>

              ))}

              {streaming !== null && (

                <div className="flex gap-2.5">

                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500">

                    <Bot className="h-3.5 w-3.5 text-white" />

                  </span>

                  <div className="rounded-2xl rounded-bl-sm border border-violet-400/22 bg-gradient-to-br from-violet-600/[0.14] to-cyan-500/[0.07] px-3.5 py-2.5 text-[12.5px] text-slate-100">

                    {streaming}

                    <span className="ml-0.5 inline-block h-3 w-[2px] translate-y-0.5 bg-cyan-300 animate-blink" />

                  </div>

                </div>

              )}

            </div>

            {cite && (

              <button

                onClick={() => setCite(null)}

                className="mx-4 mb-2 flex items-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-500/[0.08] px-3 py-2 text-left"

              >

                <X className="h-3 w-3 shrink-0 text-cyan-300" />

                <span className="min-w-0 flex-1 truncate text-[10.5px] text-cyan-100">

                  Highlighted: {cite.doc} · p.{cite.page}

                </span>

              </button>

            )}

            <div className="border-t border-white/[0.07] p-3">

              <div className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-3 py-2 transition focus-within:border-violet-400/60">

                <Sparkles className="h-4 w-4 shrink-0 text-violet-300" />

                <input

                  value={q}

                  onChange={(e) => setQ(e.target.value)}

                  onKeyDown={(e) =>

                    e.key === 'Enter' && ask(q)

                  }

                  placeholder="Ask across your whole library…"

                  className="h-8 flex-1 bg-transparent text-[12.5px] text-white"

                />

                <button

                  onClick={() => ask(q)}

                  disabled={!!streaming}

                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white disabled:opacity-50"

                >

                  <Send className="h-3.5 w-3.5" />

                </button>

              </div>

              <div className="mt-2 text-[10px] text-slate-500">

                <Clock className="mr-1 inline h-3 w-3" />

                Answers will be generated from uploaded material.

              </div>

            </div>

          </div>

        </Reveal>

      </div>

      {uploadOpen && (

        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#11111b] p-6 shadow-2xl">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-bold text-white">

                  Upload Study Material

                </h2>

                <p className="mt-1 text-xs text-slate-500">

                  Upload a PDF to your personal knowledge base.

                </p>

              </div>

              <button
                type="button"
                onClick={() => {

                  if (uploading) return;

                  setUploadOpen(false);

                  setUploadMessage(null);

                  setUploadFile(null);

                  setUploadSubjectId('');

                }}

                disabled={uploading}

                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white disabled:opacity-50"

                aria-label="Close upload dialog"

              >

                <X className="h-4 w-4" />

              </button>

            </div>

            <label className="mb-4 block">

              <span className="mb-2 block text-xs font-semibold text-slate-300">

                PDF file

              </span>

              <input

                type="file"

                accept="application/pdf,.pdf"

                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setUploadFile(file);
                  setUploadMessage(file ? `${file.name} selected.` : null);
                }}

                className="block w-full cursor-pointer rounded-xl border border-white/[0.1] bg-white/[0.035] p-3 text-xs text-slate-400 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"

              />

            </label>

            <label className="mb-4 block">

              <span className="mb-2 block text-xs font-semibold text-slate-300">

                Subject

              </span>

              <select

                value={uploadSubjectId}

                onChange={(e) => setUploadSubjectId(e.target.value)}

                className="h-11 w-full rounded-xl border border-white/[0.1] bg-white/[0.035] px-3 text-sm text-white outline-none focus:border-violet-400/60"

              >

                <option value="" className="bg-slate-900">

                  Select subject

                </option>

                {librarySubjects.map((subject) => (

                  <option

                    key={subject.id}

                    value={subject.id}

                    className="bg-slate-900"

                  >

                    {subject.title}

                  </option>

                ))}

              </select>

            </label>

            {uploadFile && (

              <div className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">

                <div className="flex items-center gap-3">

                  <FileText className="h-5 w-5 text-violet-400" />

                  <div className="min-w-0">

                    <p className="truncate text-xs font-semibold text-white">

                      {uploadFile.name}

                    </p>

                    <p className="text-[10px] text-slate-500">

                      {(uploadFile.size / 1024 / 1024).toFixed(2)} MB

                    </p>

                  </div>

                </div>

              </div>

            )}

            {uploadMessage && (

              <div className="mb-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 text-xs text-slate-300">

                {uploadMessage}

              </div>

            )}

            <button
              type="button"
              onClick={() => void uploadMaterial()}
              className="btn btn-md btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
              disabled={uploading}
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload PDF'}
            </button>

          </div>

        </div>

      )}

    </div>

  );

}
