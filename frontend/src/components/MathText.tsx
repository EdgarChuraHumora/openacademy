import katex from 'katex'
import 'katex/dist/katex.min.css'

// Texto con fórmulas entre signos $: "La mitad de $\frac{3}{4}$" → la fracción se dibuja como en un libro
export default function MathText({ text }: { text: string }) {
  const parts = text.split('$')
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} dangerouslySetInnerHTML={{ __html: katex.renderToString(part, { throwOnError: false }) }} />
        ) : (
          part
        ),
      )}
    </>
  )
}
