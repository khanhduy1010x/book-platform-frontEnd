import { useEffect, useState } from "react"
import { useAPI } from "../../Service/APIContext"
import ModalAddNewAuthor from "./ModalAddNewAuthor";
import SuccessModal from "../../Shared/SuccessModal";
import UpdateModal from "../Product/UpdateModal";
import EditAuthor from "./EditAuthor";
import SearchBar from "../../Shared/SearchBar";

export default function AuthorTalbes() {
    const [authors,setAuthors]=useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const {getAllAuthors,searchAuthor} =useAPI();
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pages, setPages] = useState([])
    const [showAddNewAuthor, setShowAddNewAuthor] = useState(false);
    const [success, setSuccess] = useState(false)
    const [showUpdateAuthor ,setShowUpdateAuthor] =useState(false);
    const [currentAuthor, setCurrentAuthor ] = useState({})
    const [content, setContent] =useState("")
    const size = 6;
    
    useEffect(() => {
        const searchAPI = async() => {
            const resp = await searchAuthor(searchTerm);
            setAuthors(resp);
        }
        if(searchTerm){
            searchAPI();
            
        }else {
            fetch();
        }
    },[searchTerm])
    useEffect(() => {
        let reset;
        if(success) {
reset = setTimeout(() => {
    setSuccess(false)
},3500)
        }
        return () => clearTimeout(reset)
    },[success])

    useEffect(() => {    
        fetch();
      },[success])

      const fetch = async () => {
        const resp = await getAllAuthors( currentPage, size);
        setTotalPages(resp.totalPages || 0);
        setCurrentPage(0);
        setPages(generatePages(resp.currentPage, resp.totalPages));
        setAuthors(resp.listAuthor)
    }

    const generatePages = (currentPage, totalPages) => {
        const visiblePages = 5; 
        let start = Math.max(1, currentPage + 1 - Math.floor(visiblePages / 2)); 
        let end = Math.min(totalPages, start + visiblePages - 1); 
      
        if (end - start + 1 < visiblePages) {
          if (start === 1) {
            end = Math.min(totalPages, visiblePages);
          } else if (end === totalPages) {
            start = Math.max(1, totalPages - visiblePages + 1);
          }
        }
      
        const pages = [];
        if (start > 1) pages.push(1, "..."); 
        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
        if (end < totalPages) pages.push("...", totalPages); 
      
        return pages;
      };
      const handlePageChange = async (page) => {
        const resp = await getAllAuthors( page-1, size);
        setAuthors(resp.listAuthor)
        setTotalPages(resp.totalPages || 0);
        setCurrentPage(resp.currentPage || 0);
        setPages(generatePages(resp.currentPage, resp.totalPages));

      };
    
    return( 
        <div className="relative z-[51]">
            {showAddNewAuthor && <ModalAddNewAuthor setShowAddNewAuthor={setShowAddNewAuthor} setContent={setContent}  setSuccess={setSuccess}/>}
            {showUpdateAuthor && <EditAuthor author={currentAuthor} setShowUpdateAuthor={setShowUpdateAuthor} setContent={setContent}  setSuccess={setSuccess}/>}

            {success && <SuccessModal content={content}/> }
            <div className="flex justify-between mb-4">
            <h2 className="text-3xl font-semibold font-oswald text-white mb-4">Danh sách author</h2>
            <button
            onClick={() => setShowAddNewAuthor(true)}
            className="bg-primary font-bold text-white rounded-xl p-2 transition-all duration-300 hover:scale-[110%]  hover:bg-white hover:text-primary"
>Thêm tác giả mới</button>  
            </div>
            <div className="text-primary  flex flex-col  font-bold text-[20px] mb-4">      
          <SearchBar placeholder={"Tìm theo tác giả..."} setSearchTerm={setSearchTerm} searchTerm={searchTerm}/>

            </div>


<div className="bg-background-white backdrop-blur font-oswald p-6 rounded-lg shadow-lg">
        {authors?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {authors.map((author) => (
              <div
                key={author.id}
                className="relative group border border-gray-200 rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={author.imageURL}
                  alt={`author ${author.id}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 font-bold right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                  onClick={() => {
                    setCurrentAuthor(author)
                    setShowUpdateAuthor(true);
                  }}
                  className="bg-primary font-bold text-white rounded-xl p-2 transition-all duration-300 hover:scale-[110%]  hover:bg-white hover:text-primary"
                  >
                    Chỉnh sửa
                  </button>
                </div>
                <div className="p-4 text-center">
                  <p className="text-white font-medium">{author.name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Chưa có author nào.</p>
        )}
      </div>
      {(authors.length > 0 && !searchTerm) && <div className="pagination-controls flex justify-center mt-8">
          <nav aria-label="Page navigation example">
            <ul className="list-style-none flex">
              <li>
                <button
                  onClick={() => {
                    if (currentPage === 0) return;
                    handlePageChange(currentPage);
                  }}
                  disabled={currentPage === 0}
                  className="disabled:opacity-[0.7] disabled:pointer-events-none cursor-pointer relative block rounded bg-transparent px-3 py-1.5 text-[16px] text-white transition duration-300 "
                >
                  Previous
                </button>
              </li>

              {pages.map((page, index) => (
                <li key={index} className="mx-1">
                  {page === "..." ? (
                    <span className="px-3 py-1.5 text-white">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`relative block rounded bg-transparent px-3 py-1.5 text-[16px] transition duration-300 ${
                        currentPage + 1 === page
                          ? "bg-neutral-700 text-primary border-primary border font-bold"
                          : "text-surface hover:bg-gray-500 dark:text-white "
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </li>
              ))}

              <li>
                <button
                  onClick={() => {
                    if (currentPage === totalPages - 1) return;
                    handlePageChange(currentPage + 2);
                  }}
                  disabled={currentPage === totalPages - 1}
                  className="disabled:opacity-[0.7] disabled:pointer-events-none cursor-pointer relative block rounded bg-transparent px-3 py-1.5 text-[16px] text-white transition duration-300 "
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>}
        </div>
    )
}