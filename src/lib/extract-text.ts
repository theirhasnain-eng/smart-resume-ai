import mammoth from 'mammoth';

async function extractPdfText(buffer: Buffer): Promise<string> {
  const { extractText, getDocumentProxy } = await import('unpdf');

  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  const trimmed = String(text ?? '').trim();

  if (!trimmed) {
    throw new Error(
      'No text found in PDF. Use a text-based PDF or save your resume as .txt / .docx.'
    );
  }

  return trimmed;
}

export async function extractTextFromBuffer(buffer: Buffer, filename: string): Promise<string> {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';

  if (ext === 'txt') {
    return buffer.toString('utf-8').trim();
  }

  if (ext === 'doc') {
    throw new Error(
      'Legacy .doc files are not supported. In Word use Save As → .docx, or export as PDF.'
    );
  }

  if (ext === 'pdf') {
    return extractPdfText(buffer);
  }

  if (ext === 'docx') {
    const result = await mammoth.extractRawText({ buffer });
    const text = (result.value ?? '').trim();
    if (!text) {
      throw new Error('No text found in this Word file. Try saving as PDF or plain .txt.');
    }
    return text;
  }

  return buffer.toString('utf-8').trim();
}
