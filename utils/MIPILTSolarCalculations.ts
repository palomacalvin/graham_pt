import { ProjectData } from "@/types/MISolarProject";
import { MIMultiplicationFactors } from "@/types/MIMultiplicationFactors";

// PILT / Non-PILT Values
const QUALIFYING_PILT_RATE = 2000
const NON_QUALIFYING_PILT_RATE = 7000

// Data structure for the yearly revenue calculations.
interface YearlyRevenueResult {
  year: number;
  tcv?: number;
  revenue: number;
}

// NPV calculation function.
export function calculateNPV(rate: number, cash_flows: number[]): number {
    const first_year = cash_flows[0] ?? 0;
    const remaining = cash_flows.slice(1);

    const discounted = remaining.reduce((sum, cf, i) => {
    return sum + cf / Math.pow(1 + rate, i + 1);
    }, 0);

    return first_year + discounted;
}

// Sums the revenues.
export function sumRevenueStreams(
    streams: number[][]
): number[] {
    const years = streams[0]?.length ?? 0;

    return Array.from({ length: years }, (_, i) =>
        streams.reduce((sum, stream) => sum + (stream[i] ?? 0), 0)
    );
}

// Calculates the gross total.
export function calculateGrossTotal(values: number[]): number {
    return values.reduce((acc, val) => acc + val, 0);
}

