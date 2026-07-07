"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";


export default function WIHome() {
  const router = useRouter();

  const navigate = (type: "button") => {
      router.push("/wisconsin-all");
  };

  return (
    <div className="home-page-wrapper">
      <Navbar />

      <main className="landing-container">

        <div className="intro-header-block" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          
          <h1 className="page-main-title">Wisconsin</h1>
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
            In Wisconsin, large-scale wind and solar projects are exempt from local property taxes. Instead, projects pay
            taxes and fees to the Department of Revenue. The state then reimburses local governments via utility aid
            payments. Utility aid payments are split between the municipalities and counties hosting the project. The
            amount paid to each local unit is based on the type and size of the energy facility, and whether the project is
            located in a township or city/village. 
          </p>

          <p>
            When farmland is converted, counties and municipalities gain substantial tax revenue from utility aid payments
            and a one-time conversion fee. While schools and other units lose a small amount of revenue from the elimination
            of agricultural property taxes, developers may agree to reimburse units for the loss.
          </p>

          <ul>
            <li>
              <p>
                <strong>Annual utility aid payments:</strong>Utility aid payments typically total $5,000/per megawatt (MW) of project
                capacity per year, split between counties and municipalities in proportions dictated by state law.
              </p>
            </li>
            <li>
              <p>
                <strong>One-time conversion fee (Year 1):</strong> Counties charge a fee for converting farmland, averaging $283/acre
                for 30+ acres, though fees vary widely based on agricultural land value.
              </p>
            </li>
            <li>
              <p>
                <strong>Loss of farmland property taxes:</strong> Farm property taxes, based on current land use, no longer apply. Since
                schools and some local units do not receive utility aid or conversion payments, they may lose a small
                amount of annual revenue.
              </p>
            </li>
          </ul>

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
            <a className="accent-link" href="/wisconsin/Wisconsin-Property-Tax-Final.pdf" download="Wisconsin-Policy-Brief.pdf">
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
