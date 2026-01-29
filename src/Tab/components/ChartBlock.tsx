import { useMemo } from 'react';
import {
	BarChart, Bar,
	LineChart, Line,
	AreaChart, Area,
	PieChart, Pie, Cell,
	XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { makeStyles, tokens, Text } from '@fluentui/react-components';

const COLORS = ['#0078d4', '#00b7c3', '#8cbd18', '#bad80a', '#ffb900', '#f25022'];

interface ChartConfig {
	type: 'bar' | 'line' | 'area' | 'pie';
	title?: string;
	description?: string;
	data: any[];
	xAxisKey: string;
	series: Array<{
		key: string;
		color?: string;
		name?: string;
	}>;
}

const useStyles = makeStyles({
	container: {
		marginTop: tokens.spacingVerticalL,
		marginBottom: tokens.spacingVerticalL,
		backgroundColor: tokens.colorNeutralBackground2,
		border: `1px solid ${tokens.colorNeutralStroke2}`,
		borderRadius: tokens.borderRadiusLarge,
		padding: tokens.spacingVerticalXL,
	},
	title: {
		fontSize: tokens.fontSizeBase500,
		fontWeight: tokens.fontWeightSemibold,
		color: tokens.colorNeutralForeground1,
		marginBottom: tokens.spacingVerticalS,
		textAlign: 'center',
	},
	description: {
		fontSize: tokens.fontSizeBase300,
		color: tokens.colorNeutralForeground2,
		marginBottom: tokens.spacingVerticalL,
		textAlign: 'center',
		maxWidth: '600px',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	chartWrapper: {
		width: '100%',
		height: '350px',
		fontSize: tokens.fontSizeBase200,
	},
	error: {
		padding: tokens.spacingVerticalM,
		border: `1px solid ${tokens.colorPaletteRedBorder2}`,
		backgroundColor: tokens.colorPaletteRedBackground2,
		borderRadius: tokens.borderRadiusMedium,
		color: tokens.colorPaletteRedForeground1,
		fontSize: tokens.fontSizeBase300,
	},
});

export const ChartBlock = ({ codeContent }: { codeContent: string }) => {
	const styles = useStyles();

	const config = useMemo(() => {
		try {
			const cleanContent = codeContent.trim();
			return JSON.parse(cleanContent) as ChartConfig;
		} catch (e) {
			console.error("Failed to parse chart JSON:", e);
			return null;
		}
	}, [codeContent]);

	if (!config) {
		return (
			<div className={styles.error}>
				Failed to render chart: Invalid JSON data.
			</div>
		);
	}

	const renderChart = () => {
		// Determine colors based on Teams theme
		const gridColor = tokens.colorNeutralStroke3;
		const axisColor = tokens.colorNeutralForeground3;
		const tooltipBg = tokens.colorNeutralBackground1;
		const tooltipBorder = tokens.colorNeutralStroke2;

		switch (config.type.toLowerCase()) {
			case 'bar':
				return (
					<BarChart data={config.data}>
						<CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
						<XAxis
							dataKey={config.xAxisKey}
							stroke={axisColor}
							tick={{ fill: axisColor }}
						/>
						<YAxis
							stroke={axisColor}
							tick={{ fill: axisColor }}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: tooltipBg,
								borderColor: tooltipBorder,
								borderRadius: tokens.borderRadiusMedium,
							}}
						/>
						<Legend />
						{config.series.map((s, i) => (
							<Bar
								key={s.key}
								dataKey={s.key}
								name={s.name || s.key}
								fill={s.color || COLORS[i % COLORS.length]}
							/>
						))}
					</BarChart>
				);
			case 'line':
				return (
					<LineChart data={config.data}>
						<CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
						<XAxis
							dataKey={config.xAxisKey}
							stroke={axisColor}
							tick={{ fill: axisColor }}
						/>
						<YAxis
							stroke={axisColor}
							tick={{ fill: axisColor }}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: tooltipBg,
								borderColor: tooltipBorder,
								borderRadius: tokens.borderRadiusMedium,
							}}
						/>
						<Legend />
						{config.series.map((s, i) => (
							<Line
								key={s.key}
								type="monotone"
								dataKey={s.key}
								name={s.name || s.key}
								stroke={s.color || COLORS[i % COLORS.length]}
								strokeWidth={2}
								dot={{ r: 4 }}
							/>
						))}
					</LineChart>
				);
			case 'area':
				return (
					<AreaChart data={config.data}>
						<CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
						<XAxis
							dataKey={config.xAxisKey}
							stroke={axisColor}
							tick={{ fill: axisColor }}
						/>
						<YAxis
							stroke={axisColor}
							tick={{ fill: axisColor }}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: tooltipBg,
								borderColor: tooltipBorder,
								borderRadius: tokens.borderRadiusMedium,
							}}
						/>
						<Legend />
						{config.series.map((s, i) => (
							<Area
								key={s.key}
								type="monotone"
								dataKey={s.key}
								name={s.name || s.key}
								stroke={s.color || COLORS[i % COLORS.length]}
								fill={s.color || COLORS[i % COLORS.length]}
								fillOpacity={0.3}
							/>
						))}
					</AreaChart>
				);
			case 'pie':
				return (
					<PieChart>
						<Tooltip
							contentStyle={{
								backgroundColor: tooltipBg,
								borderColor: tooltipBorder,
								borderRadius: tokens.borderRadiusMedium,
							}}
						/>
						<Legend />
						{config.series.map((s, i) => (
							<Pie
								key={s.key}
								data={config.data}
								dataKey={s.key}
								nameKey={config.xAxisKey}
								cx="50%"
								cy="50%"
								outerRadius={100}
								fill={s.color || COLORS[i % COLORS.length]}
								label
							>
								{config.data.map((_entry: any, index: number) => (
									<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
								))}
							</Pie>
						))}
					</PieChart>
				);
			default:
				return (
					<Text style={{ color: tokens.colorNeutralForeground2, textAlign: 'center', padding: tokens.spacingVerticalM }}>
						Unsupported chart type: {config.type}
					</Text>
				);
		}
	};

	return (
		<div className={styles.container}>
			{config.title && (
				<div className={styles.title}>{config.title}</div>
			)}
			{config.description && (
				<div className={styles.description}>{config.description}</div>
			)}
			<div className={styles.chartWrapper}>
				<ResponsiveContainer width="100%" height="100%">
					{renderChart()}
				</ResponsiveContainer>
			</div>
		</div>
	);
};
