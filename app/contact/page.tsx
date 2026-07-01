import React from "react";
import Navbar from "@/components/Navbar";
import FooterComp from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="home-page-wrapper">
      <Navbar />

      <main className="landing-container">

        <div className="intro-header-block">
          <h1 className="page-main-title">Contact Us</h1>
        </div>

        <div className="landing-body-text">
          <p>
            This project is updated and maintained by the Center for EmPowering Communities
            at the Graham Sustainability Institute (University of Michigan).
          </p>

          <p>
            If you have questions or concerns about references, page content,
            calculations, or website bugs, please reach out to{" "}
            <a href="mailto:empoweringcommunities@umich.edu" className="accent-link">
              empoweringcommunities@umich.edu
            </a>.
          </p>

          <p>
            For our full reference list, please visit the{" "}
            <a href="references" className="accent-link">References</a> page.
          </p>

          <p>
            To learn more about the project, click to{" "}
            <a 
              target="_blank" 
              rel="noopener noreferrer"
              href="https://graham.umich.edu/project/renewable-energy-tax-impacts" 
              className="accent-link"
            >
              visit the project's landing page
            </a>{" "}
            on the Graham Sustainability Institute website. On this page, you can find
            a webinar recording from August 2025 with helpful information about the project.
            You can also learn more about the Center for EmPowering Communities on this page.
          </p>
        </div>
  
        <div className="about-section-divider">
          <h1 className="page-section-title">Acknowledgements</h1>

          <div className="landing-body-text">
            <p>
              <em>
                Grounded in cutting-edge social science and deep community engagement, the Center for EmPowering
                Communities harnesses the expertise of the University of Michigan to support communities across the urban-rural 
                spectrum as they leverage decarbonization opportunities to advance their goals and enhance their quality of
                life. This material is based upon work supported by the U.S. Department of Energy’s Office of Energy Efficiency
                and Renewable Energy (EERE) under the Solar Energy Technologies Office Award Number EE00009361. The
                views expressed herein do not necessarily represent the views of the U.S. Department of Energy, or the United
                States Government. It is also supported by funding from the Rural Climate Partnership, a funding collaborative
                rooted in rural America.
              </em>
            </p>

            <p>
              <em>
                Contributors include Matthew Appel, Hayley Sakwa, Paloma Calvin, Vamika Jain, Alisa Sehgal, Alexandra Haddad
                and Fatimah Bolhassan, advised by Sarah Mills.
              </em>
            </p>
          </div>
        </div>

      </main>

      <FooterComp />
    </div>
  );
}