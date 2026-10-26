import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ePub from "epubjs";
import { books, readProgress } from "../../data/books";
import "./Reader.css";

const THEME_LABELS = { paper: "Giấy sáng", sepia: "Vàng ấm", night: "Ban đêm" };
const THEME_STYLES = {
  paper: { body: { color: "#252525", background: "#fffefa", "line-height": "1.7" } },
  sepia: { body: { color: "#352c22", background: "#f2e8d5", "line-height": "1.7" } },
  night: { body: { color: "#e8e9e9", background: "#202427", "line-height": "1.7" } },
};

function getSavedSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem("lat-reader-settings") || "{}");
    return {
      theme: THEME_STYLES[saved.theme] ? saved.theme : "paper",
      fontSize: Number.isFinite(saved.fontSize) ? Math.min(180, Math.max(80, saved.fontSize)) : 110,
    };
  } catch {
    return { theme: "paper", fontSize: 110 };
  }
}

function readBookmarks(id) {
  try {
    const entries = JSON.parse(localStorage.getItem("lat-bookmarks-" + id) || "[]");
    return Array.isArray(entries) ? entries : [];
  } catch {
    return [];
  }
}

function flattenToc(entries, depth = 0) {
  return entries.flatMap((entry) => [
    { href: entry.href, label: entry.label, depth },
    ...flattenToc(entry.subitems || [], depth + 1),
  ]);
}

