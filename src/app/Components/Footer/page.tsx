'use client'
import React from 'react'
import { FaGift } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
     <footer className="bg-indigo-50 text-indigo-900">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Top Row: Logo + Links */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
                    src="/logo.svg"
                    alt="Logo"
                    className="w-7 h-7 rounded-full"
                  />
            <span className="text-xl font-semibold">
              Event buddy<span className="text-purple-700">.</span>
            </span>
          </div>

          <ul className="flex gap-6 mt-4 md:mt-0 text-sm font-medium">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/signin" className="hover:underline">Sign in</Link></li>
            <li><Link href="/signup" className="hover:underline">Sign up</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-200 mb-4" />

        {/* Copyright */}
        <p className="text-center text-sm text-gray-600">
          © 2025 Event buddy. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
