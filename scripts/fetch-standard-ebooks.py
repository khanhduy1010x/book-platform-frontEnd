#!/usr/bin/env python3
"""Fetch a curated set of free EPUBs and covers from Standard Ebooks.

Standard Ebooks publishes these editions and covers into the U.S. public
domain. Check local copyright rules before distributing them elsewhere.
"""

import json
import re
import time
import urllib.request
import zipfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BOOK_DIR = ROOT / "public/books"
CATALOG = ROOT / "src/data/additionalBooks.json"
SOURCES = [
    ("emma", "jane-austen/emma", "Emma", "Jane Austen", 1815, "Tiểu thuyết", "10 giờ", "Emma Woodhouse và những cuộc mai mối làm đảo lộn cuộc sống ở Highbury.", "peach"),
    ("sense-and-sensibility", "jane-austen/sense-and-sensibility", "Sense and Sensibility", "Jane Austen", 1811, "Tiểu thuyết", "11 giờ", "Hai chị em Dashwood đi tìm tình yêu giữa lý trí và cảm xúc.", "moss"),
    ("dracula", "bram-stoker/dracula", "Dracula", "Bram Stoker", 1897, "Kinh dị", "13 giờ", "Những lá thư và nhật ký lần theo bóng dáng Bá tước Dracula.", "charcoal"),
    ("treasure-island", "robert-louis-stevenson/treasure-island", "Treasure Island", "Robert Louis Stevenson", 1883, "Phiêu lưu", "6 giờ", "Jim Hawkins lên đường tìm kho báu cùng một đoàn thủy thủ khó lường.", "blue"),
    ("jekyll-and-hyde", "robert-louis-stevenson/the-strange-case-of-dr-jekyll-and-mr-hyde", "The Strange Case of Dr. Jekyll and Mr. Hyde", "Robert Louis Stevenson", 1886, "Kinh dị", "3 giờ", "Bí mật của bác sĩ Jekyll mở ra câu chuyện về hai mặt con người.", "lavender"),
    ("dorian-gray", "oscar-wilde/the-picture-of-dorian-gray", "The Picture of Dorian Gray", "Oscar Wilde", 1890, "Tiểu thuyết", "7 giờ", "Một bức chân dung cất giữ hậu quả của tuổi trẻ và những lựa chọn của Dorian.", "charcoal"),
    ("moby-dick", "herman-melville/moby-dick", "Moby-Dick", "Herman Melville", 1851, "Phiêu lưu", "22 giờ", "Thuyền trưởng Ahab theo đuổi cá voi trắng trên đại dương.", "blue"),
    ("two-cities", "charles-dickens/a-tale-of-two-cities", "A Tale of Two Cities", "Charles Dickens", 1859, "Tiểu thuyết", "12 giờ", "Những số phận đan xen giữa London và Paris thời Cách mạng Pháp.", "peach"),
    ("great-expectations", "charles-dickens/great-expectations", "Great Expectations", "Charles Dickens", 1861, "Tiểu thuyết", "15 giờ", "Pip lớn lên giữa tham vọng, ân tình và những bí mật quá khứ.", "moss"),
    ("tom-sawyer", "mark-twain/the-adventures-of-tom-sawyer", "The Adventures of Tom Sawyer", "Mark Twain", 1876, "Phiêu lưu", "7 giờ", "Những trò nghịch ngợm và cuộc phiêu lưu bên sông Mississippi.", "peach"),
    ("baskervilles", "arthur-conan-doyle/the-hound-of-the-baskervilles", "The Hound of the Baskervilles", "Arthur Conan Doyle", 1902, "Trinh thám", "6 giờ", "Holmes điều tra lời nguyền và những dấu chân bí ẩn trên đồng hoang.", "charcoal"),
    ("wizard-of-oz", "l-frank-baum/the-wonderful-wizard-of-oz", "The Wonderful Wizard of Oz", "L. Frank Baum", 1900, "Phiêu lưu", "4 giờ", "Dorothy cùng những người bạn tìm đường đến Thành phố Ngọc Lục Bảo.", "moss"),
    ("secret-garden", "frances-hodgson-burnett/the-secret-garden", "The Secret Garden", "Frances Hodgson Burnett", 1911, "Tiểu thuyết", "7 giờ", "Mary phát hiện khu vườn khóa kín và thay đổi cuộc sống của những người quanh mình.", "lavender"),
]


def download(url, destination):
    if destination.exists():
        return
    request = urllib.request.Request(url, headers={"User-Agent": "KhanhDuyBookCatalog/1.0 (manual curation)"})
    with urllib.request.urlopen(request, timeout=30) as response:
        destination.write_bytes(response.read())


def main():
    BOOK_DIR.mkdir(parents=True, exist_ok=True)
    catalog = []
    for slug, source, title, author, year, category, reading_time, description, cover in SOURCES:
        page = "https://standardebooks.org/ebooks/" + source
        request = urllib.request.Request(page, headers={"User-Agent": "KhanhDuyBookCatalog/1.0 (manual curation)"})
        with urllib.request.urlopen(request, timeout=30) as response:
            html = response.read().decode("utf-8")
        match = re.search(r'href="([^\"]+\.epub)"', html)
        if match is None:
            raise RuntimeError(f"No EPUB download listed: {page}")
        epub = BOOK_DIR / f"se-{slug}.epub"
        image = BOOK_DIR / f"se-{slug}.jpg"
        download("https://standardebooks.org" + match.group(1) + "?source=download", epub)
        download(page + "/downloads/cover.jpg", image)
        with zipfile.ZipFile(epub) as archive:
            if archive.read("mimetype") != b"application/epub+zip":
                raise RuntimeError(f"Invalid EPUB: {epub}")
        if image.read_bytes()[:3] != b"\xff\xd8\xff":
            raise RuntimeError(f"Invalid JPEG: {image}")
        catalog.append({
            "id": slug, "title": title, "author": author, "year": year,
            "category": category, "language": "Tiếng Anh", "readingTime": reading_time,
            "description": description, "epub": "/books/" + epub.name,
            "image": "/books/" + image.name, "source": page,
            "cover": cover, "monogram": title[0],
        })
        print(f"{title}: {epub.stat().st_size // 1024} KiB EPUB")
        time.sleep(1)
    CATALOG.parent.mkdir(parents=True, exist_ok=True)
    CATALOG.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(catalog)} books to {CATALOG}")


if __name__ == "__main__":
    main()
