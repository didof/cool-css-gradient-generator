import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const mode = getMode();
const productionMode = mode === "production" || mode === 'staging';

console.info(`Bundling for <${mode}> mode.`);
console.info(`Using <production> behaviour: ${productionMode}`);

const resolve = nodeResolve({
  preferBuiltins: false,
  mainFields: ["module", "browser"],
});

const terse = terser({
  ecma: 2015,
  mangle: { toplevel: true },
  compress: {
    module: true,
    toplevel: true,
    unsafe_arrows: true,
    drop_console: productionMode,
    drop_debugger: productionMode,
  },
  output: { quote_style: 1 },
});

export default [
  {
    input: "src/main.js",
    plugins: [resolve],
    output: {
      file: "public/main.js",
      format: "es",
      sourcemap: productionMode ? false : "inline",
      plugins: [terse],
    },
  },
];

function getMode() {
  const { MODE } = process.env;
  if (MODE == null || MODE === "staging" || MODE === "production") {
    return MODE || "development";
  }

  console.warn(`The value <${MODE}> is not accepted for the env var MODE. Fallbacking to <development>.\nSupported values are <development> [default], <staging>, <production>.`);
  return "development";
}