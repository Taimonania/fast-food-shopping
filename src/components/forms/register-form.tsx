import { cn } from '@/registry/new-york-v4/lib/utils';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Input } from '@/registry/new-york-v4/ui/input';
import { Label } from '@/registry/new-york-v4/ui/label';

export function RegisterForm({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>Enter your email and password to register</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className='flex flex-col gap-6'>
                            <div className='grid gap-3'>
                                <Label htmlFor='email'>Email</Label>
                                <Input id='email' type='email' placeholder='m@example.com' required />
                            </div>
                            <div className='grid gap-3'>
                                <Label htmlFor='password'>Password</Label>
                                <Input id='password' type='password' required />
                            </div>
                            <Button type='submit' className='w-full'>
                                Register
                            </Button>
                        </div>
                        <div className='mt-4 text-center text-sm'>
                            Already have an account?{' '}
                            <a href='/login' className='underline underline-offset-4'>
                                Login
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
