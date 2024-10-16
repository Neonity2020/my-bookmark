import { FC } from 'react';
import Link from 'next/link';

const Footer: FC = () => {
  return (
    <footer className="w-full border-t border-border/40 bg-background">
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto">
        <div className="flex flex-1">
          <p className="text-sm text-muted-foreground">
            © 2024 我的网址导航. 保留所有权利.
          </p>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
            隐私政策
          </Link>
          <Link href="/terms" className="text-muted-foreground hover:text-foreground">
            使用条款
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
