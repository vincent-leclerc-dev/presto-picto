/* eslint-disable no-console */
import { Base64Encode } from 'base64-stream';
import concat from 'concat-stream';
import path from 'path';
import { URL } from 'url';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

/**
 * Convert a Readable Stream to base64 string
 * @param {ReadableStream} stream - a readable stream to convert in base64 string
 * @returns {Promise} - Promise that resolve in a string containing the base64
 */
export function streamToBlob(stream: any, mimeType: string): Promise<Blob> {
  if (mimeType != null && typeof mimeType !== 'string') {
    throw new Error('Invalid mimetype, expected string.');
  }
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream
      .on('data', (chunk: Buffer) => chunks.push(chunk))
      .once('end', () => {
        const blob =
          mimeType != null
            ? new Blob(chunks, { type: mimeType })
            : new Blob(chunks);
        resolve(blob);
      })
      .once('error', reject);
  });
}

export function blobToObjectURL(blob: any): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      resolve(URL.createObjectURL(blob));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Convert a Readable Stream to base64 string
 * @param {ReadableStream} stream - a readable stream to convert in base64 string
 * @returns {Promise} - Promise that resolve in a string containing the base64
 */
export function streamToBase64(stream: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const base64Transform = new Base64Encode();

    const cbConcat = (base64: any) => {
      resolve(base64);
    };

    stream
      .pipe(base64Transform)
      .pipe(concat(cbConcat))
      .on('error', (error: any) => {
        console.error('streamToBase64 error:', error);
        reject(error);
      });
  });
}

export function wordFromFileName(fileName: string): string {
  return fileName
    .replace('.png', '')
    .replace('.jpg', '')
    .replace('.jpeg', '')
    .replaceAll('_', ' ')
    .replace(/[0-9]+/g, '')
    .replace('(', '')
    .replace(')', '')
    .replaceAll(' ', '-')
    .toLocaleLowerCase()
    .trim();
}
