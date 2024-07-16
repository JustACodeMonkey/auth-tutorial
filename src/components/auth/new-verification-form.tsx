'use client';

import { CardWrapper } from './card-wrapper';
import { BeatLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { newVerification } from '@/actions/new-verification';
import { FormSuccess } from '../form/form-success';
import { FormError } from '../form/form-error';

export const NewVerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError('Missing token!');
      return;
    }

    newVerification(token)
      .then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      })
      .catch(() => setError('Something went wrong!'));
  }, [token, success, error]);

  useEffect(() => onSubmit(), [onSubmit]);

  return (
    <CardWrapper
      headerLabel='Confirming your verification'
      backButtonHref='/login'
      backButtonLabel='Back to login'
    >
      <div className="flex items-center justify-center w-full">
        {!success && !error && (
          <BeatLoader />
        )}
        <FormSuccess message={success} />
        {!success && (
          <FormError message={error} />
        )}
      </div>
    </CardWrapper>
  )
};
