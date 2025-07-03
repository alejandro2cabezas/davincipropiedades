export default function PageTitle({ title, subtitle, iconComponent, containerClasses }) {
  return (
    <div className={"publicar-header " + containerClasses}>
      <div className="d-flex flex-row align-items-center justify-content-center">
        <div className="header-icon">{iconComponent}</div>
        <h1 className="header-title ml-4">{title}</h1>
      </div>
      <p className="header-subtitle">{subtitle}</p>
    </div>
  );
}
