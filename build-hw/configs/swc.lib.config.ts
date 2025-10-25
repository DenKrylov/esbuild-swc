import { transformFile } from '@swc/core';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, extname, relative, resolve } from 'node:path';

interface TargetConfig {
  module: 'es6' | 'commonjs';
  outDir: string;
}

async function collectSourceFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        return collectSourceFiles(fullPath);
      }

      return extname(entry.name) === '.ts' ? [fullPath] : [];
    }),
  );

  return files.flat();
}

async function buildWithSwc() {
  const projectRoot = resolve(process.cwd(), 'build-hw');
  const libDir = resolve(projectRoot, 'lib');

  const targets: TargetConfig[] = [
    { module: 'es6', outDir: resolve(projectRoot, 'dist', 'swc', 'esm') },
    { module: 'commonjs', outDir: resolve(projectRoot, 'dist', 'swc', 'cjs') },
  ];

  const sources = await collectSourceFiles(libDir);

  await Promise.all(
    targets.map(async (target) => {
      await Promise.all(
        sources.map(async (file) => {
          const relativePath = relative(libDir, file).replace(/\.ts$/, '.js');
          const outputFile = resolve(target.outDir, relativePath);

          const { code, map } = await transformFile(file, {
            filename: file,
            sourceMaps: true,
            minify: true,
            jsc: {
              parser: {
                syntax: 'typescript',
              },
              target: 'es2018',
            },
            module: {
              type: target.module,
            },
          });

          await mkdir(dirname(outputFile), { recursive: true });
          await writeFile(outputFile, code, 'utf8');
          if (map) {
            await writeFile(`${outputFile}.map`, map, 'utf8');
          }
        }),
      );
    }),
  );

  console.log('[swc] Сборка библиотеки завершена для ESM и CJS.');
}

buildWithSwc().catch((error) => {
  console.error(
    '[swc] Не удалось собрать библиотеку:',
    error,
  );
  process.exitCode = 1;
});
