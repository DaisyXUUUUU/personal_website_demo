import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/admin-auth'
import { siteContent } from '@/lib/site-content'
import { DraftPreview } from './preview-client'

export const dynamic = 'force-dynamic'

export default async function PreviewPage() {
  const session = await getAdminSession()
  if (!session) redirect('/admin')
  return <DraftPreview initialContent={siteContent} />
}
