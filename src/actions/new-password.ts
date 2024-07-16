'use server';

import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { getUserByEmail } from '@/data/user';
import { NewPasswordSchema } from '@/schemas';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  if (!token) return { error: 'Missing token!' };

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) return { error: 'Invalid password!' };

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) return { error: 'Invalid token!' };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: 'Token has expired!' };

  const exisistingUser = await getUserByEmail(existingToken.email);
  if (!exisistingUser) return { error: 'Email does not exist!' };

  const { password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: {
      id: exisistingUser.id
    },
    data: {
      password: hashedPassword
    }
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id
    }
  });

  return { success: 'Password updated' };
};
