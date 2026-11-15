import { useState } from "react";
import Studio from "../components/Studio";
import { finishes } from "../data/catalog";

export default function Products() {
  const initialFinish = new URLSearchParams(window.location.search).get("finish");
  const [finish, setFinish] = useState(finishes.find((item) => item.id === initialFinish) || finishes[0]);
  const chooseFinish = (item) => {
    setFinish(item);
    const url = new URL(window.location.href);
    url.searchParams.set("finish", item.id);
    window.history.replaceState(null, "", url);
  };
  return <main>
    <section className="page-intro products-intro"><p className="eyebrow">THE COLLECTION / 01</p><h1>A considered seat.<br />An individual <em>touch.</em></h1><p>Explore the Forma 01 chair. Find your angle, choose a color, and see how it feels in your space.</p></section>
    <section className="product-detail page-container">
      <Studio finish={finish} onFinishChange={chooseFinish} className="product-studio" />
      <div className="product-information"><p className="eyebrow">FORMA 01 / ACCENT CHAIR</p><h2>A place to <em>pause.</em></h2><p className="product-summary">A sculptural silhouette with a curved back, an inviting seat, and a light, open base. A small change with a whole new perspective.</p><div className="product-choice"><span>YOUR COLOR STUDY</span><strong aria-live="polite">{finish.name}</strong></div><div className="finish-options">{finishes.map((item) => <button key={item.id} aria-pressed={finish.id === item.id} onClick={() => chooseFinish(item)}><span style={{ background: item.color }} />{item.name}<span aria-hidden="true">{finish.id === item.id ? "✓" : "+"}</span></button>)}</div><p className="finish-description" aria-live="polite">{finish.description}</p><a className="button button-dark product-enquiry" href={`/contact?product=${encodeURIComponent(`Forma 01 — ${finish.name}`)}`}>Enquire about this chair <span aria-hidden="true">↗</span></a><p className="product-caption">Color previews are illustrative. Enquire to confirm available finishes, specifications, pricing, and delivery.</p><div className="product-accordions"><details open><summary>Explore it in 3D</summary><p>Choose Place chair to move it across the floor, or Orbit view to look around all 360°. Switch room palettes to see your chosen color in a different setting.</p></details><details><summary>Before you choose</summary><p>Ask us to confirm the dimensions, materials, available finishes, and care instructions for your selection before placing an order.</p></details><details><summary>Planning a space?</summary><p>Tell us about your room, how you use it, and the pieces you are looking for. You can include these details in your enquiry.</p></details></div></div>
    </section>
    <section className="finish-stories section-space"><div className="section-heading"><div><p className="eyebrow">ONE FORM / THREE PERSPECTIVES</p><h2>Find your kind of <em>character.</em></h2></div><a className="text-link" href="/contact">Let’s talk about your space ↗</a></div><div className="finish-story-grid">{finishes.map((item, index) => <a key={item.id} href={`/products?finish=${item.id}`} className="finish-story"><div className="finish-art" style={{ "--finish-color": item.color }}><span>0{index + 1}</span><div /><span>{item.name.toUpperCase()}</span></div><h3>{item.name}</h3><p>{item.description}</p><span className="text-link">Explore this color ↗</span></a>)}</div></section>
    <section className="closing"><p className="eyebrow">YOUR ROOM, YOUR PERSPECTIVE</p><h2>Something in <em>mind?</em></h2><a href="/contact" className="button button-dark">Start a conversation ↗</a></section>
  </main>;
}
