// src/components/Footer.jsx
import Link from 'next/link';
import '@/app/styles/css/footer.css'; 
import Image from 'next/image';
const Footer = () => {
  return (
    <footer className="footerdiv">
      <div className="footer-container">
        <div className="footer-section about">
          <h2>About Us</h2>
          <div className="para">
            <p>We are a leading e-commerce platform offering a wide range of products at competitive prices. Our mission is to provide the best shopping experience for our customers.</p>
          </div>
        </div>
        
        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/aboutus">About Us</Link></li>
            <li><Link href="/contactus">Contact Us</Link></li>
            <li><Link href="/categories">Categories</Link></li>
            <li><Link href="/cart">Shopping Cart</Link></li>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/signup">Sign Up</Link></li>
          </ul>
        </div>
        
        <div className="footer-section contact">
          <h2>Contact Us</h2>
          <div className="contact">
            <strong className="bold">Email:</strong>
            <p>customerscare@indianbazaarguy.com</p>
            <strong className="bold">Phone:</strong>
            <p>+91 0123456789</p>
            <strong className="bold">Address:</strong>
            <p>Guwahati, Assam, India - 05</p>
          </div>
        </div>
        
        <div className="footer-section social">
          <h2 className='social-h2'>Follow Us</h2>
          <div className="social-links">
            <a href="https://www.facebook.com/profile.php?id=61571570876599" target="_blank" rel="noopener noreferrer">
              <Image src="/images/facebook.png"alt="Facebook"width={50} height={50} /> Facebook
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <Image src="/images/Twitter.png" alt="Twitter" width={50} height={50}/> Twitter
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <Image src="/images/instagram.png" alt="Instagram"width={50} height={50}  /> Instagram
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
              <Image src="/images/youtube.png" alt="YouTube" width={50} height={50} /> YouTube
            </a>
          </div>
        </div>
      </div>
    
      <div className="footer-bottom">
        <p>&copy; 2025 Indian Bazaar Guy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
