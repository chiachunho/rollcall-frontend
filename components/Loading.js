import MainCard from './MainCard';
import SideList from './SideList';

export default function Loading() {
  return (
    <>
      <MainCard leftContent={<div className="animate-pulse h-10 bg-slate-200 rounded"></div>}>
        <div className="animate-pulse h-10 bg-slate-200 rounded"></div>
        <div className="animate-pulse space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-5 bg-slate-200 rounded col-span-2"></div>
            <div className="h-5 bg-slate-200 rounded col-span-1"></div>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div className="h-5 bg-slate-200 rounded col-span-2"></div>
            <div className="h-5 bg-slate-200 rounded col-span-3"></div>
          </div>
          <div className="h-5 bg-slate-200 rounded"></div>
        </div>
      </MainCard>
      <SideList heading={<div className="animate-pulse h-10 bg-slate-200 rounded"></div>}>
        {Array(4)
          .fill()
          .map((_, idx) => (
            <div className="animate-pulse shadow-md rounded-md flex flex-row max-h-full" key={idx}>
              <div className="bg-sky-800 w-1.5 rounded-l-md"></div>
              <div className="p-3 flex-grow">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-5 bg-slate-200 rounded col-span-2"></div>
                </div>
              </div>
            </div>
          ))}
      </SideList>
    </>
  );
}
