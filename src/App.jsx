import { useState } from "react";
import Modal from "./sections/hero/Modal";
import "./App.css";

const finishes = [
  { name: "Espresso", color: "#45372f" },
  { name: "Oat", color: "#c7b49a" },
  { name: "Moss", color: "#66715b" },
];
const rooms = [
  { title: "A softer place to land.", category: "Living spaces", image: "carousel-1.jpg", text: "Layered textures. Quiet tones. Room to unwind." },
  { title: "Good company starts here.", category: "Dining spaces", image: "feature-2.jpg", text: "Thoughtful pieces for everyday rituals." },
  { title: "Make room for your ideas.", category: "Personal spaces", image: "carousel-3.jpg", text: "A little character in every corner." },
];
const Arrow = () => <span aria-hidden="true">↗</span>;

export default function App() {
  const [finish, setFinish] = useState(finishes[0]);
  const [rotating, setRotating] = useState(true);
  const [reset, setReset] = useState(0);
  const [room, setRoom] = useState(0);
  const [menu, setMenu] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Forma home">forma<span>®</span></a>
        <nav aria-label="Main navigation" className={menu ? "nav-links is-open" : "nav-links"}>
          <a href="#collection" onClick={() => setMenu(false)}>The collection</a>
          <a href="#philosophy" onClick={() => setMenu(false)}>Our perspective</a>
          <a href="#spaces" onClick={() => setMenu(false)}>Spaces & stories</a>
        </nav>
        <a href="#studio" className="header-cta">Enter the studio <Arrow /></a>
        <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? "Close" : "Menu"}</button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow"><span className="small-dot" /> OBJECTS WITH INTENTION</p>
            <h1>Good design.<br />Better <em>living.</em></h1>
            <p className="hero-description">Furniture with a sense of purpose.<br />Made to feel like you.</p>
            <a className="button button-dark" href="#collection">Find your next favorite <Arrow /></a>
            <div className="hero-note"><span className="note-line" /><p>Considered forms.<br />Everyday possibilities.</p></div>
          </div>
          <div className="hero-showcase" id="studio">
            <div className="showcase-top"><span>THE INTERACTIVE EDIT</span><span className="live-label"><span className="small-dot" /> LIVE 3D</span></div>
            <span className="showcase-word" aria-hidden="true">a new angle.</span>
            <div className="chair-shadow" />
            <Modal color={finish.color} rotating={rotating} resetKey={reset} />
            <div className="viewer-hint"><span aria-hidden="true">⟷</span> Drag to discover every angle</div>
            <div className="viewer-controls">
              <button aria-label={rotating ? "Pause chair rotation" : "Start chair rotation"} aria-pressed={rotating} onClick={() => setRotating(!rotating)}>{rotating ? "Ⅱ" : "▷"}</button>
              <button aria-label="Reset chair view" onClick={() => setReset(reset + 1)}>↺</button>
            </div>
            <div className="product-bar">
              <div><p className="eyebrow">THE CHAIR STUDY / 01</p><h2>Every angle. Yours.</h2></div>
              <div className="finish-selector"><span aria-live="polite">{finish.name}</span><div className="swatches">{finishes.map((item) => <button key={item.name} style={{ "--swatch": item.color }} className={finish.name === item.name ? "swatch selected" : "swatch"} aria-label={`Preview ${item.name} finish`} aria-pressed={finish.name === item.name} onClick={() => setFinish(item)} />)}</div></div>
            </div>
          </div>
          <div className="hero-bottom"><span>DESIGNED TO BE LIVED WITH.</span><a href="#collection">A little more to explore <span aria-hidden="true">↓</span></a><span>01 — 03</span></div>
        </section>

        <section className="collection section-space" id="collection">
          <div className="section-heading"><div><p className="eyebrow">01 / THE CONSIDERED COLLECTION</p><h2>A feeling called <em>home.</em></h2></div><p>Not just a room. A reflection of you.<br />Explore a few ways to make it your own.</p></div>
          <div className="collection-grid">{rooms.map((item, index) => <a key={item.category} href="#spaces" className="collection-card" onClick={() => setRoom(index)}><div className="card-image"><img src={`/assets/images/${item.image}`} alt={item.category === "Dining spaces" ? "Warm dining area with wood furniture" : item.category === "Living spaces" ? "Comfortable furnished living room" : "An inviting interior with considered furniture"} loading="lazy" /><span className="image-number">0{index + 1}</span><span className="round-arrow"><Arrow /></span></div><div className="card-title"><h3>{item.category}</h3><span>Explore the mood</span></div></a>)}</div>
        </section>

        <section className="philosophy" id="philosophy"><div className="philosophy-image"><img src="/assets/images/feature-2.jpg" alt="Furniture materials and interior details" loading="lazy" /><span className="image-caption">THE BEAUTY IS IN THE DETAILS.</span></div><div className="philosophy-copy"><p className="eyebrow">02 / LESS, BUT MORE MEANINGFUL</p><h2>More than a piece.<br />Part of your <em>everyday.</em></h2><p>We believe a space comes together through the things you choose to keep. A favorite seat. A shared table. That one quiet corner.</p><p>Our perspective is simple: thoughtful shapes, tactile materials, and room for life to happen.</p><a className="text-link" href="#studio">Get closer to the design <Arrow /></a><div className="design-values"><span>01<br /><strong>Considered form</strong></span><span>02<br /><strong>Tactile character</strong></span><span>03<br /><strong>Everyday comfort</strong></span></div></div></section>

        <section className="spaces section-space" id="spaces"><div className="section-heading"><div><p className="eyebrow">03 / ROOM FOR INSPIRATION</p><h2>Your space. A new <em>perspective.</em></h2></div><div className="room-tabs" aria-label="Room inspiration">{rooms.map((item, index) => <button key={item.category} aria-pressed={room === index} className={room === index ? "active" : ""} onClick={() => { setRoom(index); setSaved(false); }}>{item.category.split(" ")[0]}</button>)}</div></div><div className="room-feature"><img key={rooms[room].image} src={`/assets/images/${rooms[room].image}`} alt={`${rooms[room].category} inspiration`} loading="lazy" /><div className="room-overlay"><p className="eyebrow">THE {rooms[room].category.toUpperCase()} EDIT</p><h3>{rooms[room].title}</h3><p>{rooms[room].text}</p><button className="button button-light" aria-pressed={saved} onClick={() => setSaved(!saved)}>{saved ? "Mood saved for this visit ✓" : "Save this mood ♡"}</button></div><span className="room-count">0{room + 1} / 03</span></div><p className="concept-note">An exploration of spaces and finishes. The 3D color study is illustrative.</p></section>
        <section className="closing"><p className="eyebrow">A DIFFERENT WAY TO SEE YOUR SPACE</p><h2>Make yourself <em>at home.</em></h2><a className="button button-dark" href="#studio">Play with the possibilities <Arrow /></a></section>
      </main>
      <footer><a className="wordmark" href="#home">forma<span>®</span></a><p>Thoughtful furniture. A fresh perspective.</p><a href="#home">Back to the top ↑</a><span>© {new Date().getFullYear()} Forma · Design concept</span></footer>
    </>
  );
}
