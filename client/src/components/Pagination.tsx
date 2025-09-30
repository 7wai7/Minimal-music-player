import { ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/Pagination.css"

interface Props {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    maxItems: number;
    pageLimit: number;
}

function Pagination({
    currentPage,
    setCurrentPage,
    maxItems,
    pageLimit,
}: Props) {
    const totalPages = Math.ceil(maxItems / pageLimit);

    if(totalPages <= 1) return <></>

    // допоміжна функція для створення масиву сторінок
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // якщо сторінок ≤ 5 → показуємо всі
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                // перші сторінки
                pages.push(1, 2, 3, 4, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                // останні сторінки
                pages.push(
                    1,
                    "...",
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                );
            } else {
                // десь посередині
                pages.push(
                    1,
                    "...",
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    "...",
                    totalPages
                );
            }
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="pagination-btns">
            {/* Попередня сторінка */}
            <button
                className="prev tr-bg icon-wrapper"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                <ChevronLeft size={20} color="var(--theme)" />
            </button>

            {/* Номери сторінок */}
            {pages.map((page, index) =>
                page === "..." ? (
                    <span key={index} className="dots">
                        ...
                    </span>
                ) : (
                    <button
                        key={index}
                        className={page === currentPage ? "active" : ""}
                        onClick={() => setCurrentPage(page as number)}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Наступна сторінка */}
            <button
                className="next tr-bg icon-wrapper"
                onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
            >
                <ChevronRight size={20} color="var(--theme)" />
            </button>
        </div>
    );
}

export default Pagination;
