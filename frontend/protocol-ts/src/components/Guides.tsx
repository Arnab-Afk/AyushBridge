import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'

const guides = [
  {
    href: '/quickstart',
    name: 'Quick Start',
    description: 'Get up and running with AyushBridge in minutes.',
  },
  {
    href: '/authentication',
    name: 'ABHA Authentication',
    description: 'Learn ABHA OAuth 2.0 authentication for secure API access.',
  },
  {
    href: '/terminologies/namaste',
    name: 'NAMASTE CodeSystem',
    description: 'Explore 4,500+ standardized traditional medicine terms.',
  },
  {
    href: '/terminologies/icd11',
    name: 'ICD-11 Integration',
    description: 'Understand dual-coding with WHO ICD-11 TM2 and Biomedicine.',
  },
]

export function Guides() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="guides">
        Getting Started Guides
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 sm:grid-cols-2 xl:grid-cols-4 dark:border-white/5">
        {guides.map((guide) => (
          <div key={guide.href}>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {guide.description}
            </p>
            <p className="mt-4">
              <Button href={guide.href} variant="text" arrow="right">
                Read more
              </Button>
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
