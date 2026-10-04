"use client";

import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useChartTheme from "./useChartTheme";
import {
  axisLabel,
  axisLine,
  axisTick,
  grid,
  legendStyle,
  tooltipStyle,
} from "./chartPrimitives";
import PrototypeNotice from "@/components/shared/PrototypeNotice";
import { PROTOTYPE_LABELS } from "@/lib/constants";

const DEFAULT_MARGIN = { top: 10, right: 8, bottom: 6, left: 0 };

export default function BaseScatterChart({
  data,
  xKey,
  yKey,
  zKey,
  caption,
  xLabel,
  yLabel,
  name = "Points",
  height = 240,
  margin = DEFAULT_MARGIN,
  color = "fx-brand",
  className = "",
}) {
  const theme = useChartTheme();
  const fill = theme[color] ?? theme["fx-brand"];

  return (
    <div className={`flex flex-col gap-3 ${className}`.trim()}>
      <div className="fx-plot-bg overflow-hidden rounded-[var(--radius-hud)] border border-line">
        <ResponsiveContainer width="100%" height={height}>
          <ScatterChart margin={margin}>
            <CartesianGrid {...grid(theme)} />
            <XAxis
              type="number"
              dataKey={xKey}
              name={xLabel ?? xKey}
              tick={axisTick(theme)}
              axisLine={axisLine(theme)}
              tickLine={false}
              label={xLabel ? axisLabel(theme, xLabel, "insideBottom") : undefined}
              domain={["dataMin", "dataMax"]}
            />
            <YAxis
              type="number"
              dataKey={yKey}
              name={yLabel ?? yKey}
              tick={axisTick(theme)}
              axisLine={axisLine(theme)}
              tickLine={false}
              width={42}
              label={yLabel ? axisLabel(theme, yLabel, "insideLeft") : undefined}
            />
            <Tooltip
              cursor={{ stroke: theme["fx-hairline-lit"], strokeDasharray: "2 2" }}
              contentStyle={tooltipStyle(theme)}
            />
            <Legend wrapperStyle={legendStyle(theme)} iconSize={8} />
            {/*
             * A thin lit ring around each point keeps overlapping records legible at small
             * marker sizes, which matters because several experiments share near-identical
             * gravity and oxygen values.
             */}
            <Scatter
              name={name}
              data={data}
              fill={fill}
              fillOpacity={0.75}
              stroke={theme["fx-ink"]}
              strokeOpacity={0.35}
              strokeWidth={1}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      {caption ? (
        <PrototypeNotice compact label={PROTOTYPE_LABELS.illustration} message={caption} />
      ) : null}
    </div>
  );
}
