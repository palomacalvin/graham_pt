import React from "react";

export default function ProjectLifeBreakdown() {
  return (
    <section className="about-section-divider">

        <h1 className="page-section-title">Breakdown Over the Life of the Project</h1>
    
        <div className="landing-body-text">
            <p>
            The gross value represents the total dollar value of tax revenue over the life of the project. 
            Underlying property values are adjusted for inflation on an annual basis.
            </p>

            <p>
            The net present value adjusts this dollar value using the discount factor to represent 
            what the future money is expected to be worth today (accounting for inflation and risk).
            </p>
        </div>
    </section>
  );
}