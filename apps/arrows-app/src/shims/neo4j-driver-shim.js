// Shim for neo4j-driver browser bundle.
// The arrows-app's neo4jStorage.js imports neo4j-driver for its "Store in Neo4j"
// feature. That browser bundle (neo4j-web.min.js) is a pre-built webpack UMD
// package that calls require() at runtime, which crashes in Vite's ESM output.
// Since we only use the Arrows editor as a visual graph editor (not for Neo4j
// storage), we stub this module out entirely to prevent the crash.
export const v1 = {
  driver: () => ({
    session: () => ({
      run: () => Promise.resolve({ records: [] }),
      close: () => Promise.resolve(),
    }),
    close: () => Promise.resolve(),
  }),
  auth: {
    basic: () => ({}),
  },
}
export default { v1 }
