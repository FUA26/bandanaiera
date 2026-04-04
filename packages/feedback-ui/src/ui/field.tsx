import * as React from "react"

const Field = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))
Field.displayName = "Field"

export { Field }
