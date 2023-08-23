/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import Image from 'next/image';
import { NextPage } from 'next';

const Custom404: NextPage = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="image-container">
          <Image 
            src="/2572631.png" 
            alt="404 Illustration" 
            width={250}
            height={250}
          />
        </div>
        <h1 className="error-title">404</h1>
        <p className="error-description">Oops! Page Not Found</p>
        
        <div className="button-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <Link legacyBehavior href="/">
            <a className="error-button" style={{ fontWeight: 'bold', textAlign: 'center', padding: '10px 20px', width: '200px' }}>Go to Home Page</a>
          </Link>
          <Link legacyBehavior href="/blogs">
            <a className="error-button" style={{ fontWeight: 'bold', textAlign: 'center', padding: '10px 20px', width: '200px' }}>Go To Blogs</a>
          </Link>
        </div>
        <p className="contact-feedback-description">
        Can't find what you're looking for? <br/> 
        Found a broken link or have any feedback?
        <br/>
        Contact me on <Link legacyBehavior href="https://www.linkedin.com/in/kazaz-or/">
        <a target="_blank" rel="noopener noreferrer" className="linkedin-link">LinkedIn</a>
        </Link>.
        </p>
      </div>
    </div>
  );
}

export default Custom404;