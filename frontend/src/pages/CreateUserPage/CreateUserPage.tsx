import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import type { CreateUserRequestDto } from '../../lib/api/userApi/dto/request'
import { userApi } from '../../lib/api/userApi/userApi'

const createUserSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email address'),
})

type FormValues = z.infer<typeof createUserSchema>

function CreateUserPage() {
	const [loading, setLoading] = useState(false)
	const [serverMessage, setServerMessage] = useState('')
	const [serverError, setServerError] = useState('')
	const {
		register,
		handleSubmit,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm<FormValues>({
		mode: 'onTouched',
	})

	const onSubmit = async (data: FormValues) => {
		setServerMessage('')
		setServerError('')
		clearErrors()

		const validationResult = createUserSchema.safeParse(data)
		if (!validationResult.success) {
			validationResult.error.issues.forEach((err) => {
				const field = err.path[0] as keyof FormValues | undefined
				if (field) {
					setError(field, { type: 'manual', message: err.message })
				}
			})
			return
		}

		setLoading(true)
		try {
			const dto: CreateUserRequestDto = { name: data.name, email: data.email }
			const response = await userApi.createUserRaw(dto)

			if (response.status >= 200 && response.status < 300) {
				setServerMessage(response.data.message)
				return
			}

			setServerError(response.data.message || 'Failed to create user')
		} catch (err) {
			setServerError(err instanceof Error ? err.message : 'Failed to create user')
		} finally {
			setLoading(false)
		}
	}

	return (
		<section className="route-card p-2.5">
			<h1 className="mb-6 text-3xl font-bold text-gray-900">Create user</h1>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
				<div>
					<label className="block text-sm font-medium text-gray-700">Name</label>
					<input
						{...register('name')}
						className="mt-1 block w-full rounded border p-2"
						placeholder="Full name"
						disabled={loading}
					/>
					{errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">Email</label>
					<input
						{...register('email')}
						className="mt-1 block w-full rounded border p-2"
						placeholder="email@example.com"
						disabled={loading}
					/>
					{errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
				</div>

				<div>
					<button
						type="submit"
						className="inline-flex cursor-pointer items-center rounded bg-blue-600 px-4 py-2 text-white"
						disabled={loading}
					>
						{loading ? 'Creating…' : 'Create user'}
					</button>
				</div>

				{serverMessage && <p className="text-green-700 text-sm">{serverMessage}</p>}
				{serverError && <p className="text-red-600 text-sm">{serverError}</p>}
			</form>
		</section>
	)
}

export default CreateUserPage
