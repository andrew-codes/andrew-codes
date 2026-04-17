import styled from "@emotion/styled"
import type { FC } from "react"

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

const CodePostAsset: FC<{ highlightedHtml: string; language: string }> = ({
  highlightedHtml,
  language,
}) => (
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
        style={{ fontSize: "13.5px", lineHeight: 1.7, background: "transparent" }}
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </pre>
  </CodeWrapper>
)

const getCodePostAssetComponent = (
  codeAssets: Record<string, { raw: string; highlightedHtml: string }> | undefined,
) => {
  const C: FC<{ fileName: string; language: string | undefined | null }> = ({
    fileName,
    language,
  }) => {
    if (!codeAssets) {
      return null
    }

    const asset = codeAssets[fileName]
    const lang = language ? `language-${language}` : ""

    return <CodePostAsset language={lang} highlightedHtml={asset.highlightedHtml} />
  }

  return C
}

export default getCodePostAssetComponent
export { CodePostAsset }
