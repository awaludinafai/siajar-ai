import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CreatorProfileView } from './components/CreatorProfileView';
import { CurriculumGuideView } from './components/CurriculumGuideView';
import { DocumentWorkspace } from './components/DocumentWorkspace';
import { GeneratorSidebar } from './components/GeneratorSidebar';
import { HistoryView } from './components/HistoryView';
import { LeftMenuSidebar } from './components/LeftMenuSidebar';
import { TopBar, WorkspaceTab } from './components/TopBar';
import { DEFAULT_FORM_DATA, getMenuLabel } from './data/curriculum';
import { GeneratorFormData, MenuSectionId, SavedDocument } from './types';
import { downloadAsWordDoc } from './utils/exportDoc';
import { cleanMarkdownForPlainText } from './utils/formatMarkdown';

const STORAGE_KEY = 'siajar_ai_history_v1';

interface MenuDraftState {
  content: string;
  docId: string | null;
}

const INITIAL_DRAFTS: Record<MenuSectionId, MenuDraftState> = {
  perangkat_ajar: { content: '', docId: null },
  analisis_alokasi_waktu: { content: '', docId: null },
  capaian_pembelajaran: { content: '', docId: null },
  alur_tujuan_pembelajaran: { content: '', docId: null },
  program_semester: { content: '', docId: null },
  program_tahunan: { content: '', docId: null },
  modul_ajar: { content: '', docId: null },
};

