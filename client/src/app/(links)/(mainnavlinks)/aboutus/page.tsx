import Link from "next/link";
import "@/app/styles/pages/aboutus.css";
// import { Metadata } from "next";
export const metadata  = {
  title: "About Us - Indian Bazaar Guy",
  description: "Learn about Indian Bazaar Guy, our mission, values, and how we are transforming online shopping.",
  keywords: "about us, Indian Bazaar Guy, online shopping, e-commerce, company story, mission, values",
}
export default function aboutUs() {
  return (
    <div id="aboutus" className="aboutus">
    <div className="hero">
    <h1>Shop Smarter. Live Better.</h1>
    <p>Discover how Indian Bazaar Guy  is transforming the way you shop online.</p>
  </div>

  <div className="section">
    <h2>Our Story</h2>
    <p>Launched in 2024, Indian Bazaar Guy  was created to make online shopping simple, fun, and reliable. From day one, our goal has been to provide a seamless shopping experience with top-quality products and unbeatable service.</p>
    <ul className="milestones">
      <li><strong>2024:</strong> Indian Bazaar Guy is born – starting with 100 products.</li>
      {/* <li><strong>2021:</strong> Reached 1 million orders and launched mobile app.</li> */}
      {/* <li><strong>2023:</strong> Expanded to international shipping in over 20 countries.</li> */}
    </ul>
  </div>

  <div className="section">
    <h2>What Drives Us</h2>
    <div className="values">
      <div className="value-box">
        <h3>Customer First</h3>
        <p>We’re here to serve you with personalized service and satisfaction guaranteed.</p>
      </div>
      <div className="value-box">
        <h3>Quality Products</h3>
        <p>Every product is handpicked and quality-checked by our team.</p>
      </div>
      <div className="value-box">
        <h3>Fast Delivery</h3>
        <p>We deliver your orders quickly and reliably, anywhere in the world.</p>
      </div>
    </div>
  </div>

  <div className="cta">
    {/* <h2>Join Over 2 Million Happy Shoppers</h2>  */}
    <Link href="/">Start Shopping Now</Link>
  </div>
    </div>
  );
};