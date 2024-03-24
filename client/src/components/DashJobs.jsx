import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashJobs() {

  const { currentUser } = useSelector((state) => state.user);
  const [userJobs, setUserJobs] = useState([]);
  const [showMore, setShowMore] = useState(true);

  console.log(userJobs);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`/api/job/getjobs?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserJobs(data.job);
          if (data.job.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin || currentUser.isEmp ) {
      fetchJobs();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userJobs.length;
    try {
      const res = await fetch(
        `/api/job/getjobs?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserJobs((prev) => [...prev, ...data.job]);
        if (data.job.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isEmp && userJobs.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              
              <Table.HeadCell>Job title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userJobs.map((job) => (
              <Table.Body className='divide-y'>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(job.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  
                  <Table.Cell>
                    <Link
                      className='font-medium text-gray-900 dark:text-white'
                      to={`/job/${job.slug}`}
                    >
                      {job.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{job.category}</Table.Cell>
                  <Table.Cell>
                    <span className='font-medium text-red-500 hover:underline cursor-pointer'>
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className='text-teal-500 hover:underline'
                      to={`/update-job/${job._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>

          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
          
        </>
      ) : (
        <p>You have no jobs yet!</p>
      )}
    </div>
  );
}