import { useState } from 'react';
import { Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

export default function CreateJob() {
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    description: '',
    skills: '',
    category: '',
    salary: '',
    location: '',
  });
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
    try {
      const fetchJobs = async () => {
        const res = await fetch(`/api/job/getjobs?jobId=${jobId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.job[0]);
        }
      };

      fetchJobs();
    } catch (error) {
      console.log(error.message);
    }
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/job/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/job/${data.slug}`);
      }
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
          onChange={handleChange}
        />
        <TextInput
          type='text'
          placeholder='Company Name'
          required
          id='companyName'
          onChange={handleChange}
        />
        <ReactQuill
          theme='snow'
          placeholder='Description'
          className='h-72 mb-12'
          required
          onChange={handleQuillChange}
        />
        <TextInput
          type='text'
          placeholder='Skills'
          required
          id='skills'
          onChange={handleChange}
        />
        <Select required id='category' onChange={handleChange}>
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
          onChange={handleChange}
        />
        <TextInput
          type='text'
          placeholder='Location'
          required
          id='location'
          onChange={handleChange}
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
