import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Explorer - AyushBridge',
  description: 'Interactive API explorer for AyushBridge FHIR R4 terminology services.',
}

export default function ApiExplorerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
