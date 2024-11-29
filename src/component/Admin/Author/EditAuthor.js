import { useRef, useState } from "react"
import { useAPI } from "../../Service/APIContext";

export default function EditAuthor({author,setShowUpdateAuthor,setSuccess,setContent}) {
    const [name,setName]=useState(author.name);
    const {editAuthor}=useAPI();
    const [file, setFile]=useState(author.imageURL);
    const inputRef = useRef(null);
    const handleCallApiCreate =  async () => {
        let fileImage = file === author.imageURL ? null : file ; 

        const resp = await editAuthor(author.id, fileImage,name);
        if(resp) {
            setContent("Chỉnh sửa tác giả thành công!")
            setSuccess(true);
            setShowUpdateAuthor(false);
        }
    }
    return (
        <div className="fixed inset-0 font-oswald bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 ">
        <div className="bg-white p-6  max-h-screen overflow-y-auto rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-3xl font-bold pb-2 border-b border-gray-400 border-b-[3px]">Thêm tác giả mới</h2>
            <div className="mt-2 flex flex-col items-center justify-center">
                <label className="text-[18px] font-bold">
                    Tên tác giả  :
                </label>
                <input className="border p-2 w-1/2 rounded-xl border-gray-400"
                placeholder="Tên tác giả"
                type="text"
                value={name}
                onChange={(e) => {
                    setName(e.target.value)
                }}
                >
                </input>
            </div>
            <div className="mt-3 mb-2 flex flex-col items-center justify-center" >
               
                <input ref={inputRef} className="hidden" type="file" accept=".jpg, .jpeg, png"
                onChange={(e) => {
                    setFile(e.target.files[0])
                }}
                ></input>
                <div className="flex items-center justify-center">
                    <div>
                <div className="w-[200px] h-[60px] flex items-center justify-center">

                <button className="bg-primary font-bold text-white rounded-xl p-2 transition-all duration-300 hover:scale-[110%]  hover:bg-white hover:border-primary hover:border hover:text-primary"
            onClick={() =>inputRef.current.click() }
            >Thêm ảnh tác giả</button> 
            </div>
            </div>
                </div>
                <div className="mb-4 w-[150px] h-[150px] rounded-full overflow-hidden">
                    <img src={file === author.imageURL ? file :  URL.createObjectURL(file) } className="object-cover hover:scale-[150%] transition-all duration-1000 ease-in-out cursor-pointer"/>
                </div>
            </div>
            <div className="flex justify-end pt-2 border-t-[2px] border-gray-400">
          <div className="flex-1">
          <button
          onClick={(e) => setShowUpdateAuthor(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
          >
            Hủy
          </button>
          </div>
          <div>
          <button
          onClick={handleCallApiCreate}
            disabled={!(name && file)}
            className="bg-primary disabled:hover:bg-primary disabled:hover:opacity-80 hover:border hover:border-primary  disabled:hover:scale-[100%] disabled:hover:text-white disabled:bg-opacity-80 text-white rounded-xl p-2 disabled: transition-all px-4 duration-300 hover:scale-[110%]  hover:bg-white hover:text-primary"
            >
            Lưu
          </button>
          </div>
        </div>
          </div>
          </div>

    )
}