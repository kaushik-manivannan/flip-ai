'use client'

import { FC } from "react";
import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import logo from "@/public/logo.svg";
import logoDark from "@/public/logo-dark.svg";

interface NavBarProps {
  showMainNav?: boolean;
}

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Contact', href: '#contact' },
]

const signedInNavigation = [
  { name: 'Create Flashcards', href: '/create' },
  { name: 'Saved Collections', href: '/collections' },
  { name: 'Pricing', href: '/pricing' },
]

const NavBar: FC<NavBarProps> = ({ showMainNav = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.startsWith('#')) {
      return false; // We're not highlighting hash links
    }
    // Remove leading slash from both href and pathname for comparison
    const cleanHref = href.replace(/^\//, '');
    const cleanPathname = pathname.replace(/^\//, '');
    return cleanPathname === cleanHref;
  };

  const linkClasses = (href: string) =>
    `text-sm font-semibold leading-6 ${
      isActive(href)
        ? 'text-primary'
        : 'text-gray-900 dark:text-foreground hover:text-primary transition-colors'
    }`;

  return (
    <>
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8 bg-primary-foreground dark:bg-primary-foreground w-full"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 rounded-full">
            <span className="sr-only">Flip AI</span>
            <Image
              className="hidden dark:block"
              src={logoDark}
              alt="dark-mode-image"
              width={40}
              height={40}
            />
            <Image
              className="mb-4 block dark:hidden"
              src={logo}
              alt="light-mode-image"
              width={40}
              height={40}
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6 mr-4 dark:text-foreground" />
          </button>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        <SignedOut>
          {showMainNav && (
            <div className="hidden lg:flex lg:gap-x-12 justify-between">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={linkClasses(item.href)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          )}
        </SignedOut>
        <SignedIn>
          <div className="hidden lg:flex lg:gap-x-12 justify-between">
            {signedInNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={linkClasses(item.href)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </SignedIn>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <SignedOut>
            <Link href="/sign-in" className="text-sm font-semibold leading-6 text-gray-900 mr-4 dark:text-foreground" passHref>
              Login
            </Link>
            <Link href="/sign-up" className="text-sm font-semibold leading-6 text-gray-900 dark:text-foreground" passHref>
              Sign Up
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

      {/* Dialog Box for Mobile Devices */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-background">
          <div className="flex items-center justify-between">
            <Link href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Flip AI</span>
              <Image
                className="hidden dark:block"
                src={logoDark}
                alt="dark-mode-image"
                width={40}
                height={40}
              />
              <Image
                className="mb-4 block dark:hidden"
                src={logo}
                alt="light-mode-image"
                width={40}
                height={40}
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6 dark:text-foreground" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10 dark:divide-foreground">
              <SignedOut>
                {showMainNav && (
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        onClick={() => setMobileMenuOpen(false)}
                        key={item.name}
                        href={item.href}
                        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                          isActive(item.href)
                            ? 'text-primary'
                            : 'text-gray-900 dark:text-foreground hover:bg-gray-50 dark:hover:bg-primary-foreground'
                        }`}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                )}
                <div className="py-6">
                  <Link
                    href="/sign-in"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-foreground dark:hover:bg-primary-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/sign-up"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-foreground dark:hover:bg-primary-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="space-y-2 py-6">
                  {signedInNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                        isActive(item.href)
                          ? 'text-primary'
                          : 'text-gray-900 dark:text-foreground hover:bg-gray-50 dark:hover:bg-primary-foreground'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SignedIn>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default NavBar;