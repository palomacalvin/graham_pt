import React, { useState } from "react";
import Link from "next/link";


export default function Instructions ( {state}: { state: string } ) {

    const fileName = `${state}-Property-Tax-Final.pdf`

    return (
        <main className="landing-container">

        <div className="landing-body-text">

        <div className="info-callout-box" style={{marginBottom: "0"}}>
            <p>
                Fill in the fields below with values relevant to your project. Default values
                are available for each county, city/township, and school district; these values
                have been compiled from state-by-state research. See the{" "}
                <Link className="boxLinkText" href="references">
                    References
                </Link>{" "}
                page for more details.

                Hover over the information icons next to each field to learn more about individual inputs.
            </p>

            <div className="about-section-divider">
                <p><strong>Have feedback?</strong></p>
                We appreciate your perspective! If you have feedback to share, please fill out {" "}
                <a className="accent-link" href="https://docs.google.com/forms/d/e/1FAIpQLSeQAkqsU5jzojgh0W-Q8KQIs_8j3LmOq0NgpKYjhvr8CXLa6Q/viewform?usp=dialog">this Google form</a>. 
                The form is anonymous, but you can leave your name and email address if you'd like to be contacted by the Center for EmPowering Communities. Otherwise, you may 
                contact us directly by emailing <a href="mailto:empoweringcommunities@umich.edu" className="mailto">empoweringcommunities@umich.edu</a> with any questions,
                comments, or feedback.
            </div>

            <br></br>

            <a
                className="inPageButton basicLinkText"
                href={`/${state.toLowerCase()}/${fileName}`}
                download={`${state}-Policy-Brief.pdf`}
            >
                Click to download the policy brief
            </a>
            
        </div>

        </div>

        </main>

    )
}