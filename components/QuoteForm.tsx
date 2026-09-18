"use client";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, UploadCloud } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const steps = ["Packaging", "Dimensions", "Quantity", "Material", "Printing", "Finishes", "Artwork", "Details", "Notes", "Review"];
const options: Record<number, string[]> = { 0: ["Mailer box", "Rigid box", "Folding carton", "Shipping box", "Display box", "Mylar bag"], 2: ["100 – 499", "500 – 999", "1,000 – 4,999", "5,000 – 9,999", "10,000+"], 3: ["Kraft", "Corrugated", "Paperboard", "Rigid board", "Recycled paper"], 4: ["Outside only", "Inside only", "Inside & outside", "No printing"], 5: ["Matte", "Gloss", "Spot UV", "Foil", "Embossing", "Debossing"] };
const quoteSchema = z.object({ name: z.string().min(2, "Add your name"), email: z.string().email("Add a valid email") });
type QuoteDetails = z.infer<typeof quoteSchema>;
export function QuoteForm(){
  const [step, setStep] = useState(0); const [data, setData] = useState<Record<string,string>>({}); const [done,setDone]=useState(false);
  const { setValue, handleSubmit, formState: { errors } } = useForm<QuoteDetails>({ resolver: zodResolver(quoteSchema), defaultValues: { name: "", email: "" } });
  const update=(k:string,v:string)=>{setData(d=>({...d,[k]:v})); if(k==="name"||k==="email") setValue(k,v,{shouldValidate:true});};
  const submit = handleSubmit(() => setDone(true));
  useEffect(() => {
    const saved = sessionStorage.getItem("fable-quote-starter");
    if (!saved) return;
    try {
      const starter = JSON.parse(saved) as Record<string, string>;
      setData(current => ({ ...current, Packaging: starter.packaging || "", Quantity: starter.quantity || "", Dimensions: starter.dimensions || "", Material: starter.material || "", Printing: starter.printing || "", email: starter.email || "" }));
      if (starter.email) setValue("email", starter.email);
    } catch {}
  }, [setValue]);
  if(done) return <div className="form-success"><span><Check/></span><h2>Your project is in good hands.</h2><p>Thanks for sharing the details. A packaging specialist will respond within one business day.</p></div>;
  return <div className="quote-builder"><div className="quote-progress"><div className="progress-top"><span>Step {step+1} of {steps.length}</span><b>{steps[step]}</b></div><div className="progress-track"><i style={{width:`${(step+1)*10}%`}}/></div><div className="progress-labels">{steps.map((s,i)=><span className={i<=step?"active":""} key={s}>{i<step?<Check/>:i+1}</span>)}</div></div><div className="quote-step"><p className="eyebrow">{steps[step]}</p><h2>{step===0?"What are you creating?":step===1?"What size do you need?":step===2?"How many do you need?":step===3?"Choose a material":step===4?"Where should we print?":step===5?"Add premium finishes":step===6?"Do you have artwork?":step===7?"Tell us about yourself":step===8?"Anything else we should know?":"Check everything looks right"}</h2>{options[step] && <div className="choice-grid">{options[step].map(o=><button key={o} onClick={()=>update(steps[step],o)} className={data[steps[step]]===o?"selected":""}>{data[steps[step]]===o&&<Check/>}{o}</button>)}</div>}{step===1&&<div className="field-row"><label>Length<input type="number" placeholder="12" onChange={e=>update("length",e.target.value)}/></label><label>Width<input type="number" placeholder="9" onChange={e=>update("width",e.target.value)}/></label><label>Height<input type="number" placeholder="4" onChange={e=>update("height",e.target.value)}/></label><label>Unit<select onChange={e=>update("unit",e.target.value)}><option>Inches</option><option>Millimeters</option></select></label></div>}{step===6&&<label className="upload"><UploadCloud/><b>Drop artwork here or browse</b><span>PDF, AI, EPS or ZIP up to 25MB</span><input type="file"/></label>}{step===7&&<div className="form-grid"><label>Full name<input required placeholder="Alex Morgan" onChange={e=>update("name",e.target.value)}/>{errors.name&&<small className="field-error">{errors.name.message}</small>}</label><label>Work email<input required type="email" placeholder="alex@company.com" onChange={e=>update("email",e.target.value)}/>{errors.email&&<small className="field-error">{errors.email.message}</small>}</label><label>Phone<input placeholder="+1 555 000 0000" onChange={e=>update("phone",e.target.value)}/></label><label>Company<input placeholder="Your company" onChange={e=>update("company",e.target.value)}/></label></div>}{step===8&&<textarea rows={6} placeholder="Products, launch date, special requirements…" onChange={e=>update("notes",e.target.value)}/>} {step===9&&<div className="review-grid">{Object.entries(data).map(([k,v])=><div key={k}><span>{k}</span><b>{v}</b></div>)}</div>}</div><div className="form-actions"><button className="button button-secondary" disabled={step===0} onClick={()=>setStep(s=>s-1)}><ArrowLeft/> Back</button><button className="button button-primary" onClick={()=>step===9?void submit():setStep(s=>s+1)}>{step===9?"Submit quote":"Continue"} <ArrowRight/></button></div></div>
}
