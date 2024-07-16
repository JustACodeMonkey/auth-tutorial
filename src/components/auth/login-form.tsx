'use client';

import { CardWrapper } from './card-wrapper';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import * as z from 'zod';
import { LoginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { FormError } from '../form/form-error';
import { FormSuccess } from '../form/form-success';
import { login } from '@/actions/login';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error') === 'OAuthAccountNotLinked'
    ? 'Email in use with a different provider'
    : '';

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => startTransition(() => {
    setError('');
    setSuccess('');

    login(values).then(data => {
      setError(data?.error);
      setSuccess(data?.success);
    });
  });

  return (
    <CardWrapper
      headerLabel='Welcome back'
      backButtonLabel="Don't have an account?"
      backButtonHref="/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <Button
                    size="sm"
                    variant="link"
                    asChild
                    className="px-0 font-normal"
                  >
                    <Link href="/reset-password">Forgot password</Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error || urlError} />
          <FormSuccess message={success} />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full"
          >
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
