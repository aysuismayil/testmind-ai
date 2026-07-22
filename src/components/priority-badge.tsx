import type { Priority } from "@/lib/types";

const STYLES: Record<Priority, string> = {
  High: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  Medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STYLES[priority]}`}>
      {priority}
    </span>
  );
}
