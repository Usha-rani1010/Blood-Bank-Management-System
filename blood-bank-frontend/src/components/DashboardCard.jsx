function DashboardCard({ title, value, color }) {
  return (
    <div className="col-md-3 mb-4">
      <div className={`card text-center border-${color}`}>
        <div className="card-body">
          <h5>{title}</h5>
          <h2 className={`text-${color}`}>{value}</h2>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;