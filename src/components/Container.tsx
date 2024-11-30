type ContainerProps = {
  children: React.ReactNode;
};

export default function Container({ children }: ContainerProps) {
  return <div className="mx-2 rounded-md shadow-sm bg-card">{children}</div>;
}
