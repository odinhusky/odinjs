import { useState, useEffect, useMemo } from "react";
import useDeepEffect from "./useDeepEffect";

interface PaginationProps<T> {
  data: T[];
  pageSize: number;
  paginationSize: number;
}

interface PaginationData<T> {
  totalPages: number;
  currentPage: number;
  currentPageData: T[];
  paginationList: number[];
  goToPage: (pageNumber: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

export const usePagination = <T>(
  {
    data,
    pageSize,
    paginationSize = 5
  }: PaginationProps<T>
): PaginationData<T> => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageData, setCurrentPageData] = useState<T[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useDeepEffect(() => {
    const totalPages = Math.ceil(data.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, data.length);
    const currentData = data.slice(startIndex, endIndex);
    
    setTotalPages(totalPages);
    setCurrentPageData(currentData);
  }, [data, currentPage, pageSize]);

  const paginationList = useMemo(() => {
    const halfSize = Math.floor(paginationSize / 2);
    let startPage = Math.max(currentPage - halfSize, 1);
    let endPage = startPage + paginationSize - 1;
  
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(totalPages - paginationSize + 1, 1);
    }
  
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  
    return pages;
  }, [currentPage, paginationSize, totalPages]);

  const goToPage = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    goToPage(currentPage - 1);
  };

  return {
    totalPages,
    currentPage,
    currentPageData,
    paginationList,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
  };
}

export default usePagination;