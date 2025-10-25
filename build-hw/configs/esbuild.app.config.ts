import { build, context, type BuildOptions } from 'esbuild';
import { resolve } from 'node:path';

type Mode = 'dev' | 'prod';

interface CliFlags {
  mode: Mode;
  watch: boolean;
}

function parseFlags(): CliFlags {
  const modeArg =
    process.argv
      .find((arg) => arg.startsWith('--mode='))
      ?.split('=')[1] ?? process.env.NODE_ENV ?? 'prod';

  const mode = modeArg === 'dev' ? 'dev' : 'prod';
  const watch = process.argv.includes('--watch') || mode === 'dev';

  return { mode, watch };
}

async function run() {
  const { mode, watch } = parseFlags();
  const isProd = mode === 'prod';

  const projectRoot = resolve(process.cwd(), 'build-hw');
  const appEntry = resolve(projectRoot, 'app/index.ts');
  const distDir = resolve(projectRoot, 'dist');

  const commonOptions: BuildOptions = {
    entryPoints: {
      app: appEntry,
    },
    absWorkingDir: projectRoot,
    bundle: true,
    splitting: true,
    format: 'esm',
    outdir: distDir,
    sourcemap: true,
    metafile: true,
    minify: isProd,
    treeShaking: true,
    target: ['es2020'],
    platform: 'browser',
    loader: { '.ts': 'ts' },
    logLevel: 'info',
  };

  if (watch) {
    const ctx = await context({
      ...commonOptions,
      minify: isProd,
      sourcemap: true,
    });

    await ctx.watch();
    console.log(
      `[esbuild] Сборка приложения выполняется в режиме ${mode} с включенным наблюдением.`,
    );
    return;
  }

  await build(commonOptions);
  console.log(
    `[esbuild] Сборка приложения завершена в режиме ${mode}.`,
  );
}

run().catch((error) => {
  console.error(
    '[esbuild] Ошибка сборки приложения:',
    error,
  );
  process.exitCode = 1;
});
