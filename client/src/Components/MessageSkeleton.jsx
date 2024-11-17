const MessageSkeleton = () => {
  return (
    <div className="flex flex-col w-[700px]">
      <div className="flex items-center gap-2 m-2">
        <div className="skeleton h-12 w-12 shrink-0 rounded-full"></div>
        <div className="skeleton h-4 w-[100px]"></div>
      </div>
      <div className="divider w-full"></div>
      <div className="w-full justify-start">
        <div className="flex gap-3 items-center">
          <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>
          <div className="flex flex-col gap-1">
            <div className="skeleton h-4 w-40"></div>
            <div className="skeleton h-4 w-40"></div>
          </div>
        </div>
        <div className="flex gap-3 items-center justify-end">
          <div className="flex flex-col gap-1">
            <div className="skeleton h-4 w-40"></div>
          </div>
          <div className="skeleton w-10 h-10 rounded-full shrink-0"></div>
        </div>
      </div>
    </div>
  );
};
export default MessageSkeleton;
