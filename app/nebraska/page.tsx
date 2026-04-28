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
    <div>
      <Navbar />
      <div className="">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <header>Nebraska</header>
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
          Local governments, school districts, and other local taxing units (like natural resource districts and fire districts)
          in Nebraska receive revenues from wind and solar facilities through two categories: 
          </h2>

          <h2>
            <strong>Nameplate capacity taxes</strong>: These taxes are calculated by multiplying a facility’s rated power generation capacity (i.e.,
            its nameplate capacity), measured in megawatts (MW), times $3,518. This is distributed to all units in
            the tax district, based on their proportional share of the tax rate.
          </h2>

          <h2>
            <strong>Real property taxes</strong>: Wind and solar projects continue to pay property taxes on the underlying land,
            called real property.2 For renewable energy facilities, real property also includes foundations, access roads,
            fences, and the value of leases with landowners.3 In Nebraska, all real property is taxed according to the
            value it would be sold at in the real estate market. There is some dispute about whether to classify the
            land under renewable energy projects as agricultural land or commercial property. If the land is classified
            as agricultural land, there would be no change to the real property taxes paid when a renewable energy
            project is built. If the land is reclassified as commercial property, there would be a small increase in real
            property taxes paid, because agricultural land is valued for tax purposes at 75% of its market value. 
          </h2>

          <h2>
            Click on the button above to understand the tax impacts for wind and solar projects. Note that all values are
            estimates.
          </h2>

          <div className="basicTextBlock">
            Have questions? Visit the <a className="basicLinkText" href="https://graham.umich.edu/project/renewable-energy-tax-impacts" target="_blank" rel="noopener norefferer">landing page</a> or <a className="basicLinkText" href="/nebraska/Nebraska-Property-Tax-Final-2025.pdf" download="Nebraska-Policy-Brief.pdf"> download the policy brief</a> for more information.
          </div>
        </div>

        <Footer></Footer>
    </div>
  );
}
