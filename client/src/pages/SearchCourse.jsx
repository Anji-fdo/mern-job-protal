import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';

export default function SearchCourse() {
  const [sidebarData, setSidebarData] = useState({
    searchTermss: '',
    sort: 'desc',
    level: 'uncategorized',
  });

  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermss = urlParams.get('searchTermss') || '';
    const sort = urlParams.get('sort') || 'desc';
    const level = urlParams.get('level') || 'uncategorized';

    setSidebarData({ searchTermss, sort, level });
    fetchCourse(urlParams);
  }, [location.search]);

  const fetchCourse = async (params) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/course/getcourse?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch courses');
      const data = await res.json();
      setCourse(data.course);
      setLoading(false);
      setShowMore(data.course.length === 9);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData({ ...sidebarData, [id]: value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  const urlParams = new URLSearchParams();
  Object.entries(sidebarData).forEach(([key, value]) => {
    if (value || key === 'level') urlParams.set(key, value);
  });
  navigate(`/searchcourse?${urlParams.toString()}`);
};


  const handleShowMore = async () => {
    const startIndex = course.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    fetchCourse(urlParams);
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Level:</label>
            <Select onChange={handleChange} value={sidebarData.level} id='level'>
              <option value='uncategorized'>Uncategorized</option>
              <option value='diploma'>Diploma</option>
              <option value='degree'>Degree</option>
              <option value='certificate'>Certificate</option>
              <option value='hnd'>HND</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
          Course results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && course.length === 0 && <p className='text-xl text-gray-500'>No courses found.</p>}
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading && course.map((course) => <CourseCard key={course._id} course={course} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
