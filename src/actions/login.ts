'use server';

import { signIn } from '@/auth';
import { getUserByEmail } from '@/data/user';
import { sendVerificationEmail } from '@/lib/mail';
import { generateVerificationToken } from '@/lib/tokens';
import { DEFAULT_URL_WHEN_LOGGED_IN } from '@/routes';
import { LoginSchema } from '@/schemas';
import { AuthError } from 'next-auth';
import * as z from 'zod';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }
  
  const { email, password } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist!' };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: 'Confirmation email sent!' };
  }


  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_URL_WHEN_LOGGED_IN
    });
  } catch (e) {
    if (e instanceof AuthError) {
      switch (e.type) {
        case 'AccessDenied': return { error: 'Email not verified' };
        case 'CallbackRouteError': return { error: 'User does not exist' };
        case 'CredentialsSignin': return { error: 'Invalid credentials' };
        default: return { error: 'Something went wrong' };
      }
    }
    throw e;
  }
};
