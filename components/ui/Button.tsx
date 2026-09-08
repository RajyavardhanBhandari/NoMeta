import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'quiet';
  icon?: 'arrow' | 'upload' | 'download' | 'check' | 'plus';
};

export function Button({ children, href, variant = 'primary', icon, className = '', ...props }: ButtonProps) {
  const classes = `nm-button nm-button--${variant} ${className}`;
  const content = <>{children}{icon && <Icon name={icon} size={17} />}</>;
  if (href) return <Link href={href} className={classes}>{content}</Link>;
  return <button className={classes} {...props}>{content}</button>;
}
