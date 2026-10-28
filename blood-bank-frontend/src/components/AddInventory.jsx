import { useState } from "react";
import API from "../services/api";

function AddInventory({ onInventoryAdded }) {

    const [inventory, setInventory] = useState({
        bloodGroup: "",
        availableUnits: ""
    });

    const handleChange = (e) => {
        setInventory({
            ...inventory,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await API.post("/api/inventory", inventory);

            alert("Inventory Added Successfully!");

            setInventory({
                bloodGroup: "",
                availableUnits: ""
            });

            onInventoryAdded();

        } catch (error) {

            console.error(error);

            alert("Unable to add inventory");

        }

    };

    return (

        <div className="card mb-4">

            <div className="card-header bg-danger text-white">
                Add Blood Inventory
            </div>

            <div className="card-body">

                <form onSubmit={handleSubmit}>

                    <div className="row">

                        <div className="col-md-6 mb-3">

                            <select
                                className="form-control"
                                name="bloodGroup"
                                value={inventory.bloodGroup}
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
                                placeholder="Available Units"
                                name="availableUnits"
                                value={inventory.availableUnits}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                    <button className="btn btn-danger">
                        Save Inventory
                    </button>

                </form>

            </div>

        </div>

    );

}

export default AddInventory;