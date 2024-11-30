type ContainerProps = {
  children: React.ReactNode;
  padding?: boolean;
};

export default function Container({
  children,
  padding = true,
}: ContainerProps) {
  const paddingClass = padding ? "p-3" : "";
  return (
    <div
      className={`bg-card rounded-md shadow-sm ${paddingClass} flex flex-col gap-4`}
    >
      {children}
    </div>
  );
}
