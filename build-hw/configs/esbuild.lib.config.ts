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
  const distRoot = resolve(projectRoot, 'dist', 'lib');
  const entryPoints = {
    index: resolve(projectRoot, 'lib/index.ts'),
    math: resolve(projectRoot, 'lib/math.ts'),
    string: resolve(projectRoot, 'lib/string.ts'),
  };

  const common: BuildOptions = {
    entryPoints,
    absWorkingDir: projectRoot,
    bundle: true,
    sourcemap: true,
    minify: isProd,
    treeShaking: true,
    target: ['es2018'],
    platform: 'neutral',
    loader: { '.ts': 'ts' },
    logLevel: 'info',
    splitting: false,
    external: ['react', 'react/jsx-runtime', 'lodash', 'lodash/*'],
  };

  const buildMatrix: BuildOptions[] = [
    {
      ...common,
      format: 'esm',
      outdir: resolve(distRoot, 'esm'),
    },
    {
      ...common,
      format: 'cjs',
      outdir: resolve(distRoot, 'cjs'),
    },
  ];

  if (watch) {
    const contexts = await Promise.all(
      buildMatrix.map(async (options) => {
        const ctx = await context({
          ...options,
        });
        await ctx.watch();
        return ctx;
      }),
    );

    console.log(
      `[esbuild] Сборка библиотеки выполняется в режиме ${mode} с включенным наблюдением для ${contexts.length} форматов.`,
    );
    return;
  }

  await Promise.all(buildMatrix.map((options) => build(options)));
  console.log(
    `[esbuild] Сборка библиотеки завершена в режиме ${mode}.`,
  );
}

run().catch((error) => {
  console.error(
    '[esbuild] Ошибка сборки библиотеки:',
    error,
  );
  process.exitCode = 1;
});
