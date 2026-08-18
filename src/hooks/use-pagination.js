import { useState } from "react";
function usePagination(items, itemsPerPage) {
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    return {
        currentItems,
        pageCount,
        handlePageClick,
    };
}
export default usePagination;
