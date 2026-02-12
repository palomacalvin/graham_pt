"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useLinkClickHandler } from "react-router-dom";

export default function Home() {
  const router = useRouter();

  const chooseType = (type: "wind" | "solar") => {
    if (type === "wind") {
      router.push("/michigan-wind");
    } else if (type === "solar") {
      router.push("/michigan-solar");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <header>Michigan</header>
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
          Wind and solar projects in Michigan pay personal property taxes based on the installed new cost of the
          renewable energy project. Most of the equipment is taxed as industrial personal property, but some components
          like electrical substations or new transmission lines are taxed as utility personal property. The land under solar
          panels is typically reclassified as industrial real property, while land under wind turbines retains its property
          classification from before the project was built.
          </h2>

          <h2>
            <ul>
              <li>
                <strong>Valuation: </strong>The State Tax Commission determines which components of a renewable energy project should
                        be taxed and sets valuation multipliers that incorporate both inflation and depreciation.
               </li>
               <li>
                <strong> School funding: </strong>Renewable energy developers pay a 18-mill school operating millage and a 6-mill State
                  Education Tax on some components of their projects. However, since school operating funding in Michigan
                  is allocated on a per pupil basis, these don’t usually result in noticeable changes at the local level. Where
                  voters in a local school district have approved a debt or sinking fund millage, renewable energy developers
                  pay these millages which do directly grow local budgets.
               </li>
            </ul>
          </h2>

          <h2>
            Solar projects of at least 2 megawatts may be eligible for a payment in lieu of taxes (PILT), which exempts
            them from industrial personal property taxes, but replaces it with an annual flat rate based on the project’s
            nameplate capacity. The PILT is $7,000 per megawatt for most projects, though the PILT must be reduced to
            $2,000 per megawatt if the property where the solar project is located is state-owned, in an Opportunity Zone,
            or is located on a brownfield site. The local government has discretion to approve or deny the developer’s
            request for a PILT.
          </h2>

          <h2>
          Click on the buttons above to understand the tax impacts for wind and solar projects. Note that all values are
          estimates.

          </h2>

          <div className="basicTextBlock">
            Have questions? Visit the <a className="basicLinkText" href="https://graham.umich.edu/project/renewable-energy-tax-impacts" target="_blank" rel="noopener norefferer">landing page</a> or <a className="basicLinkText" href="michigan/files/Michigan-Property-Tax-Final-2025.pdf" download="Michigan-Policy-Brief.pdf"> download the policy brief</a> for more information.
          </div>
        </div>
    </div>
  );
}
