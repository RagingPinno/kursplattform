import React, { useState, useMemo } from 'react';

function FilterControls({ courses, onFilterChange, sortBy, onSortChange }) {
  const [activeFilters, setActiveFilters] = useState({
    language: 'all',
    difficulty: 'all',
    category: 'all',
    courseType: 'all', // ✅ Nytt filter-state
  });

  const filterOptions = useMemo(() => {
    const languages = [...new Set(courses.map(c => c.language).filter(Boolean))];
    const categories = [...new Set(courses.map(c => c.category).filter(Boolean))];
    return { languages, categories };
  }, [courses]);

  const handleFilter = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...activeFilters, [name]: value };
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const clearedFilters = {
      language: 'all',
      difficulty: 'all',
      category: 'all',
      courseType: 'all',
    };
    setActiveFilters(clearedFilters);
    onFilterChange(clearedFilters);
    onSortChange('date');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row gap-4 items-center">
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* ✅ Nytt filter för kurstyp */}
        <div>
          <label htmlFor="courseType" className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
          <select id="courseType" name="courseType" value={activeFilters.courseType} onChange={handleFilter} className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500">
            <option value="all">Alla typer</option>
            <option value="Kurs">Kurser</option>
            <option value="Utmaning">Utmaningar</option>
          </select>
        </div>
        
        {/* Befintliga filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
          <select id="category" name="category" value={activeFilters.category} onChange={handleFilter} className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500">
            <option value="all">Alla</option>
            {filterOptions.categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">Svårighetsgrad</label>
          <select id="difficulty" name="difficulty" value={activeFilters.difficulty} onChange={handleFilter} className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500">
            <option value="all">Alla</option>
            <option value="1">1 (Nybörjare)</option>
            <option value="2">2 (Grundläggande)</option>
            <option value="3">3 (Medel)</option>
            <option value="4">4 (Avancerad)</option>
          </select>
        </div>
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sortera efter</label>
          <select id="sort" name="sort" value={sortBy} onChange={(e) => onSortChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500">
            <option value="date">Senast tillagd</option>
            <option value="difficulty">Svårighetsgrad</option>
            <option value="category">Kategori</option>
            <option value="popularity">Popularitet</option>
          </select>
        </div>
      </div>

      <div className="flex-shrink-0 pt-5 sm:pt-0 sm:ml-4">
        <button onClick={resetFilters} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
          Återställ
        </button>
      </div>
    </div>
  );
}

export default FilterControls;
