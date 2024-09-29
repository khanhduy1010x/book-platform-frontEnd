import Carousel3d from "./Carousel3D/3DCarousel";
import BookSlider from "../HomeBook/BookSlider"
export default function ListByTypePage() {
    const listBook = [
        {
            id:1 ,
            description : 'Em nghĩ là không nên thay đổi công viên trượt băng bằng một viện bảo tàng. Quyệt định đó sẽ tốt hơn cho cộng đồng. Bây giờ, ai cũng muốn được giải trí sau những làm việc và học tập mệt mỏi, và đa phần họ sẽ quyết định đến công viên trượt băng. Việc tiếp tục hoạt động công viên trượt băng sẽ giúp đem lại doanh thu nhiều hơn là viện bảo tàng.Mà khi doanh thu tăng thì quỹ tiền của cộng đồng sẽ nhiều hơn. Chúng ta sẽ dùng số tiền đó để sửa chữa, cải thiện và nâng cấp những thứ mà chúng ta nghĩ sẽ mang lại doanh thu nhiều. Mà khi những nhà đầu tư thấy một thành phố đang phát triển, họ sẽ tìm đến. Vì thế, em nghĩ chúng ta nên có một công viên trượt băng để có nhiều lợi ích cho mọi người và cộng đồng.',
            price: 500000,
            image: "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.fm_audio_book/0/0/0/5689.jpg?v=1&w=360&h=526",
            name :"Khoảng cách nào xen giữa chúng ta"
        },
        {
            id:2,
            description : 'Nói về truyền hình và vi-đe-ô thì đây là một môn giải trí được rất nhiều trẻ em yêu thích. Truyền hình và vi-đe-ô giúp trẻ được giải, cho bé xem các chương trình mà bé yêu thích, giúp trẻ hiểu biết thêm thông qua truyền hình và vi-đe-ô, để cho bé cảm thấy vui vẻ và thoải mái. Nhưng, trong vi-đe-ô và truyền hình có luồng ánh sáng xanh được chiếu trực tiếp vào mắt trẻ nếu cho trẻ xem vào truyền hình quá lâu thì sẽ ảnh hưởng đến mắt của trẻ, có thể làm mù mắt của trẻ. Vì vậy mõi ngày chỉ nên cho bé xem vi-đe-ô và truyền hình từ 15-30 phút',
            price: 70000,
            image: "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.fm_audio_book/0/0/0/5734.jpg?v=1&w=360&h=526",
            name :"Muôn trùng sự thật"
        },
        {
            id:3,
            description : 'Thuc dậy sớm tốt. Hôm qua, tui ngủ muon. Tôi khong ăn và mợt.Thuc dậy sớm tốt. Hôm qua, tui ngủ muon. Tôi khong ăn và mợt.Thuc dậy sớm tốt. Hôm qua, tui ngủ muon. Tôi khong ăn và mợt.Thuc dậy sớm tốt. Hôm qua, tui ngủ muon. Tôi khong ăn và mợt.Thuc dậy sớm tốt. Hôm qua, tui ngủ muon. Tôi khong ăn và mợt.Thuc dậy sớm tốt. Hôm qua, tui ngủ muon. Tôi khong ăn và mợt.Thuc dậy sớm tốt. Hôm qua, tui ngủ muon. Tôi khong ăn và mợt.Thuc dậy sớm tốt. Hôm qua, tui ngủ muon. Tôi khong ăn và mợt. ',
            price: 520000,
            image: "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.fm_audio_book/0/0/0/5785.jpg?v=1&w=360&h=526",
            name :"Thuc dậy sớm tốt"
        },
        {
            id:4,
            description : 'Mỗi con người được sinh ra và tồn tại ở những thời kì, hoàn cảnh khác nhau. Điều này hình thành sự chênh lệch tư duy giữa các thế hệ. Một minh chứng thực tế về sự khác biệt giữa hai thế hệ bộc lộ rõ rệt là em và mẹ em. Mẹ em nói riêng và những người thế hệ trước nói chung đều được sinh ra trong hoàn cảnh khó khăn. Cuộc sống khắc nghiệt của họ bị ảnh hưởng bởi chiến tranh, đây là một điểm bất lợi lớn. Khi con người trải qua nhiều trắc trở, họ tự khắc biết cách vượt qua. Từ đó, họ đúc kết thêm kinh nghiệm sống và trở nên có trách nhiệm hơn với bản thân. Hơn nữa, mỗi con người sinh ra đều có bản năng sinh tồn. Vì vậy, dù có khó khăn tới mức nào, họ vẫn có thể chịu đựng và duy trì tiếp tục sự sống. ',
            price: 449999,
            image: "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/48388.jpg?v=1&w=350&h=510",
            name :"Thoát khỏi hội chứng Stockholm trong tình yêu"
        },

    ]
    
  return (
    <div className="bg-black p-[124px] relative min-h-screen">
               <div className="blur-layer-1 absolute top-[206px] !bg-blur-bg-primary right-1/2 z-0"></div>
               <div className="blur-layer-2 absolute -top-[98px] left-1/2 z-0"></div>
   <Carousel3d listBook={listBook}/>
   <div className="mt-10">
    <h2 className="text-white font-bold font-oswald text-[24px]">Tất cả sách "<span className="text-primary">Trinh Thám</span>"</h2>
    <p className="text-white font-oswald">1293 kết quả</p>
<div className="">
    <BookSlider/>
    <BookSlider/>
    <BookSlider/>
{/* ----------------------------------------------------------------------------- */}


{/* ------------------------------------------------------------------------------------- */}
</div>
   </div>
    </div>
  );
}
