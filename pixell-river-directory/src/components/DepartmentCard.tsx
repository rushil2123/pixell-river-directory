interface Props {
  department: string;
  employees: string[];
}

export default function DepartmentCard({ department, employees }: Props) {
  return (
    <article className="dept-card">
      <h4>{department || "Unnamed Department"}</h4>
      <ul>
        {employees.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </article>
  );
}