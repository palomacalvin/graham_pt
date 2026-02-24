import { ProjectData } from "@/types/MISolarProject";
import { MIMultiplicationFactors } from "@/types/MIMultiplicationFactors";


// Data structure for the yearly revenue calculations.
interface YearlyRevenueResult {
    year: number;
    tcv: number;
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

// Generates yearly revenue arrays up to 30 years.
export function generateYearlyRevenue(
    millage_rate: number,
    years = 30,
    projectData?: ProjectData,
    is_school_operating = false,
): YearlyRevenueResult[] {

    const results: YearlyRevenueResult[] = [];

    const inflation = projectData?.inflation_multiplier ?? 1;

    const ownership_change = projectData?.real_property_ownership_change;

    const taxable_increase = ownership_change ?
        Math.max(
            (projectData.post_solar_taxable_value ?? 0) -
            (projectData.pre_solar_taxable_value ?? 0),
            0
        ) : 0;



    // ================== Year 1 Calculations ======================== //
    let base_revenue: number;

    if (is_school_operating) {
        base_revenue = (millage_rate / 1000) * (projectData?.real_property_school_district_millages ?? 0);
    } else {
        base_revenue = (millage_rate / 1000) * taxable_increase;
    }

    let revenue = base_revenue;

    results.push({
        year: 1,
        tcv: is_school_operating 
        ? (projectData?.real_property_school_district_millages ?? 0)
        : taxable_increase,
        revenue,
    });

    // ======================= Year 2+ Calculations ======================= //

    for (let year = 2; year <= years; year++) {
        revenue = revenue * inflation;

        results.push({
            year,
            tcv: 0,
            revenue,
        });
    }

    return results;
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
    multiplicationFactors: MIMultiplicationFactors[]
) {
    const original_cost = projectData.original_cost_pre_inverter ?? 0;
    const discount_rate = projectData.annual_discount_rate ?? 0.05;

    const county_allocated = generateYearlyRevenue(
        projectData.county_allocated ?? 0,
    );


    const county_extra = generateYearlyRevenue(
        projectData.county_extra_voted ?? 0,
    );

    const county_debt = generateYearlyRevenue(
        projectData.county_debt ?? 0,
    );

    const total_county_per_year = sumRevenueStreams([
        county_allocated.map(x => x.revenue),
        county_extra.map(x => x.revenue),
        county_debt.map(x => x.revenue),
    ]);

    const gross_county = calculateGrossTotal(total_county_per_year);
    const county_npv = calculateNPV(discount_rate, total_county_per_year);

  
    // ========================= Local Unit ======================== //

    const local_unit_allocated = generateYearlyRevenue(
        projectData.lu_allocated ?? 0,
        30,
        projectData
    );

    const local_unit_extra_voted = generateYearlyRevenue(
        projectData.lu_extra_voted ?? 0,
        30,
        projectData
    );

    const local_unit_debt = generateYearlyRevenue(
        projectData.lu_debt ?? 0,
        30,
        projectData
    );

    const total_local_unit_per_year = sumRevenueStreams([
        local_unit_allocated.map(x => x.revenue),
        local_unit_extra_voted.map(x => x.revenue),
        local_unit_debt.map(x => x.revenue),
    ]);

    const gross_local_unit = calculateGrossTotal(total_local_unit_per_year);
    const local_unit_npv = calculateNPV(discount_rate, total_local_unit_per_year);

    // ========================= School District ======================== //

    const sd_hold_harmless = generateYearlyRevenue(
        projectData.sd_hold_harmless ?? 0,
        30,
        projectData
    );

    const sd_debt = generateYearlyRevenue(
        projectData.sd_debt ?? 0,
        30,
        projectData
    );

    const sd_operating = generateYearlyRevenue(
        projectData.sd_non_homestead ?? 0,
        30,
        projectData,
        true
    );

    const sd_sinking_fund = generateYearlyRevenue(
        projectData.sd_sinking_fund ?? 0,
        30,
        projectData
    );


    const sd_recreational = generateYearlyRevenue(
        projectData.sd_recreational ?? 0,
        30,
        projectData
    );


    const total_sd_per_year = sumRevenueStreams([
        sd_hold_harmless.map(x => x.revenue),
        sd_operating.map(x => x.revenue),
        sd_debt.map(x => x.revenue),
        sd_sinking_fund.map(x => x.revenue),
        sd_recreational.map(x => x.revenue),
    ]);

    const gross_sd = calculateGrossTotal(total_sd_per_year);
    const sd_npv = calculateNPV(discount_rate, total_sd_per_year);


    // ========================= Intermediate School District ======================== //

    const int_sd_allocated = generateYearlyRevenue(
        projectData.isd_allocated ?? 0,
        30,
        projectData
    );

    const int_sd_vocational = generateYearlyRevenue(
        projectData.isd_vocational ?? 0,
        30,
        projectData
    );

    const int_sd_special_ed = generateYearlyRevenue(
        projectData.isd_special_ed ?? 0,
        30,
        projectData
    );


    const int_sd_debt = generateYearlyRevenue(
        projectData.isd_debt ?? 0,
        30,
        projectData
    );

    const int_sd_enhancement = generateYearlyRevenue(
        projectData.isd_enhancement ?? 0,
        30,
        projectData
    );


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

    const comm_college_operating = generateYearlyRevenue(
        projectData.cc_operating ?? 0,
        30,
        projectData
    );

    const comm_college_debt = generateYearlyRevenue(
        projectData.cc_debt ?? 0,
        30,
        projectData
    );


    const total_cc_per_year = sumRevenueStreams([
        comm_college_operating.map(x => x.revenue),
        comm_college_debt.map(x => x.revenue),
    ]);

    const gross_comm_college = calculateGrossTotal(total_cc_per_year);
    const comm_college_npv = calculateNPV(discount_rate, total_cc_per_year);

    // ========================= Public Authorities ======================== //

    const pa = generateYearlyRevenue(
        projectData.part_unit_auth ?? 0,
        30,
        projectData
    );

    const pa_debt = generateYearlyRevenue(
        projectData.part_unit_auth_debt ?? 0,
        30,
        projectData
    );


    const total_pa_per_year = sumRevenueStreams([
        pa.map(x => x.revenue),
        pa_debt.map(x => x.revenue),
    ]);

    const gross_pa = calculateGrossTotal(total_pa_per_year);
    const pa_npv = calculateNPV(discount_rate, total_pa_per_year);

    // ========================= Village ======================== //

    const vill_allocated = generateYearlyRevenue(
        projectData.village_allocated ?? 0,
        30,
        projectData
    );

    const vill_extra = generateYearlyRevenue(
        projectData.village_extra_voted ?? 0,
        30,
        projectData
    );

    const vill_debt = generateYearlyRevenue(
        projectData.village_debt ?? 0,
        30,
        projectData
    );

    const vill_pa = generateYearlyRevenue(
        projectData.village_auth ?? 0,
        30,
        projectData
    );

    const vill_pa_debt = generateYearlyRevenue(
        projectData.village_auth_debt ?? 0,
        30,
        projectData
    );


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
            operating: sd_operating,
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
