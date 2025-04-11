import clsx from 'clsx';
import { useRef, useState } from 'react';

import { Select } from 'src/ui/select';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';

import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose';

import styles from './ArticleParamsForm.module.scss';

import {
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	ArticleStateType,
} from 'src/constants/articleProps';

type Props = {
	isOpen: boolean;
	onToggle: () => void;
	mainRef: React.RefObject<HTMLElement>;
};

export const ArticleParamsForm = ({ isOpen, onToggle, mainRef }: Props) => {
	const [formState, setFormState] =
		useState<ArticleStateType>(defaultArticleState);

	const asideRef = useRef<HTMLElement>(null);

	useOutsideClickClose({
		isOpen,
		rootRef: asideRef,
		onClose: onToggle,
		onChange: () => {},
	});

	const updateState = <K extends keyof ArticleStateType>(
		key: K,
		value: ArticleStateType[K]
	) => {
		setFormState((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const applyStyles = (state: ArticleStateType) => {
		const root = mainRef.current;
		if (!root) return;

		root.style.setProperty('--font-family', state.fontFamilyOption.value);
		root.style.setProperty('--font-size', state.fontSizeOption.value);
		root.style.setProperty('--font-color', state.fontColor.value);
		root.style.setProperty('--bg-color', state.backgroundColor.value);
		root.style.setProperty('--container-width', state.contentWidth.value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		applyStyles(formState);
		onToggle();
	};

	const handleReset = () => {
		setFormState(defaultArticleState);
		applyStyles(defaultArticleState);
	};

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={onToggle} />
			<aside
				ref={asideRef}
				className={clsx(styles.container, {
					[styles.container_open]: isOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>

					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={(option) => updateState('fontFamilyOption', option)}
					/>

					<RadioGroup
						title='Размер шрифта'
						name='font-size'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={(option) => updateState('fontSizeOption', option)}
					/>

					<Select
						title='Цвет текста'
						options={fontColors}
						selected={formState.fontColor}
						onChange={(option) => updateState('fontColor', option)}
					/>

					<Separator />

					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={(option) => updateState('backgroundColor', option)}
					/>

					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={(option) => updateState('contentWidth', option)}
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
