"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";

export default function ILHome() {
  const router = useRouter();

  const navigate = (type: "button") => {
    router.push("/indiana-all");
  };

  return (
    <div className="home-page-wrapper">
      <Navbar />

      <main className="landing-container">
        
        <div className="intro-header-block" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 className="page-main-title">Indiana</h1>
          <img
            src="/photos-logos/EPCstacked.png"
            alt="EPC Logo"
            className="header-logo-image"
            style={{ maxWidth: "40vh", height: "auto", padding: "2rem" }}
          />
        </div>

        <div className="formTemplate">
          <button
            onClick={() => navigate("button")}
            className="basicButton"
          >
            Wind and Solar Calculators
          </button>
        </div>

        <div className="landing-body-text">
          <p>
            Wind and solar projects in Indiana are taxed like other types of property. County assessors determine the value
            of the land and equipment, and projects pay taxes at local rates to counties, townships, schools, and other units.
            Indiana limits the amount of property tax revenue that local units can collect, so a project with high property
            value (like a wind or solar project) does not always lead to a direct increase in local budgets. Instead, local
            officials can decide to reduce the taxes of neighboring property owners and/or to help finance public projects
            outside revenue restrictions. Local governments can also implement economic development agreements, tax
            abatements, and/or tax financing to change the size and distribution of tax impacts.
          </p>

         
          <ul>
            <li>
              <p><strong>Agricultural land value</strong> is determined by a statewide base price per acre, which is then adjusted depending
              on the property’s soil quality and land type.
              </p>
            </li>
            <li>
              <p>
                <strong>Land under solar panels</strong> is valued according to a standard minimum price per acre, called regional base
                rates. Rates are set annually by the state, with different rates for three regions in Indiana.
              </p>
            </li>
            <li>
              <p>
                <strong>Land under wind turbines</strong> is classified as industrial property and assessed at market value.
                Surrounding farmland, if still in agricultural use, continues to be taxed as farmland.
              </p>
            </li>
            <li>
              <p>
                <strong>Equipment such as wind turbines and solar panels</strong> are considered personal property and are assessed
                based on their initial cost, often constituting the largest share of the property value increase.
              </p>
            </li>
          </ul>

          <p>
            If the larger tax payments would cause a county or local unit to exceed its tax revenue limits for the year, the
            unit may choose to lower tax rates. In this case, the project’s impact is delivered to neighbors as a reduction in
            their annual tax bills. If the unit chooses to maintain rates, it must find other ways to collect project revenue that
            bypass limits, like economic development agreements or public financing. If the added tax revenue does not
            exceed the unit limit, project payments boost the local budget, enabling public services to improve or expand.
            In either case, the total benefit from property tax changes can be calculated as the difference between the
            project tax payments and the previous farmland payments.
          </p>

          <p>
            Click on the button above to understand the tax impacts for wind and solar projects. Note that all values are
            estimates.
          </p>
        </div>

        <div className="about-section-divider">
          <div className="info-callout-box">
            Have questions? Visit the{" "}
            <a className="accent-link" href="https://graham.umich.edu/project/renewable-energy-tax-impacts" target="_blank" rel="noopener noreferrer">
              landing page
            </a>{" "}
            or{" "}
            <a className="accent-link" href="/illinois/Illinois-Property-Tax-Final.pdf" download="Illinois-Policy-Brief.pdf">
              download the policy brief
            </a>{" "}
            for more information.
          </div>
        </div>

      </main>

      <Footer />
      <Analytics />
    </div>
  );
}