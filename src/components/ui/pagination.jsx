import ReactPaginate from "react-paginate";
const Pagination = ({ handlePageClick, pageCount, forcePage }) => {
    return (<ReactPaginate className="pagination list-wrap" breakLabel="..." activeClassName="current" nextLabel={<i className="fa-regular fa-arrow-right icon"></i>} onPageChange={handlePageClick} pageRangeDisplayed={5} pageCount={pageCount} forcePage={forcePage} previousLabel={<i className="fa-regular fa-arrow-left icon"></i>} renderOnZeroPageCount={null}/>);
};
export default Pagination;
