import React from "react";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "react-bootstrap/Pagination";

interface PaginationProps {
  itemsCount: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  containerStyle?: string;
  size?: "sm" | "lg";
}

const Paginacion = (props: PaginationProps) => {
  const { itemsCount, pageSize, currentPage, onPageChange } = props;

  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount === 1) return null;
  const pages = _.range(1, pagesCount + 1);

  const prevPages =
    currentPage === 1
      ? []
      : currentPage === 2
      ? [pages[currentPage - 2]]
      : [pages[currentPage - 3], pages[currentPage - 2]];
  const nextPages =
    currentPage <= pagesCount - 2
      ? [pages[currentPage], pages[currentPage + 1]]
      : currentPage === pagesCount - 1
      ? [pages[currentPage]]
      : [];
  const showPages = [...prevPages, pages[currentPage - 1], ...nextPages];

  return (
    <Pagination size={props.size} className={props.containerStyle}>
      <Pagination.Item
        key="prev"
        disabled={currentPage === 1}
        onClick={() => {
          onPageChange(currentPage - 1);
        }}
      >
        <FontAwesomeIcon icon="chevron-left" />
      </Pagination.Item>
      {currentPage > 3 && (
        <Pagination.Item key="prevPages" disabled>
          <span>...</span>
        </Pagination.Item>
      )}
      {showPages.map((page) => (
        <Pagination.Item
          key={page}
          active={currentPage === page}
          onClick={() => {
            if (currentPage !== page) onPageChange(page);
          }}
        >
          {page}
        </Pagination.Item>
      ))}
      {currentPage <= pagesCount - 3 && (
        <Pagination.Item key="nextPages" disabled>
          <span>...</span>
        </Pagination.Item>
      )}
      <Pagination.Item
        key="next"
        disabled={currentPage === pagesCount}
        onClick={() => {
          onPageChange(currentPage + 1);
        }}
      >
        <FontAwesomeIcon icon="chevron-right" />
      </Pagination.Item>
    </Pagination>
  );
};

export default Paginacion;
