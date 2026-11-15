import { useEffect } from "react";
import Home from "./pages/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import "./App.css";

const routes = {
  "/": { component: Home, title: "A fresh perspective on living" },
  "/products": { component: Products, title: "Furniture & finishes" },
  "/about": { component: About, title: "About us" },
  "/contact": { component: Contact, title: "Contact us" },
};

export default function App() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const route = routes[path];
  const Page = route?.component;
  useEffect(() => {
    document.title = `Forma — ${route?.title || "Page not found"}`;
  }, [route]);
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <a className="wordmark" href="/" aria-label="Forma home">forma<span>®</span></a>
      <nav id="main-navigation" aria-label="Main navigation" className="nav-links">
        {[["/", "Home"], ["/products", "Products"], ["/about", "About us"], ["/contact", "Contact"]].map(([href, label]) => <a key={href} href={href} aria-current={path === href ? "page" : undefined}>{label}</a>)}
      </nav>
      <a href="/#studio" className="header-cta">Enter the studio <span aria-hidden="true">↗</span></a>
    </header>
    <div id="main-content" tabIndex="-1">
      {Page ? <Page /> : <main className="page-intro"><p className="eyebrow">404 / A LITTLE OFF THE PATH</p><h1>Let’s get you <em>home.</em></h1><a className="button button-dark" href="/">Back to Forma ↗</a></main>}
    </div>
    <footer className="company-footer">
      <div className="footer-brand"><a className="wordmark" href="/">forma<span>®</span></a><p>Thoughtful furniture.<br />A fresh perspective.</p></div>
      <div><span className="eyebrow">EXPLORE</span><a href="/products">The collection</a><a href="/#studio">Interactive studio</a></div>
      <div><span className="eyebrow">FORMA</span><a href="/about">About us</a><a href="/contact">Get in touch</a></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Forma · Design concept</span><a href="#main-content">Back to top ↑</a></div>
    </footer>
  </>;
}
