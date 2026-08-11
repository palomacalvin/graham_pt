// **** FOR DEBUGGING ONLY **** //


// "use client";

// import React, { useMemo, useState } from "react";
// import { ProjectData } from "@/types/INProject";
// import { calculateSchedule, 
//   AbatementUnit, 
//   calculateTaxBaseImpact, 
//   calculateNewTaxRates, 
//   calculatePropertyTaxPayments, 
//   calculateTaxOffsetForCommunity,
//   calculateNewTaxRatesWithAbatement,
//   calculatePropertyTaxPaymentsWithAbatement,
//   calculateTaxOffsetForCommunityWithAbatement } from "@/utils/INCalculations";
// import AbatementTable from "@/app/indiana-components/AbatementTable";

// interface ScheduleVerificationTableProps {
//   projectData?: ProjectData;
//   initialAbatementUnits?: AbatementUnit[];
//   debugToConsole?: boolean;
// }

// const DEFAULT_10_YR_ABATEMENT: AbatementUnit[] = Array.from({ length: 10 }, (_, i) => ({
//   year: i + 1,
//   personalPropertyAbatement: 1.0,
//   realPropertyAbatement: 1.0,
// }));

// export const ScheduleVerificationTable: React.FC<ScheduleVerificationTableProps> = ({
//   projectData,
//   initialAbatementUnits = DEFAULT_10_YR_ABATEMENT,
//   debugToConsole = false,
// }) => {

//   const [abatementUnits, setAbatementUnits] = useState<AbatementUnit[]>(
//       initialAbatementUnits
//   );

//   const calculationResults = useMemo(() => {
//     const res = calculateSchedule(projectData, abatementUnits);
//     if (debugToConsole) {
//       console.log("Calculated Tax Schedule Results:", res);
//     }
//     return res;
//   }, [projectData, abatementUnits, debugToConsole]);

//   const { inputs, schedule, noAbatementSchedule, withAbatementSchedule } = calculationResults;

//   // Non-abated project AV schedule.
//   const projectAvSchedule = useMemo(() => {
//     return noAbatementSchedule.map((row) => row.totalAssessedValue);
//   }, [noAbatementSchedule]);

//   // Abated project AV Schedule.
//   const abatedProjectAvSchedule = useMemo(() => {
//     return withAbatementSchedule.map((row) => row.totalAssessedValue);
//   }, [withAbatementSchedule]);

//   // Non-abated calculations.
//   const taxBaseImpactResults = useMemo(() => {
//     if (!projectData) return null;
//     const res = calculateTaxBaseImpact(projectData, projectAvSchedule);
//     if (debugToConsole) {
//       console.log("Calculated Tax Base Impact Results:", res);
//     }
//     return res;
//   }, [projectData, projectAvSchedule, debugToConsole]);

//   const newTaxRateResults = useMemo(() => {
//     if (!projectData) return null;
//     const res = calculateNewTaxRates(projectData, projectAvSchedule);
//     if (debugToConsole) {
//       console.log("Calculated New Tax Rate Results:", res);
//     }
//     return res;
//   }, [projectData, projectAvSchedule, debugToConsole]);

//   const propertyTaxPaymentResults = useMemo(() => {
//     if (!projectData) return null;
//     const res = calculatePropertyTaxPayments(projectData, projectAvSchedule);
//     if (debugToConsole) {
//       console.log("Calculated Property Tax Payments Results:", res);
//     }
//     return res;
//   }, [projectData, projectAvSchedule, debugToConsole]);

//   const taxOffsetResults = useMemo(() => {
//     if (!projectData || projectAvSchedule.length === 0) return null;
//     const res = calculateTaxOffsetForCommunity(projectData, projectAvSchedule);
//     if (debugToConsole) {
//       console.log("Calculated Community Tax Offset Results:", res);
//     }
//     return res;
//   }, [projectData, projectAvSchedule, debugToConsole]);


//   // Abated calculations.
//   const taxBaseImpactResultsWithAbatement = useMemo(() => {
//     if (!projectData) return null;
//     return calculateTaxBaseImpact(projectData, abatedProjectAvSchedule);
//   }, [projectData, abatedProjectAvSchedule]);

//   const newTaxRateResultsWithAbatement = useMemo(() => {
//     if (!projectData) return null;
//     return calculateNewTaxRatesWithAbatement(projectData, abatedProjectAvSchedule);
//   }, [projectData, abatedProjectAvSchedule]);

//   const propertyTaxPaymentResultsWithAbatement = useMemo(() => {
//     if (!projectData) return null;
//     return calculatePropertyTaxPaymentsWithAbatement(projectData, abatedProjectAvSchedule);
//   }, [projectData, abatedProjectAvSchedule]);

//   const taxOffsetResultsWithAbatement = useMemo(() => {
//     if (!projectData || abatedProjectAvSchedule.length === 0) return null;
//     return calculateTaxOffsetForCommunityWithAbatement(projectData, abatedProjectAvSchedule);
//   }, [projectData, abatedProjectAvSchedule]);


