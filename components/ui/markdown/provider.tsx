import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"

import MarkdownComponents from "./components"

type Props = { children: string }

const MarkdownProvider = (props: Props) => (
  <ReactMarkdown
    components={MarkdownComponents}
    rehypePlugins={[rehypeRaw]}
    {...props}
  />
)

export default MarkdownProvider
