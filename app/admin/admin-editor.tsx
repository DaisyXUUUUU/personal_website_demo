'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Eye,
  ImagePlus,
  Laptop,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  Smartphone,
  Tablet,
  Trash2,
  X,
} from 'lucide-react'
import type { EducationItem, HobbyItem, ProjectItem, SiteContent, WorkItem } from '@/lib/site-content'
import { validateSiteContent } from '@/lib/site-content'

type Section = 'skills' | 'education' | 'workExperience' | 'projects' | 'hobbies'
type Device = 'desktop' | 'tablet' | 'mobile'
type UploadDraft = { file: File; previewUrl: string; targetPath: string; publicPath: string }

const SECTION_LABELS: Record<Section, string> = {
  skills: 'Skills',
  education: 'Education',
  workExperience: 'Work Experience',
  projects: 'Projects',
  hobbies: 'Hobbies',
}

const DEVICE_WIDTH: Record<Device, string> = { desktop: '100%', tablet: '768px', mobile: '390px' }

export function AdminEditor({ initialContent, login }: { initialContent: SiteContent; login: string }) {
  const [content, setContent] = useState(initialContent)
  const [publishedSnapshot, setPublishedSnapshot] = useState(() => JSON.stringify(initialContent))
  const [section, setSection] = useState<Section>('projects')
  const [uploads, setUploads] = useState<Record<string, UploadDraft>>({})
  const [hydrated, setHydrated] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [device, setDevice] = useState<Device>('desktop')
  const [publishOpen, setPublishOpen] = useState(false)
  const [command, setCommand] = useState('')
  const [status, setStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const uploadsRef = useRef(uploads)

  useEffect(() => {
    const stored = window.localStorage.getItem('ziyue-portfolio-draft')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (validateSiteContent(parsed)) setContent(parsed)
      } catch {
        window.localStorage.removeItem('ziyue-portfolio-draft')
      }
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) window.localStorage.setItem('ziyue-portfolio-draft', JSON.stringify(content))
  }, [content, hydrated])

  useEffect(() => {
    uploadsRef.current = uploads
  }, [uploads])

  useEffect(() => () => {
    Object.values(uploadsRef.current).forEach((upload) => URL.revokeObjectURL(upload.previewUrl))
  }, [])

  useEffect(() => {
    if (!previewOpen && !publishOpen) return
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (publishOpen) setPublishOpen(false)
      else setPreviewOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [previewOpen, publishOpen])

  const previewContent = useMemo(() => contentWithUploadPaths(content, uploads, 'preview'), [content, uploads])
  const publishContent = useMemo(() => contentWithUploadPaths(content, uploads, 'public'), [content, uploads])
  const hasChanges = JSON.stringify(publishContent) !== publishedSnapshot || Object.keys(uploads).length > 0

  useEffect(() => {
    if (!previewOpen) return
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'ZIYUE_PREVIEW_CONTENT', content: previewContent },
      window.location.origin,
    )
  }, [previewContent, previewOpen])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== 'ZIYUE_PREVIEW_READY') return
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'ZIYUE_PREVIEW_CONTENT', content: previewContent },
        window.location.origin,
      )
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [previewContent])

  const setImage = (kind: 'projects' | 'hobbies', id: string, file: File) => {
    const extension = imageExtension(file)
    if (!extension || file.size > 8 * 1024 * 1024) {
      setStatus('error')
      setMessage('Please choose a PNG, JPEG, WebP, or GIF image smaller than 8 MB.')
      return
    }
    const key = `${kind}:${id}`
    const safeId = id.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '') || 'image'
    const targetPath = `public/uploads/${kind}/${safeId}-${Date.now()}.${extension}`
    const previous = uploads[key]
    if (previous) URL.revokeObjectURL(previous.previewUrl)
    setUploads((current) => ({
      ...current,
      [key]: {
        file,
        previewUrl: URL.createObjectURL(file),
        targetPath,
        publicPath: `/${targetPath.replace(/^public\//, '')}`,
      },
    }))
    setStatus('idle')
    setMessage('')
  }

  const resetDraft = () => {
    if (!window.confirm('Discard all unpublished changes and restore the deployed content?')) return
    Object.values(uploads).forEach((upload) => URL.revokeObjectURL(upload.previewUrl))
    setUploads({})
    setContent(initialContent)
    setPublishedSnapshot(JSON.stringify(initialContent))
    window.localStorage.removeItem('ziyue-portfolio-draft')
    setStatus('idle')
    setMessage('Draft reset.')
  }

  const publish = async () => {
    if (!command.trim()) {
      setStatus('error')
      setMessage('Enter your private publish command.')
      return
    }
    setStatus('publishing')
    setMessage('Publishing your changes…')

    const form = new FormData()
    const manifest: { field: string; targetPath: string }[] = []
    Object.values(uploads).forEach((upload, index) => {
      const field = `image-${index}`
      form.append(field, upload.file)
      manifest.push({ field, targetPath: upload.targetPath })
    })
    form.set('content', JSON.stringify(publishContent))
    form.set('uploads', JSON.stringify(manifest))
    form.set('command', command)

    try {
      const response = await fetch('/api/admin/publish', { method: 'POST', body: form })
      const result = await response.json() as { error?: string; commit?: { url: string } }
      if (!response.ok) throw new Error(result.error ?? 'Publishing failed.')
      Object.values(uploads).forEach((upload) => URL.revokeObjectURL(upload.previewUrl))
      setUploads({})
      setContent(publishContent)
      setPublishedSnapshot(JSON.stringify(publishContent))
      window.localStorage.setItem('ziyue-portfolio-draft', JSON.stringify(publishContent))
      setStatus('success')
      setMessage('Published successfully. Your website is now redeploying from GitHub.')
      setCommand('')
      setPublishOpen(false)
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Publishing failed.')
    }
  }

  return (
    <main className="min-screen-dynamic bg-[#120b12] text-hero-card">
      <header className="sticky top-0 z-40 border-b border-hero-pink/25 bg-[#120b12]/95 px-4 py-3 backdrop-blur sm:px-7">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-hero-pink/75">Private workspace</p>
            <h1 className="text-xl font-black text-hero-pink sm:text-2xl">Portfolio Studio</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden font-mono text-xs text-hero-card/55 sm:inline">@{login}</span>
            <button type="button" onClick={() => setPreviewOpen(true)} className="admin-button-secondary">
              <Eye className="size-4" /> Preview
            </button>
            <button type="button" disabled={!hasChanges} onClick={() => setPublishOpen(true)} className="admin-button-primary disabled:cursor-not-allowed disabled:opacity-40">
              <Save className="size-4" /> Publish
            </button>
            <form action="/api/admin/auth/logout" method="post">
              <button type="submit" className="admin-icon-button" aria-label="Sign out"><LogOut className="size-4" /></button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 sm:px-7 lg:grid-cols-[240px_minmax(0,1fr)] lg:py-10">
        <aside>
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-28 lg:grid lg:overflow-visible">
            {(Object.keys(SECTION_LABELS) as Section[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSection(key)}
                className={`shrink-0 rounded-xl px-4 py-3 text-left text-sm font-bold transition-colors ${section === key ? 'bg-hero-pink text-hero-ink' : 'bg-white/5 text-hero-card/70 hover:bg-white/10'}`}
              >
                {SECTION_LABELS[key]}
                <span className="ml-2 font-mono text-xs opacity-60">{collectionLength(content, key)}</span>
              </button>
            ))}
            <button type="button" onClick={resetDraft} className="mt-0 flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-hero-card/55 hover:bg-white/5 hover:text-hero-card lg:mt-4">
              <RotateCcw className="size-4" /> Reset draft
            </button>
          </nav>
        </aside>

        <section className="min-w-0">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-hero-pink">Content manager</p>
              <h2 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">{SECTION_LABELS[section]}</h2>
              <p className="mt-2 text-sm text-hero-card/55">Changes are saved as a private draft in this browser until you publish.</p>
            </div>
            <AddButton section={section} onAdd={() => setContent(addItem(content, section))} />
          </div>

          {status !== 'idle' && (
            <div className={`mb-5 flex items-start gap-2 rounded-xl border p-3 text-sm ${status === 'success' ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-100' : status === 'error' ? 'border-red-300/30 bg-red-400/10 text-red-100' : 'border-hero-pink/30 bg-hero-pink/10 text-hero-card'}`}>
              {status === 'success' && <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}
              <span>{message}</span>
            </div>
          )}

          {section === 'skills' && <SkillsEditor content={content} setContent={setContent} />}
          {section === 'education' && <EducationEditor content={content} setContent={setContent} />}
          {section === 'workExperience' && <WorkEditor content={content} setContent={setContent} />}
          {section === 'projects' && <ProjectsEditor content={content} setContent={setContent} uploads={uploads} setImage={setImage} />}
          {section === 'hobbies' && <HobbiesEditor content={content} setContent={setContent} uploads={uploads} setImage={setImage} />}
        </section>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#090609] text-hero-card" role="dialog" aria-modal="true" aria-label="Website preview">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-hero-pink">Live draft</p>
              <p className="font-bold">Full website preview</p>
            </div>
            <div className="flex items-center gap-2">
              {(['desktop', 'tablet', 'mobile'] as Device[]).map((item) => (
                <button key={item} type="button" onClick={() => setDevice(item)} aria-label={`${item} preview`} className={`admin-icon-button ${device === item ? 'bg-hero-pink text-hero-ink' : ''}`}>
                  {item === 'desktop' ? <Laptop className="size-4" /> : item === 'tablet' ? <Tablet className="size-4" /> : <Smartphone className="size-4" />}
                </button>
              ))}
              <button type="button" onClick={() => setPreviewOpen(false)} className="admin-icon-button" aria-label="Close preview"><X className="size-5" /></button>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 items-start justify-center overflow-auto bg-[#22151f] p-3 sm:p-5">
            <iframe
              ref={iframeRef}
              src="/admin/preview"
              title="Draft website preview"
              onLoad={() => iframeRef.current?.contentWindow?.postMessage({ type: 'ZIYUE_PREVIEW_CONTENT', content: previewContent }, window.location.origin)}
              className="h-full min-h-[720px] max-w-full border-0 bg-white shadow-2xl"
              style={{ width: DEVICE_WIDTH[device] }}
            />
          </div>
        </div>
      )}

      {publishOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Confirm publish">
          <div className="w-full max-w-lg rounded-3xl border border-hero-pink/35 bg-[#1c111b] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-hero-pink">Final confirmation</p>
                <h2 className="mt-2 text-3xl font-black">Publish changes?</h2>
              </div>
              <button type="button" onClick={() => setPublishOpen(false)} className="admin-icon-button" aria-label="Close"><X className="size-5" /></button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-hero-card/65">This will commit the draft and selected images to GitHub. The public website will update after its automatic deployment completes.</p>
            <label className="mt-6 block text-sm font-bold text-hero-card">Private publish command</label>
            <input
              type="password"
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') publish() }}
              autoComplete="off"
              className="admin-input mt-2"
              placeholder="Enter your command"
              autoFocus
            />
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setPublishOpen(false)} className="admin-button-secondary">Cancel</button>
              <button type="button" onClick={publish} disabled={status === 'publishing'} className="admin-button-primary disabled:opacity-50">
                <Save className="size-4" /> {status === 'publishing' ? 'Publishing…' : 'Confirm & publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function SkillsEditor({ content, setContent }: EditorProps) {
  const [nextSkill, setNextSkill] = useState('')
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
      <div className="flex flex-wrap gap-2">
        {content.skills.map((skill, index) => (
          <span key={`${skill}-${index}`} className="inline-flex items-center gap-1 rounded-full border border-hero-pink/45 py-1.5 pl-3 pr-1.5 font-mono text-sm text-hero-pink">
            {skill}
            <button type="button" disabled={index === 0} aria-label={`Move ${skill} up`} onClick={() => setContent({ ...content, skills: moveItem(content.skills, index, -1) })} className="rounded-full p-1 hover:bg-hero-pink/15 disabled:opacity-25"><ArrowUp className="size-3" /></button>
            <button type="button" disabled={index === content.skills.length - 1} aria-label={`Move ${skill} down`} onClick={() => setContent({ ...content, skills: moveItem(content.skills, index, 1) })} className="rounded-full p-1 hover:bg-hero-pink/15 disabled:opacity-25"><ArrowDown className="size-3" /></button>
            <button type="button" aria-label={`Remove ${skill}`} onClick={() => setContent({ ...content, skills: content.skills.filter((_, itemIndex) => itemIndex !== index) })}><X className="size-3.5" /></button>
          </span>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <input className="admin-input" value={nextSkill} onChange={(event) => setNextSkill(event.target.value)} placeholder="New skill" onKeyDown={(event) => {
          if (event.key === 'Enter' && nextSkill.trim()) {
            setContent({ ...content, skills: [...content.skills, nextSkill.trim()] })
            setNextSkill('')
          }
        }} />
        <button type="button" onClick={() => { if (nextSkill.trim()) { setContent({ ...content, skills: [...content.skills, nextSkill.trim()] }); setNextSkill('') } }} className="admin-button-primary"><Plus className="size-4" /> Add</button>
      </div>
    </div>
  )
}

function EducationEditor({ content, setContent }: EditorProps) {
  return <ItemList items={content.education} setItems={(education) => setContent({ ...content, education })} title={(item) => item.school} render={(item, update) => <>
    <Field label="Years" value={item.year} onChange={(year) => update({ ...item, year })} />
    <Field label="School" value={item.school} onChange={(school) => update({ ...item, school })} />
    <Field label="Details" value={item.detail} multiline onChange={(detail) => update({ ...item, detail })} />
  </>} />
}

function WorkEditor({ content, setContent }: EditorProps) {
  return <ItemList items={content.workExperience} setItems={(workExperience) => setContent({ ...content, workExperience })} title={(item) => item.role} render={(item, update) => <>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Period" value={item.period} onChange={(period) => update({ ...item, period })} /><Field label="Location" value={item.location} onChange={(location) => update({ ...item, location })} /></div>
    <Field label="Role" value={item.role} onChange={(role) => update({ ...item, role })} />
    <Field label="Organization" value={item.org} onChange={(org) => update({ ...item, org })} />
    <Field label="Summary" value={item.summary} multiline onChange={(summary) => update({ ...item, summary })} />
    <ListField label="Detail bullets" values={item.details} onChange={(details) => update({ ...item, details })} />
  </>} />
}

function ProjectsEditor({ content, setContent, uploads, setImage }: EditorProps & ImageEditorProps) {
  return <ItemList items={content.projects} setItems={(projects) => setContent({ ...content, projects })} title={(item) => item.org} render={(item, update) => <>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Year" value={item.year} onChange={(year) => update({ ...item, year })} /><Field label="Period" value={item.period} onChange={(period) => update({ ...item, period })} /></div>
    <Field label="Project title" value={item.org} onChange={(org) => update({ ...item, org })} />
    <Field label="Role / affiliation" value={item.role} multiline onChange={(role) => update({ ...item, role })} />
    <Field label="Summary" value={item.summary} multiline onChange={(summary) => update({ ...item, summary })} />
    <ImageField current={uploads[`projects:${item.id}`]?.previewUrl ?? item.image} onSelect={(file) => setImage('projects', item.id, file)} />
    <ListField label="Detail bullets" values={item.bullets} onChange={(bullets) => update({ ...item, bullets })} />
    <CommaField label="Card tags" values={item.tags} onChange={(tags) => update({ ...item, tags })} />
    <CommaField label="Skills & tools" values={item.skills} onChange={(skills) => update({ ...item, skills })} />
    <div className="grid gap-4 sm:grid-cols-2"><Field label="External link label (optional)" value={item.link?.label ?? ''} onChange={(label) => updateProjectLink(item, update, label, item.link?.href ?? '')} /><Field label="External URL (optional)" value={item.link?.href ?? ''} onChange={(href) => updateProjectLink(item, update, item.link?.label ?? '', href)} /></div>
  </>} />
}

function HobbiesEditor({ content, setContent, uploads, setImage }: EditorProps & ImageEditorProps) {
  return <ItemList items={content.hobbies} setItems={(hobbies) => setContent({ ...content, hobbies })} title={(item) => item.title} render={(item, update) => <>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Title" value={item.title} onChange={(title) => update({ ...item, title })} /><label className="admin-label">Icon<select value={item.icon} onChange={(event) => update({ ...item, icon: event.target.value as HobbyItem['icon'] })} className="admin-input mt-2"><option value="trophy">Trophy</option><option value="disc">Vinyl record</option><option value="snowflake">Snowflake</option><option value="martini">Cocktail</option><option value="camera">Camera</option><option value="utensils">Cooking</option></select></label></div>
    <Field label="Quote" value={item.quote} multiline onChange={(quote) => update({ ...item, quote })} />
    <ImageField current={uploads[`hobbies:${item.id}`]?.previewUrl ?? item.image} onSelect={(file) => setImage('hobbies', item.id, file)} />
  </>} />
}

type EditorProps = { content: SiteContent; setContent: (content: SiteContent) => void }
type ImageEditorProps = { uploads: Record<string, UploadDraft>; setImage: (kind: 'projects' | 'hobbies', id: string, file: File) => void }

function ItemList<T extends { id: string }>({ items, setItems, title, render }: { items: T[]; setItems: (items: T[]) => void; title: (item: T) => string; render: (item: T, update: (item: T) => void) => React.ReactNode }) {
  return <div className="grid gap-4">{items.map((item, index) => (
    <details key={item.id} className="group rounded-2xl border border-white/10 bg-white/5" open={index === 0}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 sm:p-5">
        <span className="min-w-0 truncate font-black text-hero-card">{title(item) || 'Untitled item'}</span>
        <span className="font-mono text-xs text-hero-pink">EDIT</span>
      </summary>
      <div className="grid gap-4 border-t border-white/10 p-4 sm:p-5">
        {render(item, (next) => setItems(items.map((current) => current.id === item.id ? next : current)))}
        <div className="flex flex-wrap justify-between gap-2 border-t border-white/10 pt-4">
          <div className="flex gap-2"><button type="button" disabled={index === 0} onClick={() => setItems(moveItem(items, index, -1))} className="admin-icon-button disabled:opacity-30" aria-label="Move up"><ArrowUp className="size-4" /></button><button type="button" disabled={index === items.length - 1} onClick={() => setItems(moveItem(items, index, 1))} className="admin-icon-button disabled:opacity-30" aria-label="Move down"><ArrowDown className="size-4" /></button></div>
          <button type="button" onClick={() => { if (window.confirm(`Delete “${title(item)}”?`)) setItems(items.filter((current) => current.id !== item.id)) }} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-red-200 hover:bg-red-400/10"><Trash2 className="size-4" /> Delete</button>
        </div>
      </div>
    </details>
  ))}</div>
}

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return <label className="admin-label">{label}{multiline ? <textarea className="admin-input mt-2 min-h-24 resize-y" value={value} onChange={(event) => onChange(event.target.value)} /> : <input className="admin-input mt-2" value={value} onChange={(event) => onChange(event.target.value)} />}</label>
}

function ListField({ label, values, onChange }: { label: string; values: string[]; onChange: (values: string[]) => void }) {
  return <fieldset><legend className="admin-label">{label}</legend><div className="mt-2 grid gap-2">{values.map((value, index) => <div key={index} className="flex gap-2"><textarea className="admin-input min-h-20 resize-y" value={value} onChange={(event) => onChange(values.map((current, itemIndex) => itemIndex === index ? event.target.value : current))} /><button type="button" aria-label="Remove item" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="admin-icon-button shrink-0 text-red-200"><Trash2 className="size-4" /></button></div>)}<button type="button" onClick={() => onChange([...values, ''])} className="admin-button-secondary w-fit"><Plus className="size-4" /> Add line</button></div></fieldset>
}

function CommaField({ label, values, onChange }: { label: string; values: string[]; onChange: (values: string[]) => void }) {
  return <label className="admin-label">{label}<span className="ml-2 font-normal text-hero-card/40">comma separated</span><input className="admin-input mt-2" value={values.join(', ')} onChange={(event) => onChange(event.target.value.split(',').filter((value) => value.trim()).map((value) => value.trim()))} /></label>
}

function ImageField({ current, onSelect }: { current: string; onSelect: (file: File) => void }) {
  return <div><p className="admin-label">Image</p><div className="mt-2 flex flex-col gap-3 rounded-xl border border-dashed border-hero-pink/35 p-3 sm:flex-row sm:items-center"><div className="aspect-video w-full overflow-hidden rounded-lg bg-black/20 sm:w-44"><img src={current} alt="Current preview" className="h-full w-full object-cover" /></div><label className="admin-button-secondary cursor-pointer"><ImagePlus className="size-4" /> Choose image<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) onSelect(file) }} /></label></div></div>
}

