'use client';

import { CardWrapper } from './card-wrapper';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import * as z from 'zod';
import { NewPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { FormError } from '../form/form-error';
import { FormSuccess } from '../form/form-success';
import { newPassword } from '@/actions/new-password';
import { useSearchParams } from 'next/navigation';

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: ''
    }
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => startTransition(() => {
    setError('');
    setSuccess('');

    newPassword(values, token).then(data => {
      setError(data?.error);
      setSuccess(data?.success);
    });
  });

  return (
    <CardWrapper
      headerLabel='Reset your password?'
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
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
                      placeholder="********"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full"
          >
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
