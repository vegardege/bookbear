type ContainerProps = {
  children: React.ReactNode;
};

export default function Container({ children }: ContainerProps) {
  return (
    <div
      className="overflow-x-auto rounded-sm shadow-sm"
      style={{ backgroundColor: "#f5d5a7" }}
    >
      {children}
    </div>
  );
}
