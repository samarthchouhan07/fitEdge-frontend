import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

function Progress({ className, value, ...props }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full transition-all"
        style={{
          width: `${value || 0}%`,
          backgroundColor: value > 80 ? "green" : value > 50 ? "orange" : "red",
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };