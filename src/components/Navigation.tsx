import { FC } from 'react';
import Link from 'next/link';
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  className?: string;
}

const Navigation: FC<NavigationProps> = ({ className }) => {
  return (
    <header className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between mx-auto">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 ml-4">
            <span className="font-bold">我的网址导航</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-2 text-sm font-medium">
            <Link href="/about">
              <Button variant="ghost">关于</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost">联系我们</Button>
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Navigation;
