import { useEffect, useState } from 'react';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdateJobs() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleQuillChange = (content) => {
    setFormData({ ...formData, description: content });
    
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/job/getjobs?jobID=${jobId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        setPublishError(null);
        setFormData(data.job[0]);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/job/updatejob/${jobId}/${currentUser._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate(`/job/${data.slug}`);
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update a Job</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Job Title'
          required
          id='title'
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          value={formData.title}
        />
        <TextInput
          type='text'
          placeholder='Company Name'
          required
          id='companyName'
          onChange={(e) =>
            setFormData({ ...formData, companyName: e.target.value })
          }
          value={formData.companyName}
        />
        <ReactQuill
          theme='snow'
          value={formData.description}
          placeholder='Description'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, description: value });
          }}
        />
        <TextInput
          type='text'
          placeholder='Skills'
          required
          id='skills'
          onChange={(e) =>
            setFormData({ ...formData, skills: e.target.value })
          }
          value={formData.skills}
        />
        <Select required id='category' onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}>
          <option value='uncategorized'>Select a Type</option>
          <option value='fulltime'>Full-Time</option>
          <option value='contract'>Contract Basic</option>
          <option value='intern'>Internship</option>
        </Select>
        <TextInput
          type='number'
          placeholder='Salary'
          required
          id='salary'
          onChange={(e) =>
            setFormData({ ...formData, salary: e.target.value })
          }
          value={formData.salary}
        />
        <TextInput
          type='text'
          placeholder='Location'
          required
          id='location'
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          value={formData.location}
        />
        <Button
          type='submit'
          gradientDuoTone='purpleToPink'
        >
          Publish Job
        </Button>

        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}

      </form>
    </div>
  );
}
