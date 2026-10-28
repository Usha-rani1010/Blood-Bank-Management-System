import DashboardCard from "../components/DashboardCard";

function Home() {
  return (
    <div>

      <h2 className="mb-4">Dashboard</h2>

      <div className="row">

        <DashboardCard
          title="Total Donors"
          value="120"
          color="primary"
        />

        <DashboardCard
          title="Blood Units"
          value="250"
          color="success"
        />

        <DashboardCard
          title="Requests"
          value="35"
          color="warning"
        />

        <DashboardCard
          title="Blood Groups"
          value="8"
          color="danger"
        />

      </div>

    </div>
  );
}

export default Home;