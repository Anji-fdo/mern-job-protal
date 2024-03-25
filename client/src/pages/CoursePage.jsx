import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';

export default function CoursePage() {
  const { courseSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/course/getcourse?slug=${courseSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setCourse(data.course[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseSlug]);

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  return <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
    <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{course && course.title}</h1>
    <Link to={`/searchcourse?level=${course && course.level}`} className='self-center mt-5'>
    <Button color='gray' pill size='xs'>{course && course.level}</Button>
    </Link>
    <img src={course && course.image} alt={course && course.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>
    <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{course && new Date(course.createdAt).toLocaleDateString()}</span>
        <span className='italic'>{course && (course.about.length /1000).toFixed(0)} mins read</span>
    </div>
    <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html: course && course.about}}>

    </div>

    <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
    </div>
    
  </main>;
}