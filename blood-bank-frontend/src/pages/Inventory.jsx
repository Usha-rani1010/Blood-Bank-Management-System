import { useEffect, useState } from "react";
import API from "../services/api";
import AddInventory from "../components/AddInventory";
import EditInventory from "../components/EditInventory";
import { useLanguage } from "../context/LanguageContext";

function Inventory() {
    const { t } = useLanguage();

    const [inventory, setInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // Load inventory
    const loadInventory = () => {
        API.get("/api/inventory")
            .then((response) => {
                setInventory(response.data);
            })
            .catch((error) => {
                console.error("Inventory Error:", error);
            });
    };

    useEffect(() => {
        loadInventory();
    }, []);

    // Delete inventory
    const deleteInventory = async (id) => {
        if (!window.confirm(t("confirmDeleteInventory") || "Delete this blood stock?")) {
            return;
        }

        try {
            await API.delete(`/api/inventory/${id}`);
            loadInventory();
        } catch (error) {
            console.error(error);
            alert("Unable to delete inventory");
        }
    };

    // Determine stock status key
    const getStockStatus = (units) => {
        if (units === 0) {
            return "Out of Stock";
        }
        if (units < 5) {
            return "Low Stock";
        }
        return "Available";
    };

    // Filter inventory
    const filteredInventory = inventory.filter((item) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch = item.bloodGroup?.toLowerCase().includes(search);
        const status = getStockStatus(Number(item.availableUnits));
        const matchesStatus = statusFilter === "All" || status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container">
            {/* Page Heading */}
            <div className="my-4">
                <h2 className="mb-1 fw-bold">{t("inventoryTitle")}</h2>
                <p className="text-muted mb-0">
                    {t("inventorySubtitle")}
                </p>
            </div>


            {/* Add Inventory */}

            <AddInventory
                onInventoryAdded={loadInventory}
            />


            {/* Inventory Card */}
            <div className="card shadow-sm border-0 mt-4">
                {/* Card Header */}
                <div className="card-header bg-danger text-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                            {t("availableStock")}
                        </h5>
                        <span className="badge bg-light text-danger">
                            {filteredInventory.length} {t("bloodGroup")}
                        </span>
                    </div>
                </div>

                <div className="card-body">
                    {/* Search and Filter */}
                    <div className="row g-3 mb-4">
                        {/* Search */}
                        <div className="col-12 col-md-7">
                            <label className="form-label fw-semibold">
                                {t("searchBloodGroup")}
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={t("searchInventoryPlaceholder")}
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                            />
                        </div>

                        {/* Status */}
                        <div className="col-12 col-md-5">
                            <label className="form-label fw-semibold">
                                {t("stockStatus")}
                            </label>

                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                            >
                                <option value="All">{t("allStock")}</option>
                                <option value="Available">{t("available")}</option>
                                <option value="Low Stock">{t("lowStock")}</option>
                                <option value="Out of Stock">{t("outOfStock")}</option>
                            </select>
                        </div>
                    </div>

                    {/* Inventory Table */}
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>{t("id")}</th>
                                    <th>{t("bloodGroup")}</th>
                                    <th>{t("availableUnits")}</th>
                                    <th>{t("stockStatus")}</th>
                                    <th>{t("action")}</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredInventory.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center text-muted py-5"
                                        >
                                            <h5>{t("noInventoryFound")}</h5>
                                            <p className="mb-0">
                                                {t("noInventoryFoundDesc")}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInventory.map((item) => {
                                        const units = Number(item.availableUnits);
                                        const status = getStockStatus(units);

                                        return (
                                            <tr key={item.id}>
                                                {/* ID */}
                                                <td>{item.id}</td>

                                                {/* Blood Group */}
                                                <td>
                                                    <span className="badge bg-danger fs-6">
                                                        {item.bloodGroup}
                                                    </span>
                                                </td>

                                                {/* Units */}
                                                <td>
                                                    <strong className="fs-5">
                                                        {units}
                                                    </strong>
                                                    <span className="text-muted ms-1">
                                                        {t("units")}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td>
                                                    {status === "Available" && (
                                                        <span className="badge bg-success">
                                                            {t("available")}
                                                        </span>
                                                    )}
                                                    {status === "Low Stock" && (
                                                        <span className="badge bg-warning text-dark">
                                                            {t("lowStock")}
                                                        </span>
                                                    )}
                                                    {status === "Out of Stock" && (
                                                        <span className="badge bg-danger">
                                                            {t("outOfStock")}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="text-nowrap">
                                                    <EditInventory
                                                        inventory={item}
                                                        onUpdated={loadInventory}
                                                    />

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            deleteInventory(item.id)
                                                        }
                                                    >
                                                        {t("delete")}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Inventory;