import React from "react";
import Link from "next/link";
import { FiLinkedin, FiGithub } from "react-icons/fi";
import Image from "next/image";
import logoDark from "@/public/logo-dark.svg";

// SVG Components as React Icons
const GithubIcon = () => <FiGithub className="w-6 h-6" />;
const LinkedInIcon = () => <FiLinkedin className="w-6 h-6" />;

type FooterProps = {};

const Footer = (props: FooterProps) => {
  // Common anchor styles
  const anchorStyles =
    "text-sm text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80 cursor-pointer";

  return (
    <section className="py-12 bg-gradient-to-r from-primary-foreground to-popover w-full" id="contact">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center xl:flex xl:items-center xl:justify-between xl:text-left">
          <div className="xl:flex xl:items-center xl:justify-start">
            <Link href="#hero">
              <Image
                className="w-auto mx-auto h-7"
                src={logoDark}
                alt="Flip AI Logo"
              />
            </Link>
            <p className="mt-5 text-md text-white xl:ml-6 xl:mt-0">
              © Copyright 2024 Flip AI
            </p>
          </div>

          <div className="items-center mt-8 xl:mt-0 xl:flex xl:justify-end xl:space-x-8">
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 xl:justify-end">
              <li>
                <Link href="#features">
                  <span className={anchorStyles}>Features</span>
                </Link>
              </li>
              <li>
                <Link href="#pricing">
                  <span className={anchorStyles}>Pricing</span>
                </Link>
              </li>
            </ul>

            <div className="w-full h-px mt-8 mb-5 xl:w-px xl:m-0 xl:h-6 bg-gray-50/20"></div>

            <ul className="flex items-center justify-center space-x-8 xl:justify-end">
              <li>
                <Link
                  href="https://www.linkedin.com/in/kaushik-manivannan/"
                  title="LinkedIn"
                  className="block text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedInIcon />
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/kaushik-manivannan"
                  title="GitHub"
                  className="block text-white transition-all duration-200 hover:text-opacity-80 focus:text-opacity-80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubIcon />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;