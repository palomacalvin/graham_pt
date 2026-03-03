"use client";

import React from "react";
import { ProjectData } from "@/types/MISolarProject";

interface Props {
  projectData: ProjectData;
  setProjectData: React.Dispatch<React.SetStateAction<ProjectData>>;
}

export default function MISolarProjectDetailsSection ({
    projectData,
    setProjectData

}: Props) {

    const inflation = (projectData.inflation_multiplier ?? 0) * 100;
    const discount = (projectData.annual_discount_rate ?? 0) * 100;

    return (
        <section>
            <h1>Project Details</h1>

            <br />

            <p style={{ color: "red", fontStyle: "italic"}}>
                All fields in this section are required. You may choose to
                use the defaults listed below, or override them with values relevant to
                your project.
            </p>
            
            <br></br>
            
            <label>
                Nameplate capacity of solar project (in megawatts):
                <div className="inputWithInfo">
                    <input
                        type="number"
                        value={projectData?.nameplate_capacity ?? 100}
                        onChange={(e) =>
                            setProjectData((prev) => ({
                                ...prev!,
                                nameplate_capacity: parseFloat(e.target.value),
                            }))
                            }
                        className="basicInputBox"
                    />
                </div>
            </label>

        

            <label>
                Original cost of site improvements for <strong>new</strong>{" "}
                solar projects <strong>up to and including the inverter</strong>, including:
                solar modules, racks, tracking, on-site battery storage systems, controls, interver ($):
                <div className="inputWithInfo">
                <input
                    type="number"
                    value={projectData.original_cost_pre_inverter}
                    onChange={(e) =>
                        setProjectData((prev) => ({
                        ...prev,
                        original_cost_pre_inverter: parseFloat(e.target.value),
                        }))
                    }
                    className="basicInputBox"
                    />
                    <div className="infoWrapper">
                        <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                        <div className="infoBubble">
                            If you don't know the total cost of a particular project, it can be estimated by 
                            multiplying $1 million by the nameplate capacity in megawatts. If you are unsure about how the total project cost should be divided between these two 
                            categories, assume that 90% of the total cost is for site improvements <strong>up 
                            to and including the inverter</strong>.
                        </div>
                    </div>
                </div>
            </label>


        <label>
            Original cost of site improvements for <strong>new</strong> solar project
            {" "}<strong>after the inverter</strong>, including: cables, substations, and other transmission
            and distribution infrastructure created by the solar project ($):
            <div className="inputWithInfo">
                <input
                    type="number"
                    value={projectData?.original_cost_post_inverter ?? 10000000}
                    onChange={(e) =>
                        setProjectData((prev) => ({
                        ...prev,
                        original_cost_post_inverter: parseFloat(e.target.value),
                        }))
                    }
                    className="basicInputBox"
                />

                <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                    <div className="infoBubble">
                        If you are unsure about how the total project cost should be divided between these two 
                        categories, assume that 10% is for site improvements <strong>after</strong>{" "} 
                        the inverter.
                    </div>
                </div>
            </div>
        </label>

        <label>
            Expected useful economic life of project (years):
            <div className="inputWithInfo">
                <input
                    type="number"
                    step="1"
                    value={projectData?.expected_useful_life ?? 30}
                    onChange={(e) =>
                        setProjectData((prev) => ({
                        ...prev,
                        expected_useful_life: parseFloat(e.target.value),
                        }))
                }
                className="basicInputBox"
                />

                <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                    <div className="infoBubble">
                        Note: This calculator can only calculate revenues up to 35 years.
                    </div>
                </div>
            </div>
        </label>

    

        <label>
            Average annual inflation rate (%):
            <div className="inputWithInfo">
                <input
                    type="number"
                    step="0.01"
                    value={inflation}
                    onChange={(e) =>
                    setProjectData((prev) => ({
                        ...prev,
                        inflation_multiplier: parseFloat(e.target.value) / 100,
                    }))
                    }
                    className="basicInputBox"
                />
                

                <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                    <div className="infoBubble">
                        The default number (2.7%) represents the average 
                        annual inflation rate multiplier from 1995-2025 as calculated by 
                        the State Tax Commission. 
                        The default multiplier translates to a 2.7% average annual inflation rate. 
                        Users can override this default number and enter their own estimated 
                        average annual inflation rate multiplier if they prefer.
                    </div>
                </div>
            </div>
        </label>

        <label>
            Annual discount rate (%):
            <div className="inputWithInfo">
                <input
                    type="number"
                    step="0.01"
                    value={discount}
                    onChange={(e) =>
                    setProjectData((prev) => ({
                        ...prev,
                        annual_discount_rate: parseFloat(e.target.value) / 100,
                    }))
                    }
                    className="basicInputBox"
                />
                <div className="infoWrapper">
                    <img src="/photos-logos/information-bubble.svg" alt="Vector graphic information bubble"></img>
                    <div className="infoBubble">
                        The default discount rate of 3.0% comes from {" "}
                        <a style={{ textDecoration: "underline" }} target="_blank" href="https://nvlpubs.nist.gov/nistpubs/ir/2023/NIST.IR.85-3273-38.pdf">FEMP guidelines for analyzing renewable energy projects for federal agencies</a>.
                        Users can override this default rate and enter their own estimated 
                        discount rate if they prefer.
                    </div>
                </div>

            </div>
            </label>

        </section>
    )
}