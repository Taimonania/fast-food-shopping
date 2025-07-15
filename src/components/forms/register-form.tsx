'use client';

import { cn } from '@/registry/new-york-v4/lib/utils';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/registry/new-york-v4/ui/form';
import { Input } from '@/registry/new-york-v4/ui/input';
import { useAuthActions } from '@convex-dev/auth/react';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Registration form validation schema
const registerFormSchema = z
    .object({
        email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            ),
        confirmPassword: z.string().min(1, 'Please confirm your password')
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword']
    });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
    const { signIn } = useAuthActions();
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    async function onSubmit(values: RegisterFormValues) {
        try {
            // Use Convex Auth to register the user
            const formData = new FormData();
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('flow', 'signUp');

            await signIn('password', formData);

            console.log('Registration successful!');
        } catch (error) {
            console.error('Registration failed:', error);
            // In a real app, you'd show this error to the user
        }
    }

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>Enter your details below to create your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type='email' placeholder='m@example.com' {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            We'll use this email for your account and notifications.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type='password' placeholder='Enter your password' {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Must be at least 8 characters with uppercase, lowercase, and number.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='confirmPassword'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type='password' placeholder='Confirm your password' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Creating account...' : 'Create account'}
                            </Button>
                        </form>
                    </Form>
                    <div className='mt-4 text-center text-sm'>
                        Already have an account?{' '}
                        <a href='/login' className='underline underline-offset-4'>
                            Login
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
