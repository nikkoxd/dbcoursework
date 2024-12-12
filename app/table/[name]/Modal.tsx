export default function Modal({ title, onClose, children }: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div onClick={onClose} className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10 flex items-center justify-center">
      <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 px-4 py-5 rounded-lg shadow-lg">
        <div className="flex justify-between gap-16 mb-4">
          <h1 className="text-lg font-bold">{title}</h1>
          <button onClick={onClose} className="underline">Отменить</button>
        </div>
        {children}
      </div>
    </div>
  );
}
