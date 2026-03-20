import { cn } from "@/lib/utils"

export type ComparisonColumn = {
  key: string
  label: string
  highlighted?: boolean
}

export type ComparisonRow = {
  label: string
  cells: Record<string, React.ReactNode>
}

type ComparisonTableProps = {
  columns: ComparisonColumn[]
  rows: ComparisonRow[]
  labelHeader?: string
  labelWidth?: string
  className?: string
}

export function ComparisonTable({
  columns,
  rows,
  labelHeader,
  labelWidth = "200px",
  className,
}: ComparisonTableProps) {
  const gridTemplate = `${labelWidth} repeat(${columns.length}, 1fr)`

  return (
    <div className={className}>
      {/* Desktop */}
      <div className="hidden md:block">
        {/* Column headers */}
        <div
          className="gap-x-px bg-white"
          style={{ display: "grid", gridTemplateColumns: gridTemplate }}
        >
          <div className="bg-[#F3F3F3] px-4 py-4">
            {labelHeader && (
              <span className="text-foreground font-bold">{labelHeader}</span>
            )}
          </div>
          {columns.map((col) => (
            <div
              key={col.key}
              className={cn(
                "px-4 py-4",
                col.highlighted ? "bg-secondary-foreground" : "bg-[#ECECEC]"
              )}
            >
              <span
                className={cn(
                  "font-bold",
                  col.highlighted ? "text-white" : "text-foreground"
                )}
              >
                {col.label}
              </span>
            </div>
          ))}
        </div>

        {/* Data rows */}
        {rows.map((row, i) => (
          <div
            key={i}
            className="gap-x-px border-t bg-white"
            style={{ display: "grid", gridTemplateColumns: gridTemplate }}
          >
            <div className="flex items-center bg-[#F3F3F3] px-4 py-4">
              <span className="text-foreground font-bold">{row.label}</span>
            </div>
            {columns.map((col) => (
              <div
                key={col.key}
                className={cn(
                  "px-4 py-4",
                  col.highlighted ? "bg-secondary-foreground/10" : "bg-white"
                )}
              >
                <p
                  className={cn(
                    "font-medium",
                    col.highlighted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {row.cells[col.key]}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mobile: Stacked cards */}
      <div className="space-y-3 md:hidden">
        {rows.map((row, i) => {
          const highlighted = columns.find((c) => c.highlighted)
          const rest = columns.filter((c) => !c.highlighted)

          return (
            <div key={i} className="bg-card p-5">
              <p className="text-sm font-bold">{row.label}</p>
              {highlighted && (
                <div className="bg-secondary-foreground/10 mt-3 px-4 py-3">
                  <p className="text-secondary-foreground mb-0.5 text-xs font-bold tracking-widest uppercase">
                    {highlighted.label}
                  </p>
                  <p className="text-foreground text-sm font-medium">
                    {row.cells[highlighted.key]}
                  </p>
                </div>
              )}
              {rest.map((col) => (
                <div key={col.key} className="mt-3">
                  <p className="text-muted-foreground mb-0.5 text-xs font-bold tracking-widest uppercase">
                    {col.label}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {row.cells[col.key]}
                  </p>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