export default function EpubReader() {
  const { id } = useParams();
  const book = books.find((entry) => entry.id === id);
  const viewerRef = useRef(null);
  const publicationRef = useRef(null);
  const renditionRef = useRef(null);
  const locationsReadyRef = useRef(false);
  const currentCfiRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [panel, setPanel] = useState(null);
  const [toc, setToc] = useState([]);
  const [chapter, setChapter] = useState("");
  const [percent, setPercent] = useState(0);
  const [seekPercent, setSeekPercent] = useState(0);
  const [settings, setSettings] = useState(getSavedSettings);
  const [bookmarks, setBookmarks] = useState(() => readBookmarks(id));

  useEffect(() => {
    if (!book || !viewerRef.current) return undefined;
    let disposed = false;
    const publication = ePub(book.epub);
    const rendition = publication.renderTo(viewerRef.current, {
      width: "100%",
      height: "100%",
      flow: "paginated",
      spread: "auto",
      allowScriptedContent: false,
    });
    publicationRef.current = publication;
    renditionRef.current = rendition;
    locationsReadyRef.current = false;
    currentCfiRef.current = null;
    setLoading(true);
    setError("");
    setToc([]);
    setBookmarks(readBookmarks(book.id));
    const saved = readProgress(book.id);

    Object.entries(THEME_STYLES).forEach(([name, style]) => rendition.themes.register(name, style));
    const initialSettings = getSavedSettings();
    rendition.themes.select(initialSettings.theme);
    rendition.themes.fontSize(initialSettings.fontSize + "%");

    const onRelocated = (location) => {
      if (!location?.start?.cfi || disposed) return;
      currentCfiRef.current = location.start.cfi;
      let value = 0;
      if (locationsReadyRef.current) {
        value = Math.round(publication.locations.percentageFromCfi(location.start.cfi) * 100);
      } else if (saved?.percent) {
        value = saved.percent;
      }
      const safeValue = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
      setPercent(safeValue);
      setSeekPercent(safeValue);
      localStorage.setItem("lat-progress-" + book.id, JSON.stringify({
        cfi: location.start.cfi,
        percent: safeValue,
        updatedAt: new Date().toISOString(),
      }));
      const match = flattenToc(publication.navigation?.toc || []).find((item) =>
        location.start.href && item.href.split("#")[0] === location.start.href.split("#")[0]);
      if (match) setChapter(match.label);
    };
    rendition.on("relocated", onRelocated);

    async function load() {
      try {
        await publication.ready;
        const navigation = await publication.loaded.navigation;
        if (disposed) return;
        setToc(flattenToc(navigation.toc || []));
        try {
          await rendition.display(saved?.cfi || undefined);
        } catch {
          await rendition.display();
        }
        if (!disposed) setLoading(false);
        await publication.locations.generate(1200);
        if (disposed) return;
        locationsReadyRef.current = true;
        const location = rendition.currentLocation();
        if (location?.start?.cfi) onRelocated(location);
      } catch {
        if (!disposed) {
          setError("Không mở được tệp EPUB. Vui lòng thử tải lại trang.");
          setLoading(false);
        }
      }
    }
    load();

    return () => {
      disposed = true;
      rendition.off("relocated", onRelocated);
      rendition.destroy();
      publication.destroy();
      publicationRef.current = null;
      renditionRef.current = null;
    };
  }, [book]);

  useEffect(() => {
    localStorage.setItem("lat-reader-settings", JSON.stringify(settings));
    if (renditionRef.current) {
      renditionRef.current.themes.select(settings.theme);
      renditionRef.current.themes.fontSize(settings.fontSize + "%");
    }
  }, [settings]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target instanceof HTMLElement && ["INPUT", "TEXTAREA", "BUTTON"].includes(event.target.tagName)) return;
      if (event.key === "ArrowRight") renditionRef.current?.next();
      if (event.key === "ArrowLeft") renditionRef.current?.prev();
      if (event.key === "Escape") setPanel(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!book) return <div className="reader-missing"><p>Không tìm thấy sách.</p><Link to="/">Về thư viện</Link></div>;

  const toggleBookmark = () => {
    const cfi = currentCfiRef.current;
    if (!cfi) return;
    const exists = bookmarks.some((entry) => entry.cfi === cfi);
    const next = exists
      ? bookmarks.filter((entry) => entry.cfi !== cfi)
      : [{ cfi, label: chapter || "Vị trí " + percent + "%", percent, date: new Date().toISOString() }, ...bookmarks];
    setBookmarks(next);
    localStorage.setItem("lat-bookmarks-" + book.id, JSON.stringify(next));
  };

  const seek = () => {
    if (!locationsReadyRef.current) return;
    const cfi = publicationRef.current.locations.cfiFromPercentage(seekPercent / 100);
    if (cfi) renditionRef.current?.display(cfi);
  };

  const hasBookmark = bookmarks.some((entry) => entry.cfi === currentCfiRef.current);
  return (
    <main className={"reader reader--" + settings.theme}>
      <header className="reader__header">
        <Link to={"/detail/" + book.id} className="reader__back" aria-label="Quay lại chi tiết sách"><i className="fa-solid fa-arrow-left" /> <span>Thư viện</span></Link>
        <div className="reader__identity"><strong>{book.title}</strong><span>{book.author}</span></div>
        <div className="reader__actions">
          <button type="button" onClick={toggleBookmark} aria-label={hasBookmark ? "Bỏ dấu trang" : "Đánh dấu trang"} title={hasBookmark ? "Bỏ dấu trang" : "Đánh dấu trang"}><i className={hasBookmark ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"} /></button>
          <button type="button" onClick={() => setPanel(panel === "contents" ? null : "contents")} aria-label="Mục lục" aria-expanded={panel === "contents"}><i className="fa-solid fa-list" /></button>
          <button type="button" onClick={() => setPanel(panel === "settings" ? null : "settings")} aria-label="Cài đặt đọc" aria-expanded={panel === "settings"}><i className="fa-solid fa-font" /></button>
        </div>
      </header>

      <div className="reader__body">
        <button className="reader__turn reader__turn--prev" type="button" onClick={() => renditionRef.current?.prev()} aria-label="Trang trước"><i className="fa-solid fa-chevron-left" /></button>
        <div className="reader__paper">
          {loading && <div className="reader__message"><div className="reader__spinner" />Đang mở sách…</div>}
          {error && <div className="reader__message reader__message--error">{error}<button type="button" onClick={() => window.location.reload()}>Tải lại</button></div>}
          <div ref={viewerRef} className="reader__viewer" aria-label={"Nội dung sách " + book.title} />
        </div>
        <button className="reader__turn reader__turn--next" type="button" onClick={() => renditionRef.current?.next()} aria-label="Trang tiếp"><i className="fa-solid fa-chevron-right" /></button>
      </div>

      <footer className="reader__footer">
        <span className="reader__chapter">{chapter || "Đang đọc"}</span>
        <div className="reader__seek"><input type="range" min="0" max="100" value={seekPercent} onChange={(event) => setSeekPercent(Number(event.target.value))} onMouseUp={seek} onTouchEnd={seek} onKeyUp={seek} aria-label="Chuyển đến vị trí trong sách" disabled={loading} /><span>{percent}%</span></div>
      </footer>

      {panel && <><button className="reader__overlay" aria-label="Đóng bảng đọc" onClick={() => setPanel(null)} type="button" /><aside className="reader__panel" aria-label={panel === "contents" ? "Mục lục và dấu trang" : "Cài đặt đọc"}>
        <div className="reader__panel-head"><h2>{panel === "contents" ? "Mục lục" : "Tùy chỉnh đọc"}</h2><button type="button" aria-label="Đóng" onClick={() => setPanel(null)}><i className="fa-solid fa-xmark" /></button></div>
        {panel === "contents" ? <>
          <div className="reader__panel-tabs"><button className="is-active" type="button">Chương</button><button type="button" onClick={() => setPanel("bookmarks")}>Dấu trang ({bookmarks.length})</button></div>
          <div className="reader__toc">{toc.length ? toc.map((item, index) => <button type="button" style={{ paddingLeft: 18 + Math.min(item.depth, 3) * 16 }} key={item.href + index} onClick={() => { renditionRef.current?.display(item.href); setPanel(null); }}>{item.label}</button>) : <p>Sách chưa có mục lục.</p>}</div>
        </> : panel === "bookmarks" ? <>
          <div className="reader__panel-tabs"><button type="button" onClick={() => setPanel("contents")}>Chương</button><button className="is-active" type="button">Dấu trang ({bookmarks.length})</button></div>
          <div className="reader__toc">{bookmarks.length ? bookmarks.map((item) => <button type="button" key={item.cfi} onClick={() => { renditionRef.current?.display(item.cfi); setPanel(null); }}>{item.label} <small>{item.percent}%</small></button>) : <p>Chưa có dấu trang. Bấm biểu tượng dấu trang khi đang đọc để lưu vị trí.</p>}</div>
        </> : <>
          <div className="reader__setting"><h3>Cỡ chữ</h3><div className="reader__size"><button type="button" aria-label="Giảm cỡ chữ" disabled={settings.fontSize <= 80} onClick={() => setSettings({ ...settings, fontSize: settings.fontSize - 10 })}>A−</button><span>{settings.fontSize}%</span><button type="button" aria-label="Tăng cỡ chữ" disabled={settings.fontSize >= 180} onClick={() => setSettings({ ...settings, fontSize: settings.fontSize + 10 })}>A+</button></div></div>
          <div className="reader__setting"><h3>Màu nền</h3><div className="reader__themes">{Object.keys(THEME_LABELS).map((theme) => <button type="button" className={"reader__theme reader__theme--" + theme + (settings.theme === theme ? " is-active" : "")} key={theme} onClick={() => setSettings({ ...settings, theme })} aria-pressed={settings.theme === theme}><span>Aa</span>{THEME_LABELS[theme]}</button>)}</div></div>
          <p className="reader__hint">Dùng phím ← → để chuyển trang. Cài đặt và tiến độ được lưu trên trình duyệt này.</p>
        </>}
      </aside></>}
    </main>
  );
}
