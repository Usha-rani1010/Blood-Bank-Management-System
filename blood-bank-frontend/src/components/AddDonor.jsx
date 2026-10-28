import { useState } from "react";
import API from "../services/api";

function AddDonor({ onDonorAdded }) {

  const [donor, setDonor] = useState({
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    phone: "",
    city: "",
    email: ""
  });

  const handleChange = (e) => {
    setDonor({
      ...donor,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/api/donors", donor);

      alert("Donor Added Successfully!");

      setDonor({
        name: "",
        age: "",
        gender: "",
        bloodGroup: "",
        phone: "",
        city: "",
        email: ""
      });

      if (onDonorAdded) {
        onDonorAdded();
      }

    } catch (error) {
      console.error(error);
      alert("Error adding donor");
    }
  };

  return (
    <div className="card mb-4">

      <div className="card-header bg-danger text-white">
        <h4 className="mb-0">Add New Donor</h4>
      </div>

      <div className="card-body">

        <form onSubmit={handleSubmit}>

          <div className="row">

            <div className="col-md-6 mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={donor.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Age</label>
              <input
                type="number"
                className="form-control"
                name="age"
                value={donor.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                name="gender"
                value={donor.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Blood Group</label>
              <select
                className="form-select"
                name="bloodGroup"
                value={donor.bloodGroup}
                onChange={handleChange}
                required
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={donor.phone}
                onChange={handleChange}
                required
              />
            </div>

            

            <div className="col-md-6 mb-3">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={donor.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={donor.email}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <button type="submit" className="btn btn-danger">
            Save Donor
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddDonor;