interface DashboardCardProps {
  title: string;
  value: number | string;
  color: string;
  description: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  color,
  description,
}) => {
  return (
    <div
      style={{
        textAlign: "center",
        width: "25%",
        padding: "8px",
      }}
    >
      <div
        style={{
          padding: "20px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: color,
          color: "#fff",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ fontSize: "36px", margin: "0" }}>{value}</h2>
        <p style={{ fontSize: "18px", margin: "5px 0" }}>{title}</p>
        <p style={{ fontSize: "14px", margin: "5px 0", opacity: "0.8" }}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default DashboardCard;
