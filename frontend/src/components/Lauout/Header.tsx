import { NavLink } from 'react-router-dom';
import { pageLinks } from '../../lib/const/pageLinks';

function Header() {
  return (
    <header className="w-full border rounded-lg p-3 flex items-center justify-between bg-white dark:bg-gray-900">
      <nav className="flex gap-2" aria-label="Main navigation">
        {pageLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? 'px-3 py-1 rounded-full bg-indigo-100  font-medium text-black'
                : 'px-3 py-1 rounded-full text-amber-50 hover:text-black hover:bg-gray-100'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Header;