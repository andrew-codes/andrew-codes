type PostMetadata = Record<string, any> & { id?: string; date?: Date }
type Post = [string, PostMetadata]

export { Post, PostMetadata }
