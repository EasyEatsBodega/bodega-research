"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

interface ScoreRadarProps {
  pmf: number;
  ui: number;
  sentiment: number;
  overall: number;
}

export function ScoreRadar({ pmf, ui, sentiment, overall }: ScoreRadarProps) {
  const data = [
    { subject: "PMF", score: pmf, fullMark: 10 },
    { subject: "UI/UX", score: ui, fullMark: 10 },
    { subject: "VIBE", score: sentiment, fullMark: 10 },
    { subject: "OVERALL", score: overall, fullMark: 10 },
  ];

  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#888", fontSize: 11, fontFamily: "monospace" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={{ fill: "#666", fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#F0A202"
            fill="#F0A202"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ScoreBarsProps {
  pmf: number;
  ui: number;
  sentiment: number;
}

function getScoreColor(score: number): string {
  if (score >= 8) return "#22c55e"; // green
  if (score >= 6) return "#F0A202"; // gold
  if (score >= 4) return "#F18805"; // orange
  return "#D95D39"; // coral/red
}

export function ScoreBars({ pmf, ui, sentiment }: ScoreBarsProps) {
  const data = [
    { name: "PMF", score: pmf },
    { name: "UI/UX", score: ui },
    { name: "VIBE", score: sentiment },
  ];

  return (
    <div className="w-full h-[120px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <XAxis type="number" domain={[0, 10]} tick={{ fill: "#666", fontSize: 10 }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#888", fontSize: 11, fontFamily: "monospace" }}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface FreshnessGaugeProps {
  score: number;
}

export function FreshnessGauge({ score }: FreshnessGaugeProps) {
  const percentage = (score / 10) * 100;
  const rotation = (percentage / 100) * 180 - 90; // -90 to 90 degrees

  const getGaugeColor = () => {
    if (score >= 8) return "#22c55e";
    if (score >= 6) return "#F0A202";
    if (score >= 4) return "#F18805";
    return "#D95D39";
  };

  const getLabel = () => {
    if (score >= 8) return "FRESH";
    if (score >= 6) return "DECENT";
    if (score >= 4) return "STALE";
    return "FLOP";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-16 overflow-hidden">
        {/* Background arc */}
        <div
          className="absolute bottom-0 left-0 w-32 h-32 rounded-full border-8 border-surface-tertiary"
          style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }}
        />
        {/* Colored arc based on score */}
        <div
          className="absolute bottom-0 left-0 w-32 h-32 rounded-full border-8 transition-all duration-500"
          style={{
            borderColor: getGaugeColor(),
            clipPath: `polygon(0 50%, 100% 50%, 100% 100%, 0 100%)`,
            transform: `rotate(${rotation - 90}deg)`,
            transformOrigin: "center center",
          }}
        />
        {/* Needle */}
        <div
          className="absolute bottom-0 left-1/2 w-1 h-14 bg-foreground rounded-full origin-bottom transition-transform duration-500"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        />
        {/* Center dot */}
        <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-foreground rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>
      <div className="mt-2 text-center">
        <span
          className="font-mono font-bold text-lg"
          style={{ color: getGaugeColor() }}
        >
          {score.toFixed(1)}
        </span>
        <span className="text-gray-500 font-mono text-xs block">{getLabel()}</span>
      </div>
    </div>
  );
}

interface ScoreRingProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreRing({ score, label, size = "md" }: ScoreRingProps) {
  const percentage = (score / 10) * 100;
  const strokeWidth = size === "sm" ? 4 : size === "lg" ? 8 : 6;
  const dimensions = size === "sm" ? 48 : size === "lg" ? 80 : 64;
  const radius = (dimensions - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (score >= 8) return "#22c55e";
    if (score >= 6) return "#F0A202";
    if (score >= 4) return "#F18805";
    return "#D95D39";
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: dimensions, height: dimensions }}>
        <svg width={dimensions} height={dimensions} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            fill="none"
            stroke="#262626"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={dimensions / 2}
            cy={dimensions / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`font-mono font-bold ${
              size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-lg"
            }`}
            style={{ color: getColor() }}
          >
            {score.toFixed(1)}
          </span>
        </div>
      </div>
      <span className="font-mono text-xs text-gray-500 mt-1 uppercase">{label}</span>
    </div>
  );
}

interface MiniSparklineProps {
  value: number;
  maxValue?: number;
}

export function MiniSparkline({ value, maxValue = 10 }: MiniSparklineProps) {
  const percentage = (value / maxValue) * 100;

  const getColor = () => {
    if (value >= 8) return "bg-green-500";
    if (value >= 6) return "bg-bodega-gold";
    if (value >= 4) return "bg-bodega-orange";
    return "bg-bodega-coral";
  };

  return (
    <div className="w-full h-2 bg-surface-tertiary rounded-full overflow-hidden">
      <div
        className={`h-full ${getColor()} rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
