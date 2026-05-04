import type { InputHTMLAttributes } from 'react';
import { Controller, type Control, type FieldPath, type FieldValues, type RegisterOptions } from 'react-hook-form';

type InputProps<TFieldValues extends FieldValues> = {
	name: FieldPath<TFieldValues>;
	control: Control<TFieldValues>;
	label: string;
	rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
	containerClassName?: string;
	labelClassName?: string;
	inputClassName?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'defaultValue'>;

export function Input<TFieldValues extends FieldValues>({
	name,
	control,
	label,
	rules,
	containerClassName = '',
	labelClassName = '',
	inputClassName = '',
	id,
	...inputProps
}: InputProps<TFieldValues>) {
	const inputId = id ?? String(name);

	return (
		<div className={`flex flex-col gap-1 ${containerClassName}`.trim()}>
			<label htmlFor={inputId} className={`text-sm font-medium text-slate-700 ${labelClassName}`.trim()}>
				{label}
			</label>

			<Controller
				name={name}
				control={control}
				rules={rules}
				render={({ field, fieldState }) => (
					<>
						<input
							{...field}
							{...inputProps}
							id={inputId}
							value={field.value ?? ''}
							className={[
								'w-full rounded-md border px-3 py-2 text-sm text-slate-900 outline-none transition',
								'placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200',
								fieldState.error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-300',
								inputClassName,
							]
								.filter(Boolean)
								.join(' ')}
						/>

						{fieldState.error?.message ? (
							<span className="text-xs text-red-600">{String(fieldState.error.message)}</span>
						) : null}
					</>
				)}
			/>
		</div>
	);
}

export default Input;
