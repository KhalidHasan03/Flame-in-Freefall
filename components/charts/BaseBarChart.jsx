"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

export default function BaseBarChart({
  data,
  xKey,
  series,
  caption,
  yLabel,
  xLabel,
  height = 240,
  margin = DEFAULT_MARGIN,
  className = "",
}) {
  const theme = useChartTheme();

  return (
    <div className={`flex flex-col gap-3 ${className}`.trim()}>
      {/* Inset one step below the panel so grid lines stay legible against the plot field. */}
      <div className="fx-plot-bg overflow-hidden rounded-[var(--radius-hud)] border border-line">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data} margin={margin}>
            <CartesianGrid {...grid(theme)} />
            <XAxis
              dataKey={xKey}
              tick={axisTick(theme)}
              axisLine={axisLine(theme)}
              tickLine={false}
              label={xLabel ? axisLabel(theme, xLabel, "insideBottom") : undefined}
            />
            <YAxis
              tick={axisTick(theme)}
              axisLine={axisLine(theme)}
              tickLine={false}
              width={40}
              label={yLabel ? axisLabel(theme, yLabel, "insideLeft") : undefined}
            />
            <Tooltip contentStyle={tooltipStyle(theme)} cursor={{ fill: theme["fx-hairline"] }} />
            <Legend wrapperStyle={legendStyle(theme)} iconSize={8} />
            {series.map((item) => (
              <Bar
                key={item.key}
                dataKey={item.key}
                name={item.name}
                fill={theme[item.color] ?? theme["fx-brand"]}
                // Square tops read as plotted bars; rounded ones read as a rounded-corner UI card.
                radius={[2, 2, 0, 0]}
                maxBarSize={28}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {caption ? (
        <PrototypeNotice compact label={PROTOTYPE_LABELS.illustration} message={caption} />
      ) : null}
    </div>
  );
}
