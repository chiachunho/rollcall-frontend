export default function Result({
  color = 'bg-sky-800',
  heading = '請刷學生證條碼',
  content = '僅限國立臺灣科技大學學生證',
}) {
  return (
    <div className="shadow-md rounded-md flex flex-row">
      <div className={`${color} w-1.5 rounded-l-md`}></div>
      <div className="p-3 space-y-2 flex-grow">
        <div className="text-2xl font-medium tracking-wide">{heading}</div>
        <div>{content}</div>
      </div>
    </div>
  );
}