//   // Formatting helper functions.
//   const fmtRateOrDash = (val: number | null) => {
//     if (val === null || val === undefined || isNaN(val)) return "-";
//     return (val * 100).toFixed(3) + "%";
//   };
  
//   const fmtCurrency = (val: number) =>
//     "$" + Math.round(val).toLocaleString("en-US");

//   const fmtPercent = (val: number) => (val * 100).toFixed(4) + "%";


//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
//       <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
//         UDP & Real Property Depreciation Schedule
//       </h2>

//       {/* Input Reference Panel */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md border text-sm">
//         <div>
//           <span className="text-gray-500 block">Total Investment</span>
//           <span className="font-semibold">{fmtCurrency(inputs.totalInvestment)}</span>
//         </div>
//         <div>
//           <span className="text-gray-500 block">% Investment UDP</span>
//           <span className="font-semibold">{(inputs.pctInvestmentUDP * 100).toFixed(0)}%</span>
//         </div>
//         <div>
//           <span className="text-gray-500 block">Total UDP</span>
//           <span className="font-semibold">{fmtCurrency(inputs.totalUDP)}</span>
//         </div>
//         <div>
//           <span className="text-gray-500 block">Real Property Improvements</span>
//           <span className="font-semibold">{fmtCurrency(inputs.realPropertyImprovements)}</span>
//         </div>
//       </div>

//       {/* Output Schedule Table */}
//       <div className="overflow-x-auto border rounded-lg max-h-[500px]">
//         <table className="w-full text-sm text-left border-collapse">
//           <thead className="bg-gray-100 sticky top-0 border-b">
//             <tr>
//               <th className="p-2 font-semibold">Year</th>
//               <th className="p-2 font-semibold text-right">5-Yr MACRS</th>
//               <th className="p-2 font-semibold text-right">Depreciation Balance</th>
//               <th className="p-2 font-semibold text-right">Final AV (UDP)</th>
//               <th className="p-2 font-semibold text-right">Improvements</th>
//               <th className="p-2 font-semibold text-right">Increased Land Value</th>
//               <th className="p-2 font-semibold text-right text-blue-900 bg-blue-50/50">Total AV</th>
//             </tr>
//           </thead>
//           <tbody>
//             {schedule.map((row) => (
//               <tr key={row.year} className="border-b hover:bg-gray-50 font-mono text-xs">
//                 <td className="p-2 font-bold text-gray-700">{row.year}</td>
//                 <td className="p-2 text-right">{(row.macrsPercent * 100).toFixed(2)}%</td>
//                 <td className="p-2 text-right">{fmtCurrency(row.depreciationBalance)}</td>
//                 <td className="p-2 text-right">{fmtCurrency(row.finalAssessedValueUDP)}</td>
//                 <td className="p-2 text-right">{fmtCurrency(row.improvements)}</td>
//                 <td className="p-2 text-right">{fmtCurrency(row.increasedLandValue)}</td>
//                 <td className="p-2 text-right font-bold text-blue-900 bg-blue-50/30">
//                   {fmtCurrency(row.totalAssessedValue)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>


//       {/* Table 2: No Property Tax Abatement Table */}
//         <div className="border rounded-lg p-4 bg-white shadow-sm">
//           <h3 className="text-md font-bold text-gray-700 mb-3">2. No Property Tax Abatement</h3>
//           <div className="overflow-x-auto max-h-[500px]">
//             <table className="w-full text-xs text-left border-collapse">
//               <thead className="bg-gray-100 sticky top-0 border-b">
//                 <tr>
//                   <th className="p-2">Yr</th>
//                   <th className="p-2 text-right">Utility Property</th>
//                   <th className="p-2 text-right">Improvements</th>
//                   <th className="p-2 text-right">Inc. Land Value</th>
//                   <th className="p-2 text-right font-bold text-blue-900">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {noAbatementSchedule.map((row) => (
//                   <tr key={row.year} className="border-b hover:bg-gray-50 font-mono">
//                     <td className="p-2 font-bold">{row.year}</td>
//                     <td className="p-2 text-right">{fmtCurrency(row.utilityProperty)}</td>
//                     <td className="p-2 text-right">{fmtCurrency(row.improvements)}</td>
//                     <td className="p-2 text-right">{fmtCurrency(row.increasedLandValue)}</td>
//                     <td className="p-2 text-right font-bold text-blue-900">{fmtCurrency(row.totalAssessedValue)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Table 3: With Property Tax Abatement Table */}
//         <div className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
//           <h3 className="text-md font-bold text-gray-700">3. With Property Tax Abatement</h3>
//           <div className="overflow-x-auto max-h-[400px]">
//             <table className="w-full text-xs text-left border-collapse">
//               <thead className="bg-gray-100 sticky top-0 border-b">
//                 <tr>
//                   <th className="p-2">Yr</th>
//                   <th className="p-2 text-right">Utility Property</th>
//                   <th className="p-2 text-right">Improvements</th>
//                   <th className="p-2 text-right">Inc. Land Value</th>
//                   <th className="p-2 text-right font-bold text-green-900 bg-green-50/50">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {withAbatementSchedule.map((row) => (
//                   <tr key={row.year} className="border-b hover:bg-gray-50 font-mono">
//                     <td className="p-2 font-bold">{row.year}</td>
//                     <td className="p-2 text-right">{fmtCurrency(row.utilityProperty)}</td>
//                     <td className="p-2 text-right">{fmtCurrency(row.improvements)}</td>
//                     <td className="p-2 text-right">{fmtCurrency(row.increasedLandValue)}</td>
//                     <td className="p-2 text-right font-bold text-green-900 bg-green-50/30">{fmtCurrency(row.totalAssessedValue)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Table 4: Taxing Unit Tax Base & Tax Payment Impact */}
//       <div className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
//         <div className="flex justify-between items-center">
//           <h3 className="text-md font-bold text-gray-700">
//             4. Taxing Unit Tax Base & Tax Payment Impact (No Abatement)
//           </h3>
//           {taxBaseImpactResults && (
//             <span className="text-xs text-gray-500 font-mono">
//               Total Base Net AV:{" "}
//               <strong className="text-gray-800">
//                 {fmtCurrency(taxBaseImpactResults.totalBaseNetAV)}
//               </strong>
//             </span>
//           )}
//         </div>

