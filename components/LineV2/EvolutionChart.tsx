import { LineChartData } from '@/hooks/useGetLineChartForTripId';
import { rgba, theme } from '@/theme';
import React, { useMemo, useState } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import Svg, { G, Line, Rect, Text as SvgText } from 'react-native-svg';

const SCREEN_W = Dimensions.get('window').width;

export default function EvolutionChart({
  data,
  currency = '€',
}: {
  data: LineChartData;
  currency?: string;
}) {
  const chartH = 260;
  const barW = 44;
  const gap = 14;

  const totalsPerDay = useMemo(
    () => data.data.map((row) => row.reduce((a, b) => a + (b || 0), 0)),
    [data.data],
  );

  const maxY = useMemo(() => {
    const max = Math.max(...totalsPerDay, 1);
    const step = Math.pow(10, Math.floor(Math.log10(max)) - 1);
    return Math.ceil(max / step) * step;
  }, [totalsPerDay]);

  const chartW = Math.max(SCREEN_W, data.labels.length * (barW + gap) + 24);

  const [tip, setTip] = useState<{
    x: number;
    label: string;
    total: number;
    rows: { name: string; v: number; c: string }[];
  } | null>(null);

  const onBarPress = (idx: number, xCenter: number) => {
    const total = totalsPerDay[idx];
    const rows = data.legend
      .map((name, i) => ({ name, v: data.data[idx][i] || 0, c: data.barColors[i] }))
      .filter((r) => r.v > 0)
      .sort((a, b) => b.v - a.v);
    setTip({ x: xCenter, label: data.labels[idx], total, rows });
  };

  return (
    <View style={{ marginTop: theme.spacing.sm }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: theme.spacing.md }}
      >
        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radii.xl,
            paddingVertical: 12,
            paddingHorizontal: 6,
            width: chartW,
            ...theme.shadow.level1,
            borderWidth: 1,
            borderColor: theme.colors.neutral[200],
          }}
        >
          <Svg width={chartW} height={chartH}>
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
              const y = chartH - 30 - p * (chartH - 60);
              return (
                <G key={i}>
                  <Line
                    x1={12}
                    x2={chartW - 12}
                    y1={y}
                    y2={y}
                    stroke={theme.colors.neutral[200]}
                    strokeWidth={1}
                  />
                  <SvgText x={16} y={y - 4} fill={theme.colors.neutral[500]} fontSize="10">
                    {(maxY * p).toFixed(2)}
                  </SvgText>
                </G>
              );
            })}

            {data.labels.map((label, idx) => {
              const x = 50 + idx * (barW + gap);
              const xCenter = x + barW / 2;
              const total = totalsPerDay[idx];
              let yCursor = chartH - 30;

              return (
                <G key={label}>
                  <Rect
                    x={x - 6}
                    y={20}
                    width={barW + 12}
                    height={chartH - 40}
                    fill="transparent"
                    onPress={() => onBarPress(idx, xCenter)}
                  />
                  {data.legend.map((_, i) => {
                    const v = data.data[idx][i] || 0;
                    if (!v) return null;
                    const h = (v / maxY) * (chartH - 60);
                    yCursor -= h;
                    return (
                      <Rect
                        key={i}
                        x={x}
                        y={yCursor}
                        width={barW}
                        height={h}
                        fill={data.barColors[i]}
                      />
                    );
                  })}
                  <SvgText
                    x={x + barW / 2}
                    y={chartH - 8}
                    textAnchor="middle"
                    fill={theme.colors.neutral[600]}
                    fontSize="12"
                  >
                    {label}
                  </SvgText>

                  {tip && Math.abs(tip.x - xCenter) < 1 && (
                    <Rect
                      x={x - 3}
                      y={20}
                      width={barW + 6}
                      height={chartH - 40}
                      rx={10}
                      fill={rgba(theme.colors.primary[500], 0.08)}
                    />
                  )}
                </G>
              );
            })}
          </Svg>

          {tip && (
            <View
              style={{
                position: 'absolute',
                left: Math.min(Math.max(tip.x - 120, 8), chartW - 240),
                top: 8,
                width: 240,
                padding: 10,
                borderRadius: 12,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.neutral[200],
                ...theme.shadow.level2,
              }}
            >
              <Text
                style={{
                  fontFamily: theme.typography.family.medium,
                  color: theme.colors.text.secondary,
                }}
              >
                {tip.label}
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  fontFamily: theme.typography.family.bold,
                  color: theme.colors.text.primary,
                }}
              >
                Total : {tip.total.toFixed(2)} {currency}
              </Text>
              <View style={{ marginTop: 6 }}>
                {tip.rows.slice(0, 5).map((r) => (
                  <View
                    key={r.name}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 2,
                          backgroundColor: r.c,
                          marginRight: 6,
                        }}
                      />
                      <Text style={{ color: theme.colors.text.primary }}>{r.name}</Text>
                    </View>
                    <Text style={{ color: theme.colors.text.primary }}>
                      {r.v.toFixed(2)} {currency}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
