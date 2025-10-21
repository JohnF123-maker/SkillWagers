import React from 'react';
import { Link } from 'react-router-dom';

const AppFooter = () => {
  return (
    <footer className="w-full border-t border-gray-700 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-400">
        <div className="flex flex-wrap items-center justify-center gap-1">
          <Link 
            to="/legal/terms-and-conditions" 
            className="hover:text-gray-200 transition-colors"
            aria-label="Terms and Conditions"
          >
            Terms & Conditions
          </Link>
          <span aria-hidden="true">·</span>
          <Link 
            to="/legal/privacy-policy" 
            className="hover:text-gray-200 transition-colors"
            aria-label="Privacy Policy"
          >
            Privacy Policy
          </Link>
          <span aria-hidden="true">·</span>
          <Link 
            to="/legal/terms-of-use" 
            className="hover:text-gray-200 transition-colors"
            aria-label="Terms of Use"
          >
            Terms of Use
          </Link>
          <span aria-hidden="true">·</span>
          <Link 
            to="/legal/responsible-gaming" 
            className="hover:text-gray-200 transition-colors"
            aria-label="Responsible Gaming Policy"
          >
            Responsible Gaming
          </Link>
          <span aria-hidden="true">·</span>
          <Link 
            to="/legal/data-collection" 
            className="hover:text-gray-200 transition-colors"
            aria-label="Data Collection Policy"
          >
            Data Collection
          </Link>
          <span aria-hidden="true">·</span>
          <Link 
            to="/legal/beta-testing-terms" 
            className="hover:text-gray-200 transition-colors"
            aria-label="Beta Testing Terms"
          >
            Beta Testing Terms
          </Link>
          <span aria-hidden="true">·</span>
          <Link 
            to="/contact" 
            className="hover:text-gray-200 transition-colors"
            aria-label="Contact Us"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;