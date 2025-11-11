import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="">
      <Navbar></Navbar>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <header>Introduction</header>
        <img
          src="/photos-logos/EPCstacked.png"
          alt="EPC Logo"
          style={{ maxWidth: "40vh", height: "auto", padding: "2rem" }}
        />
      </div>

      <h2>
        Renewable energy projects are expanding nationwide as governments and
        industries respond to climate change and advancing technology. This growth is
        expected to continue for projects of all sizes, especially utility-scale developments
        that power thousands of homes by feeding electricity directly to the grid. Spanning
        thousands of acres, these large projects are most often built in rural places and
        frequently on agricultural land. 
      </h2>

      <h2>
        Like other properties, these projects pay taxes to local government units, including
        towns, schools, libraries, and others. Energy property taxes are usually much
        higher than farmland taxes, though the size of the difference depends on state
        tax laws. Large-scale wind and solar projects are typically taxed in one of two
        ways: ad valorem (based on land and equipment value, taxed at local rates) or as
        a Payment in Lieu of Taxes or PILOT (often a flat rate tied to the project’s electricity
        production capacity). 
      </h2>

      <h2>
        State policymakers determine which tax system applies and how it is implemented,
        balancing the trade-offs between lower taxes to attract developers and higher
        taxes to benefit host communities. These policies—from the broad structures
        to the tiny details—shape the size and distribution of tax payments over a
        project’s 20- to 40-year lifespan. Sometimes units like counties and schools
        may be affected differently, and some local residents may benefit more than
        others. Policymakers must also plan for decommissioning to prevent “boom/bust”
        revenue cycles that can occur when major taxpayers enter and exit. With many
        of these policies newly established, state and local officials are still learning their
        applications and impacts.
      </h2>

      <header>About this page</header>

      <h2>
        This website is intended to be a resource to understand the 
        tax implications of renewable energy in eight Midwest states. 

        This material is for informational purposes only and is not intended
        as legal advice.
      </h2>

      <h2>
        To use this resource, view the calculators for your state of 
        interest. You may use default values for a given state, or choose
        values based on your project. Key information and sources are provided
        within each calculator. 
      </h2>

      <h2>
        You may also wish to consult policy briefs for the states
        for more in-depth explanations of policies in your state of interest.
        View the policy briefs or take a look at the Google Sheets versions
        of these calculators by visiting the Center for EmPowering Communities 
        project page, <em><a style={{ textDecoration: "underline", color: "#0075bc"}} href="https://graham.umich.edu/project/renewable-energy-tax-impacts"
          target="_blank"
          rel="noopener noreferrer"
        >Local Property Tax Impacts of Large Scale Wind and Solar Projects</a></em>.
      </h2>

      <Footer></Footer>
    </div>
  );
}
