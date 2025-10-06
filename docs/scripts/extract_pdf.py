from pypdf import PdfReader

reader = PdfReader('docs/tareas-sprint1.pdf')
for i, page in enumerate(reader.pages, start=1):
    text = page.extract_text() or ''
    if not text.strip():
        continue
    print(f"--- Page {i} ---")
    print(text)
