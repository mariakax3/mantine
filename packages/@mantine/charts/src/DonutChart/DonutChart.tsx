import {
  Cell,
  Pie,
  PieProps,
  PieChart as ReChartsPieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts';
import {
  Box,
  BoxProps,
  createVarsResolver,
  ElementProps,
  factory,
  Factory,
  getThemeColor,
  MantineColor,
  rem,
  StylesApiProps,
  useMantineTheme,
  useProps,
  useResolvedStylesApi,
  useStyles,
} from '@mantine/core';
import { ChartTooltip } from '../ChartTooltip/ChartTooltip';
import classes from './DonutChart.module.css';

export interface DonutChartCell {
  name: string;
  value: number;
  color: MantineColor;
}

export type DonutChartStylesNames = 'root' | 'label';
export type DonutChartCssVariables = {
  root: '--chart-stroke-color' | '--chart-labels-color' | '--chart-size';
};

export interface DonutChartProps
  extends BoxProps,
    StylesApiProps<DonutChartFactory>,
    ElementProps<'div'> {
  data: DonutChartCell[];
  withTooltip?: boolean;
  tooltipAnimationDuration?: number;
  tooltipProps?: Omit<TooltipProps<any, any>, 'ref'>;
  pieProps?: Partial<Omit<PieProps, 'ref'>>;
  strokeColor?: MantineColor;
  labelColor?: MantineColor;
  paddingAngle?: number;
  withLabels?: boolean;
  withLabelsLine?: boolean;
  thickness?: number;
  size?: number;
  strokeWidth?: number;
  startAngle?: number;
  endAngle?: number;
  tooltipDataSource?: 'segment' | 'all';
  chartLabel?: string | number;
  children?: React.ReactNode;
  pieChartProps?: React.ComponentPropsWithoutRef<typeof ReChartsPieChart>;
  valueFormatter?: (value: number) => string;
  legendOrientation?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-left' | 'center-right';
}

export type DonutChartFactory = Factory<{
  props: DonutChartProps;
  ref: HTMLDivElement;
  stylesNames: DonutChartStylesNames;
  vars: DonutChartCssVariables;
}>;

const defaultProps: Partial<DonutChartProps> = {
  withTooltip: true,
  withLabelsLine: true,
  paddingAngle: 0,
  thickness: 20,
  size: 160,
  strokeWidth: 1,
  startAngle: 0,
  endAngle: 360,
  tooltipDataSource: 'all',
};

const varsResolver = createVarsResolver<DonutChartFactory>(
  (theme, { strokeColor, labelColor, withLabels, size }) => ({
    root: {
      '--chart-stroke-color': strokeColor ? getThemeColor(strokeColor, theme) : undefined,
      '--chart-labels-color': labelColor ? getThemeColor(labelColor, theme) : undefined,
      '--chart-size': withLabels ? rem(size! + 80) : rem(size!),
    },
  })
);

export const DonutChart = factory<DonutChartFactory>((_props, ref) => {
  const props = useProps('DonutChart', defaultProps, _props);
  const {
    classNames,
    className,
    style,
    styles,
    unstyled,
    vars,
    data,
    withTooltip,
    tooltipAnimationDuration,
    tooltipProps,
    pieProps,
    paddingAngle,
    withLabels,
    withLabelsLine,
    size,
    thickness,
    strokeWidth,
    startAngle,
    endAngle,
    tooltipDataSource,
    chartLabel,
    children,
    pieChartProps,
    valueFormatter,
    strokeColor,
    legendOrientation,
    ...others
  } = props;

  const theme = useMantineTheme();

  const getStyles = useStyles<DonutChartFactory>({
    name: 'DonutChart',
    classes,
    props,
    className,
    style,
    classNames,
    styles,
    unstyled,
    vars,
    varsResolver,
  });

  const { resolvedClassNames, resolvedStyles } = useResolvedStylesApi<DonutChartFactory>({
    classNames,
    styles,
    props,
  });

  const cells = data.map((item, index) => (
    <Cell
      key={index}
      fill={getThemeColor(item.color, theme)}
      stroke="var(--chart-stroke-color, var(--mantine-color-body))"
      strokeWidth={strokeWidth}
    />
  ));

  const legendPosition = {
    'top': { x: 0, y: -180 },
    'bottom': { x: 0, y: 180 },
    'top-left': { x: -180, y: -180 },
    'top-right': { x: 180, y: -180 },
    'bottom-left': { x: -180, y: 180 },
    'bottom-right': { x: 180, y: 180 },
    'center-left': { x: -230, y: 0 },
    'center-right': { x: 230, y: 0 },
  };

  const legendOffset = legendPosition[legendOrientation || 'center-right'];

  return (
    <Box ref={ref} size={size} {...getStyles('root')} {...others}>
      <ResponsiveContainer>
        <ReChartsPieChart {...pieChartProps}>
          <Pie
            data={data}
            innerRadius={size! / 2 - thickness!}
            outerRadius={size! / 2}
            dataKey="value"
            isAnimationActive={false}
            paddingAngle={paddingAngle}
            startAngle={startAngle}
            endAngle={endAngle}
            label={withLabels ? { fill: 'var(--chart-labels-color, var(--mantine-color-dimmed))', fontSize: 12, fontFamily: 'var(--mantine-font-family)' } : false}
            labelLine={withLabelsLine ? { stroke: 'var(--chart-label-color, var(--mantine-color-dimmed))', strokeWidth: 1 } : false}
            {...pieProps}
          >
            {cells}
          </Pie>

          {chartLabel && (
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              {...getStyles('label')}
            >
              {chartLabel}
            </text>
          )}

          {withTooltip && (
            <Tooltip
              animationDuration={tooltipAnimationDuration}
              isAnimationActive={false}
              content={({ payload }) => (
                <ChartTooltip
                  payload={data}
                  classNames={resolvedClassNames}
                  styles={resolvedStyles}
                  type="radial"
                  segmentId={tooltipDataSource === 'segment' ? payload?.[0]?.name : undefined}
                  valueFormatter={valueFormatter}
                />
              )}
              position={{ x: legendOffset.x, y: legendOffset.y }}
              {...tooltipProps}
            />
          )}

          {children}
        </ReChartsPieChart>
      </ResponsiveContainer>
    </Box>
  );
});

DonutChart.displayName = '@mantine/charts/DonutChart';
DonutChart.classes = classes;
