/**
 * Form Component
 * Wrapper component for react-hook-form integration
 */

import { FormHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const Form = ({ children, className, onSubmit, ...props }: FormProps) => {
  return (
    <form
      className={cn('space-y-4', className)}
      onSubmit={onSubmit}
      {...props}
    >
      {children}
    </form>
  );
};

