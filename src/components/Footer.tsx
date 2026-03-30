import React from 'react'
import { Send, Twitter } from 'lucide-react'

function Footer() {
  const socials = [
    {
      label: 'Follow us on Twitter',
      href: 'https://x.com/CeylonBrief',
      icon: Twitter,
    },
    {
      label: 'Join us on Telegram',
      href: 'https://t.me/CeylonBrief',
      icon: Send,
    },
  ]

  return (
    <footer className='bg-red-900 border-t border-red-700 text-gray-100 dark:text-white text-sm md:text-base w-full py-6 px-12 flex justify-center'>
      <div className='flex w-full max-w-8xl flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left'>
        <span className='font-medium tracking-wide'>Copyright © | 2025 CeylonBrief</span>
        <div className='flex flex-col items-center gap-3 sm:flex-row sm:gap-4'>
          <span className='text-xs uppercase tracking-wider text-gray-200'>
            Connect with us
          </span>
          <div className='flex items-center gap-4'>
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target='_blank'
                rel='noreferrer noopener'
                aria-label={label}
                className='rounded-full border border-red-200/60 p-2 text-gray-100 transition hover:bg-white hover:text-red-700'
              >
                <Icon className='h-5 w-5' aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
