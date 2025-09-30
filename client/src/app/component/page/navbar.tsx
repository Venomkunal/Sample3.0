'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/component/page/AuthContext';
import '@/app/styles/css/header.css';
import CartIcon from '@/app/component/cartitem/CartIcon';
import axios from 'axios';

// 🔹 Product type
type Product = {
  _id: string;
  name: string;
  price: number;
  category?: string | string[];
  description?: string;
  images?: string[];
};

// 🔹 API Category type (flat response)
type ApiCategory = {
  _id: string;
  title: string;
  slug: string;
  parent?: { _id: string } | null;
};

// 🔹 Category type (recursive with children)
type Category = ApiCategory & {
  children: Category[];
};

const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL;

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  // 🔹 search states
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 categories state
  const [categories, setCategories] = useState<Category[]>([]);

  // --------------------
  // Menu logic
  // --------------------
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    router.push('/login');
  };

  // --------------------
  // Fetch categories & build hierarchy
  // --------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, subsRes, subsubsRes] = await Promise.all([
          axios.get<ApiCategory[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`),
          axios.get<ApiCategory[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subcategories`),
          axios.get<ApiCategory[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subsubcategories`),
        ]);

        const cats: Category[] = catsRes.data.map((c) => ({ ...c, children: [] }));

        // attach subcategories
        subsRes.data.forEach((sub) => {
          const parentCat = cats.find((c) => c._id === sub.parent?._id);
          if (parentCat) {
            parentCat.children.push({ ...sub, children: [] });
          }
        });

        // attach sub-subcategories
        subsubsRes.data.forEach((ssub) => {
          const parentSub = subsRes.data.find((sub) => sub._id === ssub.parent?._id);
          if (parentSub) {
            const parentCat = cats.find((c) => c._id === parentSub.parent?._id);
            if (parentCat) {
              const subIndex = parentCat.children.findIndex((x) => x._id === parentSub._id);
              if (subIndex > -1) {
                parentCat.children[subIndex].children.push({ ...ssub, children: [] });
              }
            }
          }
        });

        setCategories(cats);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchData();
  }, []);

  // 🔹 Recursive renderer for categories
  const renderMenu = (cats: Category[]): JSX.Element => (
    <ul className="dropdown-menu">
      {cats.map((cat) => (
        <li key={cat._id}>
          <Link href={`/categories/${cat.slug}`} onClick={closeMobileMenu}>
            {cat.title}
          </Link>

          {cat.children && cat.children.length > 0 && (
            <ul className="submenu">
              {cat.children.map((child) => (
                <li key={child._id}>
                  <Link href={`/categories/${child.slug}`} onClick={closeMobileMenu}>
                    {child.title}
                  </Link>

                  {/* Recursive for deeper levels */}
                  {child.children && child.children.length > 0 && renderMenu(child.children)}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );

  // --------------------
  // Search logic
  // --------------------
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        setLoading(true);
        axios
          .get<Product[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/search?q=${query}`)
          .then((res) => setResults(res.data))
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/products/search?q=${query}`);
      setQuery('');
      setResults([]);
    }
  };

  // --------------------
  // JSX
  // --------------------
  return (
    <nav className="mainnav">
      <div className="mainnavdiv">
        {/* Logo */}
        <div className="mainnavdivlogo">
          <Link href="/">
            <Image
              className="img"
              src="/images/logo.png"
              alt="India Bazaar Guy"
              width={100}
              height={100}
              priority
            />
            <span>India Bazaar Guy</span>
          </Link>
        </div>

        {/* Hamburger */}
        <div className="hamburger" onClick={toggleMobileMenu}>
          ☰
        </div>

        {/* Cart (mobile) */}
        <div className="mnav-cart">
          <CartIcon />
        </div>

        {/* Profile (mobile) */}
        <div className="maccountslink">
          <Link href={isLoggedIn ? '/dashboard' : '/auth'} className="mprofile-icon">
            <Image src="/images/profile.png" alt="profile" width={60} height={60} />
          </Link>
        </div>

        {/* Cart (tablet/desktop) */}
        <div className="tnav-cart">
          <CartIcon />
        </div>
        <div className="taccountslink">
          <Link href={isLoggedIn ? '/dashboard' : '/auth'} className="tprofile-icon">
            <Image src="/images/profile.png" alt="profile" width={90} height={90} />
          </Link>
        </div>

        {/* 🔹 Searchbar with dropdown */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>

          {query && results.length > 0 && (
            <ul className="search-results">
              {results.map((item) => {
                const category =
                  Array.isArray(item.category) && item.category.length > 0
                    ? item.category[0]
                    : typeof item.category === 'string'
                    ? item.category.split(',')[0]
                    : 'search';
                return (
                  <li key={item._id}>
                    <Link
                      href={`/products/${category}/id/${item._id}`}
                      onClick={() => {
                        setQuery('');
                        setResults([]);
                      }}
                    >
                      <Image
                        src={
                          item.images && item.images.length > 0
                            ? `${uploadUrl}${item.images[0]}`
                            : '/images/placeholder.png'
                        }
                        alt={item.name}
                        width={40}
                        height={40}
                      />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {loading && <p className="loading">Searching...</p>}
          {query && !loading && results.length === 0 && (
            <p className="no-results">No products found</p>
          )}
        </div>

        {/* Navigation Links */}
        <div className={`Horizontalnavbar ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link href="/" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/categories" onClick={closeMobileMenu}>
                Categories
              </Link>
              {renderMenu(categories)}
            </li>
            <li>
              <Link href="/aboutus" onClick={closeMobileMenu}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contactus" onClick={closeMobileMenu}>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Cart (desktop) */}
        <div className="nav-cart">
          <CartIcon />
        </div>

        {/* Auth Links */}
        <div className="account-links">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard">
                <Image src="/images/profile.png" alt="profile" width={40} height={40} />
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={closeMobileMenu}>
                <button className="login">Log In</button>
              </Link>
              <Link href="/signup" onClick={closeMobileMenu}>
                <button className="signup">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
