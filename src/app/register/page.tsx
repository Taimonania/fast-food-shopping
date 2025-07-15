import { RegisterForm } from '@/components/forms/register-form';

const RegisterPage = () => {
    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50'>
            <div className='w-full max-w-md'>
                <RegisterForm />
            </div>
        </div>
    );
};

export default RegisterPage;
