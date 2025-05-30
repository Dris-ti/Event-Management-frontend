'use client'

import { PaginationProps } from '@/app/Types/AllTypes';
import React from 'react';



export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
<div className="flex justify-center mt-10 space-x-2">
  {getPageNumbers().map((page, i) =>
    typeof page === 'number' ? (
      <button
        key={i}
        onClick={() => onPageChange(page)}
        className={`w-10 h-10 rounded-md border border-[#EBEBEB] text-center text-sm font-medium ${
          page === currentPage
            ? 'text-white'
            : 'bg-white text-gray-800 hover:bg-blue-100'
        }`}
        style={
          page === currentPage
            ? { background: 'linear-gradient(to bottom, #7B8BFF, #4157FE)' }
            : undefined
        }
      >
        {page}
      </button>
    ) : (
      <span key={i} className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
    )
  )}
</div>

  );
}
