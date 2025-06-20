import hljs from "highlight.js"
import type { FC } from "react"
import { useEffect, useRef } from "react"

const CodePostAsset: FC<{ code: string; language: string }> = ({
  code,
  language,
}) => {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!codeRef.current) {
      return
    }

    hljs.highlightElement(codeRef.current)
  }, [])

  return (
    <pre>
      <code className={`hljs ${language}`} ref={codeRef}>
        {code}
      </code>
    </pre>
  )
}

const getCodePostAssetComponent = (
  codeAssets: Record<string, string> | undefined,
) => {
  const C: FC<{ fileName: string; language: string | undefined | null }> = ({
    fileName,
    language,
  }) => {
    if (!codeAssets) {
      return null
    }

    const code = codeAssets[fileName]
    let lang = ""

    if (language) {
      lang = `language-${language}`
    }

    return <CodePostAsset language={lang} code={code} />
  }

  return C
}

export default getCodePostAssetComponent
export { CodePostAsset }