function AddButton({ section, onAdd }: { section: Section; onAdd: () => void }) {
  if (section === 'skills') return null
  const singular = section === 'workExperience' ? 'experience' : section === 'hobbies' ? 'hobby' : section === 'education' ? 'education' : 'project'
  return <button type="button" onClick={onAdd} className="admin-button-primary"><Plus className="size-4" /> Add {singular}</button>
}

function collectionLength(content: SiteContent, section: Section) {
  return content[section].length
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const destination = index + direction
  if (destination < 0 || destination >= items.length) return items
  const next = [...items]
  ;[next[index], next[destination]] = [next[destination], next[index]]
  return next
}

function newId(prefix: string) {
  return `${prefix}-${Date.now()}`
}

function addItem(content: SiteContent, section: Section): SiteContent {
  if (section === 'education') return { ...content, education: [...content.education, { id: newId('education'), year: 'Add dates', school: 'New school', detail: 'Add degree and details' }] }
  if (section === 'workExperience') return { ...content, workExperience: [...content.workExperience, { id: newId('work'), period: 'Add dates', role: 'New role', org: 'Add organization', location: 'Add location', summary: 'Add a short summary', details: ['Add an achievement'] }] }
  if (section === 'projects') return { ...content, projects: [...content.projects, { id: newId('project'), year: String(new Date().getFullYear()), period: 'Add dates', role: 'Add your role', org: 'New project', image: '/placeholder.jpg', summary: 'Add a short summary', bullets: ['Add a project achievement'], tags: ['New'], skills: ['Add a skill'] }] }
  if (section === 'hobbies') return { ...content, hobbies: [...content.hobbies, { id: newId('hobby'), title: 'New hobby', quote: 'Add a short quote', image: '/placeholder.jpg', icon: 'trophy' }] }
  return content
}

function contentWithUploadPaths(content: SiteContent, uploads: Record<string, UploadDraft>, mode: 'preview' | 'public'): SiteContent {
  return {
    ...content,
    projects: content.projects.map((item) => {
      const upload = uploads[`projects:${item.id}`]
      return upload ? { ...item, image: mode === 'preview' ? upload.previewUrl : upload.publicPath } : item
    }),
    hobbies: content.hobbies.map((item) => {
      const upload = uploads[`hobbies:${item.id}`]
      return upload ? { ...item, image: mode === 'preview' ? upload.previewUrl : upload.publicPath } : item
    }),
  }
}

function imageExtension(file: File) {
  const byType: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' }
  return byType[file.type] ?? null
}

function updateProjectLink(item: ProjectItem, update: (item: ProjectItem) => void, label: string, href: string) {
  if (!label.trim() && !href.trim()) update({ ...item, link: undefined })
  else update({ ...item, link: { label, href } })
}
