import { useEffect, useState } from "react";
import API from "../services/api";

function EditDonor({ donor, onUpdated, onCancel }) {

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        bloodGroup: "",
        phone: "",
        city: "",
        email: ""
    });

    useEffect(() => {
        if (donor) {
            setFormData({
                name: donor.name || "",
                age: donor.age || "",
                gender: donor.gender || "",
                bloodGroup: donor.bloodGroup || "",
                phone: donor.phone || "",
                city: donor.city || "",
                email: donor.email || ""
            });
        }
    }, [donor]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await API.put(`/api/donors/${donor.id}`, formData);

            alert("Donor Updated Successfully!");

            onUpdated();

        } catch (error) {
            console.error(error);
            alert("Unable to update donor");
        }
    };

    return (
        <div className="card mb-4">

            <div className="card-header bg-warning">
                <h5>Edit Donor</h5>
            </div>

            <div className="card-body">

                <form onSubmit={handleSubmit}>

                    <div className="row">

                        <div className="col-md-6 mb-3">
                            <input
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name"
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                type="number"
                                className="form-control"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Age"
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <select
                                className="form-control"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <select
                                className="form-control"
                                name="bloodGroup"
                                value={formData.bloodGroup}
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
                                className="form-control"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone"
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                className="form-control"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                required
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                required
                            />
                        </div>

                    </div>

                    <button className="btn btn-success me-2">
                        Update
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                </form>

            </div>

        </div>
    );
}

export default EditDonor;