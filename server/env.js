/** Read env at runtime — dynamic access avoids esbuild inlining values into function bundles. */
function env(name, fallback = '') {
  return process.env[name] ?? fallback;
}

module.exports = { env };
