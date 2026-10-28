import { useState } from "react";
import API from "../services/api";

function AddRequest({ onRequestAdded }) {

    const [request, setRequest] = useState({
        patientName: "",
        bloodGroup: "",
        unitsRequired: "",
        hospital: "",
        status: "Pending"
    });

    const handleChange = (e) => {
        setRequest({
            ...request,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await API.post("/api/requests", request);

            alert("Blood Request Added Successfully!");

            setRequest({
                patientName: "",
                bloodGroup: "",
                unitsRequired: "",
                hospital: "",
                status: "Pending"
            });

            if (onRequestAdded) {
                onRequestAdded();
            }

        } catch (error) {

            console.error("Full Error:", error);

            if (error.response) {
                console.log("Backend Error:", error.response.data);
                alert("Error: " + JSON.stringify(error.response.data));
            } else {
                alert("Unable to connect to the server.");
            }

        }

    };

    return (

        <div className="card mb-4">

            <div className="card-header bg-danger text-white">
                Add Blood Request
            </div>

            <div className="card-body">

                <form onSubmit={handleSubmit}>

                    <div className="row">

                        <div className="col-md-6 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Patient Name"
                                name="patientName"
                                value={request.patientName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <select
                                className="form-control"
                                name="bloodGroup"
                                value={request.bloodGroup}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Blood Group</option>
                                <option>A+</option>
                                <option>A-</option>
                                <option>B+</option>
                                <option>B-</option>
                                <option>AB+</option>
                                <option>AB-</option>
                                <option>O+</option>
                                <option>O-</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Units Required"
                                name="unitsRequired"
                                value={request.unitsRequired}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Hospital Name"
                                name="hospital"
                                value={request.hospital}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <select
                                className="form-control"
                                name="status"
                                value={request.status}
                                onChange={handleChange}
                            >
                                <option>Pending</option>
                                <option>Approved</option>
                                <option>Completed</option>
                            </select>
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="btn btn-danger"
                    >
                        Save Request
                    </button>

                </form>

            </div>

        </div>

    );

}

export default AddRequest;