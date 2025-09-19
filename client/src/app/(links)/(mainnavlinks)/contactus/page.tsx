import { Metadata } from 'next';
import Image from 'next/image';
import '@/app/styles/pages/Contactus.css';

export const metadata: Metadata = {
  title: 'Contact Us',
};

export default function ContactUs() {
  return (
    <>
      <section className="contact-formsection">
        <form method="post" action="" id="contactForm" className="contact-form">
          <h2>Contact Us</h2>

          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />

          <label htmlFor="subject">Subject:</label>
          <input type="text" id="subject" name="subject" required />

          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" rows={5} required></textarea>

          <input type="submit" value="Send Message" className="submit-button" />
        </form>
      </section>

      <section className="register-office">
        <div className="para">
          <h1>Registered Office</h1>
          <div className="map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3190.850525886796!2d91.79089951323897!3d26.144302078764568!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a5920d81832c1%3A0xb1de20388dded973!2sAssam%20Secretariat!5e0!3m2!1sen!2sin!4v1747285074431!5m2!1sen!2sin"
              width="490"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      <section className="contact-infosection">
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p>If you have any questions or need further assistance, feel free to reach out to us:</p>
          <p><strong>Phone:</strong> +91 0123456789</p>
          <p><strong>Email:</strong> customerscare@indianbazaarguy</p>
          <p><strong>Address:</strong> Guwahati, Assam, India - 05</p>
          <p><strong>Business Hours:</strong> Monday to Friday, 9 AM - 6 PM</p>
          <p>We look forward to hearing from you!</p>

          <p><strong>Follow us on social media:</strong></p>
          <ul className="social-media">
            <li>
              <a href="https://www.facebook.com/indianbazaarguy" target="_blank" rel="noopener noreferrer">
                <Image src="/images/facebook.png" alt="Facebook" width={20} height={20} /> Facebook
              </a>
            </li>
            <li>
              <a href="https://twitter.com/indianbazaarguy" target="_blank" rel="noopener noreferrer">
                <Image src="/images/Twitter.png" alt="Twitter" width={20} height={20} /> Twitter
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/indianbazaarguy" target="_blank" rel="noopener noreferrer">
                <Image src="/images/Instagram.png" alt="Instagram" width={20} height={20} /> Instagram
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                <Image src="/images/youtube.png" alt="YouTube" width={20} height={20} /> LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="bottom">
        <div></div>
      </section>
    </>
  );
}
