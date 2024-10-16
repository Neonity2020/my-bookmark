import NextLink from 'next/link';
import { AnchorHTMLAttributes, forwardRef } from 'react';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  external?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, external = false, children, ...props }, ref) => {
    if (external || href.startsWith('http') || href.startsWith('//')) {
      return (
        <a
          ref={ref}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <NextLink href={href} passHref legacyBehavior>
        <a ref={ref} {...props}>
          {children}
        </a>
      </NextLink>
    );
  }
);

Link.displayName = 'Link';

export default Link;
