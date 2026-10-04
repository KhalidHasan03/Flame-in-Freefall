"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
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

/** Line chart wrapper that picks up the live theme. */
export function BaseLineChart({
  data,
  xKey,
  series,
  caption,
  margin = DEFAULT_MARGIN,
  className = "",
  maxHeight = 240,
  xLabel,
  yLabel,
}) {
  const theme = useChartTheme();

  return (
    <div className={`flex flex-col gap-3 ${className}`.trim()}>
      <div className="fx-plot-bg overflow-hidden rounded-[var(--radius-hud)] border border-line">
        <ResponsiveContainer width="100%" height={maxHeight}>
          <LineChart data={data} margin={margin}>
            <CartesianGrid {...grid(theme)} />
            <XAxis
              dataKey={xKey}
              tick={axisTick(theme)}
              axisLine={axisLine(theme)}
              tickLine={false}
              label={xLabel ? axisLabel(theme, xLabel, "insideBottom") : undefined}
            />
            <YAxis
              width={40}
              tick={axisTick(theme)}
              axisLine={axisLine(theme)}
              tickLine={false}
              label={yLabel ? axisLabel(theme, yLabel, "insideLeft") : undefined}
            />
            <Tooltip contentStyle={tooltipStyle(theme)} cursor={{ stroke: theme["fx-hairline-lit"] }} />
            <Legend wrapperStyle={legendStyle(theme)} iconSize={8} />
            {series.map((item) => {
              const stroke = theme[item.color] ?? item.color ?? theme["fx-signal"];
              return (
                <Line
                  key={item.key}
                  type={item.type ?? "monotone"}
                  dataKey={item.key}
                  name={item.name}
                  stroke={stroke}
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 3.5, strokeWidth: 0 }}
                  strokeDasharray={item.dashed ? "6 3" : undefined}
                  /*
                   * The line's glow is a CSS drop-shadow rather than a second overlapping
                   * series. A duplicate pass would have shown up twice in the tooltip and the
                   * legend, and an SVG filter would cost far more per frame than a composited
                   * shadow does.
                   */
                  style={{ filter: `drop-shadow(0 0 5px ${stroke})` }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {caption ? (
        <PrototypeNotice compact label={PROTOTYPE_LABELS.illustration} message={caption} />
      ) : null}
    </div>
  );
}
