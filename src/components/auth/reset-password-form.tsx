'use client';

import { CardWrapper } from './card-wrapper';
import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import * as z from 'zod';
import { ResetPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { FormError } from '../form/form-error';
import { FormSuccess } from '../form/form-success';
import { resetPassword } from '@/actions/reset-password';

export const ResetPasswordSchemaForm = () => {

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => startTransition(() => {
    setError('');
    setSuccess('');

    resetPassword(values).then(data => {
      setError(data?.error);
      setSuccess(data?.success);
    });
  });

  return (
    <CardWrapper
      headerLabel='Forgot your password?'
      backButtonLabel="Back to login"
      backButtonHref="/login"
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
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full"
          >
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
