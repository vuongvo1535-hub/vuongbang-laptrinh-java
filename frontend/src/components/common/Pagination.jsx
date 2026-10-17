export default function Pagination({
    currentPage,
    pageCount,
    onPageChange,
}) {
    const getPages = () => {
        const delta = 2;
        const pages = [];

        const left = Math.max(1, currentPage - delta);
        const right = Math.min(pageCount, currentPage + delta);

        if (left > 1) {
            pages.push(1);
            if (left > 2) pages.push("...");
        }

        for (let i = left; i <= right; i++) {
            pages.push(i);
        }

        if (right < pageCount) {
            if (right < pageCount - 1) pages.push("...");
            pages.push(pageCount);
        }

        return pages;
    };
    const pages = getPages();
    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-vang-kem"
            >
                ← Trước
            </button>
            {pages.map((page, index) => {
                const key =
                    page === "..."
                        ? `ellipsis-${index}`
                        : `page-${page}`;

                return page === "..." ? (
                    <span key={key} className="px-3 py-2">
                        ...
                    </span>
                ) : (
                    <button
                        key={key}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-lg border transition ${currentPage === page
                                ? "bg-cam-vang text-nau-dam border-cam-vang font-semibold"
                                : "bg-white hover:bg-vang-kem"
                            }`}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === pageCount}
                className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-vang-kem"
            >
                Sau →
            </button>
        </div>
    );
}
