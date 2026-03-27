"use client";

import { TextBlock } from "./blocks/text-block";
import { CardBlock } from "./blocks/card-block";
import { AlertBlock } from "./blocks/alert-block";
import { ChartBlock } from "./blocks/chart-bar";
import { FormBlock } from "./blocks/form-block";
import { ListBlock } from "./blocks/list-block";
import { StatBlock } from "./blocks/stat-block";
import { UIBlock } from "@/types/engine";

const blockMap: Record<
  string,
  React.FC<{ props: Record<string, unknown> }>
> = {
  card: CardBlock,
  alert: AlertBlock,
  list: ListBlock,
  stat: StatBlock,
  form: FormBlock,
  chart: ChartBlock,
  text: TextBlock,
};

export function RenderUIBlocks({ blocks }: { blocks: UIBlock[] }) {
  const groups: Array<{ type: "stat-group"; blocks: UIBlock[] } | { type: "single"; block: UIBlock }> = [];

  for (const block of blocks) {
    if (block.type === "stat") {
      const last = groups[groups.length - 1];
      if (last && last.type === "stat-group") {
        last.blocks.push(block);
      } else {
        groups.push({ type: "stat-group", blocks: [block] });
      }
    } else {
      groups.push({ type: "single", block });
    }
  }

  return (
    <div className="space-y-2 mt-3">
      {groups.map((group, i) => {
        if (group.type === "stat-group") {
          const cols = group.blocks.length >= 3 ? "grid-cols-3" : group.blocks.length === 2 ? "grid-cols-2" : "";
          return (
            <div key={i} className={`grid gap-2 ${cols}`}>
              {group.blocks.map((block, j) => (
                <StatBlock key={j} props={block.props} />
              ))}
            </div>
          );
        }
        const Component = blockMap[group.block.type];
        if (!Component) return null;
        return <Component key={i} props={group.block.props} />;
      })}
    </div>
  );
}
