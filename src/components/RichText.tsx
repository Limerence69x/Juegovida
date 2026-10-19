// Formato mínimo del texto narrativo: párrafos separados por línea en blanco y
// bloques de sistema (líneas que empiezan con «>») en tipografía de terminal.

interface Props {
  text: string
  caret?: boolean
}

export function RichText({ text, caret }: Props) {
  const paragraphs = text.split('\n\n')
  return (
    <div className="space-y-3">
      {paragraphs.map((p, i) => {
        const last = i === paragraphs.length - 1
        const isSystem = p.startsWith('>')
        if (isSystem) {
          return (
            <pre
              key={i}
              className={`term whitespace-pre-wrap border-l-2 border-accent bg-panel-2 px-3 py-2 text-[19px] text-accent ${last && caret ? 'caret' : ''}`}
            >
              {p}
            </pre>
          )
        }
        return (
          <p key={i} className={`whitespace-pre-line text-[15.5px] leading-relaxed ${last && caret ? 'caret' : ''}`}>
            {p}
          </p>
        )
      })}
    </div>
  )
}
