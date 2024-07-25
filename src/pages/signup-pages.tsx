import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Cookies from 'js-cookie';

interface FormValues {
    email: string;
    username: string;
    password: string;
}

export function SignupForm() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('https://studio-foto-backend.vercel.app/v1/auth/register', data);
            console.log('Signup successful:', response.data);
            toast({
                title: "Signup successful",
                description: "Your account has been created successfully",
            });

            // Store tokens
            const { access, refresh } = response.data.tokens;
            localStorage.setItem('accessToken', JSON.stringify(access));
            Cookies.set('refreshToken', JSON.stringify(refresh), { secure: true, httpOnly: true, sameSite: 'strict' });
            localStorage.setItem('userData', JSON.stringify(response.data.user));
            // Navigate to the dashboard or login page
            navigate('/dashboard'); // You can redirect to the dashboard or login page
            reset(); // Clear the form data
        } catch (error) {
            let errorMsg = 'An unexpected error occurred';
            if (error instanceof AxiosError) {
                errorMsg = error.response?.data.message || error.message;
            }
            toast({
                variant: "destructive",
                title: "Signup failed",
                description: errorMsg,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <><Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Sign Up</CardTitle>
                <CardDescription>
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                disabled={isSubmitting}
                                {...register("email", { required: "Email is required" })}
                            />
                            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                placeholder="username"
                                disabled={isSubmitting}
                                {...register("username", { required: "Username is required" })}
                            />
                            {errors.username && <span className="text-red-500">{errors.username.message}</span>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="password"
                                disabled={isSubmitting}
                                {...register("password", { required: "Password is required" })}
                            />
                            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Signing up..." : "Sign Up"}
                        </Button>
                    </div>
                </form>
                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Button variant={"link"} className="underline" onClick={goToLogin}>
                        Login now
                    </Button>
                </div>
            </CardContent>
        </Card>
            <Toaster />
        </>

    );
}
