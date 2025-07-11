import { Button, ButtonProps, cn } from "@heroui/react";

import type { ReactNode } from "react";

interface IQuizOptionButtonProps extends ButtonProps {
	children: ReactNode;
	onPress?: () => void;
	optionAnswer: string;
	selectedAnswer: string;
	optionText: string;
}

export function QuizOptionButton({ children, onPress, optionAnswer, selectedAnswer, optionText, className }: IQuizOptionButtonProps) {
	return <Button
		color="primary"
		variant="ghost"
		className={cn(
			"data-[hover=true]:!bg-transparent data-[hover=true]:!opacity-100 data-[hover=true]:!text-black",
			"w-9/12 border-black text-black",
			"active:outline-none text-lg",
			selectedAnswer && optionText === optionAnswer
				? "bg-green-500 border-green-500 data-[hover=true]:!bg-green-500"
				: selectedAnswer === optionText &&
						selectedAnswer !== optionAnswer &&
						"!bg-red-400 !border-red-400 data-[hover=true]:!bg-red-400",
			className || ""
		)}
		onPress={() => {
			if (onPress) {
				onPress();
			}
		}}
		disableAnimation
	>
		{children}
	</Button>
}