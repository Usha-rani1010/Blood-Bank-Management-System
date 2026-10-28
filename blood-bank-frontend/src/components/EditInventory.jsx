import { useEffect, useState } from "react";
import API from "../services/api";

function EditInventory({ inventory, onUpdated }) {

    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        bloodGroup: "",
        availableUnits: ""
    });


    // Load inventory data

    useEffect(() => {

        if (inventory) {

            setFormData({
                bloodGroup: inventory.bloodGroup || "",
                availableUnits: inventory.availableUnits ?? ""
            });

        }

    }, [inventory]);


    // Open Edit

    const handleEdit = () => {

        setFormData({
            bloodGroup: inventory.bloodGroup || "",
            availableUnits: inventory.availableUnits ?? ""
        });

        setShowModal(true);

    };


    // Handle changes

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // Update inventory

    const updateInventory = async (e) => {

        e.preventDefault();

        try {

            const updatedInventory = {
                bloodGroup: formData.bloodGroup,
                availableUnits: Number(formData.availableUnits)
            };


            await API.put(
                `/api/inventory/${inventory.id}`,
                updatedInventory
            );


            alert("Inventory Updated Successfully!");


            setShowModal(false);


            if (onUpdated) {
                onUpdated();
            }


        } catch (error) {

            console.error(
                "Inventory Update Error:",
                error
            );

            if (error.response) {

                console.error(
                    "Backend Error:",
                    error.response.data
                );

            }

            alert("Unable to update inventory");

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


                            {/* HEADER */}

                            <div className="modal-header bg-warning">

                                <h5 className="modal-title">
                                    Edit Inventory
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                ></button>

                            </div>


                            {/* FORM */}

                            <form onSubmit={updateInventory}>

                                <div className="modal-body">


                                    {/* BLOOD GROUP */}

                                    <label className="form-label fw-bold">
                                        Blood Group
                                    </label>

                                    <select
                                        className="form-select mb-3"
                                        name="bloodGroup"
                                        value={formData.bloodGroup}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select Blood Group
                                        </option>

                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>

                                    </select>


                                    {/* AVAILABLE UNITS */}

                                    <label className="form-label fw-bold">
                                        Available Units
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        name="availableUnits"
                                        value={formData.availableUnits}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                    />

                                </div>


                                {/* FOOTER */}

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
                                        Update Inventory
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

export default EditInventory;