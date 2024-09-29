export default function TransictionTable() {
  return (
    <div className=" max-w-screen mt-4 rounded-xl overflow-hidden">
      <table className="table-auto w-full text-left whitespace-no-wrap border-collapse ">
        <thead>
          <tr className="bg-primary text-white">
            <th className="px-4 py-2  min-w-[100px] text-center">
              ID Giao Dịch
            </th>
            <th className="px-4 py-2  min-w-[150px] text-center">
              Nội dung giao dịch
            </th>
            <th className="px-4 py-2  min-w-[120px] text-center">
              Số dư trước
            </th>
            <th className="px-4 py-2  min-w-[120px] text-center">Số dư sau</th>
            <th className="px-4 py-2  min-w-[150px] text-center">
              Loại giao dịch
            </th>
            <th className="px-4 py-2  min-w-[160px] text-center">
              Thời gian giao dịch
            </th>
          </tr>
        </thead>
        <tbody className="text-black">
          <tr className="bg-gray-100">
            <td className="px-4 py-2  max-w-[200px] break-words border-r border-gray-300  text-center">
              10102
            </td>
            <td className="px-4 py-2 max-w-[200px] break-words border-r border-gray-300 float-left">
              Nạp sò từ số tài khoản xxxx 
            </td>
            <td className="px-4 py-2  max-w-[200px] break-words border-r border-gray-300 text-center">
              100.000
            </td>
            <td className="px-4 py-2  max-w-[200px] break-words border-r border-gray-300 text-center">
              200.000
            </td>
            <td className="px-4 py-2  max-w-[200px] break-words border-r border-gray-300 text-center">
              Nạp tiền QR
            </td>
            <td className="px-4 py-2  max-w-[200px] break-words  text-center">
              10/10/2002 12:03
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
