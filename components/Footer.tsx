/* 

Footer component specifications. 
Adds a footer to the base of each page with links to resources,
including a contact page, a FAQ page, and to the Sterling Heights
official government website.

*/

/* Styling contained in FooterComp.module.css */


/* Imports */
import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const FooterComp = ({  }) => {
  return (
    <div className={styles.footer_links}>
      <p>

        {/* Internal link */}
        <Link href="/contact" className={styles.footer_link_text}>
            Contact
        </Link>

        <span className={styles.divider}>{" ∘ "}</span>

        {/* Internal link */}
        <Link href="/contact" className={styles.footer_link_text}>
            Contact
        </Link>

        <span className={styles.divider}>{" ∘ "}</span>


        {/* External link */}
        <a
          className={styles.footer_link_text}
          href="https://graham.umich.edu/project/renewable-energy-tax-impacts"
          target="_blank"
          rel="noopener noreferrer"
        >
          Center for EmPowering Communities
        </a>
      </p>
    </div>
  );
};

export default FooterComp;
