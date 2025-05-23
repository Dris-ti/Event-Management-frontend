'use client'

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

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
            className={`w-10 h-10 rounded-md border-1 border-[#EBEBEB] text-center text-sm font-medium ${
              page === currentPage
                ? 'bg-[#4157FE] text-white'
                : 'bg-white text-gray-800 hover:bg-blue-100'
            }`}
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
