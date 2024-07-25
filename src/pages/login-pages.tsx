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
import Cookies from 'js-cookie'; // Add this line to import the js-cookie library

interface FormValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('https://studio-foto-backend.vercel.app/v1/auth/login', data);
      // Store tokens
      const { access, refresh } = response.data.tokens;
      localStorage.setItem('accessToken', JSON.stringify(access));
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      Cookies.set('refreshToken', JSON.stringify(refresh), { secure: true, httpOnly: true, sameSite: 'strict' });

      // Navigate to another page
      navigate('/dashboard'); // Replace with your desired route
      reset(); // Clear the form data
    } catch (error) {
      let errorMsg = 'An unexpected error occurred';
      if (error instanceof AxiosError) {
        errorMsg = error.response?.data.message || error.message;
      }
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="ml-auto inline-block text-sm underline" disabled={isSubmitting}>
                    Forgot your password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  disabled={isSubmitting}
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && <span className="text-red-500">{errors.password.message}</span>}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Button variant={"link"} className="underline" onClick={goToSignup} disabled={isSubmitting}>
              Sign up now
            </Button>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </>
  );
}
