"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useLinkClickHandler } from "react-router-dom";

export default function Home() {
  const router = useRouter();

  const chooseType = (type: "wind" | "solar") => {
    if (type === "wind") {
      router.push("/minnesota-wind");
    } else if (type === "solar") {
      router.push("/minnesota-solar");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <header>Minnesota</header>
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
          In Minnesota, wind and solar projects pay property taxes based on both land value and energy production.
          Land is classified according to its primary use—typically agriculture or energy production—and taxed at
          local rates accordingly. In addition, projects pay a production tax per megawatt-hour (MWh) of electricity
          generated annually.
          </h2>

          <h2>
          Click on the buttons above to understand the tax impacts for wind and solar projects. Note that all values are
          estimates.

          </h2>

          <div className="basicTextBlock">
            <h1> Taxes on Wind and Solar Projects</h1>
              <ul style={{marginTop: "1rem" }}>
                  <li>Land tax: Wind and solar projects continue to pay property taxes on the land they occupy, though
                  sometimes the classification of the land changes. Land directly under solar panels is usually considered
                  as commercial and taxed at a higher rate than agricultural land. In contrast, land around wind turbines
                  typically retains its agricultural classification and lower tax rate.</li>
                  
                  <li>Production tax: Instead of paying personal property taxes on equipment, projects pay $1.20 per MWh
                  of electricity produced each year. Annual production varies depending on factors such as local conditions
                  (e.g., wind or sunlight levels), energy demand (e.g., grid power needs), and specific project requirements
                  (e.g., maintenance, adverse conditions, compliance).</li>
              </ul>
          </div>

          <div className="basicTextBlock">
            Have questions? Visit the <a className="basicLinkText" href="https://graham.umich.edu/project/renewable-energy-tax-impacts" target="_blank" rel="noopener norefferer">landing page</a> or <a className="basicLinkText" href="minnesota/files/Minnesota-Property-Tax-Final-2025.pdf" download="Minnesota-Policy-Brief.pdf"> download the policy brief</a> for more information.
          </div>
        </div>
    </div>
  );
}
