// The package ships its TypeScript source (index.ts) and relies on peer
// @types it doesn't declare, so tsc would type-check it as project code.
// Declare the module ambiently so the compiler never loads its source.
declare module "remark-mdx-images" {
  import type { Plugin } from "unified"
  const remarkMdxImages: Plugin<[{ resolve?: boolean }?]>
  export default remarkMdxImages
}
