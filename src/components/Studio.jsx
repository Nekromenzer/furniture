/* eslint-disable react/prop-types */
import { useState } from "react";
import Modal from "../sections/hero/Modal";
import { finishes } from "../data/catalog";

export default function Studio({ finish = finishes[0], onFinishChange, className = "" }) {
  const [rotating, setRotating] = useState(false);
  const [interaction, setInteraction] = useState("move");
  const [roomStyle, setRoomStyle] = useState("sand");
  const [reset, setReset] = useState(0);
  return (
          <div className={`hero-showcase ${className}`} id="studio">
            <div className="showcase-top"><span>YOUR VIRTUAL ROOM</span><span className="live-label"><span className="small-dot" /> LIVE 3D</span></div>
            <div className="studio-toolbar"><div className="mode-switch" aria-label="3D interaction mode">{["move", "orbit"].map((mode) => <button key={mode} aria-pressed={interaction === mode} onClick={() => setInteraction(mode)}>{mode === "move" ? "↔ Place chair" : "◎ Orbit view"}</button>)}</div><select aria-label="3D room style" value={roomStyle} onChange={(event) => setRoomStyle(event.target.value)}><option value="sand">Warm studio</option><option value="sage">Sage retreat</option><option value="gallery">Urban gallery</option></select></div>
            <Modal color={finish.color} rotating={rotating} resetKey={reset} interaction={interaction} roomStyle={roomStyle} />
            <div className="viewer-hint"><span aria-hidden="true">⟷</span> {interaction === "move" ? "Drag the chair to place it · arrow keys work too" : "Drag the room to explore · scroll to zoom"}</div>
            <div className="viewer-controls">
              <button aria-label={rotating ? "Pause chair rotation" : "Start chair rotation"} aria-pressed={rotating} onClick={() => setRotating(!rotating)}>{rotating ? "Ⅱ" : "▷"}</button>
              <button aria-label="Reset chair placement and view" onClick={() => setReset(reset + 1)}>↺</button>
            </div>
            <div className="product-bar">
              <div><p className="eyebrow">THE CHAIR STUDY / 01</p><h2>Make room for you.</h2></div>
              <div className="finish-selector"><span aria-live="polite">{finish.name}</span><div className="swatches">{finishes.map((item) => <button key={item.name} style={{ "--swatch": item.color }} className={finish.name === item.name ? "swatch selected" : "swatch"} aria-label={`Preview ${item.name} finish`} aria-pressed={finish.name === item.name} onClick={() => onFinishChange(item)} />)}</div></div>
            </div>
          </div>
  );
}