// Main tax results calculations for each unit/jurisdiction.
export function calculateMichiganTaxResults(
    projectData: ProjectData,
    multiplicationFactors: MIMultiplicationFactors[],
    originalCost: number,
    years = 30
) {
    const discount_rate = projectData.annual_discount_rate ?? 0.05;
    const nameplate_capacity = projectData.nameplate_capacity ?? 0;

    const pilt_rate = projectData.real_property_conditions
        ? QUALIFYING_PILT_RATE
        : NON_QUALIFYING_PILT_RATE;

    const pilt_payment = nameplate_capacity * pilt_rate;


    const total_homestead_rate = Math.abs(((projectData.sd_comm_pers ?? 0) - (projectData.homestead_rate ?? 0)) / 1000);
    console.log(total_homestead_rate);
    const divisor = total_homestead_rate > 0 ? total_homestead_rate : 1;

    const proportionalPayment = (millage?: number) =>
        pilt_payment * (((millage ?? 0) / 1000) / divisor);


    const generateYearlyRevenue = (
        millage?: number
    ): YearlyRevenueResult[] => {

        return multiplicationFactors.slice(0, years).map((factor, index) => {

            const year = index + 1;

            // PILT years
            if (year <= 20) {
                const revenue = proportionalPayment(millage);
                return { year, revenue };
            }

            // Non-PILT years
            const tcv = originalCost * factor.factor_form_5762 * 0.5;
            const revenue = ((millage ?? 0) / 1000) * tcv;

            return { year, tcv, revenue };
        });
    };




    // ================= COUNTY =================

    const county_allocated = generateYearlyRevenue(projectData.county_allocated);

    const county_extra = generateYearlyRevenue(projectData.county_extra_voted);

    const county_debt = generateYearlyRevenue(projectData.county_debt);

    const total_county_per_year = sumRevenueStreams([
        county_allocated.map(x => x.revenue),
        county_extra.map(x => x.revenue),
        county_debt.map(x => x.revenue),
    ]);

    const gross_county = calculateGrossTotal(total_county_per_year);
    const county_npv = calculateNPV(discount_rate, total_county_per_year);

    console.log(total_county_per_year);
    console.log(gross_county);
    console.log(county_npv);


    // ========================= Local Unit ======================== //

    const local_unit_allocated = generateYearlyRevenue(projectData.lu_allocated);

    const local_unit_extra_voted = generateYearlyRevenue(projectData.lu_extra_voted);

    const local_unit_debt = generateYearlyRevenue(projectData.lu_debt);

    const total_local_unit_per_year = sumRevenueStreams([
        local_unit_allocated.map(x => x.revenue),
        local_unit_extra_voted.map(x => x.revenue),
        local_unit_debt.map(x => x.revenue),
    ]);

    const gross_local_unit = calculateGrossTotal(total_local_unit_per_year);
    const local_unit_npv = calculateNPV(discount_rate, total_local_unit_per_year);

    // ========================= School District ======================== //

    const sd_hold_harmless = generateYearlyRevenue(projectData.sd_hold_harmless);

    const sd_debt = generateYearlyRevenue(projectData.sd_debt);

    const sd_sinking_fund = generateYearlyRevenue(projectData.sd_sinking_fund);

    const sd_recreational = generateYearlyRevenue(projectData.sd_recreational);

    const total_sd_per_year = sumRevenueStreams([
        sd_hold_harmless.map(x => x.revenue),
        sd_debt.map(x => x.revenue),
        sd_sinking_fund.map(x => x.revenue),
        sd_recreational.map(x => x.revenue),
    ]);

    const gross_sd = calculateGrossTotal(total_sd_per_year);
    const sd_npv = calculateNPV(discount_rate, total_sd_per_year);

    // ========================= Intermediate School District ======================== //

    const int_sd_allocated = generateYearlyRevenue(projectData.isd_allocated);

    const int_sd_vocational = generateYearlyRevenue(projectData.isd_vocational);

    const int_sd_special_ed = generateYearlyRevenue(projectData.isd_special_ed);

    const int_sd_debt = generateYearlyRevenue(projectData.isd_debt);

    const int_sd_enhancement = generateYearlyRevenue(projectData.isd_enhancement);

    const total_isd_per_year = sumRevenueStreams([
        int_sd_allocated.map(x => x.revenue),
        int_sd_vocational.map(x => x.revenue),
        int_sd_special_ed.map(x => x.revenue),
        int_sd_debt.map(x => x.revenue),
        int_sd_enhancement.map(x => x.revenue),
    ]);

    const gross_isd = calculateGrossTotal(total_isd_per_year);
    const isd_npv = calculateNPV(discount_rate, total_isd_per_year);


    // ========================= Community College ======================== //

    const comm_college_operating = generateYearlyRevenue(projectData.cc_operating);

    const comm_college_debt = generateYearlyRevenue(projectData.cc_debt);

    const total_cc_per_year = sumRevenueStreams([
        comm_college_operating.map(x => x.revenue),
        comm_college_debt.map(x => x.revenue),
    ]);

    const gross_comm_college = calculateGrossTotal(total_cc_per_year);
    const comm_college_npv = calculateNPV(discount_rate, total_cc_per_year);

    // ========================= Public Authorities ======================== //

    const pa = generateYearlyRevenue(projectData.part_unit_auth);

    const pa_debt = generateYearlyRevenue(projectData.part_unit_auth_debt);

    const total_pa_per_year = sumRevenueStreams([
        pa.map(x => x.revenue),
        pa_debt.map(x => x.revenue),
    ]);

    const gross_pa = calculateGrossTotal(total_pa_per_year);
    const pa_npv = calculateNPV(discount_rate, total_pa_per_year);

    // ========================= Village ======================== //

    const vill_allocated = generateYearlyRevenue(projectData.village_allocated);

    const vill_extra = generateYearlyRevenue(projectData.village_extra_voted);

    const vill_debt = generateYearlyRevenue(projectData.village_debt);

    const vill_pa = generateYearlyRevenue(projectData.village_auth);

    const vill_pa_debt = generateYearlyRevenue(projectData.village_auth_debt);

    const total_village_per_year = sumRevenueStreams([
        vill_allocated.map(x => x.revenue),
        vill_extra.map(x => x.revenue),
        vill_debt.map(x => x.revenue),
        vill_pa.map(x => x.revenue),
        vill_pa_debt.map(x => x.revenue),
    ]);

    const gross_village = calculateGrossTotal(total_village_per_year);
    const village_npv = calculateNPV(discount_rate, total_village_per_year);

    // ====================== FINAL RETURN ===================== //

    return {
        county: {
            allocated: county_allocated,
            extra: county_extra,
            debt: county_debt,
            totalPerYear: total_county_per_year,
            gross: gross_county,
            npv: county_npv,
        },
        local_unit: {
            allocated: local_unit_allocated,
            extra: local_unit_extra_voted,
            debt: local_unit_debt,
            totalPerYear: total_local_unit_per_year,
            gross: gross_local_unit,
            npv: local_unit_npv,
        },
        school_district: {
            hold_harmless: sd_hold_harmless,
            debt: sd_debt,
            sinking_fund: sd_sinking_fund,
            recreational: sd_recreational,
            totalPerYear: total_sd_per_year,
            gross: gross_sd,
            npv: sd_npv,
        },
        intermediate_school_district: {
            allocated: int_sd_allocated,
            vocational: int_sd_vocational,
            special_education: int_sd_special_ed,
            debt: int_sd_debt,
            enhancement: int_sd_enhancement,
            totalPerYear: total_isd_per_year,
            gross: gross_isd,
            npv: isd_npv,
        },
        community_college: {
            operating: comm_college_operating,
            debt: comm_college_debt,
            totalPerYear: total_cc_per_year,
            gross: gross_comm_college,
            npv: comm_college_npv,
        },
        public_authority: {
            authority: pa,
            debt: pa_debt,
            totalPerYear: total_pa_per_year,
            gross: gross_pa,
            npv: pa_npv,
        },
        village: {
            allocated: vill_allocated,
            extra: vill_extra,
            debt: vill_debt,
            authority: vill_pa,
            authority_debt: vill_pa_debt,
            totalPerYear: total_village_per_year,
            gross: gross_village,
            npv: village_npv,
        },
    };
}
