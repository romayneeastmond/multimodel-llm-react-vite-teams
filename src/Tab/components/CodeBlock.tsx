import { useState } from 'react';
import { makeStyles, tokens, Button } from '@fluentui/react-components';
import { Copy24Regular, Checkmark24Regular } from '@fluentui/react-icons';

interface CodeBlockProps {
	code: string;
	language?: string;
}

const useStyles = makeStyles({
	container: {
		position: 'relative',
		marginTop: tokens.spacingVerticalM,
		marginBottom: tokens.spacingVerticalM,
		backgroundColor: tokens.colorNeutralBackground4,
		borderRadius: tokens.borderRadiusMedium,
		border: `1px solid ${tokens.colorBrandStroke2}`,
	},
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
		backgroundColor: tokens.colorNeutralBackground5,
		borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
		borderTopLeftRadius: tokens.borderRadiusMedium,
		borderTopRightRadius: tokens.borderRadiusMedium,
	},
	language: {
		fontSize: tokens.fontSizeBase200,
		fontWeight: tokens.fontWeightSemibold,
		color: tokens.colorNeutralForeground2,
		fontFamily: tokens.fontFamilyMonospace,
		textTransform: 'uppercase',
		letterSpacing: '0.5px',
	},
	copyButton: {
		minWidth: 'auto',
	},
	codeWrapper: {
		padding: tokens.spacingVerticalL,
		overflowX: 'auto',
	},
	code: {
		fontFamily: tokens.fontFamilyMonospace,
		fontSize: tokens.fontSizeBase300,
		lineHeight: '1.6',
		color: tokens.colorNeutralForeground1,
		whiteSpace: 'pre',
		margin: '0',
	},
});

export const CodeBlock = ({ code, language = 'code' }: CodeBlockProps) => {
	const styles = useStyles();
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy code:', err);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<span className={styles.language}>{language}</span>
				<Button
					appearance="subtle"
					size="small"
					icon={copied ? <Checkmark24Regular /> : <Copy24Regular />}
					onClick={handleCopy}
					className={styles.copyButton}
				>
					{copied ? 'Copied!' : 'Copy'}
				</Button>
			</div>
			<div className={styles.codeWrapper}>
				<pre className={styles.code}>{code}</pre>
			</div>
		</div>
	);
};
