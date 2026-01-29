import { useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { makeStyles, tokens } from '@fluentui/react-components';
import { ChartBlock } from './ChartBlock';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
	content: string;
	className?: string;
}

interface ChartData {
	id: string;
	content: string;
}

interface CodeBlockData {
	id: string;
	code: string;
	language: string;
}

const useStyles = makeStyles({
	markdown: {
		'& h1': {
			fontSize: tokens.fontSizeBase500,
			fontWeight: tokens.fontWeightSemibold,
			marginTop: tokens.spacingVerticalXL,
			marginBottom: tokens.spacingVerticalL,
			borderBottom: `2px solid ${tokens.colorNeutralStroke2}`,
			paddingBottom: tokens.spacingVerticalS,
		},
		'& h2': {
			fontSize: tokens.fontSizeBase400,
			fontWeight: tokens.fontWeightSemibold,
			marginTop: tokens.spacingVerticalXL,
			marginBottom: tokens.spacingVerticalL,
		},
		'& h3': {
			fontSize: tokens.fontSizeBase300,
			fontWeight: tokens.fontWeightSemibold,
			marginTop: tokens.spacingVerticalXL,
			marginBottom: tokens.spacingVerticalL,
		},
		'& p': {
			marginTop: '0',
			marginBottom: tokens.spacingVerticalM,
			lineHeight: '1.6',
		},
		'& ul, & ol': {
			marginTop: '0',
			marginBottom: tokens.spacingVerticalM,
			paddingLeft: tokens.spacingHorizontalXXL,
		},
		'& li': {
			marginBottom: tokens.spacingVerticalXS,
		},
		'& code': {
			backgroundColor: tokens.colorNeutralBackground3,
			padding: `${tokens.spacingVerticalXXS} ${tokens.spacingHorizontalXS}`,
			borderRadius: tokens.borderRadiusSmall,
			fontFamily: tokens.fontFamilyMonospace,
			fontSize: tokens.fontSizeBase200,
			color: tokens.colorPaletteBlueForeground2,
			border: `1px solid ${tokens.colorNeutralStroke3}`,
		},
		'& pre': {
			backgroundColor: tokens.colorNeutralBackground4,
			padding: tokens.spacingVerticalL,
			borderRadius: tokens.borderRadiusMedium,
			overflowX: 'auto',
			marginTop: tokens.spacingVerticalM,
			marginBottom: tokens.spacingVerticalM,
			border: `1px solid ${tokens.colorBrandStroke2}`,
			position: 'relative',
		},
		'& pre code': {
			backgroundColor: 'transparent',
			padding: '0',
			border: 'none',
			color: tokens.colorNeutralForeground1,
			fontSize: tokens.fontSizeBase300,
			lineHeight: '1.6',
		},
		'& blockquote': {
			borderLeft: `4px solid ${tokens.colorBrandStroke1}`,
			marginLeft: '0',
			marginRight: '0',
			paddingLeft: tokens.spacingHorizontalM,
			color: tokens.colorNeutralForeground2,
			fontStyle: 'italic',
		},
		'& table': {
			borderCollapse: 'collapse',
			width: '100%',
			marginTop: '0',
			marginBottom: tokens.spacingVerticalM,
			display: 'table',
		},
		'& thead': {
			display: 'table-header-group',
		},
		'& tbody': {
			display: 'table-row-group',
		},
		'& tr': {
			borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
			display: 'table-row',
		},
		'& th, & td': {
			border: `1px solid ${tokens.colorNeutralStroke2}`,
			padding: tokens.spacingVerticalS,
			textAlign: 'left',
			wordBreak: 'break-word',
			verticalAlign: 'top',
			minWidth: '100px',
		},
		'& th': {
			backgroundColor: tokens.colorNeutralBackground3,
			fontWeight: tokens.fontWeightSemibold,
		},
		'& a': {
			color: tokens.colorBrandForeground1,
			textDecoration: 'none',
			':hover': {
				textDecoration: 'underline',
			},
		},
		'& img': {
			maxWidth: '100%',
			height: 'auto',
			borderRadius: tokens.borderRadiusMedium,
		},
		'& hr': {
			border: 'none',
			borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
			marginTop: tokens.spacingVerticalL,
			marginBottom: tokens.spacingVerticalL,
		},
	},
});

marked.use({
	breaks: true,
	gfm: true,
});

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
	const styles = useStyles();
	const containerRef = useRef<HTMLDivElement>(null);
	const chartRootsRef = useRef<Map<string, Root>>(new Map());
	const codeRootsRef = useRef<Map<string, Root>>(new Map());

	useEffect(() => {
		const renderMarkdown = async () => {
			if (!containerRef.current) return;

			try {
				let processedContent = content;
				const charts: ChartData[] = [];
				const codeBlocks: CodeBlockData[] = [];

				const chartRegex = /```(?:chart|json-chart)\s*\n([\s\S]*?)```/g;
				processedContent = processedContent.replace(chartRegex, (_match, chartContent) => {
					const chartId = `chart-${charts.length}`;
					charts.push({
						id: chartId,
						content: chartContent.trim()
					});
					return `<div data-chart-id="${chartId}"></div>`;
				});

				const codeRegex = /```(\w+)?\s*\n([\s\S]*?)```/g;
				processedContent = processedContent.replace(codeRegex, (_match, lang, codeContent) => {
					const codeId = `code-${codeBlocks.length}`;
					codeBlocks.push({
						id: codeId,
						code: codeContent.trim(),
						language: lang || 'code'
					});
					return `<div data-code-id="${codeId}"></div>`;
				});

				const rawHtml = await marked.parse(processedContent);

				const cleanHtml = DOMPurify.sanitize(rawHtml, {
					ADD_ATTR: ['target', 'data-chart-id', 'data-code-id'],
				});
				containerRef.current.innerHTML = cleanHtml;

				charts.forEach((chart) => {
					const placeholder = containerRef.current?.querySelector(`[data-chart-id="${chart.id}"]`);
					if (placeholder) {
						const existingRoot = chartRootsRef.current.get(chart.id);
						if (existingRoot) {
							existingRoot.unmount();
						}
						const root = createRoot(placeholder);
						root.render(<ChartBlock codeContent={chart.content} />);
						chartRootsRef.current.set(chart.id, root);
					}
				});

				codeBlocks.forEach((codeBlock) => {
					const placeholder = containerRef.current?.querySelector(`[data-code-id="${codeBlock.id}"]`);
					if (placeholder) {
						const existingRoot = codeRootsRef.current.get(codeBlock.id);
						if (existingRoot) {
							existingRoot.unmount();
						}

						const root = createRoot(placeholder);
						root.render(<CodeBlock code={codeBlock.code} language={codeBlock.language} />);
						codeRootsRef.current.set(codeBlock.id, root);
					}
				});
			} catch (error) {
				console.error('Error rendering markdown:', error);

				if (containerRef.current) {
					containerRef.current.textContent = content;
				}
			}
		};

		renderMarkdown();

		return () => {
			chartRootsRef.current.forEach((root) => {
				root.unmount();
			});
			chartRootsRef.current.clear();

			codeRootsRef.current.forEach((root) => {
				root.unmount();
			});
			codeRootsRef.current.clear();
		};
	}, [content]);

	return (
		<div
			ref={containerRef}
			className={`${styles.markdown} ${className || ''}`}
		/>
	);
};
