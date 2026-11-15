import { useState } from "react";
import { company } from "../data/catalog";

export default function Contact() {
  const product = new URLSearchParams(window.location.search).get("product") || "";
  const [prepared, setPrepared] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [topic, setTopic] = useState(product ? "Product enquiry" : "General enquiry");
  const onSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = `${form.get("topic")}${form.get("product") ? ` — ${form.get("product")}` : ""}`;
    const text = `Hello Forma,\n\n${form.get("message")}\n\n${form.get("product") ? `Interested in: ${form.get("product")}\n` : ""}Name: ${form.get("name")}\nEmail: ${form.get("email")}${form.get("phone") ? `\nPhone: ${form.get("phone")}` : ""}`;
    setPrepared({ subject, text });
    setCopied(false);
    setCopyError(false);
    requestAnimationFrame(() => document.getElementById("enquiry-preview")?.focus());
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([`To: ${company.email}\nSubject: ${prepared.subject}\n\n${prepared.text}`], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "forma-enquiry.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(prepared.text); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  };
  return <main>
    <section className="page-intro contact-intro"><p className="eyebrow">CONTACT / LET’S TALK</p><h1>Every good space starts<br />with a <em>conversation.</em></h1><p>A question about a piece? An idea for your room? We would love to hear what you have in mind.</p></section>
    <section className="contact-layout page-container">
      <aside className="contact-information"><p className="eyebrow">FIND YOUR WAY TO FORMA</p><h2>A little closer<br />to <em>home.</em></h2><dl><div><dt>WRITE TO US</dt><dd><a href={`mailto:${company.email}`}>{company.email} ↗</a></dd></div><div><dt>BASED IN</dt><dd>{company.location}</dd></div><div><dt>PHONE / SAMPLE NUMBER</dt><dd>{company.phone}</dd><p className="sample-phone-note">A demonstration number, not an active contact line. Please email us.</p></div></dl><div className="contact-image"><img src="/assets/images/carousel-1.jpg" alt="A comfortable chair beside a light-filled window" loading="lazy" /><span>A SPACE FOR YOUR NEXT IDEA.</span></div></aside>
      <div className="contact-form-panel"><div className="form-heading"><h2>Tell us a little <em>more.</em></h2><p>Fields marked * are required.</p></div><form onSubmit={onSubmit} onChange={() => { setPrepared(null); setCopied(false); }}>
        <div className="form-row"><label>Your name *<input name="name" autoComplete="name" required maxLength={100} placeholder="Full name" /></label><label>Email address *<input name="email" type="email" autoComplete="email" required maxLength={200} placeholder="you@example.com" /></label></div>
        <div className="form-row"><label>Phone number <span className="optional">(optional)</span><input name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="Your contact number" /></label><label>What is it about? *<select name="topic" value={topic} onChange={(event) => setTopic(event.target.value)}><option>General enquiry</option><option>Product enquiry</option><option>Help with my space</option><option>Trade & collaboration</option></select></label></div>
        <label>Piece or finish <span className="optional">(optional)</span><input name="product" defaultValue={product} maxLength={200} placeholder="e.g. Forma 01 in Oat" /></label>
        <label>Your message *<textarea name="message" required rows={5} maxLength={4000} placeholder="Tell us about your space, the piece you’re interested in, or how we can help…" /></label>
        <p className="form-note">Your details stay in this page until you choose to open your email app, copy, or download your enquiry. This form does not send messages automatically.</p>
        <button type="submit" className="button button-dark">Prepare your enquiry <span aria-hidden="true">↗</span></button>
      </form>
      {prepared && <section className="enquiry-preview" id="enquiry-preview" tabIndex="-1" aria-labelledby="enquiry-title"><p className="eyebrow">READY WHEN YOU ARE</p><h3 id="enquiry-title">Your enquiry is ready.</h3><p>Review it below, then open your email app to send it to {company.email}. No message has been sent yet.</p><div className="enquiry-body"><strong>{prepared.subject}</strong><pre>{prepared.text}</pre></div><div className="enquiry-actions"><a className="button button-dark" href={`mailto:${company.email}?subject=${encodeURIComponent(prepared.subject)}&body=${encodeURIComponent(prepared.text)}`}>Open email app ↗</a><button className="button button-outline" onClick={copy}>{copied ? "Copied ✓" : "Copy message"}</button><button className="download-link" onClick={download}>Download .txt ↓</button></div><p role="status">{copyError ? "Copy isn’t available in this browser. Download your enquiry instead." : copied ? "Message copied. Paste it into your email to send." : "If no email app opens, copy or download your message."}</p></section>}
      </div>
    </section>
    <section className="contact-faq section-space"><div><p className="eyebrow">A FEW HELPFUL DETAILS</p><h2>Before you <em>ask.</em></h2></div><div className="faq-list"><details><summary>Can I explore the furniture before enquiring?</summary><p>Yes. Visit the <a href="/products">Products page</a> to explore the chair in 3D, try the color studies, and move it around the virtual room.</p></details><details><summary>How do I ask about pricing or delivery?</summary><p>Choose Product enquiry and include the piece, finish, quantity, and delivery location in your message. These details can be confirmed directly by email.</p></details><details><summary>Are the colors and room previews exact?</summary><p>The previews are illustrative color and room studies. Confirm the available materials, finishes, dimensions, and care instructions before making a purchase.</p></details><details><summary>Can I discuss a project or collaboration?</summary><p>Of course. Choose Trade & collaboration and tell us about the project, location, timeline, and what you have in mind.</p></details></div></section>
  </main>;
}
