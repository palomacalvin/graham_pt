"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function OHHome() {
  const router = useRouter();

  const navigate = (type: "button") => {
      router.push("/ohio-all");
  };

  return (
    <div>
      <Navbar />
      <div className="">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <header>Ohio</header>
            <img
              src="/photos-logos/EPCstacked.png"
              alt="EPC Logo"
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

          <h2>
          In Ohio, renewable energy developers typically contribute to local tax revenue through the state’s <strong>Qualified
          Energy Project (QEP)</strong> program. Under this framework, eligible wind and solar projects are exempt from
          traditional property taxes and instead make annual Payments in Lieu of Taxes (PILOT) based on project
          capacity. These payments range from $6,000 to $8,000 per megawatt (MW), depending on the percentage
          of full-time Ohio-resident workers employed. Counties may also negotiate additional discretionary payments,
          allowing total contributions to reach up to $9,000 per MW. Mandatory payments are distributed to counties,
          townships, and school districts in the same proportions as property taxes, while discretionary payments go
          to the county’s general fund.
          </h2>

          <h2>
            <strong>Non-QEP projects</strong> are taxed as public utility properties based on land and equipment value. In these cases,
            the Ohio Department of Taxation treats wind and solar equipment as public utility equipment and assesses
            it based on type (production, transmission or distribution), and years of service. Land under solar panels is
            classified as commercial and valued according to market price. Land that remains in agricultural use, as is
            common between wind turbines, is assessed based on its expected agricultural income. and may qualify for
            additional tax reductions. Property tax revenue from non-QEP projects is distributed to local taxing units based
            on local tax rates.
          </h2>

          <h2>
            Click on the button above to understand the tax impacts for wind and solar projects. Note that all values are
            estimates.
          </h2>

          <div className="basicTextBlock">
            Have questions? Visit the <a className="basicLinkText" href="https://graham.umich.edu/project/renewable-energy-tax-impacts" target="_blank" rel="noopener norefferer">landing page</a> or <a className="basicLinkText" href="/ohio/Ohio-Property-Tax-Final-2025.pdf" download="Ohio-Policy-Brief.pdf"> download the policy brief</a> for more information.
          </div>
        </div>

        <Footer></Footer>
    </div>
  );
}
