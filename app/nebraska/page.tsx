"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function NEHome() {
  const router = useRouter();

  const navigate = (type: "button") => {
      router.push("/nebraska-all");
  };

  return (
    <div className="home-page-wrapper">
      <Navbar />

      <main className="landing-container">
        <div className="intro-header-block" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          
          <h1 className="page-main-title">Nebraska</h1>
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

        <div className="landing-body-text">
          <p>
            Local governments, school districts, and other local taxing units (like natural resource districts and fire districts)
            in Nebraska receive revenues from wind and solar facilities through two categories: 
          </p>

          <p>
            <strong>Nameplate capacity taxes</strong>: These taxes are calculated by multiplying a facility’s rated power generation capacity (i.e.,
            its nameplate capacity), measured in megawatts (MW), times $3,518. This is distributed to all units in
            the tax district, based on their proportional share of the tax rate.
          </p>

          <p>
            <strong>Real property taxes</strong>: Wind and solar projects continue to pay property taxes on the underlying land,
            called real property.2 For renewable energy facilities, real property also includes foundations, access roads,
            fences, and the value of leases with landowners.3 In Nebraska, all real property is taxed according to the
            value it would be sold at in the real estate market. There is some dispute about whether to classify the
            land under renewable energy projects as agricultural land or commercial property. If the land is classified
            as agricultural land, there would be no change to the real property taxes paid when a renewable energy
            project is built. If the land is reclassified as commercial property, there would be a small increase in real
            property taxes paid, because agricultural land is valued for tax purposes at 75% of its market value. 
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
            <a className="accent-link" href="/nebraska/Nebraska-Property-Tax-Final.pdf" download="Nebraska-Policy-Brief.pdf">
              download the policy brief
            </a>{" "}
            for more information.
          </div>
        </div>
        
        </main>

        <Footer></Footer>
    </div>
  );
}
