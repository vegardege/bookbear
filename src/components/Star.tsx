import Image from "next/image";

export default function Star() {
  return (
    <div className="flex flex-row justify-center">
      <Image
        src="/star.svg"
        alt="Star"
        width={12}
        height={12}
        title="Notable work"
      />
    </div>
  );
}
