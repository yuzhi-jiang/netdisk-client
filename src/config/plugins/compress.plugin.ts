import compressPlugin from 'vite-plugin-compression';
import type { Plugin } from 'vite';

export default function useCompressPlugin(
  target: 'gzip' | 'brotli',
  deleteOriginFile = false,
): Plugin | Plugin[] {
  const plugins: Plugin[] = [];

  if (target === 'gzip') {
    plugins.push(
      compressPlugin({
        ext: '.gz',
        deleteOriginFile,
      }),
    );
  } else if (target === 'brotli') {
    plugins.push(
      compressPlugin({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile,
      }),
    );
  }

  return plugins;
}