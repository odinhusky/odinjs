import { SEO_CONFIG_TYPE } from "src/utils/constants"

const OTHER_BLOCK_BEGIN = "<!-- seo:other:begin -->"
const OTHER_BLOCK_END = "<!-- seo:other:end -->"
const OTHER_BLOCK_REGEX = /<!--\s*seo:other:begin\s*-->([\s\S]*?)<!--\s*seo:other:end\s*-->/

export function useHtmlTag() {
  const generateSEOHTMLMeta = (data: Record<string, string>): string => {
    const { title, description, image, other } = data

    const parts: string[] = []

    if (title) {
      parts.push(`
      <title>${title}</title>
      <meta name="title" content="${title}">
      <meta property="og:title" content="${title}">
      <meta name="twitter:title" content="${title}">
    `)
    }

    if (description) {
      parts.push(`
      <meta name="description" content="${description}">
      <meta property="og:description" content="${description}">
      <meta name="twitter:description" content="${description}">
    `)
    }

    if (image) {
      parts.push(`
      <meta property="og:image" content="${image}">
      <meta name="twitter:image" content="${image}">
    `)
    }

    if (other) {
      parts.push(`${OTHER_BLOCK_BEGIN}\n${other}\n${OTHER_BLOCK_END}`)
    }

    return parts.join("\n").trim()
  }

  const extractMetaValue = (doc: Document, selectors: string[]): string => {
    for (const selector of selectors) {
      if (selector === "title") {
        const el = doc.querySelector("title")
        if (el?.textContent) return el.textContent.trim()
      } else {
        const el = doc.querySelector(selector) as HTMLMetaElement | null
        if (el?.content) return el.content.trim()
      }
    }
    return ""
  }

  const parseSEOHTMLMeta = (html: string): Record<SEO_CONFIG_TYPE.Enums, string> => {
    // 先把 OTHER 區塊整段抽出來，避免內容被 DOMParser 當成已知 SEO 標籤
    let otherBlockContent = ""
    let htmlForKnownParse = html
    const otherMatch = html.match(OTHER_BLOCK_REGEX)
    if (otherMatch) {
      otherBlockContent = otherMatch[1].trim()
      htmlForKnownParse = html.replace(otherMatch[0], "")
    }

    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlForKnownParse, "text/html")

    // 定義每個 Enum 要嘗試的 selectors
    const selectorMap: Partial<Record<SEO_CONFIG_TYPE.Enums, string[]>> = {
      [SEO_CONFIG_TYPE.Enums.TITLE]: [
        "title",
        "meta[property='og:title']",
        "meta[name='twitter:title']",
        "meta[name='title']"
      ],
      [SEO_CONFIG_TYPE.Enums.DESCRIPTION]: [
        "meta[name='description']",
        "meta[property='og:description']",
        "meta[name='twitter:description']"
      ],
      [SEO_CONFIG_TYPE.Enums.IMAGE]: ["meta[property='og:image']", "meta[name='twitter:image']"]
    }

    // 已知的 SEO selectors，用來排除已處理的元素
    const knownSelectors = [
      "title",
      "meta[name='title']",
      "meta[property='og:title']",
      "meta[name='twitter:title']",
      "meta[name='description']",
      "meta[property='og:description']",
      "meta[name='twitter:description']",
      "meta[property='og:image']",
      "meta[name='twitter:image']"
    ]

    // 動態生成結果
    const result = Object.fromEntries(
      Object.entries(selectorMap).map(([key, selectors]) => [key, extractMetaValue(doc, selectors!)])
    ) as Record<SEO_CONFIG_TYPE.Enums, string>

    // OTHER 內容優先使用標記區塊；若舊檔案沒有標記，退回掃描 head/body 中的非已知元素
    if (otherMatch) {
      result[SEO_CONFIG_TYPE.Enums.OTHER] = otherBlockContent
    } else {
      const knownElements = new Set<Element>()
      for (const selector of knownSelectors) {
        doc.querySelectorAll(selector).forEach((el) => knownElements.add(el))
      }

      const otherParts: string[] = []
      const collectOthers = (parent: ParentNode) => {
        parent.childNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && !knownElements.has(node as Element)) {
            otherParts.push((node as Element).outerHTML)
          }
        })
      }
      collectOthers(doc.head)
      collectOthers(doc.body)

      result[SEO_CONFIG_TYPE.Enums.OTHER] = otherParts.join("\n")
    }

    return result
  }

  return {
    generateSEOHTMLMeta,
    parseSEOHTMLMeta
  }
}
