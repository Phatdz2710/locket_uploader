const OverlayLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
        </div>
        <span className="text-yellow-500 font-semibold text-sm tracking-wide">Uploading...</span>
      </div>
    </div>
  );
};

export default OverlayLoading;
