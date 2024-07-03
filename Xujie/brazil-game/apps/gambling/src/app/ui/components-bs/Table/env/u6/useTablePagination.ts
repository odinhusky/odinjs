import { useState } from "react";

export const useTablePagination = ({ dataCount }: { dataCount: number }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const goToPage = (page: number) => {
    if (page > 0 && page <= dataCount) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    goToPage(currentPage - 1);
  };

  return {
    currentPage,
    goToFirstPage,
    goToNextPage,
    goToPrevPage,
  };
}

export default useTablePagination;