import * as Tooltip from '@radix-ui/react-tooltip';

export default function Card({ title, description, price, image, colors }) {
  return (
    <div className="w-72 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
      <div className="h-48 w-full overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-600 font-bold">${price}</span>
          <div className="flex gap-1">
            {colors.map((c, i) => (
              <Tooltip.Root key={i}>
                <Tooltip.Trigger>
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c }}></span>
                </Tooltip.Trigger>
                <Tooltip.Content side="top" className="px-2 py-1 rounded bg-gray-800 text-white text-xs">
                  Cor {c}
                </Tooltip.Content>
              </Tooltip.Root>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 text-center">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Comprar
        </button>
      </div>
    </div>
  );
}