//         {taxBaseImpactResults && taxBaseImpactResults.fundImpacts.length > 0 ? (
//           <div className="overflow-x-auto max-h-[500px]">
//             <table className="w-full text-xs text-left border-collapse">
//               <thead className="bg-gray-100 sticky top-0 border-b">
//                 <tr>
//                   <th className="p-2">Unit Name</th>
//                   <th className="p-2">Fund Name</th>
//                   <th className="p-2 text-right">Certified Levy</th>
//                   <th className="p-2 text-right">Base Net AV</th>
//                   <th className="p-2 text-right">Effective Rate</th>
//                   <th className="p-2 text-right">Yr 1 Payment</th>
//                   <th className="p-2 text-right">Yr 10 Payment</th>
//                   <th className="p-2 text-right font-bold text-emerald-900 bg-emerald-50/50">
//                     25-Yr Total Payment
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {taxBaseImpactResults.fundImpacts.map((fund, idx) => {
//                   const yr1Payment = fund.expandedPaymentByYear[0] || 0;
//                   const yr10Payment = fund.expandedPaymentByYear[9] || 0;
//                   const totalFundPayments = fund.expandedPaymentByYear.reduce(
//                     (a, b) => a + b,
//                     0
//                   );

//                   return (
//                     <tr
//                       key={fund.fundCode || idx}
//                       className="border-b hover:bg-gray-50 font-mono"
//                     >
//                       <td className="p-2 font-sans font-medium text-gray-800">
//                         {fund.unitName}
//                       </td>
//                       <td className="p-2 font-sans text-gray-600">
//                         {fund.fundName}
//                       </td>
//                       <td className="p-2 text-right">
//                         {fmtCurrency(fund.certifiedLevy)}
//                       </td>
//                       <td className="p-2 text-right">
//                         {fmtCurrency(fund.baseNetAV)}
//                       </td>
//                       <td className="p-2 text-right">
//                         {fmtPercent(fund.taxRate)}
//                       </td>
//                       <td className="p-2 text-right">
//                         {fmtCurrency(yr1Payment)}
//                       </td>
//                       <td className="p-2 text-right">
//                         {fmtCurrency(yr10Payment)}
//                       </td>
//                       <td className="p-2 text-right font-bold text-emerald-900 bg-emerald-50/30">
//                         {fmtCurrency(totalFundPayments)}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//               <tfoot className="bg-gray-100 font-mono font-bold border-t">
//                 <tr>
//                   <td className="p-2" colSpan={2}>
//                     Total All Selected Funds
//                   </td>
//                   <td className="p-2 text-right">
//                     {fmtCurrency(
//                       taxBaseImpactResults.fundImpacts.reduce(
//                         (acc, f) => acc + f.certifiedLevy,
//                         0
//                       )
//                     )}
//                   </td>
//                   <td className="p-2 text-right">
//                     {fmtCurrency(taxBaseImpactResults.totalBaseNetAV)}
//                   </td>
//                   <td className="p-2 text-right">-</td>
//                   <td className="p-2 text-right">
//                     {fmtCurrency(
//                       taxBaseImpactResults.totalPaymentByYear[0] || 0
//                     )}
//                   </td>
//                   <td className="p-2 text-right">
//                     {fmtCurrency(
//                       taxBaseImpactResults.totalPaymentByYear[9] || 0
//                     )}
//                   </td>
//                   <td className="p-2 text-right text-emerald-900 bg-emerald-100/60">
//                     {fmtCurrency(
//                       taxBaseImpactResults.totalPaymentByYear.reduce(
//                         (a, b) => a + b,
//                         0
//                       )
//                     )}
//                   </td>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         ) : (
//           <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded border">
//             No taxing units selected or project data unavailable.
//           </div>
//         )}
//       </div>

//       {/* Table 4B: Tax Base & Payment Impact (With Abatement) */}
//       <div className="border border-green-200 rounded-lg p-4 bg-green-50/10 shadow-sm space-y-3">
//         <div className="flex justify-between items-center">
//           <h3 className="text-md font-bold text-green-900">
//             4B. Taxing Unit Tax Base & Tax Payment Impact (With Abatement)
//           </h3>
//           {taxBaseImpactResultsWithAbatement && (
//             <span className="text-xs text-gray-500 font-mono">
//               Total Base Net AV:{" "}
//               <strong className="text-gray-800">
//                 {fmtCurrency(taxBaseImpactResultsWithAbatement.totalBaseNetAV)}
//               </strong>
//             </span>
//           )}
//         </div>

//         {taxBaseImpactResultsWithAbatement && taxBaseImpactResultsWithAbatement.fundImpacts.length > 0 ? (
//           <div className="overflow-x-auto max-h-[500px]">
//             <table className="w-full text-xs text-left border-collapse">
//               <thead className="bg-green-100/60 sticky top-0 border-b">
//                 <tr>
//                   <th className="p-2">Unit Name</th>
//                   <th className="p-2">Fund Name</th>
//                   <th className="p-2 text-right">Certified Levy</th>
//                   <th className="p-2 text-right">Base Net AV</th>
//                   <th className="p-2 text-right">Effective Rate</th>
//                   <th className="p-2 text-right">Yr 1 Payment</th>
//                   <th className="p-2 text-right">Yr 10 Payment</th>
//                   <th className="p-2 text-right font-bold text-emerald-900 bg-emerald-100/50">
//                     25-Yr Total Payment
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {taxBaseImpactResultsWithAbatement.fundImpacts.map((fund, idx) => {
//                   const yr1Payment = fund.expandedPaymentByYear[0] || 0;
//                   const yr10Payment = fund.expandedPaymentByYear[9] || 0;
//                   const totalFundPayments = fund.expandedPaymentByYear.reduce(
//                     (a, b) => a + b,
//                     0
//                   );

//                   return (
//                     <tr
//                       key={fund.fundCode || idx}
//                       className="border-b hover:bg-green-50/30 font-mono"
//                     >
//                       <td className="p-2 font-sans font-medium text-gray-800">
//                         {fund.unitName}
//                       </td>
//                       <td className="p-2 font-sans text-gray-600">
//                         {fund.fundName}
//                       </td>
//                       <td className="p-2 text-right">
//                         {fmtCurrency(fund.certifiedLevy)}
//                       </td>
//                       <td className="p-2 text-right">
//                         {fmtCurrency(fund.baseNetAV)}
//                       </td>
//                       <td className="p-2 text-right">
//                         {fmtPercent(fund.taxRate)}
//                       </td>
//                       <td className="p-2 text-right">
//                         {fmtCurrency(yr1Payment)}
//                       </td>
//                       <td className="p-2 text-right">
//                         {fmtCurrency(yr10Payment)}
//                       </td>
//                       <td className="p-2 text-right font-bold text-emerald-900 bg-emerald-50/50">
//                         {fmtCurrency(totalFundPayments)}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded border">
//             No taxing units selected or project data unavailable.
//           </div>
//         )}
//       </div>

//       {/* Table 5: New Tax Rate Schedule */}
// <div className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
//   <div className="flex justify-between items-center border-b pb-2">
//     <h3 className="text-md font-bold text-gray-700">
//       5. New Tax Rate Schedule (Years 1–25)
//     </h3>
//     <span className="text-xs text-gray-500 font-mono">
//       Debt/Referendum rates remain fixed; Operating rates adjust down if AV growth exceeds levy.
//     </span>
//   </div>

//   {newTaxRateResults && newTaxRateResults.fundRateImpacts.length > 0 ? (
//     <div className="overflow-x-auto max-h-[550px]">
//       <table className="w-full text-xs text-left border-collapse min-w-[1800px]">
//         <thead className="bg-gray-100 sticky top-0 border-b">
//           <tr>
//             <th className="p-2 min-w-[140px] sticky left-0 bg-gray-100 z-10 shadow-sm">
//               Unit Name
//             </th>
//             <th className="p-2 min-w-[150px] sticky left-[140px] bg-gray-100 z-10 shadow-sm">
//               Fund Name
//             </th>
//             <th className="p-2 text-center min-w-[80px]">Debt/Ref?</th>
//             <th className="p-2 text-right min-w-[100px]">Certified Levy</th>
//             <th className="p-2 text-right min-w-[110px]">Base Net AV</th>
//             <th className="p-2 text-right min-w-[80px] bg-gray-200/60 font-semibold">
//               Base Rate
//             </th>

//             {/* Year 1 - 25 Headers */}
//             {Array.from({ length: 25 }, (_, i) => (
//               <th key={i} className="p-2 text-right min-w-[70px]">
//                 Yr {i + 1}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {/* Top Header Row for Project AV */}
//           <tr className="bg-blue-50/70 font-mono font-semibold border-b">
//             <td colSpan={3} className="p-2 sticky left-0 bg-blue-50 z-10 font-sans text-blue-900">
//               Project Assessed Value Schedule
//             </td>
//             <td className="p-2 text-right text-blue-900" colSpan={3}>
//               -
//             </td>
//             {projectAvSchedule.map((av, idx) => (
//               <td key={idx} className="p-2 text-right text-blue-900 min-w-[70px]">
//                 {fmtCurrency(av)}
//               </td>
//             ))}
//           </tr>

//           {/* Fund Rates Rows */}
//           {newTaxRateResults.fundRateImpacts.map((fund, idx) => (
//             <tr key={fund.fundCode || idx} className="border-b hover:bg-gray-50 font-mono">
//               <td className="p-2 font-sans font-medium text-gray-800 sticky left-0 bg-white z-10">
//                 {fund.unitName}
//               </td>
//               <td className="p-2 font-sans text-gray-600 sticky left-[140px] bg-white z-10">
//                 {fund.fundName}
//               </td>
//               <td className="p-2 text-center font-sans">
//                 {fund.isDebtOrReferendum ? (
//                   <span className="inline-block px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-800 rounded font-bold">
//                     YES
//                   </span>
//                 ) : (
//                   <span className="text-gray-400">-</span>
//                 )}
//               </td>
//               <td className="p-2 text-right">
//                 {fund.certifiedLevy > 0 ? fmtCurrency(fund.certifiedLevy) : "-"}
//               </td>
//               <td className="p-2 text-right">
//                 {fund.baseNetAV > 0 ? fmtCurrency(fund.baseNetAV) : "-"}
//               </td>
//               <td className="p-2 text-right font-semibold bg-gray-50">
//                 {fmtRateOrDash(fund.baseTaxRate)}
//               </td>

//               {/* Years 1-25 Rates */}
//               {fund.newRatesByYear.map((rate, yrIdx) => (
//                 <td key={yrIdx} className="p-2 text-right">
//                   {fmtRateOrDash(rate)}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   ) : (
//     <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded border">
//       No taxing units selected or project data unavailable.
//     </div>
//   )}
// </div>

// {/* Table 5B: New Tax Rate Schedule (With Abatement) */}
//       <div className="border border-green-200 rounded-lg p-4 bg-green-50/10 shadow-sm space-y-3">
//         <div className="flex justify-between items-center border-b pb-2">
//           <h3 className="text-md font-bold text-green-900">
//             5B. New Tax Rate Schedule (Years 1–25 - With Abatement)
//           </h3>
//         </div>

//         {newTaxRateResultsWithAbatement && newTaxRateResultsWithAbatement.fundRateImpacts.length > 0 ? (
//           <div className="overflow-x-auto max-h-[550px]">
//             <table className="w-full text-xs text-left border-collapse min-w-[1800px]">
//               <thead className="bg-green-100/60 sticky top-0 border-b">
//                 <tr>
//                   <th className="p-2 min-w-[140px] sticky left-0 bg-green-100 z-10 shadow-sm">
//                     Unit Name
//                   </th>
//                   <th className="p-2 min-w-[150px] sticky left-[140px] bg-green-100 z-10 shadow-sm">
//                     Fund Name
//                   </th>
//                   <th className="p-2 text-center min-w-[80px]">Debt/Ref?</th>
//                   <th className="p-2 text-right min-w-[100px]">Certified Levy</th>
//                   <th className="p-2 text-right min-w-[110px]">Base Net AV</th>
//                   <th className="p-2 text-right min-w-[80px] bg-gray-200/60 font-semibold">
//                     Base Rate
//                   </th>
//                   {Array.from({ length: 25 }, (_, i) => (
//                     <th key={i} className="p-2 text-right min-w-[70px]">
//                       Yr {i + 1}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="bg-green-100/40 font-mono font-semibold border-b">
//                   <td colSpan={3} className="p-2 sticky left-0 bg-green-100/80 z-10 font-sans text-green-900">
//                     Abated Project Assessed Value Schedule
//                   </td>
//                   <td className="p-2 text-right text-green-900" colSpan={3}>
//                     -
//                   </td>
//                   {abatedProjectAvSchedule.map((av, idx) => (
//                     <td key={idx} className="p-2 text-right text-green-900 min-w-[70px]">
//                       {fmtCurrency(av)}
//                     </td>
//                   ))}
//                 </tr>

//                 {newTaxRateResultsWithAbatement.fundRateImpacts.map((fund, idx) => (
//                   <tr key={fund.fundCode || idx} className="border-b hover:bg-green-50/30 font-mono">
//                     <td className="p-2 font-sans font-medium text-gray-800 sticky left-0 bg-white z-10">
//                       {fund.unitName}
//                     </td>
//                     <td className="p-2 font-sans text-gray-600 sticky left-[140px] bg-white z-10">
//                       {fund.fundName}
//                     </td>
//                     <td className="p-2 text-center font-sans">
//                       {fund.isDebtOrReferendum ? (
//                         <span className="inline-block px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-800 rounded font-bold">
//                           YES
//                         </span>
//                       ) : (
//                         <span className="text-gray-400">-</span>
//                       )}
//                     </td>
//                     <td className="p-2 text-right">
//                       {fund.certifiedLevy > 0 ? fmtCurrency(fund.certifiedLevy) : "-"}
//                     </td>
//                     <td className="p-2 text-right">
//                       {fund.baseNetAV > 0 ? fmtCurrency(fund.baseNetAV) : "-"}
//                     </td>
//                     <td className="p-2 text-right font-semibold bg-gray-50">
//                       {fmtRateOrDash(fund.baseTaxRate)}
//                     </td>

//                     {fund.newRatesByYear.map((rate, yrIdx) => (
//                       <td key={yrIdx} className="p-2 text-right">
//                         {fmtRateOrDash(rate)}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded border">
//             No taxing units selected or project data unavailable.
//           </div>
//         )}
//       </div>


// {/* Table 6: Total Property Tax Payments by Fund (No Abatement) */}
//       <div className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
//         <div className="flex justify-between items-center border-b pb-2">
//           <h3 className="text-md font-bold text-gray-700">
//             6. Total Property Tax Payments by Fund (Years 1–25 - No Abatement)
//           </h3>
//           <span className="text-xs text-gray-500 font-mono">
//             Payment = Project Assessed Value × New Tax Rate
//           </span>
//         </div>

//         {propertyTaxPaymentResults && propertyTaxPaymentResults.fundPayments.length > 0 ? (
//           <div className="overflow-x-auto max-h-[550px]">
//             <table className="w-full text-xs text-left border-collapse min-w-[2000px]">
//               <thead className="bg-gray-100 sticky top-0 border-b">
//                 <tr>
//                   <th className="p-2 min-w-[140px] sticky left-0 bg-gray-100 z-10 shadow-sm">
//                     Unit Name
//                   </th>
//                   <th className="p-2 min-w-[150px] sticky left-[140px] bg-gray-100 z-10 shadow-sm">
//                     Fund Name
//                   </th>
//                   <th className="p-2 text-center min-w-[80px]">Debt/Ref?</th>
//                   <th className="p-2 text-right min-w-[110px] bg-emerald-50/80 font-bold text-emerald-900">
//                     25-Yr Total
//                   </th>

//                   {/* Year 1 - 25 Headers */}
//                   {Array.from({ length: 25 }, (_, i) => (
//                     <th key={i} className="p-2 text-right min-w-[80px]">
//                       Yr {i + 1}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* Top Header Row for Project AV */}
//                 <tr className="bg-blue-50/70 font-mono font-semibold border-b">
//                   <td colSpan={3} className="p-2 sticky left-0 bg-blue-50 z-10 font-sans text-blue-900">
//                     Project Assessed Value Schedule
//                   </td>
//                   <td className="p-2 text-right text-blue-900 font-bold bg-blue-100/50">
//                     -
//                   </td>
//                   {projectAvSchedule.map((av, idx) => (
//                     <td key={idx} className="p-2 text-right text-blue-900 min-w-[80px]">
//                       {fmtCurrency(av)}
//                     </td>
//                   ))}
//                 </tr>

//                 {/* Fund Tax Payment Rows */}
//                 {propertyTaxPaymentResults.fundPayments.map((fund, idx) => (
//                   <tr key={fund.fundCode || idx} className="border-b hover:bg-gray-50 font-mono">
//                     <td className="p-2 font-sans font-medium text-gray-800 sticky left-0 bg-white z-10">
//                       {fund.unitName}
//                     </td>
//                     <td className="p-2 font-sans text-gray-600 sticky left-[140px] bg-white z-10">
//                       {fund.fundName}
//                     </td>
//                     <td className="p-2 text-center font-sans">
//                       {fund.isDebtOrReferendum ? (
//                         <span className="inline-block px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-800 rounded font-bold">
//                           YES
//                         </span>
//                       ) : (
//                         <span className="text-gray-400">-</span>
//                       )}
//                     </td>
//                     <td className="p-2 text-right font-bold text-emerald-900 bg-emerald-50/40">
//                       {fmtCurrency(fund.total25YrPayment)}
//                     </td>

//                     {/* Years 1-25 Payments */}
//                     {fund.paymentsByYear.map((pmt, yrIdx) => (
//                       <td key={yrIdx} className="p-2 text-right">
//                         {fmtCurrency(pmt)}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//               <tfoot className="bg-gray-100 font-mono font-bold border-t">
//                 <tr>
//                   <td className="p-2 sticky left-0 bg-gray-100 z-10" colSpan={3}>
//                     Total All Funds
//                   </td>
//                   <td className="p-2 text-right text-emerald-900 bg-emerald-100/80 font-bold">
//                     {fmtCurrency(propertyTaxPaymentResults.grandTotal25Yr)}
//                   </td>
//                   {propertyTaxPaymentResults.yearlyTotals.map((total, yrIdx) => (
//                     <td key={yrIdx} className="p-2 text-right">
//                       {fmtCurrency(total)}
//                     </td>
//                   ))}
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         ) : (
//           <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded border">
//             No taxing units selected or project data unavailable.
//           </div>
//         )}
//       </div>

//       {/* Table 6B: Total Property Tax Payments by Fund (With Abatement) */}
//       <div className="border border-green-200 rounded-lg p-4 bg-green-50/10 shadow-sm space-y-3">
//         <div className="flex justify-between items-center border-b pb-2">
//           <h3 className="text-md font-bold text-green-900">
//             6B. Total Property Tax Payments by Fund (Years 1–25 - With Abatement)
//           </h3>
//         </div>

//         {propertyTaxPaymentResultsWithAbatement && propertyTaxPaymentResultsWithAbatement.fundPayments.length > 0 ? (
//           <div className="overflow-x-auto max-h-[550px]">
//             <table className="w-full text-xs text-left border-collapse min-w-[2000px]">
//               <thead className="bg-green-100/60 sticky top-0 border-b">
//                 <tr>
//                   <th className="p-2 min-w-[140px] sticky left-0 bg-green-100 z-10 shadow-sm">
//                     Unit Name
//                   </th>
//                   <th className="p-2 min-w-[150px] sticky left-[140px] bg-green-100 z-10 shadow-sm">
//                     Fund Name
//                   </th>
//                   <th className="p-2 text-center min-w-[80px]">Debt/Ref?</th>
//                   <th className="p-2 text-right min-w-[110px] bg-emerald-100/80 font-bold text-emerald-900">
//                     25-Yr Total
//                   </th>

//                   {Array.from({ length: 25 }, (_, i) => (
//                     <th key={i} className="p-2 text-right min-w-[80px]">
//                       Yr {i + 1}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="bg-green-100/40 font-mono font-semibold border-b">
//                   <td colSpan={3} className="p-2 sticky left-0 bg-green-100/80 z-10 font-sans text-green-900">
//                     Abated Project Assessed Value Schedule
//                   </td>
//                   <td className="p-2 text-right text-green-900 font-bold bg-green-200/50">
//                     -
//                   </td>
//                   {abatedProjectAvSchedule.map((av, idx) => (
//                     <td key={idx} className="p-2 text-right text-green-900 min-w-[80px]">
//                       {fmtCurrency(av)}
//                     </td>
//                   ))}
//                 </tr>

//                 {propertyTaxPaymentResultsWithAbatement.fundPayments.map((fund, idx) => (
//                   <tr key={fund.fundCode || idx} className="border-b hover:bg-green-50/30 font-mono">
//                     <td className="p-2 font-sans font-medium text-gray-800 sticky left-0 bg-white z-10">
//                       {fund.unitName}
//                     </td>
//                     <td className="p-2 font-sans text-gray-600 sticky left-[140px] bg-white z-10">
//                       {fund.fundName}
//                     </td>
//                     <td className="p-2 text-center font-sans">
//                       {fund.isDebtOrReferendum ? (
//                         <span className="inline-block px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-800 rounded font-bold">
//                           YES
//                         </span>
//                       ) : (
//                         <span className="text-gray-400">-</span>
//                       )}
//                     </td>
//                     <td className="p-2 text-right font-bold text-emerald-900 bg-emerald-50/50">
//                       {fmtCurrency(fund.total25YrPayment)}
//                     </td>

//                     {fund.paymentsByYear.map((pmt, yrIdx) => (
//                       <td key={yrIdx} className="p-2 text-right">
//                         {fmtCurrency(pmt)}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//               <tfoot className="bg-green-100/80 font-mono font-bold border-t">
//                 <tr>
//                   <td className="p-2 sticky left-0 bg-green-100 z-10" colSpan={3}>
//                     Total All Funds
//                   </td>
//                   <td className="p-2 text-right text-emerald-900 bg-emerald-200/80 font-bold">
//                     {fmtCurrency(propertyTaxPaymentResultsWithAbatement.grandTotal25Yr)}
//                   </td>
//                   {propertyTaxPaymentResultsWithAbatement.yearlyTotals.map((total, yrIdx) => (
//                     <td key={yrIdx} className="p-2 text-right">
//                       {fmtCurrency(total)}
//                     </td>
//                   ))}
//                 </tr>
//               </tfoot>
//             </table>
//           </div>
//         ) : (
//           <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded border">
//             No taxing units selected or project data unavailable.
//           </div>
//         )}
//       </div>


//         {/* Table 7: Final Tax Offset / Savings Schedule */}
//       <div className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
//         <div className="flex justify-between items-center border-b pb-2">
//           <h3 className="text-md font-bold text-gray-700">
//             7. Community Tax Offset Schedule (Years 1–25)
//           </h3>
//           {taxOffsetResults && (
//             <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
//               Total 25-Yr Tax Offset: <strong>{fmtCurrency(taxOffsetResults.grandTotal25Yr)}</strong>
//             </span>
//           )}
//         </div>

//         {taxOffsetResults ? (
//           <div className="overflow-x-auto max-h-[500px]">
//             <table className="w-full text-xs text-left border-collapse min-w-[2000px]">
//               <thead className="bg-gray-100 sticky top-0 border-b">
//                 <tr>
//                   <th className="p-2 min-w-[220px] sticky left-0 bg-gray-100 z-10 shadow-sm">
//                     Metric
//                   </th>
//                   <th className="p-2 text-right min-w-[120px] font-bold">
//                     25-Yr Total
//                   </th>
//                   {Array.from({ length: 25 }, (_, i) => (
//                     <th key={i} className="p-2 text-right min-w-[80px]">
//                       Yr {i + 1}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//   <tr className="border-b font-mono bg-emerald-50/40 hover:bg-emerald-50/70 font-bold">
//     <td className="p-2 font-sans text-emerald-900 sticky left-0 bg-emerald-50 z-10 border-r">
//       Community Tax Offset
//     </td>
//     <td className="p-2 text-right text-emerald-900 bg-emerald-100/80">
//       {fmtCurrency(taxOffsetResults.grandTotal25Yr)}
//     </td>
//     {taxOffsetResults.yearlyTotals?.map((val: number | null, idx: number) => (
//       <td key={idx} className="p-2 text-right text-emerald-900">
//         {val !== null ? fmtCurrency(val) : "-"}
//       </td>
//     ))}
//   </tr>
// </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded border">
//             No taxing units selected or project data unavailable.
//           </div>
//         )}
//       </div>

//       {/* Table 7B: Community Tax Offset Schedule (With Abatement) */}
//       <div className="border border-green-200 rounded-lg p-4 bg-green-50/10 shadow-sm space-y-3">
//         <div className="flex justify-between items-center border-b pb-2">
//           <h3 className="text-md font-bold text-green-900">
//             7B. Community Tax Offset Schedule (Years 1–25 - With Abatement)
//           </h3>
//           {taxOffsetResultsWithAbatement && (
//             <span className="text-xs font-mono text-emerald-800 bg-emerald-100/80 px-2 py-1 rounded border border-emerald-300">
//               Total 25-Yr Tax Offset: <strong>{fmtCurrency(taxOffsetResultsWithAbatement.grandTotal25Yr)}</strong>
//             </span>
//           )}
//         </div>

//         {taxOffsetResultsWithAbatement ? (
//           <div className="overflow-x-auto max-h-[500px]">
//             <table className="w-full text-xs text-left border-collapse min-w-[2000px]">
//               <thead className="bg-green-100/60 sticky top-0 border-b">
//                 <tr>
//                   <th className="p-2 min-w-[220px] sticky left-0 bg-green-100 z-10 shadow-sm">
//                     Metric
//                   </th>
//                   <th className="p-2 text-right min-w-[120px] font-bold">
//                     25-Yr Total
//                   </th>
//                   {Array.from({ length: 25 }, (_, i) => (
//                     <th key={i} className="p-2 text-right min-w-[80px]">
//                       Yr {i + 1}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="border-b font-mono bg-emerald-100/40 hover:bg-emerald-100/70 font-bold">
//                   <td className="p-2 font-sans text-emerald-900 sticky left-0 bg-emerald-100 z-10 border-r">
//                     Community Tax Offset
//                   </td>
//                   <td className="p-2 text-right text-emerald-900 bg-emerald-200/80">
//                     {fmtCurrency(taxOffsetResultsWithAbatement.grandTotal25Yr)}
//                   </td>
//                   {taxOffsetResultsWithAbatement.yearlyTotals?.map((val: number | null, idx: number) => (
//                     <td key={idx} className="p-2 text-right text-emerald-900">
//                       {val !== null ? fmtCurrency(val) : "-"}
//                     </td>
//                   ))}
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded border">
//             No taxing units selected or project data unavailable.
//           </div>
//         )}
//       </div>



//       </div>

      


//   );
// };

// export default ScheduleVerificationTable;