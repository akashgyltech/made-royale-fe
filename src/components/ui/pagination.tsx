import ReactPaginate from "react-paginate";

// prop type
type IProps = {
  pageCount: number;
  handlePageClick: (event: { selected: number }) => void;
  // Optional: pass (currentPage - 1) to keep the widget in sync with URL-driven
  // pagination (e.g. browser back/forward), instead of ReactPaginate's own
  // internal uncontrolled state.
  forcePage?: number;
};

const Pagination = ({ handlePageClick, pageCount, forcePage }: IProps) => {
  return (
    <ReactPaginate
      className="pagination list-wrap"
      breakLabel="..."
      activeClassName="current"
      nextLabel={<i className="fa-regular fa-arrow-right icon"></i>}
      onPageChange={handlePageClick}
      pageRangeDisplayed={5}
      pageCount={pageCount}
      forcePage={forcePage}
      previousLabel={<i className="fa-regular fa-arrow-left icon"></i>}
      renderOnZeroPageCount={null}
    />
  );
};

export default Pagination;