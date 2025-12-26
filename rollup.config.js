import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true },
    { file: 'dist/index.esm.js', format: 'es', sourcemap: true },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'PerformanceSDK',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
    }),
  ],
};
