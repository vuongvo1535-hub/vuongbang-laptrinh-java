import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";

export default function Menu({ items }) {
  return (
    <nav className="flex items-center gap-6">
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;

        return (
          <div
            key={item.id ?? item.href}
            className="relative group h-10 flex items-center"
          >
            <Link
              href={item.href}
              className="flex items-center gap-1 text-nau-dam hover:text-cam-dam font-medium transition"
            >
              {item.label}
              {hasChildren && (
                <FiChevronDown
                  size={14}
                  className="transition-transform group-hover:rotate-180"
                />
              )}
            </Link>

            {/* Menu con (neu co) */}
            {hasChildren && (
              <div className="absolute left-0 top-full hidden group-hover:block z-50">
                <div className="bg-white shadow-lg rounded-lg py-1 w-48 border border-cam-vang/40">
                  {item.children.map((child) => (
                    <Link
                      key={child.id ?? child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-nau-dam hover:bg-vang-kem hover:text-cam-dam transition"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}