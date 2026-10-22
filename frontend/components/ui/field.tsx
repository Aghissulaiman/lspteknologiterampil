import * as React from "react"
import { cn } from "@/lib/utils"

const FieldGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("space-y-4", className)} {...props} />
    )
)
FieldGroup.displayName = "FieldGroup"

const Field = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
    )
)
Field.displayName = "Field"

const FieldLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => (
        <label
            ref={ref}
            className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900 dark:text-slate-100",
                className
            )}
            {...props}
        />
    )
)
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn("text-[0.8rem] text-slate-500 dark:text-slate-400", className)}
            {...props}
        />
    )
)
FieldDescription.displayName = "FieldDescription"

export { FieldGroup, Field, FieldLabel, FieldDescription }