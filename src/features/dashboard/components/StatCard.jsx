const StatCard = ({
                      icon: Icon,
                      title,
                      value,
                      subtitle,
                      breakdown,
                      valueClassName = "text-dlms-navy",
                  }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">{title}</p>
                {Icon && <Icon className="h-5 w-5 text-gray-400" strokeWidth={1.75} />}
            </div>

            <div className="flex items-end gap-5">
                <p className={`text-3xl font-bold leading-none ${valueClassName}`}>{value}</p>

                {breakdown && breakdown.length > 0 && (
                    <div className="flex gap-4">
                        {breakdown.map((item) => (
                            <div key={item.label} className="text-center">
                                <p className="text-xs text-gray-400">{item.label}</p>
                                <p className="text-sm font-semibold text-gray-700">{item.value}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
        </div>
    );
};

export default StatCard;







