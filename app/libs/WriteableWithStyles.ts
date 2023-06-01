import { Writable } from "stream"
import type { ServerStyleSheet } from "styled-components"

class WritableWithStyles extends Writable {
  private _writable: any
  private _buffered: string
  private _pendingFlush: Promise<void> | null
  private _inserted: boolean
  private _freezing: boolean
  private _sheet: ServerStyleSheet

  constructor(writable: any, sheet: ServerStyleSheet) {
    super()
    this._writable = writable
    this._buffered = ""
    this._pendingFlush = null
    this._inserted = false
    this._freezing = false
    this._sheet = sheet
  }
  _flushBufferSync() {
    const flushed = this._buffered
    this._buffered = ""
    this._pendingFlush = null

    if (flushed) {
      this._insertInto(flushed)
    }
  }
  _flushBuffer() {
    if (!this._pendingFlush) {
      this._pendingFlush = new Promise((resolve) => {
        setTimeout(async () => {
          this._flushBufferSync()
          resolve()
        }, 0)
      })
    }
  }
  _insertInto(content: any) {
    // While react is flushing chunks, we don't apply insertions
    if (this._freezing) {
      this._writable.write(content)
      return
    }

    const insertion = this._sheet.getStyleTags()
    this._sheet.instance.clearTag()

    if (this._inserted) {
      this._writable.write(insertion)
      this._writable.write(content)
      this._freezing = true
    } else {
      const index = content.indexOf("</head>")
      if (index !== -1) {
        const insertedHeadContent =
          content.slice(0, index) + insertion + content.slice(index)
        this._writable.write(insertedHeadContent)
        this._freezing = true
        this._inserted = true
      }
      if (
        process.env.NODE_ENV !== "production" &&
        insertion &&
        !this._inserted
      ) {
        console.error(
          `server inserted HTML couldn't be inserted into the stream. You are missing '<head/>' element in your layout - please add it.`,
        )
      }
    }

    if (!this._inserted) {
      this._writable.write(content)
    } else {
      queueMicrotask(() => {
        this._freezing = false
      })
    }
  }
  _write(chunk: any, encoding: any, callback: any) {
    const strChunk = chunk.toString()
    this._buffered += strChunk
    this._flushBuffer()
    callback()
  }

  flush() {
    this._pendingFlush = null
    this._flushBufferSync()
    if (typeof this._writable.flush === "function") {
      this._writable.flush()
    }
  }

  _final() {
    if (this._pendingFlush) {
      return this._pendingFlush.then(() => {
        this._writable.end()
      })
    }
    this._writable.end()
  }
}

export default WritableWithStyles
