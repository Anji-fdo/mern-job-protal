import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import CourseCard from '../components/CourseCard';

export default function CoursePage() {
  const { courseSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [course, setCourse] = useState(null);
  const [recentCourse, setRecentCourse] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    try {
      const fetchRecentCourse = async () => {
        const res = await fetch(`/api/course/getcourse?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentCourse(data.course);
        }
      };
      fetchRecentCourse();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const handleEnroll = () => {
    // Redirect to the checkout page
    navigate('/checkout');
  };


  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );

  return <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
    <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{course && course.title}</h1>
    <Link to={`/searchcourse?level=${course && course.level}`} className='self-center mt-5'>
     <Button  color='gray' pill size='xs'>{course && course.level}</Button>
    </Link>
    
    <Link to={`/searchcourse?instituteName=${course && course.instituteName}`} className='self-center mt-5'>
        <span  className='text-blue-500 text-xl' color='gray' pill size='lg'>By : {course && course.instituteName}</span>
    </Link>

    <span className="text-2xl font-bold text-blue-600">Price : ${course && course.price}</span>

    <img src={course && course.image} alt={course && course.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>
    <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>Published date : {course && new Date(course.createdAt).toLocaleDateString()}</span>
      
        
    </div>
    <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html: course && course.about}}>

    </div>

    <div className='flex justify-center items-center my-5'> {/* Center the items and add margin */}
      <span className="text-2xl font-bold text-blue-600 mr-4">Price: ${course && course.price}</span> {/* Add margin to the right */}
      <Button color='blue' pill size='lg' onClick={handleEnroll}> {/* Increase the size of the button */}
        Enroll now
      </Button>
    </div>


    <div className="max-w-4xl mx-auto w-full mb-5">
        <CallToAction />
    </div>

    <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Explore courses</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentCourse &&
            recentCourse.map((course) => <CourseCard key={course._id} course={course} />)}
        </div>
      </div>

  </main>;
}