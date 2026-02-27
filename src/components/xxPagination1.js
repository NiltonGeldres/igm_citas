

import { useState } from "react";
import React from 'react';

const Pagination1 = ({ postsPerPage, totalPosts, 
  paginate, currentPage, setCurrentPage,props 
}) => {
  console.log("CARGANDO COMPONENTE PAGINACION");
  const pageNumbers = [];
  const [maxPageLimit, setMaxPageLimit] = useState(5);
  const [minPageLimit, setMinPageLimit] = useState(0);

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
 
const nextPage = () => {
    if(currentPage !== postsPerPage) 
        setCurrentPage(currentPage + 1)
}
const prevPage = () => {
    if(currentPage !== 1) 
        setCurrentPage(currentPage - 1)
}


const pageNumbersRender = pageNumbers.map(page => {
//  if(page <= maxPageLimit  && page > minPageLimit) {
    if(page <= maxPageLimit  && page > minPageLimit) {
      return(
        <li key={page} className={`page-item ${currentPage==page ? 'active':' '}`} >
        <a  
           onClick={() => setCurrentPage(page) 
             } 
            className='page-link'>
           {page}
         </a>
       </li>
      );
  }else{
      return null;
  }
})

const handlePrevClick = ()=>{
  props.onPrevClick();
}
const handleNextClick = ()=>{
  props.onNextClick();
}
/*const handlePageClick = (e)=>{
  props.onPageChange(Number(e.target.id));
}
*/

  return (
    
    <nav>
      <ul className='pagination'>
        <li className='page-item'>
           <a  onClick={handlePrevClick}
              //onClick={nextPage} 
               className='page-link'>
              Next
            </a>
        </li>

        {pageNumbersRender}
        <li className='page-item'>
           <a  
              onClick={handleNextClick}
//              onClick={prevPage} 
               className='page-link'>
              Prev
            </a>
          </li>

      </ul>
    </nav>
  );
};

export default Pagination1;

