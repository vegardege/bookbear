const MIN_WIDTH = 1;

export default function PopularityBar({
  views,
  maxViews,
  width = "w-full",
}: {
  views: number;
  maxViews: number;
  width?: string;
}) {
  const barWidth = Math.max(MIN_WIDTH, Math.round((views / maxViews) * 100));

  return (
    <div className={`${width} rounded h-2`}>
      <div
        className="bg-bar h-2 rounded"
        style={{ width: `${barWidth}%` }}
      ></div>
    </div>
  );
}
