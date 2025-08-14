import { theme } from '@/theme';
import * as d3 from 'd3-shape';
import React, { useMemo } from 'react';
import { Dimensions, View } from 'react-native';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');
const SIZE = Math.min(width * 0.85, 320);
const R = SIZE / 2;
const INNER_R = R - 28;

export type DonutDatum = { name: string; population: number; color: string };

export default function DonutChart({
  data,
  total,
  activeName,
  onSlicePress,
  centerTitle,
  centerValue,
  centerNote,
}: {
  data: DonutDatum[];
  total: number;
  activeName: string | null;
  onSlicePress: (name: string | null) => void;
  centerTitle: string;
  centerValue: string;
  centerNote?: string;
}) {
  const pieGen = useMemo(
    () =>
      d3
        .pie<DonutDatum>()
        .value((d) => d.population)
        .sort(null),
    [],
  );
  const arcs = useMemo(() => pieGen(data), [data, pieGen]);

  const arcGen = useMemo(
    () => d3.arc<d3.PieArcDatum<DonutDatum>>().outerRadius(R).innerRadius(INNER_R).cornerRadius(2),
    [],
  );

  const hitArcGen = useMemo(
    () =>
      d3
        .arc<d3.PieArcDatum<DonutDatum>>()
        .outerRadius(R + 6)
        .innerRadius(INNER_R - 6)
        .cornerRadius(10),
    [],
  );

  return (
    <View style={{ alignItems: 'center', marginVertical: 8 }}>
      <Svg width={SIZE} height={SIZE} collapsable={false}>
        <G x={R} y={R}>
          <Circle r={R} fill={theme.colors.background} />
          {arcs.map((a, i) => {
            const name = a.data.name;
            const isActive = activeName === name;
            const path = arcGen(a) as string;
            const hitPath = hitArcGen(a) as string;

            return (
              <G key={`${name}-${i}`}>
                <Path
                  d={path}
                  fill={a.data.color}
                  opacity={isActive ? 1 : 0.88}
                  stroke={isActive ? theme.colors.primary[50] : 'transparent'}
                  strokeWidth={isActive ? 2 : 0}
                />
                <Path
                  d={hitPath}
                  fill={a.data.color}
                  fillOpacity={0.01}
                  onPress={() => onSlicePress(isActive ? null : name)}
                  onPressIn={() => {}}
                />
              </G>
            );
          })}

          <SvgText
            x={0}
            y={-8}
            fontFamily={theme.typography.family.medium}
            fontSize={12}
            fill={theme.colors.text.secondary}
            textAnchor="middle"
          >
            {centerTitle}
          </SvgText>
          <SvgText
            x={0}
            y={20}
            fontFamily={theme.typography.family.bold}
            fontSize={16}
            fill={theme.colors.text.primary}
            textAnchor="middle"
          >
            {centerValue}
          </SvgText>
          {centerNote ? (
            <SvgText
              x={0}
              y={42}
              fontFamily={theme.typography.family.medium}
              fontSize={12}
              fill={theme.colors.text.muted}
              textAnchor="middle"
            >
              {centerNote}
            </SvgText>
          ) : null}
        </G>
      </Svg>
    </View>
  );
}
