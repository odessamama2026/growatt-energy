import { APPLIANCES, BATTERY_WH, INVERTER_WATTS } from './site';
export function calculateLoad(ids: string[]) {
  const selected = APPLIANCES.filter(a=>ids.includes(a.id));
  const watts = selected.reduce((sum,a)=>sum+a.watts,0);
  // Explicit modelling assumptions, not manufacturer specifications.
  const usableWh = BATTERY_WH * 0.9 * 0.9;
  return {watts,hours:watts ? usableWh/watts : 0,okPower:watts<=INVERTER_WATTS,usableWh};
}
