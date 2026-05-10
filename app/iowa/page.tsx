"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function IAHome() {
  const router = useRouter();

  const chooseType = (type: "wind" | "solar") => {
    if (type === "wind") {
      router.push("/iowa-wind");
    } else if (type === "solar") {
      router.push("/iowa-solar");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <header>Iowa</header>
            <img
              src="/photos-logos/EPCstacked.png"
              alt="EPC Logo"
              style={{ maxWidth: "40vh", height: "auto", padding: "2rem" }}
            />
        </div>

        <div className="formTemplate">
          <button
            onClick={() => chooseType("wind")}
            className="basicButton"
          >
            Wind
          </button>

          <button
            onClick={() => chooseType("solar")}
            className="basicButton"
          >
            Solar
          </button>

          </div>

          <h2>
          In Iowa, when large-scale solar projects are constructed, the farmland is no longer taxed as agricultural
          property. Instead, the solar projects continue to pay taxes to counties, townships, schools, and other local units,
          but through a different framework. When large-scale wind projects are constructed, in contrast, traditional
          real property taxes are still paid on the farmland, but the wind project itself is taxed according to a special
          valuation system.
          </h2>

          <h2>
            <ul>
              <li>
                <strong>Solar projects</strong> are treated as utility-scale energy producers, which pay a Replacement Tax rather than traditional property
                taxes. This is an annual fee based on a project’s electricity generation, transmission assets, and electricity delivered to
                end-users in any given year. The replacement tax is distributed to local government units in the same proportions as
                property taxes.
               </li>
               <li>
                <strong>Wind projects</strong> are typically taxed under a special valuation system, which assesses the project based on a percentage of
                  its net acquisition cost (total cost to acquire and install turbines, including foundations and equipment, minus adjustments).
                  This system uses a set percentage schedule, with 0% of net acquisition cost being taxable in Year 1 and an additional 5%
                  added each year until Year 7, when the percentage is capped at 30%. This taxable value is then multiplied by local tax rates
                  to determine the wind project’s tax bill. Wind projects are also often set up as Tax Increment Financing (TIF) projects, in
                  which the county directs the increased tax revenue from the projects to a special fund for public redevelopment projects.
               </li>
            </ul>
          </h2>

          <h2>
          Click on the buttons above to understand the tax impacts for wind and solar projects. Note that all values are
          estimates.

          </h2>

          <div className="basicTextBlock">
            Have questions? Click to visit the <a className="basicLinkText" href="https://graham.umich.edu/project/renewable-energy-tax-impacts" target="_blank" rel="noopener norefferer">landing page</a> or <a className="basicLinkText" href="/iowa/Iowa-Property-Tax-Final-2025.pdf" download="Iowa-Policy-Brief.pdf"> download the policy brief</a> for more information.
          </div>
        </div>

        <Footer></Footer>
    </div>
  );
}
