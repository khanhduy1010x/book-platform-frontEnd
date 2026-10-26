export const books = [
  {
    id: 'pride-and-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: 1813,
    category: 'Tiểu thuyết',
    language: 'Tiếng Anh',
    readingTime: '8 giờ',
    description: 'Một câu chuyện sắc sảo về định kiến, gia đình và tình yêu trong xã hội Anh thế kỷ XIX.',
    epub: '/books/1342.epub',
    image: '/books/1342.jpg',
    source: 'https://www.gutenberg.org/ebooks/1342',
    cover: 'peach',
    monogram: 'P',
  },
  {
    id: 'sherlock-holmes',
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    year: 1892,
    category: 'Trinh thám',
    language: 'Tiếng Anh',
    readingTime: '9 giờ',
    description: 'Mười hai vụ án kinh điển đưa bạn theo chân Holmes và Watson khắp London.',
    epub: '/books/1661.epub',
    image: '/books/1661.jpg',
    source: 'https://www.gutenberg.org/ebooks/1661',
    cover: 'moss',
    monogram: 'S',
  },
  {
    id: 'alice-in-wonderland',
    title: "Alice's Adventures in Wonderland",
    author: 'Lewis Carroll',
    year: 1865,
    category: 'Phiêu lưu',
    language: 'Tiếng Anh',
    readingTime: '3 giờ',
    description: 'Theo Alice bước vào một thế giới kỳ lạ, nơi trí tưởng tượng không có giới hạn.',
    epub: '/books/11.epub',
    image: '/books/11.jpg',
    source: 'https://www.gutenberg.org/ebooks/11',
    cover: 'lavender',
    monogram: 'A',
  },
  {
    id: 'frankenstein',
    title: 'Frankenstein',
    author: 'Mary Shelley',
    year: 1818,
    category: 'Giả tưởng',
    language: 'Tiếng Anh',
    readingTime: '7 giờ',
    description: 'Một tác phẩm khai sinh khoa học viễn tưởng, đặt câu hỏi về sáng tạo và trách nhiệm.',
    epub: '/books/84.epub',
    image: '/books/84.jpg',
    source: 'https://www.gutenberg.org/ebooks/84',
    cover: 'charcoal',
    monogram: 'F',
  },
  {
    id: 'little-women',
    title: 'Little Women',
    author: 'Louisa May Alcott',
    year: 1868,
    category: 'Tiểu thuyết',
    language: 'Tiếng Anh',
    readingTime: '11 giờ',
    description: 'Bốn chị em nhà March lớn lên cùng những ước mơ, lựa chọn và tình thân.',
    epub: '/books/514.epub',
    image: '/books/514.jpg',
    source: 'https://www.gutenberg.org/ebooks/514',
    cover: 'blue',
    monogram: 'L',
  },
];

export const categories = ['Tất cả', ...new Set(books.map((book) => book.category))];

export function readProgress(id) {
  try {
    return JSON.parse(localStorage.getItem('lat-progress-' + id) || 'null');
  } catch {
    return null;
  }
}
