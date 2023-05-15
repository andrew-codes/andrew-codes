type PostMetadata = Record<string, any> & { id?: string; date?: Date }
type Post = [string, PostMetadata, string]

export { Post, PostMetadata }
