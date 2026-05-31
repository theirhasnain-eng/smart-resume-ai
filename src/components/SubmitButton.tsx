'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({
  children,
  className = 'btn-gradient w-full py-2',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? (
        <>
          <i className="fa-solid fa-spinner fa-spin me-2" />
          Please wait…
        </>
      ) : (
        children
      )}
    </button>
  );
}
