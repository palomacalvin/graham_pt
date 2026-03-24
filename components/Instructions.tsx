import React, { useState } from "react";
import Link from "next/link";


export default function Instructions ( {state}: { state: string } ) {

    const fileName = `${state}-Property-Tax-Final-2025.pdf`

    return (

        <div className="basicBox">
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

            <p style={{ marginTop: "1rem" }}>
                Please contact us by emailing <a href="mailto:empoweringcommunities@umich.edu" className="mailto">empoweringcommunities@umich.edu</a> with any questions,
                comments, or feedback.
            </p>

            <br></br>

            <a
                className="inPageButton basicLinkText"
                href={`/${state.toLowerCase()}/${fileName}`}
                download={`${state}-Policy-Brief.pdf`}
            >
                Click to download the policy brief
            </a>
            
        </div>
    )
}