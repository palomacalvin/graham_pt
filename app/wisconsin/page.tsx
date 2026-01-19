"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useLinkClickHandler } from "react-router-dom";

export default function WIHome() {
  const router = useRouter();

  const navigate = (type: "button") => {
      router.push("/wisconsin-all");
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
            onClick={() => navigate("button")}
            className="basicButton"
          >
            Wind and Solar Calculators
          </button>

          </div>

          <h2>
          In Wisconsin, large-scale wind and solar projects are exempt from local property taxes. Instead, projects pay
          taxes and fees to the Department of Revenue. The state then reimburses local governments via utility aid
          payments. Utility aid payments are split between the municipalities and counties hosting the project. The
          amount paid to each local unit is based on the type and size of the energy facility, and whether the project is
          located in a township or city/village.
          </h2>

          <h2>
          When farmland is converted, counties and municipalities gain substantial tax revenue from utility aid payments
          and a one-time conversion fee. While schools and other units lose a small amount of revenue from the elimination
          of agricultural property taxes, developers may agree to reimburse units for the loss.
          </h2>


          <div className="basicTextBlock">
            <h1> Taxes on Wind and Solar Projects</h1>
              <ul style={{marginTop: "1rem" }}>
                  <li>Annual utility aid payments: Utility aid payments typically total $5,000/per megawatt (MW) of project
                  capacity per year, split between counties and municipalities in proportions dictated by state law</li>
                  
                  <li>One-time conversion fee (Year 1): Counties charge a fee for converting farmland, averaging $283/acre
                  for 30+ acres, though fees vary widely based on agricultural land value.</li>

                  <li> Loss of farmland property taxes: Farm property taxes, based on current land use, no longer apply. Since
                  schools and some local units do not receive utility aid or conversion payments, they may lose a small
                  amount of annual revenue.</li>
              </ul>
            </div>

          <h2>
            Click on the button above to understand the tax impacts for wind and solar projects. Note that all values are
            estimates.
          </h2>

          <div className="basicTextBlock">
            Have questions? Visit the <a className="basicLinkText" href="https://graham.umich.edu/project/renewable-energy-tax-impacts" target="_blank" rel="noopener norefferer">landing page</a> or <a className="basicLinkText" href="minnesota/files/Minnesota-Property-Tax-Final-2025.pdf" download="Minnesota-Policy-Brief.pdf"> download the policy brief</a> for more information.
          </div>
        </div>
    </div>
  );
}
