// /app/indiana/page.tsx
import React from "react";
import Navbar from "@/components/Navbar";
import FooterComp from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
    <Navbar></Navbar>
      <div style={{ margin: "3rem" }}>
        <h1>Contact Us</h1>
        <br></br>

        <h2 className="contact">
          This project is updated
          and maintained by the Center for EmPowering Communities
          at the Graham Sustainability Institute (University of Michigan).
        </h2>

        <h2 className="contact">
          If you have questions or concerns about references, page content,
          calculations, or website bugs, please reach out to <a href="mailto:empoweringcommunities@umich.edu" className="mailto">empoweringcommunities@umich.edu</a>.
        </h2>

        <h2 className="contact">For our full reference list, please visit the <a href="references" className="contactPageLink">References</a> page.</h2>

        <h2 className="contact">To learn more about the project, click to 
          <a target="_blank" href="https://graham.umich.edu/project/renewable-energy-tax-impacts" className="contactPageLink">visit the project's landing page</a> 
          on the Graham Sustainability Institute website. On this page, you can find
          a webinar recording from August 2025 with helpful information about the project.
        </h2>

        <h2 className="contact">
          You may also learn more about the Center for EmPowering Communities by clicking to <a target="_blank" href="https://graham.umich.edu/empowering-communities" className="contactPageLink">
          visit the program's landing page</a>.
        </h2>

        <br></br>

        <h1>Acknowledgements</h1>
        <br></br>

        <p>
          <em>
            Grounded in cutting-edge social science and deep community engagement, the Center for EmPowering
            Communities harnesses the expertise of the University of Michigan to support communities across the urbanrural spectrum as they leverage decarbonization opportunities to advance their goals and enhance their quality of
            life. This material is based upon work supported by the U.S. Department of Energy’s Office of Energy Efficiency
            and Renewable Energy (EERE) under the Solar Energy Technologies Office Award Number EE00009361. The
            views expressed herein do not necessarily represent the views of the U.S. Department of Energy, or the United
            States Government. It is also supported by funding from the Rural Climate Partnership, a funding collaborative
            rooted in rural America.
          </em>
        </p>

        <br></br>

        <p>
          <em>
            Contributors include Matthew Appel, Hayley Sakwa, Paloma Calvin, Vamika Jain, Alisa Sehgal, Alexandra Haddad
            and Fatimah Bolhassan, advised by Sarah Mills.
          </em>
        </p>

      </div>
      <FooterComp></FooterComp>
    </>
    
  );
}
