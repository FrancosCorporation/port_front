/* eslint-disable */
import * as React from "react"
import { cn } from "../../lib/utils"

export const Button = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2",
        className
      )}
      {...props}
    />
  )
})
Button.displayName = "Button"