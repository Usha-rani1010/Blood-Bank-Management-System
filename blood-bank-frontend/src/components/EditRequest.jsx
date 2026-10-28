import { useEffect, useState } from "react";
import API from "../services/api";

function EditRequest({ request, onUpdated }) {

    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        patientName: "",
        bloodGroup: "",
        unitsRequired: "",
        hospital: "",
        status: "Pending"
    });


    // Load request data when Edit is clicked

    useEffect(() => {

        if (request) {

            setFormData({
                patientName: request.patientName || "",
                bloodGroup: request.bloodGroup || "",
                unitsRequired: request.unitsRequired || "",
                hospital: request.hospital || "",
                status: request.status || "Pending"
            });

        }

    }, [request]);


    // Open edit form

    const handleEdit = () => {

        setFormData({
            patientName: request.patientName || "",
            bloodGroup: request.bloodGroup || "",
            unitsRequired: request.unitsRequired || "",
            hospital: request.hospital || "",
            status: request.status || "Pending"
        });

        setShowModal(true);

    };


    // Handle form changes

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // Update request

    const updateRequest = async (e) => {

        e.preventDefault();

        try {

            const updatedRequest = {
                patientName: formData.patientName,
                bloodGroup: formData.bloodGroup,
                unitsRequired: Number(formData.unitsRequired),
                hospital: formData.hospital,
                status: formData.status
            };


            await API.put(
                `/api/requests/${request.id}`,
                updatedRequest
            );


            alert("Request Updated Successfully!");


            setShowModal(false);


            if (onUpdated) {
                onUpdated();
            }


        } catch (error) {

            console.error("Update Request Error:", error);

            alert("Unable to update request");

        }

    };


    return (

        <>

            {/* EDIT BUTTON */}

            <button
                type="button"
                className="btn btn-warning btn-sm me-2"
                onClick={handleEdit}
            >
                Edit
            </button>


            {/* EDIT MODAL */}

            {showModal && (

                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    }}
                >

                    <div className="modal-dialog">

                        <div className="modal-content">


                            {/* Header */}

                            <div className="modal-header bg-warning">

                                <h5 className="modal-title">
                                    Edit Blood Request
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>

                            </div>


                            {/* Form */}

                            <form onSubmit={updateRequest}>

                                <div className="modal-body">


                                    {/* Patient Name */}

                                    <label className="form-label">
                                        Patient Name
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control mb-3"
                                        name="patientName"
                                        value={formData.patientName}
                                        onChange={handleChange}
                                        required
                                    />


                                    {/* Blood Group */}

                                    <label className="form-label">
                                        Blood Group
                                    </label>

                                    <select
                                        className="form-select mb-3"
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>

                                    </select>


                                    {/* Units */}

                                    <label className="form-label">
                                        Units Required
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control mb-3"
                                        name="unitsRequired"
                                        value={formData.unitsRequired}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />


                                    {/* Hospital */}

                                    <label className="form-label">
                                        Hospital
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control mb-3"
                                        name="hospital"
                                        value={formData.hospital}
                                        onChange={handleChange}
                                        required
                                    />


                                    {/* STATUS */}

                                    <label className="form-label fw-bold">
                                        Request Status
                                    </label>

                                    <select
                                        className="form-select"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="Approved">
                                            Approved
                                        </option>

                                        <option value="Completed">
                                            Completed
                                        </option>

                                    </select>

                                </div>


                                {/* Footer */}

                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            setShowModal(false)
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                    >
                                        Update Request
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            )}

        </>

    );

}

export default EditRequest;