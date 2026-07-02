"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ILHome() {
  const router = useRouter();

  const navigate = (type: "button") => {
    router.push("/illinois-all");
  };

  return (
    <div className="home-page-wrapper">
      <Navbar />

      <main className="landing-container">
        
        <div className="intro-header-block" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 className="page-main-title">Illinois</h1>
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
            Agricultural land values for Illinois property taxes are determined by the land’s expected contribution to farm
            income based on the productivity of the soil. In a parallel sense, Illinois bases the assessed value (property
            value for tax purposes) of large-scale renewable energy projects on their electricity-generating potential, called
            nameplate capacity. The assessed value for these projects is determined by a per-megawatt rate that is set
            at the state-level, which is then adjusted annually to account for inflation. The per-megawatt rate for solar
            energy is $218,000 per megawatt (MW) of nameplate capacity, while the rate for wind is $360,000 per MW.
            As the property ages, depreciation is also subtracted from the value.
          </p>

          <p>
            In Illinois, most real property (land and buildings) is taxed at one-third of its assessed value, including renewable
            energy projects and agricultural land. If a property is used for both agriculture and renewable energy, it is
            valued according to the proportion of each use. Wind and solar projects then pay taxes to local government
            units—like counties, townships, and schools—according to local tax rates.
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
    </div>
  );
}