import { create } from 'zustand';
import { track } from './analytics';
type LeadState = {open:boolean;source:string;calculator:{appliances:string[]}|null;openLead:(source?:string,calculator?:{appliances:string[]})=>void;closeLead:()=>void};
export const useLead=create<LeadState>(set=>({open:false,source:'site',calculator:null,openLead:(source='site',calculator)=>{track('form_open',source);set({open:true,source,calculator:calculator||null});},closeLead:()=>set({open:false})}));