function extractDocumentTitle(
  markdown: string,
  formData: GeneratorFormData,
  menuId: MenuSectionId
): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (match && match[1]) {
    return match[1].replace(/[*_`]/g, '').trim().slice(0, 120);
  }
  return `${getMenuLabel(menuId)} · ${formData.mataPelajaran} — ${formData.kelas}`;
}

function loadSavedDocuments(): SavedDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('generator');
  const [activeMenu, setActiveMenu] = useState<MenuSectionId>('perangkat_ajar');
  const [formData, setFormData] = useState<GeneratorFormData>(DEFAULT_FORM_DATA);
  const [draftsByMenu, setDraftsByMenu] =
    useState<Record<MenuSectionId, MenuDraftState>>(INITIAL_DRAFTS);
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>(() => loadSavedDocuments());
  const [showFormPanel, setShowFormPanel] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const activeDraft = draftsByMenu[activeMenu];
  const content = activeDraft.content;
  const activeDocId = activeDraft.docId;

  const completedMenus = useMemo(() => {
    return {
      perangkat_ajar: Boolean(draftsByMenu.perangkat_ajar.content.trim()),
      analisis_alokasi_waktu: Boolean(draftsByMenu.analisis_alokasi_waktu.content.trim()),
      capaian_pembelajaran: Boolean(draftsByMenu.capaian_pembelajaran.content.trim()),
      alur_tujuan_pembelajaran: Boolean(draftsByMenu.alur_tujuan_pembelajaran.content.trim()),
      program_semester: Boolean(draftsByMenu.program_semester.content.trim()),
      program_tahunan: Boolean(draftsByMenu.program_tahunan.content.trim()),
      modul_ajar: Boolean(draftsByMenu.modul_ajar.content.trim()),
    };
  }, [draftsByMenu]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDocuments));
    } catch {
      // Ignore storage quota errors silently
    }
  }, [savedDocuments]);

  const setActiveMenuContent = (nextContent: string, nextDocId?: string | null) => {
    setDraftsByMenu((prev) => ({
      ...prev,
      [activeMenu]: {
        content: nextContent,
        docId: nextDocId !== undefined ? nextDocId : prev[activeMenu].docId,
      },
    }));
  };

  const upsertSavedDocument = (
    menuId: MenuSectionId,
    docContent: string,
    docFormData: GeneratorFormData,
    existingId: string | null
  ): string => {
    const now = new Date().toISOString();
    const title = extractDocumentTitle(docContent, docFormData, menuId);
    const id = existingId || `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    setSavedDocuments((prev) => {
      const idx = prev.findIndex((d) => d.id === id);
      const nextDoc: SavedDocument = {
        id,
        menuId,
        title,
        createdAt: idx >= 0 ? prev[idx].createdAt : now,
        updatedAt: now,
        formData: docFormData,
        content: docContent,
      };
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = nextDoc;
        return copy;
      }
      return [nextDoc, ...prev];
    });

    return id;
  };

  const streamSseEndpoint = async (
    url: string,
    body: unknown,
    onChunk: (fullText: string) => void
  ): Promise<string> => {
    const controller = new AbortController();
    abortRef.current = controller;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      let msg = `Permintaan gagal (${response.status}).`;
      try {
        const errJson = await response.json();
        if (errJson?.error) msg = errJson.error;
      } catch {
        // Keep default message
      }
      throw new Error(msg);
    }

    if (!response.body) {
      throw new Error('Respons streaming dari server tidak tersedia.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let accumulated = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split('\n\n');
      buffer = blocks.pop() || '';

      for (const block of blocks) {
        if (!block.trim()) continue;
        const lines = block.split('\n');
        let eventName = 'message';
        let dataStr = '';

        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventName = line.slice(6).trim();
          } else if (line.startsWith('data:')) {
            dataStr += line.slice(5).trim();
          }
        }

        if (!dataStr) continue;

        try {
          const parsed = JSON.parse(dataStr);
          if (eventName === 'chunk' && typeof parsed.text === 'string') {
            accumulated += parsed.text;
            onChunk(accumulated);
          } else if (eventName === 'error') {
            throw new Error(parsed.message || 'Gagal menghasilkan dokumen.');
          }
        } catch (parseErr) {
          if (eventName === 'error') {
            throw parseErr;
          }
        }
      }
    }

    return accumulated;
  };

  const handleGenerate = async () => {
    setValidationError(null);
    setErrorMessage(null);

    if (!formData.mataPelajaran.trim()) {
      setValidationError('Mohon isi nama Mata Pelajaran terlebih dahulu.');
      return;
    }

    const requiresTopic =
      activeMenu === 'perangkat_ajar' ||
      activeMenu === 'capaian_pembelajaran' ||
      activeMenu === 'alur_tujuan_pembelajaran' ||
      activeMenu === 'modul_ajar';

    if (requiresTopic && !formData.cpAtauTopik.trim() && !formData.daftarMateriAtauTp.trim()) {
      setValidationError('Mohon isi Capaian Pembelajaran (CP) atau Topik Materi Spesifik.');
      return;
    }

    if (activeMenu === 'perangkat_ajar' && formData.jenisPerangkat.length === 0) {
      setValidationError('Pilih minimal satu komponen perangkat ajar yang ingin dihasilkan.');
      return;
    }

    const targetMenu = activeMenu;
    setIsGenerating(true);
    setDraftsByMenu((prev) => ({
      ...prev,
      [targetMenu]: { content: '', docId: null },
    }));
    const snapshotForm = { ...formData };

    try {
      const finalMarkdown = await streamSseEndpoint(
        '/api/generate',
        { ...snapshotForm, menuId: targetMenu },
        (partial) => {
          setDraftsByMenu((prev) => ({
            ...prev,
            [targetMenu]: { ...prev[targetMenu], content: partial },
          }));
        }
      );

      if (finalMarkdown.trim()) {
        const cleanedFinal = cleanMarkdownForPlainText(finalMarkdown);
        const newId = upsertSavedDocument(targetMenu, cleanedFinal, snapshotForm, null);
        setDraftsByMenu((prev) => ({
          ...prev,
          [targetMenu]: { content: cleanedFinal, docId: newId },
        }));
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setErrorMessage((err as Error).message || 'Terjadi kesalahan saat menghasilkan dokumen.');
      }
    } finally {
      setIsGenerating(false);
      abortRef.current = null;
    }
  };

  const handleRefine = async (instruction: string) => {
    if (!content.trim() || isGenerating || isRefining) return;
    setErrorMessage(null);
    setIsRefining(true);
    const targetMenu = activeMenu;
    const previousContent = content;
    const existingDocId = activeDocId;
    const snapshotForm = { ...formData, menuId: targetMenu };

    try {
      let receivedAny = false;
      const updatedMarkdown = await streamSseEndpoint(
        '/api/refine',
        {
          currentContent: previousContent,
          instruction,
          formData: snapshotForm,
        },
        (partial) => {
          receivedAny = true;
          setDraftsByMenu((prev) => ({
            ...prev,
            [targetMenu]: { ...prev[targetMenu], content: partial },
          }));
        }
      );

      if (updatedMarkdown.trim()) {
        const cleanedUpdated = cleanMarkdownForPlainText(updatedMarkdown);
        const savedId = upsertSavedDocument(
          targetMenu,
          cleanedUpdated,
          snapshotForm,
          existingDocId
        );
        setDraftsByMenu((prev) => ({
          ...prev,
          [targetMenu]: { content: cleanedUpdated, docId: savedId },
        }));
      } else if (!receivedAny) {
        setDraftsByMenu((prev) => ({
          ...prev,
          [targetMenu]: { content: previousContent, docId: existingDocId },
        }));
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setErrorMessage((err as Error).message || 'Gagal menyempurnakan dokumen.');
      }
      if (!draftsByMenu[targetMenu].content.trim()) {
        setDraftsByMenu((prev) => ({
          ...prev,
          [targetMenu]: { content: previousContent, docId: existingDocId },
        }));
      }
    } finally {
      setIsRefining(false);
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsGenerating(false);
    setIsRefining(false);
  };

  const handleSelectMenu = (menuId: MenuSectionId) => {
    if (isGenerating || isRefining) return;
    setActiveMenu(menuId);
    setErrorMessage(null);
    setValidationError(null);
    setActiveTab('generator');
  };

  const handleResetNew = () => {
    handleStop();
    setDraftsByMenu((prev) => ({
      ...prev,
      [activeMenu]: { content: '', docId: null },
    }));
    setErrorMessage(null);
    setValidationError(null);
    setShowFormPanel(true);
    setActiveTab('generator');
  };

  const handleResetForm = () => {
    setFormData(DEFAULT_FORM_DATA);
    setValidationError(null);
  };

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(cleanMarkdownForPlainText(content));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setErrorMessage('Gagal menyalin ke clipboard. Anda dapat menyalin manual dari mode Edit Teks.');
    }
  };

  const handleDownloadWord = () => {
    if (!content) return;
    const title = extractDocumentTitle(content, formData, activeMenu);
    downloadAsWordDoc(content, title);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleSaveSnapshot = () => {
    if (!content.trim()) return;
    const savedId = upsertSavedDocument(activeMenu, content, formData, activeDocId);
    setActiveMenuContent(content, savedId);
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2000);
  };

  const handleOpenSavedDocument = (doc: SavedDocument) => {
    handleStop();
    const targetMenu: MenuSectionId = doc.menuId || 'perangkat_ajar';
    setFormData({ ...DEFAULT_FORM_DATA, ...doc.formData });
    setActiveMenu(targetMenu);
    setDraftsByMenu((prev) => ({
      ...prev,
      [targetMenu]: { content: doc.content, docId: doc.id },
    }));
    setErrorMessage(null);
    setValidationError(null);
    setActiveTab('generator');
  };

  const handleDeleteSavedDocument = (id: string) => {
    setSavedDocuments((prev) => prev.filter((d) => d.id !== id));
    setDraftsByMenu((prev) => {
      const updated = { ...prev };
      (Object.keys(updated) as MenuSectionId[]).forEach((k) => {
        if (updated[k].docId === id) {
          updated[k] = { ...updated[k], docId: null };
        }
      });
      return updated;
    });
  };

  const handleClearAllHistory = () => {
    setSavedDocuments([]);
    setDraftsByMenu((prev) => {
      const updated = { ...prev };
      (Object.keys(updated) as MenuSectionId[]).forEach((k) => {
        updated[k] = { ...updated[k], docId: null };
      });
      return updated;
    });
  };

  const handleLoadExample = (patch: Partial<GeneratorFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...patch,
    }));
    setValidationError(null);
    setShowFormPanel(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedDocuments.length}
        hasDocument={Boolean(content)}
        onResetNew={handleResetNew}
        onPrintPdf={handlePrintPdf}
      />

      {activeTab === 'generator' && (
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          <LeftMenuSidebar
            activeMenu={activeMenu}
            onSelectMenu={handleSelectMenu}
            completedMenus={completedMenus}
            disabled={isGenerating || isRefining}
            onOpenProfile={() => setActiveTab('profil')}
          />

          {showFormPanel && (
            <GeneratorSidebar
              activeMenu={activeMenu}
              formData={formData}
              onChange={setFormData}
              onGenerate={handleGenerate}
              onStop={handleStop}
              onReset={handleResetForm}
              isGenerating={isGenerating}
              validationError={validationError}
            />
          )}

          <DocumentWorkspace
            activeMenu={activeMenu}
            content={content}
            onContentChange={(next) => setActiveMenuContent(next)}
            formData={formData}
            isGenerating={isGenerating}
            isRefining={isRefining}
            errorMessage={errorMessage}
            onRefine={handleRefine}
            onCopy={handleCopy}
            copied={copied}
            onDownloadWord={handleDownloadWord}
            onPrintPdf={handlePrintPdf}
            onSaveSnapshot={handleSaveSnapshot}
            justSaved={justSaved}
            onLoadExample={handleLoadExample}
            showFormPanel={showFormPanel}
            onToggleFormPanel={() => setShowFormPanel((v) => !v)}
          />
        </div>
      )}

      {activeTab === 'riwayat' && (
        <main className="flex-1 bg-slate-50">
          <HistoryView
            documents={savedDocuments}
            onOpenDocument={handleOpenSavedDocument}
            onDeleteDocument={handleDeleteSavedDocument}
            onClearAll={handleClearAllHistory}
            onStartNew={handleResetNew}
          />
        </main>
      )}

      {activeTab === 'panduan' && (
        <main className="flex-1 bg-slate-50">
          <CurriculumGuideView onStartGenerator={() => setActiveTab('generator')} />
        </main>
      )}

      {activeTab === 'profil' && (
        <main className="flex-1 bg-slate-50">
          <CreatorProfileView onStartGenerator={() => setActiveTab('generator')} />
        </main>
      )}
    </div>
  );
}
