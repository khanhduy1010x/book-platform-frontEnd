export default function BookList() {
    const listBook = new Array(10).fill("");
    return (
        <div className="grid 2xl:grid-cols-6 grid-cols-4 gap-10 mt-6 mb-6">
            {
                listBook.map((_,index) =>
            (
                <div key={index} className="rounded-lg overflow-hidden"> 
                <div className="inline-block relative show-tooltip lg:w-52 xl:w-56 2xl:w-[265px] cursor-pointer float-left lg:w-full xl:w-full 2xl:w-full w-full col-span-1">
                <img className="object-contain rounded-lg " src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/49429.jpg?v=1&w=480&h=700"/>
                </div>
                <p className="font-bold text-white">Sức nặng của sự kì vọng</p>
            </div>
            ))
            }
     
        </div>
    )
}