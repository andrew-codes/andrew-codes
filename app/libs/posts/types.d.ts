type PostMetadata = Record<string, any> & { id?: string; date?: Date | string }
type ParsedPostMetadata = PostMetadata & { date?: Date }
type FileMeta = {
  filePath: string
  modified: Date | string
  source: string
}
type Post<TPostMetadata extends PostMetadata> = [
  string,
  TPostMetadata,
  FileMeta,
]
type ClientPost = OmitLast<Post<ParsedPostMetadata>>

export { ClientPost, FileMeta, ParsedPostMetadata, Post, PostMetadata }
