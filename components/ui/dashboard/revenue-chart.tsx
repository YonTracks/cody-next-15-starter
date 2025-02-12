import { generateYAxis } from '@/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/components/ui/fonts';
import { fetchRevenue } from '@/lib/data';

export default async function RevenueChart() {
  const revenue = await fetchRevenue();
  const chartHeight = 300;
  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className="w-full mx-auto mb-6">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        {/* Chart Container */}
        <div className="flex items-end gap-4 bg-white p-4 rounded-md">
          {/* Y-Axis Revenue Labels */}
          <div
            className="flex flex-col justify-between text-sm text-gray-400 h-[300px]"
          >
            {yAxisLabels.map((label) => (
              <p key={label} className="text-right">{label}</p>
            ))}
          </div>

          {/* Revenue Bars */}
          <div className="flex flex-1 items-end gap-2 md:gap-4 h-[300px]">
            {revenue.map((month) => (
              <div key={month.month} className="flex flex-col items-center w-full">
                <div
                  className="w-full bg-blue-300 rounded-md"
                  style={{
                    height: `${(chartHeight / topLabel) * month.revenue}px`,
                  }}
                ></div>
                <p className="mt-2 text-sm text-gray-400">{month.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Calendar Icon */}
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="size-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}
