def split_page_into_chunks(
    page_text: str,
    page_number: int,
    chunk_size: int = 1000,
    overlap: int = 200
):
    if not page_text or not page_text.strip():
        return []

    words = page_text.split()

    chunks = []

    current_chunk = []
    current_length = 0

    for word in words:
        word_length = len(word) + 1

        if current_length + word_length > chunk_size:
            if current_chunk:
                chunks.append({
                    "text": " ".join(current_chunk),
                    "page_number": page_number
                })

            overlap_words = []
            overlap_length = 0

            for previous_word in reversed(current_chunk):
                previous_length = len(previous_word) + 1

                if overlap_length + previous_length > overlap:
                    break

                overlap_words.insert(0, previous_word)
                overlap_length += previous_length

            current_chunk = overlap_words
            current_length = overlap_length

        current_chunk.append(word)
        current_length += word_length

    if current_chunk:
        chunks.append({
            "text": " ".join(current_chunk),
        "page_number": page_number
        })

    return chunks


def split_pages_into_chunks(
    pages,
    chunk_size: int = 1000,
    overlap: int = 200
):
    all_chunks = []

    for page in pages:
        page_chunks = split_page_into_chunks(
            page_text=page["text"],
            page_number=page["page_number"],
            chunk_size=chunk_size,
            overlap=overlap
        )

        all_chunks.extend(page_chunks)

    return all_chunks