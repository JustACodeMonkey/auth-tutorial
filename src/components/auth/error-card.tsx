import { DEFAULT_URL_WHEN_NOT_LOGGED_IN } from '@/routes';
import { CardWrapper } from './card-wrapper';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref={DEFAULT_URL_WHEN_NOT_LOGGED_IN}
      backButtonLabel="Back to login"
    >
      <div className="flex justify-center items-center w-full">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
};
