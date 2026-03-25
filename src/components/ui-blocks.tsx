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
  return (
    <div className="grid gap-3 mt-3">
      {blocks.map((block, i) => {
        const Component = blockMap[block.type];
        if (!Component) return null;
        return <Component key={i} props={block.props} />;
      })}
    </div>
  );
}
