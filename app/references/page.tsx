import React from "react";
import Navbar from "@/components/Navbar";

export default function ReferencesPage() {

  return (
    <>
    <Navbar></Navbar>
    <div style={{ margin: "3rem" }}>
      <h1>References Page</h1>
      <br></br>

      <h2 className="contact">
        On this page, download updated information briefs for the project. You can also find
        the same briefs by clicking to visit the 
        <a target="_blank" href="https://graham.umich.edu/project/renewable-energy-tax-impacts"
        className="contactPageLink"> project landing page</a>.
      </h2>

      <h2 className="contact">
        Below are lists of all references and data sources, which can also be found on the briefs.
      </h2>

      <h2 className="contact">
        If you have any questions or concerns please contact us by emailing
        <a href="mailto:empoweringcommunities@umich.edu" className="mailto">empoweringcommunities@umich.edu</a>.
      </h2>

      <section>
        <h1>Illinois</h1>
        <br></br>

        <a
          className="inPageButton"
          href={`/illinois/Illinois-Property-Tax-Final-2025.pdf`}
          download={`Illinois-Policy-Brief.pdf`}
        >
          Click to download the Illinois policy brief
        </a>

        <div>
          <ol className="ref-list">
            <li>
              Illinois Department of Revenue, “How Is Farmland Assessed for Property Tax?,” Government of Illinois, accessed May 13, 2025, <a target="_blank" 
              href="https://tax.illinois.gov/questionsandanswers/answer.319.html" className="contactPageLink">https://tax.illinois.gov/questionsandanswers/answer.319.html</a>
            </li>

            <li>
              Illinois Department of Revenue, “Commercial Solar Energy Systems Valuation,” accessed May 13 2025, <a target="_blank" 
              href="https://tax.illinois" className="contactPageLink">https://tax.illinois</a>.
            </li>

            <li>
              Conversation with Mclean County zoning office.
            </li>

            <li>
              Illinois Department of Revenue, “Commercial Solar Energy Systems Valuation,” accessed May 13 2025, {" "}
              <a target="_blank" href="https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/commercialsolarenergysystemsvaluation.pdf"
              className="contactPageLink">https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/commercialsolarenergysystemsvaluation.pdf</a>.
            </li>

            <li>
              Illinois Department of Revenue, “Wind Energy Device Valuation,” accessed May 13 2025, <a target="_blank" href="https://tax.illinois.gov/content/dam/soi/en/web/tax/
              localgovernments/property/documents/windenergydevicevaluation.pdf" className="contactPageLink">
              https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/windenergydevicevaluation.pdf</a>
            </li>

            <li>
              Illinois Department of Revenue, “Commercial Solar Energy Systems Valuation,” accessed May 13 2025, <a target="_blank" 
              href="https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/commercialsolarenergysystemsvaluation.pdf"
              className="contactPageLink">
              https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/commercialsolarenergysystemsvaluation.pdf</a>.
            </li>

            <li>
              Illinois Department of Revenue, “Wind Energy Device Valuation,” accessed May 13 2025, <a target="_blank" 
              href="https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/windenergydevicevaluation.pdf"
              className="contactPageLink">
              https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/windenergydevicevaluation.pdf</a>.
            </li>

            <li>
              Illinois Department of Revenue, “Wind Energy Device Valuation,” accessed May 13 2025, <a target="_blank"
              href="https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/windenergydevicevaluation.pdf"
              className="contactPageLink">
              https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/windenergydevicevaluation.pdf</a>.
            </li>

            <li>
              Illinois Department of Revenue, “History of CPI’s and Trending Factors Used for Wind Energy Device Valuation,” January 2024, {" "}
              <a target="_blank" href="https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/windenergytrendingfactors.pdf"
              className="contactPageLink">
              https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/windenergytrendingfactors.pdf</a>.
            </li>

            <li>
              llinois Department of Revenue, “Commercial Solar Energy Systems Valuation,” accessed May 13 2025, {" "}
              <a target="_blank" href="https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/commercialsolarenergysystemsvaluation.pdf"
              className="contactPageLink">
              https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/commercialsolarenergysystemsvaluation.pdf</a>.
            </li>

            <li>
              Illinois Department of Revenue, “Illinois Property Tax System: A General Guide to the Local Property Tax Cycle,” pp. 9: {" "}
              <a target="_blank" href="https://tax.illinois.gov/content/dam/soi/en/web/tax/research/publications/documents/localgovernment/ptax-1004.pdf"
              className="contactPageLink">
              https://tax.illinois.gov/content/dam/soi/en/web/tax/research/publications/documents/localgovernment/ptax-1004.pdf</a>.
            </li>

            <li>
              Illinois Department of Revenue, “Informational Bulletin,” June 2013, <a target="_blank"
              href="https://tax.illinois.gov/content/dam/soi/en/web/tax/research/publications/bulletins/documents/2014/fy-2014-16.pdf"
              className="contactPageLink">
              https://tax.illinois.gov/content/dam/soi/en/web/tax/research/publications/bulletins/documents/2014/fy-2014-16.pdf</a>.
            </li>

            <li>
              Illinois Department of Revenue, “Personal Property Replacement Tax,” accessed October 20 2024, {" "}
              <a target="_blank" href="https://tax.illinois.gov/localgovernments/personal-property-replacement-tax.html"
              className="contactPageLink">
              https://tax.illinois.gov/localgovernments/personal-property-replacement-tax.html</a>.
            </li>

            <li>
              Illinois Department of Revenue, “History of CPI’s and Trending Factors Used for Commercial Solar Energy Systems Valuation,” January 2025, {" "}
              <a target="_blank" href="https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/solarenergytrendingfactor.pdf"
              className="contactPageLink">
              https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/solarenergytrendingfactor.pdf</a>.
            </li>

            <li>
              Illinois Department of Revenue, “History of CPI’s and Trending Factors Used for Wind Energy Device Valuation,” January 2024, {" "}
              <a target="_blank" href="https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/windenergytrendingfactors.pdf"
              className="contactPageLink">
              https://tax.illinois.gov/content/dam/soi/en/web/tax/localgovernments/property/documents/windenergytrendingfactors.pdf</a>.
            </li>
          </ol>
        </div>
      </section>

      <br></br>


      <section>
        <h1>Indiana</h1>
        <br></br>

        <a
          className="inPageButton"
          href={`/indiana/Indiana-Property-Tax-Final-2025.pdf`}
          download={`Indiana-Policy-Brief.pdf`}
        >
          Click to download the Indiana policy brief
        </a>

        <div>
          <ol>
            <li>
              
            </li>
          </ol>
        </div>
      </section>

      <h1>Iowa</h1>
      <br></br>

      <a
        className="inPageButton"
        href={`/iowa/Iowa-Property-Tax-Final-2025.pdf`}
        download={`Iowa-Policy-Brief.pdf`}
      >
        Click to download the Iowa policy brief
      </a>

      <h1>Michigan</h1>
      <br></br>

      <a
        className="inPageButton"
        href={`/michigan/Michigan-Property-Tax-Final-2025.pdf`}
        download={`Michigan-Policy-Brief.pdf`}
      >
        Click to download the Michigan policy brief
      </a>

      <h1>Minnesota</h1>
      <br></br>

      <a
        className="inPageButton"
        href={`/minnesota/Minnesota-Property-Tax-Final-2025.pdf`}
        download={`Minnesota-Policy-Brief.pdf`}
      >
        Click to download the Minnesota policy brief
      </a>

      <h1>Nebraska</h1>
      <br></br>

      <a
        className="inPageButton"
        href={`/nebraska/Nebraska-Property-Tax-Final-2025.pdf`}
        download={`Nebraska-Policy-Brief.pdf`}
      >
        Click to download the Nebraska policy brief
      </a>

      <h1>Ohio</h1>
      <br></br>

      <a
        className="inPageButton"
        href={`/ohio/Ohio-Property-Tax-Final-2025.pdf`}
        download={`Ohio-Policy-Brief.pdf`}
      >
        Click to download the Ohio policy brief
      </a>

      <h1>Wisconsin</h1>
      <br></br>

      <a
        className="inPageButton"
        href={`/wisconsin/Wisconsin-Property-Tax-Final-2025.pdf`}
        download={`Wisconsin-Policy-Brief.pdf`}
      >
        Click to download the Wisconsin policy brief
      </a>

    </div>
    </>
  );
}
