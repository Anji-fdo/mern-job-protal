import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import PostCard from '../components/PostCard';

export default function JobPage() {
    const { jobSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [job, setJob] = useState(null);
    const [recentJobs, setRecentjobs] = useState(null);
  
    useEffect(() => {
      const fetchJob = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/job/getjobs?slug=${jobSlug}`);
          if (!response.ok) {
            throw new Error('Failed to fetch job details');
          }
          const data = await response.json();
          if (data.job.length === 0) {
            throw new Error('Job not found');
          }
          setJob(data.job[0]);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
      if (jobSlug) {
        fetchJob();
      }
    }, [jobSlug]);

    useEffect(() => {
        try {
          const fetchRecentJobs = async () => {
            const res = await fetch(`/api/job/getjobs?limit=3`);
            const data = await res.json();
            if (res.ok) {
              setRecentjobs(data.job);
            }
          };
          fetchRecentJobs();
        } catch (error) {
          console.log(error.message);
        }
      }, []);
  
      if (loading)
      return (
        <div className='flex justify-center items-center min-h-screen'>
          <Spinner size='xl' />
        </div>
      );

  

  return <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
      {job && job.title}
      </h1>

      <Link to={`/=${job && job.category}`} className='self-center mt-5'>
        <Button color='gray' pill size='xs'>
        {job && job.category}
        </Button>
      </Link>

      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{job && new Date(job.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
            {job && (job.description.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div
        className='p-3 max-w-2xl mx-auto w-full job-description'
        dangerouslySetInnerHTML={{ __html: job && job.description }}
      >
        </div>
        
        <div className='max-w-4xl mx-auto w-full'>
            <CallToAction />
        </div>
      

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentJobs &&
            recentJobs.map((job) => (
              <PostCard key={job._id} job={job} className='flex-shrink-0' />
            ))}
        </div>

      </div>
    </main>
  
}
