import { defineConfig } from 'tsup';

export default defineConfig({
  name: 'webpack5-cdn-plugin',
  target: 'node12.20.0',
  dts: {
    resolve: true,
    entry: './src/index.ts',
  },
});
