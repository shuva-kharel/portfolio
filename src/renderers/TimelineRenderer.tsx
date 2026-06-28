import type { CommandResult } from "../types";

interface TimelineItem {
  year: string;
  title: string;
  institution?: string;
  details?: string;
}

// The "education" output: a vertical timeline with the year on the left and the
// title / institution / details on the right, connected by node dots.
export default function TimelineRenderer({ result }: { result: CommandResult }) {
  const items = (result.def?.items as TimelineItem[] | undefined) ?? [];

  return (
    <div className="renderer-timeline">
      {items.map((item, i) => (
        <div className="timeline-row" key={i}>
          <div className="timeline-year">{item.year}</div>
          <div className="timeline-marker" aria-hidden="true">
            <span className="timeline-dot" />
            {i < items.length - 1 && <span className="timeline-line" />}
          </div>
          <div className="timeline-body">
            <div className="timeline-title">{item.title}</div>
            {item.institution && (
              <div className="timeline-inst">{item.institution}</div>
            )}
            {item.details && (
              <div className="timeline-details">{item.details}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
