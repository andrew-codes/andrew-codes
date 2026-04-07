import styled from "@emotion/styled"
import hljs from "highlight.js"
import type { FC } from "react"
import { useEffect, useRef } from "react"

const CodeWrapper = styled.div`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100vw - 6rem);
  max-width: calc(960px - 6rem);
  margin: 1.5rem 0;

  @media (max-width: 640px) {
    position: static;
    width: 100%;
    left: unset;
    transform: none;
    overflow-x: auto;
  }
`

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
    <CodeWrapper>
      <pre
        style={{
          background: "#111210",
          border: "0.5px solid #2e2d2a",
          borderRadius: "8px",
          padding: "1.25rem 1.5rem",
          overflowX: "auto",
          margin: 0,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <code
          className={`hljs ${language}`}
          ref={codeRef}
          style={{ fontSize: "13.5px", lineHeight: 1.7, background: "transparent" }}
        >
          {code}
        </code>
      </pre>
    </CodeWrapper>
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
